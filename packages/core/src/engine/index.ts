import { academicCategory } from "./categories/academic.js";
import { algorithmsCategory } from "./categories/algorithms.js";
import { businessCategory } from "./categories/business.js";
import { comparisonCategory } from "./categories/comparison.js";
import { dataScienceCategory } from "./categories/data-science.js";
import { debuggingCategory } from "./categories/debugging.js";
import { generalCategory } from "./categories/general.js";
import { mathCategory } from "./categories/math.js";
import { mlAiCategory } from "./categories/ml-ai.js";
import { planningCategory } from "./categories/planning.js";
import { programmingCategory } from "./categories/programming.js";
import { recommendationCategory } from "./categories/recommendation.js";
import { researchCategory } from "./categories/research.js";
import { scienceCategory } from "./categories/science.js";
import { statisticsCategory } from "./categories/statistics.js";
import { summarizationCategory } from "./categories/summarization.js";
import { tutorialCategory } from "./categories/tutorial.js";
import { writingCategory } from "./categories/writing.js";
import type { CategoryId, CategoryModule, RankedCategory, ResponseMode } from "./types.js";

export { CATEGORY_IDS } from "./types.js";
export type { CategoryId, DetectionResult, RankedCategory, ResponseMode } from "./types.js";

export const categories: CategoryModule[] = [
  mathCategory, statisticsCategory, programmingCategory, algorithmsCategory,
  debuggingCategory, dataScienceCategory, mlAiCategory, researchCategory,
  academicCategory, writingCategory, summarizationCategory, comparisonCategory,
  recommendationCategory, tutorialCategory, businessCategory, scienceCategory,
  planningCategory, generalCategory
];

const categoryById = new Map<CategoryId, CategoryModule>(categories.map((category) => [category.id, category]));

export function classify(prompt: string): RankedCategory[] {
  const ranked = categories
    .map((category) => ({ id: category.id, ...category.detect(prompt) }))
    .sort((left, right) => right.confidence - left.confidence);

  if ((ranked[0]?.confidence ?? 0) < 0.4) {
    const general = generalCategory.detect(prompt);
    return [
      { id: "general", confidence: 0.4, signals: general.signals.length ? general.signals : ["fallback: no category matched"] },
      ...ranked.filter((category) => category.id !== "general")
    ];
  }

  return ranked;
}

export function instructionsFor(prompt: string, mode: ResponseMode): string[] {
  const selected = classify(prompt).filter((category) => category.confidence > 0.5).slice(0, 2);
  const categoriesToUse = selected.length ? selected : [{ id: "general" as const, confidence: 0.4, signals: [] }];
  return categoriesToUse.map((category) => categoryById.get(category.id)!.instructions(mode));
}