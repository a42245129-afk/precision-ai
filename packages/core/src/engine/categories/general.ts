import { createCategory } from "./factory.js";

export const generalCategory = createCategory("general", [
  { signal: "general question or request", pattern: /\b(what is|explain|help me|tell me|why|can you|please)\b/i }
], {
  ultra: "Address the general request directly in the fewest complete words.",
  balanced: "Answer the general request clearly, with only useful context.",
  detailed: "Structure a thorough general answer around the request's actual scope and constraints."
});