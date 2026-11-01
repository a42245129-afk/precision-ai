import { createCategory } from "./factory.js";

export const debuggingCategory = createCategory("debugging", [
  { signal: "bug or failure", pattern: /\b(debug|bug|error|exception|stack trace|traceback|not working|failing|fix this)\b/i },
  { signal: "diagnostic output", pattern: /\b(compiler error|runtime error|assertion failed|unexpected output)\b/i }
], {
  ultra: "Identify the likely cause and give the minimal correction.",
  balanced: "Explain the likely cause, show the fix, and note why it resolves the failure.",
  detailed: "Trace the failure from evidence to cause, show a correction, and explain verification and edge cases."
});