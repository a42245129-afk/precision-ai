import { createCategory } from "./factory.js";

export const businessCategory = createCategory("business", [
  { signal: "business operations or strategy", pattern: /\b(business|market|revenue|customer|strategy|sales|startup|pricing|roi)\b/i },
  { signal: "commercial planning or analysis", pattern: /\b(product launch|go-to-market|profit margin|customer acquisition|business case)\b/i }
], {
  ultra: "Give the business decision or result with its key commercial implication.",
  balanced: "Connect the business analysis to practical decisions and important trade-offs.",
  detailed: "Analyze the commercial context, assumptions, risks, and actionable implications."
});