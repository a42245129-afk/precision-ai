import { describe, expect, it } from "vitest";

import {
  CATEGORY_IDS,
  appendOptimizationInstruction,
  buildOptimizationInstruction,
  categories,
  classify,
  classifyTask
} from "../src/index.js";

describe("classifyTask", () => {
  it("recognizes code prompts", () => {
    expect(classifyTask("Write a C++ program").task).toBe("code");
  });

  it("recognizes debugging prompts", () => {
    expect(classifyTask("Fix this compiler error").task).toBe("debugging");
  });

  it("recognizes definition prompts", () => {
    expect(classifyTask("What is game theory?").task).toBe("definition");
  });

  it("falls back to general", () => {
    expect(classifyTask("What time is it?").task).toBe("general");
  });
});

describe("Response modes", () => {
  const prompt = "What is game theory?";

  it("generates different instructions for all three modes", () => {
    const ultra = buildOptimizationInstruction(prompt, { mode: "ultra" });
    const balanced = buildOptimizationInstruction(prompt, { mode: "balanced" });
    const detailed = buildOptimizationInstruction(prompt, { mode: "detailed" });

    expect(ultra).toContain("ULTRA PRECISE");
    expect(balanced).toContain("BALANCED");
    expect(detailed).toContain("DETAILED");

    expect(new Set([ultra, balanced, detailed]).size).toBe(3);
  });

  it("gives detailed mode explicit depth requirements", () => {
    const result = buildOptimizationInstruction(prompt, { mode: "detailed" });

    expect(result).toContain("step by step");
    expect(result).toContain("examples");
    expect(result).toContain("technical details");
  });
});

describe("universal task classification", () => {
  it("exposes all 18 requested categories", () => {
    expect(CATEGORY_IDS).toHaveLength(18);
    expect(categories.map((category) => category.id).sort()).toEqual([...CATEGORY_IDS].sort());
  });

  it("returns different mode instructions for every category", () => {
    for (const category of categories) {
      const instructions = [
        category.instructions("ultra"),
        category.instructions("balanced"),
        category.instructions("detailed")
      ];
      expect(new Set(instructions).size, category.id).toBe(3);
    }
  });

  it("ranks domain matches and preserves two strong categories", () => {
    const ranked = classify("Compare linear regression and decision trees for forecasting");
    expect(ranked[0].confidence).toBeGreaterThanOrEqual(0.4);
    expect(ranked.slice(0, 2).map(({ id }) => id)).toEqual(["statistics", "comparison"]);
    expect(ranked[0].confidence).toBeGreaterThan(0.5);
    expect(ranked[1].confidence).toBeGreaterThan(0.5);
  });

  it("merges instructions from the top two strong categories", () => {
    const prompt = "Compare linear regression and decision trees for forecasting";
    const instruction = buildOptimizationInstruction(prompt, { mode: "balanced" });

    expect(instruction).toContain(categories.find(({ id }) => id === "statistics")!.instructions("balanced"));
    expect(instruction).toContain(categories.find(({ id }) => id === "comparison")!.instructions("balanced"));
  });

  it("falls back to general when no detector reaches the threshold", () => {
    expect(classify("plum sky folded quietly")[0]).toMatchObject({ id: "general", confidence: 0.4 });
  });
});

describe("appendOptimizationInstruction", () => {
  it("preserves the original prompt", () => {
    const result = appendOptimizationInstruction(
      "Explain game theory",
      { mode: "balanced" }
    );

    expect(result).toContain("Explain game theory");
  });

  it("preserves every input byte before the appended instruction", () => {
    const input = "  Explain game theory\n\n";
    const output = appendOptimizationInstruction(input, { mode: "balanced" });

    expect(output.startsWith(input)).toBe(true);
  });

  it("replaces the previous mode instead of duplicating it", () => {
    const first = appendOptimizationInstruction(
      "Explain game theory",
      { mode: "ultra" }
    );

    const second = appendOptimizationInstruction(
      first,
      { mode: "detailed" }
    );

    expect(second).toContain("RESPONSE MODE: DETAILED.");
    expect(second).not.toContain("RESPONSE MODE: ULTRA PRECISE.");
    expect(
      (second.match(/PRECISION AI — RESPONSE PREFERENCES/g) || []).length
    ).toBe(1);
  });

  it("migrates a legacy marker to exactly one current marker", () => {
    const original = "Explain game theory";
    const legacy = `${original}\n\n[PRECISION AI — RESPONSE PREFERENCES]\nlegacy rules\n[/PRECISION AI]`;
    const output = appendOptimizationInstruction(legacy, { mode: "balanced" });

    expect(output.startsWith(original)).toBe(true);
    expect(output).not.toContain("legacy rules");
    expect((output.match(/---PRECISION-AI---/g) || [])).toHaveLength(1);
  });

  it("does not add an empty prompt", () => {
    expect(
      appendOptimizationInstruction("   ", { mode: "ultra" })
    ).toBe("");
  });
});
