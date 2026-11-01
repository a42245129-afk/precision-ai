import { describe, expect, it } from "vitest";
import { appendOptimizationInstruction, classifyTask } from "../src/index.js";

describe("classifyTask", () => {
  it("recognizes code prompts", () => expect(classifyTask("Write a C++ program to add two numbers").task).toBe("code"));
  it("recognizes debugging prompts", () => expect(classifyTask("Fix this compiler error").task).toBe("debugging"));
  it("falls back to general", () => expect(classifyTask("What time is it?").task).toBe("general"));
});

describe("appendOptimizationInstruction", () => {
  it("adds the precision policy once", () => {
    const first = appendOptimizationInstruction("Define polymorphism", { mode: "ultra" });
    const second = appendOptimizationInstruction(first, { mode: "ultra" });
    expect(first).toContain("minimum length");
    expect(second.match(/PRECISION AI — RESPONSE PREFERENCES/g)).toHaveLength(1);
  });
});
