import { createCategory } from "./factory.js";

export const scienceCategory = createCategory("science", [
  { signal: "scientific discipline or object", pattern: /\b(physics|chemistry|biology|astronomy|molecule|cell|climate|scientific)\b/i },
  { signal: "scientific method or experiment", pattern: /\b(experiment|hypothesis|laboratory|organism|reaction|ecosystem)\b/i }
], {
  ultra: "Give the scientifically accurate result and essential qualification.",
  balanced: "Explain the scientific concept and the evidence or mechanism briefly.",
  detailed: "Explain the scientific mechanism, evidence, assumptions, and limits of current knowledge."
});