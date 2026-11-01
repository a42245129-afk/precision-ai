import { createCategory } from "./factory.js";

export const academicCategory = createCategory("academic", [
  { signal: "academic task or assessment", pattern: /\b(assignment|exam|essay|thesis|dissertation|coursework|marks|homework|academic)\b/i },
  { signal: "formal academic structure", pattern: /\b(argument|abstract|literature review|research paper|referencing)\b/i }
], {
  ultra: "Answer the academic task in the requested format with only essential points.",
  balanced: "Give a focused academic answer with the key concepts and supporting reasoning.",
  detailed: "Develop a structured academic response with evidence, terminology, and relevant qualifications."
});