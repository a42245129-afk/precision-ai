import { createCategory } from "./factory.js";

export const recommendationCategory = createCategory("recommendation", [
  { signal: "request for recommendation", pattern: /\b(recommend|suggest|advise|which should|what should i|best option)\b/i },
  { signal: "choice among options", pattern: /\b(choose between|which one|what would you pick|buy or)\b/i }
], {
  ultra: "Make a clear recommendation and give its decisive reason.",
  balanced: "Recommend an option based on the stated needs and explain the key trade-off.",
  detailed: "Evaluate options against the user's criteria, state assumptions, and make a justified recommendation."
});