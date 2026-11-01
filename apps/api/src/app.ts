import "dotenv/config";
import cors from "cors";
import express from "express";
import { z } from "zod";
import { appendOptimizationInstruction, classifyTask } from "@precision-ai/core";

const optimizeSchema = z.object({
  prompt: z.string().min(1).max(12000),
  mode: z.enum(["ultra", "balanced", "detailed"]).default("ultra")
});

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? false }));
  app.use(express.json({ limit: "32kb" }));

  app.get("/health", (_req, res) => res.json({ ok: true, service: "precision-ai-api", version: "0.1.0" }));

  app.post("/v1/optimize", (req, res) => {
    const parsed = optimizeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    const { prompt, mode } = parsed.data;
    res.json({
      optimizedPrompt: appendOptimizationInstruction(prompt, { mode }),
      classification: classifyTask(prompt),
      mode
    });
  });

  return app;
}