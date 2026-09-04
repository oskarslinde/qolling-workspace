import { Buffer } from "node:buffer";

const TINY_WEBP_BASE64 = "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/vuUAAA=";

const CATEGORY_FACTORIES = {
  Sports: (difficulty) => ({
    question: "A cyclist lowers their body on a fast descent. Which physics idea best explains why this helps them keep speed?",
    answers: [
      { text: "Reducing air resistance by presenting a smaller frontal area", correct: true },
      { text: "Increasing gravity by moving closer to the ground", correct: false },
      { text: "Making the bicycle tires chemically stickier", correct: false },
      { text: "Turning muscle energy directly into wind", correct: false },
    ],
    answerDescription: "A tucked posture reduces drag, so less energy is lost pushing air out of the way.",
    answerSource: "NASA Glenn Research Center, Beginner's Guide to Aerodynamics",
    tags: ["cycling", "aerodynamics", "motion"],
    imagePrompt: "A simple educational scene showing two cyclists descending a hill, one upright and one tucked, with airflow lines around them.",
    difficulty,
  }),
  Technology: (difficulty) => ({
    question: "Why does a phone often throttle performance when it gets too hot during gaming?",
    answers: [
      { text: "Lower speed reduces heat production and protects the chip", correct: true },
      { text: "The screen pixels need time to cool into new colors", correct: false },
      { text: "The battery becomes larger and blocks radio signals", correct: false },
      { text: "The operating system deletes unused apps automatically", correct: false },
    ],
    answerDescription: "Processors generate heat when switching billions of transistors; throttling reduces activity to stay within safe temperatures.",
    answerSource: "Arm Developer documentation on thermal management",
    tags: ["processors", "thermal", "phones"],
    imagePrompt: "A cutaway illustration of a smartphone showing a warm processor, cooling arrows, and a performance gauge lowering safely.",
    difficulty,
  }),
  "Pop Culture": (difficulty) => ({
    question: "A viral dance spreads across platforms faster when many users remix it. What media concept does this best demonstrate?",
    answers: [
      { text: "Participatory culture", correct: true },
      { text: "Silent film projection", correct: false },
      { text: "Analog signal decay", correct: false },
      { text: "Single-source broadcasting only", correct: false },
    ],
    answerDescription: "Participatory culture describes audiences actively creating, remixing, and sharing media rather than only consuming it.",
    answerSource: "Henry Jenkins, Convergence Culture",
    tags: ["media", "remix", "culture"],
    imagePrompt: "A neutral illustration of many generic people contributing colorful dance-step cards to a shared digital board, no platform logos.",
    difficulty,
  }),
  History: (difficulty) => ({
    question: "Why did reliable crop surpluses make early cities more likely to form?",
    answers: [
      { text: "They allowed some people to specialize in work beyond farming", correct: true },
      { text: "They made metal tools unnecessary", correct: false },
      { text: "They stopped all trade with nearby settlements", correct: false },
      { text: "They caused rivers to change direction every year", correct: false },
    ],
    answerDescription: "Surplus food could support builders, administrators, artisans, and traders, helping settlements grow more complex.",
    answerSource: "World History Encyclopedia, Urbanization in Mesopotamia",
    tags: ["cities", "agriculture", "civilization"],
    imagePrompt: "An educational ancient settlement scene with grain storage, farmers, builders, and traders arranged around a river.",
    difficulty,
  }),
  Geography: (difficulty) => ({
    question: "A coastal city has cooler summers than an inland city at the same latitude. What is the most likely reason?",
    answers: [
      { text: "Nearby ocean water changes temperature more slowly than land", correct: true },
      { text: "Latitude stops mattering near coastlines", correct: false },
      { text: "The coast receives no sunlight in summer", correct: false },
      { text: "Mountains always make coastal air colder", correct: false },
    ],
    answerDescription: "Water has high heat capacity, so oceans moderate nearby temperatures compared with inland areas.",
    answerSource: "NOAA SciJinks, why oceans affect weather and climate",
    tags: ["climate", "oceans", "latitude"],
    imagePrompt: "A split educational landscape comparing a breezy coastal city and a hotter inland city under the same sun.",
    difficulty,
  }),
  Science: (difficulty) => ({
    question: "A plant bends toward a window over several days. What process is mostly responsible?",
    answers: [
      { text: "Phototropism, growth directed by light", correct: true },
      { text: "Condensation, water vapor turning liquid", correct: false },
      { text: "Erosion, soil being worn away", correct: false },
      { text: "Magnetism, leaves aligning to poles", correct: false },
    ],
    answerDescription: "Phototropism lets plant shoots grow toward light, improving access to energy for photosynthesis.",
    answerSource: "Encyclopaedia Britannica, phototropism",
    tags: ["plants", "light", "growth"],
    imagePrompt: "A bright classroom windowsill with a potted plant bending toward sunlight, shown with gentle growth arrows.",
    difficulty,
  }),
  Literature: (difficulty) => ({
    question: "In a story, a storm begins just as the hero faces a moral crisis. What literary device is most likely being used?",
    answers: [
      { text: "Pathetic fallacy, where weather reflects emotion or mood", correct: true },
      { text: "Alphabetical order, where scenes follow letters", correct: false },
      { text: "Footnote narration, where sources replace plot", correct: false },
      { text: "Literal translation, where words never change meaning", correct: false },
    ],
    answerDescription: "Pathetic fallacy links nature or weather to human emotion, shaping the reader's sense of mood.",
    answerSource: "The Oxford Dictionary of Literary Terms, pathetic fallacy",
    tags: ["literature", "mood", "device"],
    imagePrompt: "A symbolic book illustration: a character at a crossroads under storm clouds, with warm light breaking in the distance.",
    difficulty,
  }),
  Art: (difficulty) => ({
    question: "Why might a painter use a tiny human figure beside a huge mountain?",
    answers: [
      { text: "To create scale and emphasize the mountain's size", correct: true },
      { text: "To prove the mountain is imaginary", correct: false },
      { text: "To remove contrast from the scene", correct: false },
      { text: "To make all objects the same visual weight", correct: false },
    ],
    answerDescription: "A familiar-sized figure gives viewers a reference point, making the landscape feel vast.",
    answerSource: "Tate Art Terms, scale and proportion",
    tags: ["composition", "scale", "landscape"],
    imagePrompt: "A museum-style landscape painting scene with a small traveler silhouette beside towering mountains, emphasizing scale.",
    difficulty,
  }),
  Music: (difficulty) => ({
    question: "A song feels unresolved when it pauses on a dominant chord. Why does that usually create tension?",
    answers: [
      { text: "The dominant chord strongly points back toward the tonic", correct: true },
      { text: "The instruments have stopped producing sound waves", correct: false },
      { text: "The melody can no longer use rhythm", correct: false },
      { text: "The key signature has disappeared", correct: false },
    ],
    answerDescription: "In tonal music, dominant harmony creates expectation for resolution to the tonic.",
    answerSource: "Open Music Theory, harmonic function",
    tags: ["harmony", "tonic", "tension"],
    imagePrompt: "An abstract educational music scene showing notes moving from a tense dominant chord toward a stable home chord.",
    difficulty,
  }),
  Philosophy: (difficulty) => ({
    question: "Someone refuses to lie even when lying would avoid trouble. Which ethical approach does this most resemble?",
    answers: [
      { text: "Deontology, judging actions by duties or rules", correct: true },
      { text: "Hedonism, seeking only pleasure", correct: false },
      { text: "Skepticism, doubting every possible claim", correct: false },
      { text: "Aesthetics, studying beauty and art", correct: false },
    ],
    answerDescription: "Deontological ethics emphasizes whether actions follow moral duties, not only their outcomes.",
    answerSource: "Stanford Encyclopedia of Philosophy, Deontological Ethics",
    tags: ["ethics", "duties", "rules"],
    imagePrompt: "A thoughtful classroom illustration of balanced scales, a rulebook, and two diverging paths labeled visually without readable words.",
    difficulty,
  }),
  "Food and Cooking": (difficulty) => ({
    question: "Why does bread crust turn brown and flavorful in a hot oven?",
    answers: [
      { text: "Maillard reactions between sugars and amino acids", correct: true },
      { text: "Freezing water crystals inside the dough", correct: false },
      { text: "Yeast turning into salt", correct: false },
      { text: "Air pressure removing all starch", correct: false },
    ],
    answerDescription: "Maillard reactions create many browned flavors and aromas when heat acts on sugars and amino acids.",
    answerSource: "Harold McGee, On Food and Cooking",
    tags: ["baking", "maillard", "chemistry"],
    imagePrompt: "A warm bakery science illustration showing bread crust browning in an oven with simple molecule icons nearby.",
    difficulty,
  }),
  "Health and Medicine": (difficulty) => ({
    question: "Why do vaccines train the immune system before a real infection appears?",
    answers: [
      { text: "They help immune cells recognize a pathogen feature in advance", correct: true },
      { text: "They replace all white blood cells with medicine", correct: false },
      { text: "They make viruses unable to exist anywhere", correct: false },
      { text: "They stop the body from making antibodies", correct: false },
    ],
    answerDescription: "Vaccines expose the immune system to a safe form or piece of a pathogen so it can respond faster later.",
    answerSource: "World Health Organization, Vaccines and immunization",
    tags: ["immunity", "vaccines", "antibodies"],
    imagePrompt: "A clean medical education illustration showing immune cells recognizing a harmless pathogen marker, no needles close-up.",
    difficulty,
  }),
};

