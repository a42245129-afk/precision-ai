import { createCategory } from "./factory.js";

export const writingCategory = createCategory("writing", [
  { signal: "drafting or editing request", pattern: /\b(write|draft|rewrite|polish|proofread|edit)\b/i },
  { signal: "written format or audience", pattern: /\b(email|letter|blog|story|caption|post|tone|copywriting|cover letter)\b/i }
], {
  ultra: "Return a ready-to-use draft that follows the requested tone.",
  balanced: "Provide a polished draft and preserve the requested audience, tone, and format.",
  detailed: "Produce a polished draft that satisfies the brief, audience, tone, and structural constraints."
});