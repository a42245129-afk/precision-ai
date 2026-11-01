import { createCategory } from "./factory.js";

export const mlAiCategory = createCategory("ml-ai", [
  { signal: "machine-learning method", pattern: /\b(machine learning|neural network|deep learning|transformer|embedding|model training)\b/i },
  { signal: "AI model or prompt engineering", pattern: /\b(llm|large language model|generative ai|ai model|prompt engineering|fine-tun(e|ing))\b/i }
], {
  ultra: "Give the relevant AI/ML approach and its key result or caveat.",
  balanced: "Explain the AI/ML concept or method and its practical implications.",
  detailed: "Describe the AI/ML approach, assumptions, evaluation, limitations, and alternatives."
});