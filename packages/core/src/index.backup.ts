export type ResponseMode = "ultra" | "balanced" | "detailed";
export type TaskType = "code" | "definition" | "exam" | "writing" | "debugging" | "research" | "general";

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
    if (regexes.some((regex) => regex.test(prompt))) return { task, confidence: 0.78 };
  }
  return { task: "general", confidence: 0.55 };
}

const baseRules = [
  "Answer the user's actual request directly.",
  "Use the minimum length that fully satisfies the request.",
  "Do not add greetings, generic introductions, repeated conclusions, or unsolicited background.",
  "Do not omit requested steps, outputs, constraints, caveats, or important reasoning.",
  "Correctness, safety, and completeness take priority over brevity.",
  "If the task genuinely requires detail, provide the detail; do not force an arbitrary word limit.",
  "Do not claim to have tested code, checked sources, or performed actions unless actually done."
];

const taskRules: Record<TaskType, string[]> = {
  code: [
    "For code requests, provide the simplest correct and readable solution that meets the stated requirements.",
    "Avoid unnecessary abstractions, boilerplate, comments, and multiple alternative implementations.",
    "Include only essential setup or usage notes. Preserve edge-case handling and correctness."
  ],
  debugging: [
    "For debugging, identify the likely cause, show the minimal corrected code or change, and briefly explain why.",
    "Do not rewrite unrelated parts of the user's program. Ask for missing error details only when necessary."
  ],
  definition: ["For a definition or simple factual question, answer in a few direct sentences unless the user requests depth."],
  exam: [
    "For academic answers, match the requested marks, word count, and format when specified.",
    "Use direct points and relevant terminology; do not add unrelated material."
  ],
  writing: ["For writing tasks, return a ready-to-use draft and avoid explaining the draft unless asked."],
  research: [
    "For research tasks, remain concise but include the evidence, assumptions, uncertainty, and sources needed to support the conclusion.",
    "Never remove important qualifications merely to shorten the answer."
  ],
  general: ["For straightforward questions, lead with the answer and add context only when it materially helps."]
};

const modeRules: Record<ResponseMode, string> = {
  ultra: "Style: ultra-concise. Prefer the shortest complete answer. Use bullets only when they improve clarity.",
  balanced: "Style: concise and clear. Include brief explanation where it improves understanding.",
  detailed: "Style: thorough and structured. Explain important reasoning, examples, and trade-offs without filler."
};

export function buildOptimizationInstruction(prompt: string, options: OptimizeOptions): string {
  const { task } = classifyTask(prompt);
  const rules = [...baseRules, ...taskRules[task], modeRules[options.mode]];
  return [
    "[PRECISION AI — RESPONSE PREFERENCES]",
    ...rules.map((rule, index) => `${index + 1}. ${rule}`),
    "Treat these as style preferences, not permission to ignore the user's explicit requirements.",
    "[/PRECISION AI]"
  ].join("\n");
}

export function appendOptimizationInstruction(prompt: string, options: OptimizeOptions): string {
  const instruction = buildOptimizationInstruction(prompt, options);
  if (prompt.includes("[PRECISION AI — RESPONSE PREFERENCES]")) return prompt;
  return `${prompt.trim()}\n\n${instruction}`;
}
