import { chatgptAdapter } from "./chatgpt.js";
import { geminiAdapter } from "./gemini.js";
import { genericAdapter } from "./generic.js";
import { grokAdapter } from "./grok.js";
import { perplexityAdapter } from "./perplexity.js";
import type { ComposerAdapter } from "./types.js";

const adapters: ComposerAdapter[] = [chatgptAdapter, geminiAdapter, grokAdapter, perplexityAdapter];

export function adapterForUrl(url: URL): ComposerAdapter {
  return adapters.find((adapter) => adapter.match(url)) ?? genericAdapter;
}