export function buildDryRunQuestion({ category, difficulty }) {
  return CATEGORY_FACTORIES[category](difficulty);
}

export function buildDryRunPictureQuestion({ category, difficulty }) {
  if (difficulty <= 1) {
    return {
      question: "Who is the actor shown in this image?",
      answers: [
        { text: "Jim Carrey", correct: true },
        { text: "Bruce Willis", correct: false },
        { text: "Tom Hanks", correct: false },
        { text: "Robin Williams", correct: false },
      ],
      answerDescription: "The image search target is a recognizable portrait of Jim Carrey.",
      answerSource: "Encyclopaedia Britannica, Jim Carrey",
      tags: ["actor", "film", "portrait"],
      imageSearchQuery: "Jim Carrey portrait",
      imageAlt: "Portrait of Jim Carrey",
      difficulty,
    };
  }

  return {
    question: "Which city is shown in this image?",
    answers: [
      { text: "Paris", correct: true },
      { text: "Riga", correct: false },
      { text: "Berlin", correct: false },
      { text: "Madrid", correct: false },
    ],
    answerDescription: "The Eiffel Tower is a distinctive landmark in Paris.",
    answerSource: "Encyclopaedia Britannica, Eiffel Tower",
    tags: ["city", "landmark", "paris"],
    imageSearchQuery: "Eiffel Tower Paris photo",
    imageAlt: "Eiffel Tower in Paris",
    difficulty,
  };
}

export function dryRunImageBytes() {
  return Buffer.from(TINY_WEBP_BASE64, "base64");
}
