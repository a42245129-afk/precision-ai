import { createCategory } from "./factory.js";

export const summarizationCategory = createCategory("summarization", [
  { signal: "summarize or condense", pattern: /\b(summarize|summarise|summary|condense|tl;dr|key points)\b/i },
  { signal: "overview or abstract", pattern: /\b(brief overview|executive summary|abstract of|main takeaways)\b/i }
], {
  ultra: "Return only the central points needed to represent the source accurately.",
  balanced: "Summarize the main ideas and preserve important qualifications.",
  detailed: "Organize the source's claims, evidence, and qualifications into a faithful structured summary."
});