import { createCategory } from "./factory.js";

export const algorithmsCategory = createCategory("algorithms", [
  { signal: "algorithm or complexity", pattern: /\b(algorithm|big-o|time complexity|space complexity|dynamic programming|recursion)\b/i },
  { signal: "data structure or algorithm family", pattern: /\b(sort(ing)?|search(ing)?|graph|tree traversal|hash table|shortest path|data structure)\b/i }
], {
  ultra: "Give the algorithm and its essential complexity.",
  balanced: "Explain the algorithm's main steps and time/space complexity.",
  detailed: "Describe the algorithm, correctness intuition, complexity, and relevant trade-offs."
});