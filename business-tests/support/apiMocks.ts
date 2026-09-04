import { Page, Route } from "@playwright/test";

const buildJwt = (payload: Record<string, unknown>) => {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;
};

const USER_TOKEN = buildJwt({ sub: "user-1", username: "learner", roles: ["USER"] });
const ADMIN_TOKEN = buildJwt({ sub: "admin-1", username: "admin", roles: ["ADMIN"] });
const MOCK_DRAFT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220'%3E%3Crect width='400' height='220' fill='%239ad2c0'/%3E%3Ctext x='200' y='120' fill='%230f172a' text-anchor='middle' font-size='22'%3EDraft image%3C/text%3E%3C/svg%3E";

export type ApiMockOptions = {
  loginFailureMessage?: string;
  verifyFailureMessage?: string;
  feedFailFirst?: boolean;
  feedAnswerCorrect?: boolean;
  feedQuestionImageUrl?: string;
};

export type SessionMode = "guest" | "user" | "admin";
export type SessionOptions = {
  requiresOnboarding?: boolean;
  requiresTermsAcceptance?: boolean;
};

const asJson = async (route: Route, body: unknown, status = 200) => {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
};

export const withSession = async (page: Page, mode: SessionMode, options: SessionOptions = {}) => {
  const token = mode === "admin" ? ADMIN_TOKEN : mode === "user" ? USER_TOKEN : "";
  await page.addInitScript(({ sessionToken, requiresOnboarding, requiresTermsAcceptance }) => {
    window.localStorage.clear();
    if (sessionToken) {
      window.localStorage.setItem("accessToken", sessionToken);
      window.localStorage.setItem("refreshToken", "refresh-token");
      window.localStorage.setItem("requiresOnboarding", requiresOnboarding ? "true" : "false");
      window.localStorage.setItem("requiresTermsAcceptance", requiresTermsAcceptance ? "true" : "false");
    }
  }, {
    sessionToken: token,
    requiresOnboarding: options.requiresOnboarding === true,
    requiresTermsAcceptance: options.requiresTermsAcceptance === true,
  });
};

