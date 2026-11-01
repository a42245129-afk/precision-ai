import type { CategoryId, CategoryModule, Detector, ResponseMode } from "../types.js";

export function createCategory(
  id: CategoryId,
  detectors: Detector[],
  modeInstructions: Record<ResponseMode, string>
): CategoryModule {
  return {
    id,
    detect(prompt) {
      const signals = detectors.filter(({ pattern }) => pattern.test(prompt)).map(({ signal }) => signal);
      return {
        confidence: signals.length === 0 ? 0 : Math.min(0.95, 0.35 + signals.length * 0.2),
        signals
      };
    },
    instructions(mode) {
      return modeInstructions[mode];
    }
  };
}