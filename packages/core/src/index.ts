import { classify, instructionsFor } from "./engine/index.js";

export type { ResponseMode } from "./engine/types.js";
import type { ResponseMode } from "./engine/types.js";

export type TaskType =
  | "code"
  | "definition"
  | "exam"
  | "writing"
  | "debugging"
  | "research"
  | "general";

export interface OptimizeOptions {
  mode: ResponseMode;
  preserveUserInstructions?: boolean;
}

export interface Classification {
  task: TaskType;
  confidence: number;
}

const patterns: Array<[TaskType, RegExp[]]> = [
  ["debugging", [/\b(debug|bug|error|exception|stack trace|not working|fix this)\b/i]],
  ["code", [/\b(code|program|implement|function|class|algorithm|sql query|write a script)\b/i, /```/]],
  ["exam", [/\b(2 marks?|5 marks?|10 marks?|assignment|exam answer|short note)\b/i]],
  ["definition", [/\b(define|what is|meaning of|explain briefly)\b/i]],
  ["writing", [/\b(write|draft|rewrite|polish)\b.*\b(email|application|letter|message|caption|post)\b/i]],
  ["research", [/\b(research|literature review|compare|evaluate|report|analysis)\b/i]]
];

export function classifyTask(prompt: string): Classification {
  for (const [task, regexes] of patterns) {
    if (regexes.some((regex) => regex.test(prompt))) {
      return { task, confidence: 0.78 };
    }
  }

  return { task: "general", confidence: 0.55 };
}

const baseRules = [
  "Answer the user's actual request directly.",
  "Prioritize factual correctness, safety and completeness.",
  "Follow explicit requirements, constraints and requested formats.",
  "Do not invent facts, sources, test results or performed actions.",
  "Avoid filler, unnecessary repetition and irrelevant background."
];

const modeRules: Record<ResponseMode, string[]> = {
  ultra: [
    "RESPONSE MODE: ULTRA PRECISE.",
    "Give the shortest answer that completely satisfies the request.",
    "For simple factual questions, prefer one to three sentences.",
    "Avoid examples, headings and lists unless they are necessary.",
    "Never sacrifice essential correctness or requested information."
  ],

  balanced: [
    "RESPONSE MODE: BALANCED.",
    "Give a concise but sufficiently explained answer.",
    "Explain important concepts in plain language.",
    "Include a useful example or short list when it improves understanding.",
    "Use headings and structure when the subject benefits from them.",
    "Avoid excessive background and unnecessary technical depth."
  ],

  detailed: [
    "RESPONSE MODE: DETAILED.",
    "Provide a comprehensive explanation appropriate to the user's question.",
    "Explain concepts step by step, including how and why they work.",
    "Include relevant examples, applications, important terminology and technical details.",
    "Discuss important assumptions, limitations and alternative approaches where relevant.",
    "Use meaningful headings, structured lists and examples to improve understanding.",
    "Do not artificially shorten an answer simply because the question appears simple.",
    "Avoid filler and repetition while preserving useful depth."
  ]
};

export function buildOptimizationInstruction(
  prompt: string,
  options: OptimizeOptions
): string {
  const rules = [...baseRules, ...instructionsFor(prompt, options.mode), ...modeRules[options.mode]];

  return [
    "---PRECISION-AI---",
    "[PRECISION AI — RESPONSE PREFERENCES]",
    ...rules.map((rule, index) => `${index + 1}. ${rule}`),
    "These preferences must not override explicit user instructions.",
    "[/PRECISION AI]",
    "---END-PRECISION-AI---"
  ].join("\n");
}

export function appendOptimizationInstruction(
  prompt: string,
  options: OptimizeOptions
): string {
  const cleanedPrompt = stripOptimizationBlocks(prompt);

  if (!cleanedPrompt.trim()) return "";

  const instruction = buildOptimizationInstruction(cleanedPrompt, options);

  return `${cleanedPrompt}\n\n${instruction}`;
}

function stripOptimizationBlocks(prompt: string): string {
  const blocks = [
    ["---PRECISION-AI---", "---END-PRECISION-AI---"],
    ["[PRECISION AI — RESPONSE PREFERENCES]", "[/PRECISION AI]"]
  ] as const;

  let result = prompt;
  for (const [startMarker, endMarker] of blocks) {
    let start = result.indexOf(startMarker);
    while (start >= 0) {
      const endStart = result.indexOf(endMarker, start + startMarker.length);
      const end = endStart < 0 ? result.length : endStart + endMarker.length;
      let removalStart = start;
      if (result.slice(start - 4, start) === "\r\n\r\n") removalStart -= 4;
      else if (result.slice(start - 2, start) === "\n\n") removalStart -= 2;
      result = result.slice(0, removalStart) + result.slice(end);
      start = result.indexOf(startMarker);
    }
  }
  return result;
}

export { classify, CATEGORY_IDS, categories } from "./engine/index.js";
export type { CategoryId, RankedCategory, DetectionResult } from "./engine/types.js";