export const installApiMocks = async (page: Page, options: ApiMockOptions = {}) => {
  let feedCounter = 0;
  let feedFailedOnce = false;
  let favoriteMarked = false;
  let draftCounter = 1;
  let questionDrafts: Array<Record<string, unknown>> = [];
  let showQuestionMetadata = true;
  let showFavoritesFeature = true;

  const collectionPlayQuestions = [
    {
      id: "q-1",
      question: "What is 2 + 2?",
      answers: [
        { text: "3", correct: false },
        { text: "4", correct: true },
        { text: "5", correct: false },
        { text: "6", correct: false },
      ],
      tags: ["basics"],
      categories: ["Math"],
      difficulty: 2,
      answerDescription: "Basic arithmetic",
      answerSource: "Mock source",
      createdByUserId: "author-1",
      createdByUsername: "author1",
      createdAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "q-2",
      question: "What is the capital of Latvia?",
      answers: [
        { text: "Vilnius", correct: false },
        { text: "Riga", correct: true },
        { text: "Tallinn", correct: false },
        { text: "Helsinki", correct: false },
      ],
      tags: ["geography"],
      categories: ["History"],
      difficulty: 3,
      answerDescription: "Riga is the capital city.",
      answerSource: "Mock source",
      createdByUserId: "author-1",
      createdByUsername: "author1",
      createdAt: "2026-01-01T00:00:00Z",
    },
  ];

  const messageThreads = [
    {
      threadKey: "friend-1",
      displayLabel: "friend1",
      systemThread: false,
      unreadCount: 1,
      latestMessage: {
        id: "msg-2",
        senderId: "friend-1",
        content: "Ready for a new practice session?",
        createdAt: "2026-01-02T10:05:00Z",
      },
    },
    {
      threadKey: "SYSTEM",
      displayLabel: "System",
      systemThread: true,
      unreadCount: 0,
      latestMessage: {
        id: "msg-system-1",
        senderId: "SYSTEM",
        content: "Your weekly learning summary is ready.",
        createdAt: "2026-01-02T11:05:00Z",
      },
    },
  ];

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const apiPathIndex = url.pathname.indexOf("/v1/");
    if (apiPathIndex < 0) {
      await route.continue();
      return;
    }

    const apiPath = url.pathname.slice(apiPathIndex);
    const method = request.method().toUpperCase();

    const nextFeedQuestion = () => {
      feedCounter += 1;
      return {
        feedItemId: `feed-${feedCounter}`,
        questionId: `q-${feedCounter}`,
        text: `Mock question ${feedCounter}?`,
        answers: ["Answer A", "Answer B", "Answer C", "Answer D"],
        categories: ["History"],
        tags: ["mock"],
        difficulty: 3,
        createdByUserId: "author-1",
        createdByUsername: "author1",
        imageUrl: options.feedQuestionImageUrl || null,
      };
    };

    const collectionDto = {
      id: "col-1",
      name: "Mock Collection",
      description: "Mock collection used by business tests",
      state: "PUBLIC",
      questionCount: 5,
      playableQuestionCount: 5,
      unavailableQuestionCount: 0,
      inactiveQuestionCount: 0,
      deletedQuestionCount: 0,
      missingQuestionCount: 0,
      questionIds: ["q-1", "q-2", "q-3", "q-4", "q-5"],
      createdAt: "2026-01-01T00:00:00Z",
    };

    const createDefaultDraft = (initial: Record<string, unknown> = {}) => {
      const createdAt = new Date().toISOString();
      const id = `draft-${draftCounter++}`;
      const answers = Array.isArray(initial.answers) && initial.answers.length === 4
        ? initial.answers
        : [
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: false },
          ];

      return {
        id,
        question: typeof initial.question === "string" ? initial.question : "",
        answers,
        category: typeof initial.category === "string" ? initial.category : "",
        tags: Array.isArray(initial.tags) ? initial.tags : [],
        answerDescription: typeof initial.answerDescription === "string" ? initial.answerDescription : "",
        answerSource: typeof initial.answerSource === "string" ? initial.answerSource : "",
        imageUrl: typeof initial.imageUrl === "string" ? initial.imageUrl : null,
        difficulty: 3,
        createdAt,
        updatedAt: createdAt,
      };
    };

    if (apiPath === "/v1/actuator/health" && method === "GET") {
      await asJson(route, { status: "UP" });
      return;
    }

    if (apiPath === "/v1/auth/login" && method === "POST") {
      if (options.loginFailureMessage) {
        await asJson(route, { message: options.loginFailureMessage }, 401);
      } else {
        await asJson(route, { accessToken: USER_TOKEN, refreshToken: "refresh-token", firstLogin: false });
      }
      return;
    }

    if (apiPath === "/v1/auth/register" && method === "POST") {
      await asJson(route, { accessToken: USER_TOKEN, refreshToken: "refresh-token" }, 201);
      return;
    }

    if (apiPath === "/v1/auth/refresh" && method === "POST") {
      await asJson(route, { message: "token expired" }, 401);
      return;
    }

    if (apiPath.startsWith("/v1/email/verify") && method === "GET") {
      if (options.verifyFailureMessage) {
        await asJson(route, { code: "EMAIL_TOKEN_INVALID", message: options.verifyFailureMessage }, 400);
      } else {
        await asJson(route, { accessToken: USER_TOKEN, refreshToken: "refresh-token" });
      }
      return;
    }

    if (apiPath === "/v1/email/resend-verification" && method === "POST") {
      await asJson(route, { message: "Verification email queued." });
      return;
    }

    if (apiPath.startsWith("/v1/question-collections/public") && method === "GET") {
      if (apiPath === "/v1/question-collections/public") {
        await asJson(route, {
          content: [collectionDto],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          size: 12,
          numberOfElements: 1,
        });
      } else {
        await asJson(route, collectionDto);
      }
      return;
    }

    if (apiPath.startsWith("/v1/question-collections/my") && method === "GET") {
      await asJson(route, {
        content: [{ ...collectionDto, state: "DRAFT" }],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 8,
        numberOfElements: 1,
      });
      return;
    }

    if (apiPath === "/v1/question-collections" && method === "POST") {
      await asJson(route, { ...collectionDto, id: "new-col", state: "DRAFT" }, 201);
      return;
    }

    if (apiPath.startsWith("/v1/question-collections/admin/review") && method === "GET") {
      await asJson(route, {
        content: [{ ...collectionDto, state: "PENDING" }],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 12,
        numberOfElements: 1,
      });
      return;
    }

    if (apiPath.match(/^\/v1\/question-collections\/[^/]+\/play-questions$/) && method === "GET") {
      await asJson(route, collectionPlayQuestions);
      return;
    }

    if (apiPath.match(/^\/v1\/question-collections\/[^/]+\/learning-sessions\/history$/) && method === "GET") {
      await asJson(route, [
        {
          sessionId: "session-history-1",
          collectionId: "col-1",
          collectionName: "Mock Collection",
          questionLimit: "5",
          orderMode: "random",
          loopEnabled: false,
          startedAt: "2026-01-02T08:00:00Z",
          endedAt: "2026-01-02T08:20:00Z",
          summary: {
            answeredCount: 5,
            correctCount: 4,
            skippedCount: 1,
            accuracy: 80,
          },
        },
      ]);
      return;
    }

    if (apiPath.match(/^\/v1\/question-collections\/[^/]+\/learning-sessions\/[^/]+\/results$/) && method === "GET") {
      await asJson(route, {
        collectionId: "col-1",
        collectionName: "Mock Collection",
        sessionId: "session-history-1",
        questionLimit: "5",
        orderMode: "random",
        loopEnabled: false,
        totalQuestions: 5,
        cycle: 0,
        startedAt: "2026-01-02T08:00:00Z",
        endedAt: "2026-01-02T08:20:00Z",
        summary: {
          answeredCount: 5,
          correctCount: 4,
          incorrectCount: 1,
          skippedCount: 0,
          accuracy: 80,
        },
      });
      return;
    }

    if (apiPath.startsWith("/v1/question-collections/") && method === "GET") {
      await asJson(route, collectionDto);
      return;
    }

    if (apiPath.startsWith("/v1/question-collections/") && ["PUT", "POST", "DELETE"].includes(method)) {
      await asJson(route, collectionDto);
      return;
    }

    if (apiPath === "/v1/categories" && method === "GET") {
      await asJson(route, [{ name: "History" }, { name: "Science" }]);
      return;
    }

    if (apiPath === "/v1/countries" && method === "GET") {
      await asJson(route, [
        { countryCode: "LV", countryName: "Latvia" },
        { countryCode: "LT", countryName: "Lithuania" },
        { countryCode: "EE", countryName: "Estonia" },
      ]);
      return;
    }

    if (apiPath === "/v1/me/onboarding" && method === "PUT") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      await asJson(route, {
        completed: true,
        ...payload,
      });
      return;
    }

    if (apiPath === "/v1/me/terms-acceptance" && method === "POST") {
      await asJson(route, {
        accepted: true,
      });
      return;
    }

    if (apiPath === "/v1/questions/drafts" && method === "GET") {
      await asJson(route, questionDrafts);
      return;
    }

    if (apiPath === "/v1/questions/drafts" && method === "POST") {
      const payload = (request.postDataJSON() as Record<string, unknown>) || {};
      const draft = createDefaultDraft(payload);
      questionDrafts = [draft, ...questionDrafts];
      await asJson(route, draft, 201);
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/drafts\/[^/]+$/) && method === "PUT") {
      const draftId = apiPath.split("/").pop() as string;
      const payload = (request.postDataJSON() as Record<string, unknown>) || {};
      const draft = questionDrafts.find((item) => item.id === draftId);
      if (!draft) {
        await asJson(route, { message: "Draft not found" }, 404);
        return;
      }

      Object.assign(draft, payload, { updatedAt: new Date().toISOString() });
      await asJson(route, draft);
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/drafts\/[^/]+\/image$/) && method === "PUT") {
      const draftId = apiPath.split("/")[4];
      const draft = questionDrafts.find((item) => item.id === draftId);
      if (!draft) {
        await asJson(route, { message: "Draft not found" }, 404);
        return;
      }
      Object.assign(draft, {
        imageUrl: MOCK_DRAFT_IMAGE,
        updatedAt: new Date().toISOString(),
      });
      await asJson(route, draft);
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/drafts\/[^/]+\/image$/) && method === "DELETE") {
      const draftId = apiPath.split("/")[4];
      const draft = questionDrafts.find((item) => item.id === draftId);
      if (!draft) {
        await asJson(route, { message: "Draft not found" }, 404);
        return;
      }
      Object.assign(draft, {
        imageUrl: null,
        updatedAt: new Date().toISOString(),
      });
      await asJson(route, draft);
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/drafts\/[^/]+$/) && method === "DELETE") {
      const draftId = apiPath.split("/").pop();
      questionDrafts = questionDrafts.filter((item) => item.id !== draftId);
      await route.fulfill({ status: 204 });
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/drafts\/[^/]+\/publish$/) && method === "POST") {
      const draftId = apiPath.split("/")[4];
      const payload = (request.postDataJSON() as Record<string, string>) || {};
      const draft = questionDrafts.find((item) => item.id === draftId);
      if (!draft) {
        await asJson(route, { message: "Draft not found" }, 404);
        return;
      }

      questionDrafts = questionDrafts.filter((item) => item.id !== draftId);

      await asJson(route, {
        id: `q-published-${draftId}`,
        question: draft.question || "Published question?",
        answers: draft.answers || [],
        categories: draft.category ? [draft.category] : [],
        tags: draft.tags || [],
        difficulty: 3,
        answerDescription: draft.answerDescription || "",
        answerSource: draft.answerSource || "",
        imageUrl: draft.imageUrl || null,
        moderationStatus: payload.visibility === "PUBLIC" ? "IN_REVIEW" : "PRIVATE",
        createdByUsername: "learner",
        createdAt: new Date().toISOString(),
      });
      return;
    }

    if (apiPath === "/v1/questions" && method === "POST") {
      await asJson(route, { id: "question-1" }, 201);
      return;
    }

    if (apiPath.startsWith("/v1/questions/my") && method === "GET") {
      await asJson(route, {
        content: [
          {
            id: "q-1",
            question: "What is 2 + 2?",
            answers: [
              { text: "3", correct: false },
              { text: "4", correct: true },
              { text: "5", correct: false },
              { text: "6", correct: false },
            ],
            moderationStatus: "PRIVATE",
            categories: ["Math"],
            tags: ["basics"],
            createdByUsername: "learner",
            createdAt: "2026-01-01T00:00:00Z",
          },
        ],
        totalElements: 1,
        totalPages: 1,
      });
      return;
    }

    if (apiPath.startsWith("/v1/questions/not-approved") && method === "GET") {
      await asJson(route, {
        content: [
          {
            id: "pending-q-1",
            question: "Pending review question?",
            answers: [
              { text: "A", correct: true },
              { text: "B", correct: false },
            ],
            difficulty: 3,
            createdByUsername: "author1",
            createdAt: "2026-01-01T00:00:00Z",
          },
        ],
        totalElements: 1,
        totalPages: 1,
      });
      return;
    }

    if (apiPath.startsWith("/v1/questions/favorites") && method === "GET") {
      await asJson(route, favoriteMarked ? [{ id: "q-1" }] : []);
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/[^/]+\/favorite$/) && method === "POST") {
      favoriteMarked = true;
      await asJson(route, {});
      return;
    }

    if (apiPath.match(/^\/v1\/questions\/[^/]+$/) && ["GET", "PUT"].includes(method)) {
      await asJson(route, {
        id: "q-1",
        question: "Original question text",
        answers: [
          { text: "A", correct: true },
          { text: "B", correct: false },
          { text: "C", correct: false },
          { text: "D", correct: false },
        ],
        category: "History",
      });
      return;
    }

    if (apiPath.startsWith("/v1/feed/next") && method === "GET") {
      if (options.feedFailFirst && !feedFailedOnce) {
        feedFailedOnce = true;
        await asJson(route, { message: "temporary feed error" }, 500);
      } else {
        await asJson(route, nextFeedQuestion());
      }
      return;
    }

    if (apiPath.startsWith("/v1/feed/answer") && method === "POST") {
      const correct = options.feedAnswerCorrect ?? true;
      await asJson(route, {
        correct,
        correctAnswer: "Answer A",
        answerDescription: "Because this is the best answer.",
        answerSource: "Mock source",
      });
      return;
    }

    if (apiPath.startsWith("/v1/feed/skip") && method === "POST") {
      await asJson(route, {});
      return;
    }

    if (apiPath === "/v1/me" && method === "GET") {
      await asJson(route, {
        id: "user-1",
        username: "learner",
        email: "learner@example.com",
        name: "Learner",
        surname: "Example",
        countryCode: "LV",
        gender: "Other",
        preferredCategories: ["History", "Math", "Science"],
        darkModeEnabled: false,
        roles: ["USER"],
      });
      return;
    }

    if (apiPath === "/v1/me" && method === "PUT") {
      const payload = request.postDataJSON() as Record<string, string | string[]>;
      await asJson(route, {
        id: "user-1",
        username: "learner",
        email: payload.email ?? "learner@example.com",
        name: payload.name ?? "Learner",
        surname: payload.surname ?? "Example",
        countryCode: payload.countryCode ?? "LV",
        gender: payload.gender ?? "Other",
        preferredCategories: Array.isArray(payload.preferredCategories) ? payload.preferredCategories : ["History", "Math", "Science"],
        darkModeEnabled: false,
        roles: ["USER"],
      });
      return;
    }

    if (apiPath.startsWith("/v1/me/performance") && method === "GET") {
      await asJson(route, {
        feedPhase: "ADAPTIVE_PHASE",
        categories: {
          History: { correct: 4, attempts: 5, skill: 0.7 },
        },
      });
      return;
    }

    if (apiPath.startsWith("/v1/me/performance") && method === "DELETE") {
      await asJson(route, {
        feedPhase: "START_PHASE",
        categories: {},
      });
      return;
    }

    if (apiPath === "/v1/settings/ui" && method === "GET") {
      await asJson(route, {
        showQuestionMetadata,
        showFavoritesFeature,
      });
      return;
    }

    if (apiPath === "/v1/admin/settings/ui" && method === "PUT") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      if (typeof payload.showQuestionMetadata === "boolean") {
        showQuestionMetadata = payload.showQuestionMetadata;
      }
      if (typeof payload.showFavoritesFeature === "boolean") {
        showFavoritesFeature = payload.showFavoritesFeature;
      }
      await asJson(route, {
        showQuestionMetadata,
        showFavoritesFeature,
      });
      return;
    }

    if (apiPath === "/v1/me/badges/collection-completion" && method === "POST") {
      await asJson(route, {
        newlyEarnedBadges: [],
      });
      return;
    }

    if (apiPath.startsWith("/v1/users/") && apiPath.endsWith("/summary") && method === "GET") {
      await asJson(route, {
        id: "author-1",
        username: "author1",
        displayName: "Author One",
        badges: ["Contributor"],
        stats: { publishedQuestions: 3, answeredQuestions: 12, accuracy: 75 },
      });
      return;
    }

    if (apiPath.startsWith("/v1/users/search") && method === "GET") {
      await asJson(route, [
        {
          id: "friend-1",
          username: "friend1",
          displayName: "Friend One",
        },
      ]);
      return;
    }

    if (apiPath === "/v1/messages/inbox" && method === "GET") {
      await asJson(route, messageThreads.map((thread) => thread.latestMessage));
      return;
    }

    if (apiPath === "/v1/messages/inbox/read" && method === "POST") {
      await asJson(route, {});
      return;
    }

    if (apiPath === "/v1/messages/unread-count" && method === "GET") {
      const unreadCount = messageThreads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);
      await asJson(route, { unreadCount });
      return;
    }

    if (apiPath === "/v1/messages/threads" && method === "GET") {
      await asJson(route, messageThreads);
      return;
    }

    if (apiPath.match(/^\/v1\/messages\/threads\/[^/]+\/read$/) && method === "POST") {
      await asJson(route, {});
      return;
    }

    if (apiPath.match(/^\/v1\/messages\/threads\/[^/]+$/) && method === "GET") {
      const encodedThreadKey = apiPath.split("/")[4] || "";
      const decodedThreadKey = decodeURIComponent(encodedThreadKey);
      const thread = messageThreads.find((entry) => entry.threadKey === decodedThreadKey)
        || messageThreads[0];
      const isSystemThread = thread.threadKey === "SYSTEM";

      await asJson(route, {
        threadKey: thread.threadKey,
        displayLabel: thread.displayLabel,
        systemThread: isSystemThread,
        messages: [
          {
            id: `${thread.threadKey}-msg-1`,
            senderId: isSystemThread ? "SYSTEM" : thread.threadKey,
            content: isSystemThread ? "System notice from admin." : "Hello from your friend.",
            createdAt: "2026-01-02T10:00:00Z",
          },
          {
            id: `${thread.threadKey}-msg-2`,
            senderId: "user-1",
            content: "Thanks, message received.",
            createdAt: "2026-01-02T10:04:00Z",
          },
        ],
      });
      return;
    }

    if (apiPath === "/v1/messages" && method === "POST") {
      const payload = (request.postDataJSON() as Record<string, string>) || {};
      await asJson(route, {
        id: "msg-created-1",
        recipientId: payload.recipientId || "friend-1",
        content: payload.content || "",
      }, 201);
      return;
    }

    if (apiPath === "/v1/messages/system" && method === "POST") {
      await asJson(route, {
        id: "sys-msg-1",
      }, 201);
      return;
    }

    if (apiPath === "/v1/messages/system/broadcast" && method === "POST") {
      await asJson(route, {
        recipientCount: 42,
      });
      return;
    }

    if (apiPath === "/v1/friends" && method === "GET") {
      await asJson(route, ["friend-1"]);
      return;
    }

    if (apiPath === "/v1/friends/feed" && method === "GET") {
      await asJson(route, [
        {
          actorUserId: "friend-1",
          type: "QUESTION",
          title: "Created a new Europe history question",
          entityId: "q-22",
          createdAt: "2026-01-02T09:30:00Z",
        },
      ]);
      return;
    }

    if (apiPath === "/v1/friends/requests/pending" && method === "GET") {
      await asJson(route, [
        {
          id: "request-1",
          requesterId: "friend-2",
        },
      ]);
      return;
    }

    if (apiPath === "/v1/friends/requests" && method === "POST") {
      await asJson(route, {
        requestId: "request-created-1",
      }, 201);
      return;
    }

    if (apiPath.match(/^\/v1\/friends\/requests\/[^/]+\/accept$/) && method === "POST") {
      await asJson(route, {});
      return;
    }

    if (apiPath.startsWith("/v1/admin/review-collections") && method === "GET") {
      await asJson(route, {
        content: [{ ...collectionDto, state: "PENDING" }],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 12,
        numberOfElements: 1,
      });
      return;
    }

    if ((apiPath.startsWith("/v1/ai/models") || apiPath.startsWith("/v1/admin/ai/models")) && method === "GET") {
      await asJson(route, ["mock-ai-model"]);
      return;
    }

    if ((apiPath.startsWith("/v1/ai/generate-question") || apiPath.startsWith("/v1/admin/ai/generate-question")) && method === "POST") {
      await asJson(route, { jobId: "job-1" });
      return;
    }

    if ((apiPath.startsWith("/v1/ai/generation-jobs/") || apiPath.startsWith("/v1/admin/ai/generation-jobs/")) && method === "GET") {
      await asJson(route, {
        status: "COMPLETED",
        requestedQuestionCount: 1,
        generatedQuestionCount: 1,
        requestedDifficulty: 3,
        generatedQuestions: [
          {
            question: "Generated mock question?",
            answers: ["Correct", "Wrong 1", "Wrong 2", "Wrong 3"],
            correctAnswer: "Correct",
            answerDescription: "Generated explanation",
            answerSource: "Generated source",
            category: "History",
          },
        ],
      });
      return;
    }

    if ((apiPath === "/v1/ai/generation-quota" || apiPath === "/v1/admin/ai/generation-quota") && method === "GET") {
      await asJson(route, {
        dailyLimit: 10,
        usedToday: 0,
        remainingToday: 10,
        dayStartUtc: "2026-01-01T00:00:00Z",
        nextResetAtUtc: "2026-01-02T00:00:00Z",
      });
      return;
    }

    if (apiPath === "/v1/admin/ai/question-batches" && method === "POST") {
      await asJson(route, {
        jobId: "admin-batch-1",
      }, 201);
      return;
    }

    if (apiPath.match(/^\/v1\/admin\/ai\/question-batches\/[^/]+$/) && method === "GET") {
      await asJson(route, {
        jobId: "admin-batch-1",
        status: "COMPLETED",
        requestedQuestionCount: 10,
        generatedCount: 8,
        failedCount: 2,
        submittedForReviewCount: 8,
        elapsedMillis: 62000,
      });
      return;
    }

    if (apiPath === "/v1/admin/badges" && method === "GET") {
      await asJson(route, [
        {
          badgeId: "badge-1",
          ruleCode: "COLLECTION_COMPLETION",
          nickname: "Collector",
          description: "Complete a full collection session.",
          imageUrl: "",
          active: true,
          threshold: 1,
          contextKey: null,
        },
      ]);
      return;
    }

    if (apiPath.match(/^\/v1\/admin\/users\/[^/]+\/questions$/) && method === "GET") {
      await asJson(route, {
        content: [
          {
            id: "q-77",
            question: "Admin detail sample question?",
            tags: ["sample"],
            difficulty: 3,
            createdAt: "2026-01-03T10:00:00Z",
          },
        ],
      });
      return;
    }

    if (apiPath.match(/^\/v1\/admin\/users\/[^/]+\/interactions$/) && method === "GET") {
      await asJson(route, [
        {
          interactionId: "interaction-1",
          type: "ANSWERED",
          correct: true,
          createdAt: "2026-01-03T11:00:00Z",
          selectedAnswer: "Answer A",
          questionSummary: {
            title: "Admin interaction sample question",
            categories: ["History"],
            difficulty: 3,
            active: true,
          },
        },
      ]);
      return;
    }

    if (apiPath.match(/^\/v1\/admin\/users\/[^/]+\/block$/) && method === "PATCH") {
      await asJson(route, {
        id: "user-1",
        username: "learner",
        email: "learner@example.com",
        name: "Learner",
        surname: "Example",
        roles: ["USER"],
        blocked: true,
        emailVerified: true,
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: "2026-01-03T08:00:00Z",
        firstLogin: false,
        questionCount: 3,
      });
      return;
    }

    if (apiPath.match(/^\/v1\/admin\/users\/[^/]+$/) && method === "DELETE") {
      await route.fulfill({ status: 204 });
      return;
    }

    if (apiPath.match(/^\/v1\/admin\/users\/[^/]+$/) && method === "GET") {
      await asJson(route, {
        id: "user-1",
        username: "learner",
        email: "learner@example.com",
        name: "Learner",
        surname: "Example",
        roles: ["USER"],
        blocked: false,
        emailVerified: true,
        createdAt: "2026-01-01T00:00:00Z",
        lastLogin: "2026-01-03T08:00:00Z",
        firstLogin: false,
        questionCount: 3,
      });
      return;
    }

    if (apiPath === "/v1/admin/users" && method === "GET") {
      await asJson(route, [
        {
          id: "user-1",
          username: "learner",
          email: "learner@example.com",
          name: "Learner",
          surname: "Example",
          roles: ["USER"],
          emailVerified: true,
          blocked: false,
        },
        {
          id: "admin-1",
          username: "admin",
          email: "admin@example.com",
          name: "Admin",
          surname: "User",
          roles: ["ADMIN"],
          emailVerified: true,
          blocked: false,
        },
      ]);
      return;
    }

    if (apiPath.startsWith("/v1/auth/logout") && method === "POST") {
      await asJson(route, {});
      return;
    }

    await asJson(route, {});
  });
};

