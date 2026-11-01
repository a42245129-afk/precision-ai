import { createCategory } from "./factory.js";

export const programmingCategory = createCategory("programming", [
  { signal: "software implementation request", pattern: /\b(code|program|implement|function|class|script|api|compile)\b/i },
  { signal: "programming language or code fence", pattern: /\b(typescript|javascript|python|java|c\+\+|rust|go|sql)\b|```/i }
], {
  ultra: "Provide the smallest correct implementation and essential usage detail.",
  balanced: "Provide readable, correct code and briefly explain important choices.",
  detailed: "Provide a complete implementation with relevant design choices, edge cases, and usage."
});