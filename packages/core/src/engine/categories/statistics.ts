import { createCategory } from "./factory.js";

export const statisticsCategory = createCategory("statistics", [
  { signal: "statistical measure or test", pattern: /\b(mean|median|mode|variance|standard deviation|hypothesis test|p-value|confidence interval|correlation)\b/i },
  { signal: "statistical data analysis", pattern: /\b(regression|sample size|distribution|statistical significance|probability of|survey results)\b/i }
], {
  ultra: "Give the statistical result with the essential metric and qualification.",
  balanced: "Report the statistical method and result with a concise interpretation.",
  detailed: "Explain the statistical method, assumptions, calculations, uncertainty, and interpretation."
});