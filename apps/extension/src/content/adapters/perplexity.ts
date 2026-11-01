import { createPlatformAdapter } from "./platform.js";

export const perplexityAdapter = createPlatformAdapter(
  "perplexity.ai",
  'div[contenteditable="true"][role="textbox"][aria-label="Ask anything…"]'
);