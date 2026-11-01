import { createCategory } from "./factory.js";

export const mathCategory = createCategory("math", [
  { signal: "mathematical operation or concept", pattern: /\b(solve|calculate|derive|equation|integral|derivative|geometry|algebra|theorem|matrix)\b/i },
  { signal: "mathematical notation", pattern: /[=∫√πΣ]|\b\d+\s*[+*/-]\s*\d+\b/ }
], {
  ultra: "Compute the requested mathematical result; show only essential steps and the final value.",
  balanced: "Solve the mathematics clearly, showing key equations and checks.",
  detailed: "State variables and assumptions, derive each step, and verify the mathematical result."
});