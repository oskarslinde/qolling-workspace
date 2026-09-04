import { DIFFICULTY_MIX } from "./constants.mjs";

export function buildDifficultyPlan(count) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("count must be a positive integer");
  }

  const raw = Object.entries(DIFFICULTY_MIX).map(([difficulty, ratio]) => ({
    difficulty: Number(difficulty),
    exact: count * ratio,
  }));

  const plan = raw.flatMap(({ difficulty, exact }) =>
    Array.from({ length: Math.floor(exact) }, () => difficulty),
  );

  const remaining = count - plan.length;
  raw
    .map((entry) => ({ ...entry, remainder: entry.exact - Math.floor(entry.exact) }))
    .sort((a, b) => b.remainder - a.remainder)
    .slice(0, remaining)
    .forEach(({ difficulty }) => plan.push(difficulty));

  return plan.sort((a, b) => a - b);
}

