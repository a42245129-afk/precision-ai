import { createCategory } from "./factory.js";

export const comparisonCategory = createCategory("comparison", [
  { signal: "explicit comparison", pattern: /\b(compare|comparison|versus|vs\.?|contrast|difference between)\b/i },
  { signal: "trade-offs or alternatives", pattern: /\b(pros and cons|trade-offs?|better than|side by side)\b/i }
], {
  ultra: "State the decisive differences and the practical conclusion.",
  balanced: "Compare the relevant criteria and summarize the important trade-offs.",
  detailed: "Compare options across explicit criteria, explain trade-offs, and state assumptions."
});