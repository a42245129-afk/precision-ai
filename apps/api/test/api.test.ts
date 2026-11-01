import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("API", () => {
  let server: ReturnType<typeof createServer>;
  let baseUrl: string;

  beforeEach(async () => {
    server = createServer(createApp());
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });

  it("reports health", async () => {
    const response = await fetch(`${baseUrl}/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, service: "precision-ai-api" });
  });

  it("optimizes valid prompts with the requested mode", async () => {
    const response = await fetch(`${baseUrl}/v1/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Define polymorphism", mode: "balanced" })
    });
    const result = await response.json() as { optimizedPrompt: string; classification: { task: string }; mode: string };

    expect(response.status).toBe(200);
    expect(result.optimizedPrompt).toContain("PRECISION AI — RESPONSE PREFERENCES");
    expect(result.classification.task).toBe("definition");
    expect(result.mode).toBe("balanced");
  });

  it("rejects invalid prompt and mode values", async () => {
    const response = await fetch(`${baseUrl}/v1/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "", mode: "unknown" })
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "Invalid request" });
  });
});