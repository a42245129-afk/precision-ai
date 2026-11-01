export const CATEGORY_IDS = [
  "general", "math", "statistics", "programming", "algorithms", "debugging",
  "data-science", "ml-ai", "research", "academic", "writing", "summarization",
  "comparison", "recommendation", "tutorial", "business", "science", "planning"
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
export type ResponseMode = "ultra" | "balanced" | "detailed";

export interface DetectionResult {
  confidence: number;
  signals: string[];
}

export interface RankedCategory extends DetectionResult {
  id: CategoryId;
}

export interface CategoryModule {
  id: CategoryId;
  detect(prompt: string): DetectionResult;
  instructions(mode: ResponseMode): string;
}

export interface Detector {
  signal: string;
  pattern: RegExp;
}