import { createCategory } from "./factory.js";

export const tutorialCategory = createCategory("tutorial", [
  { signal: "step-by-step instruction", pattern: /\b(how to|step[- ]by[- ]step|walk me through|tutorial|guide me)\b/i },
  { signal: "learning request", pattern: /\b(teach me|show me how|instructions for)\b/i }
], {
  ultra: "Give the minimum ordered steps needed to complete the task.",
  balanced: "Provide clear ordered steps and explain any non-obvious action.",
  detailed: "Teach the procedure from prerequisites through verification, explaining important steps."
});