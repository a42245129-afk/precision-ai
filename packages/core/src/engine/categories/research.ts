import { createCategory } from "./factory.js";

export const researchCategory = createCategory("research", [
  { signal: "research process or synthesis", pattern: /\b(research|literature review|methodology|research question|systematic review)\b/i },
  { signal: "evidence or sources", pattern: /\b(citation|sources|evidence|peer-reviewed|academic paper|study findings)\b/i }
], {
  ultra: "State the research conclusion with the essential evidence and uncertainty.",
  balanced: "Summarize the evidence, method, and key limitations concisely.",
  detailed: "Synthesize evidence and methods, distinguish fact from uncertainty, and identify limitations."
});