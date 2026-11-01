import { createPlatformAdapter } from "./platform.js";

export const grokAdapter = createPlatformAdapter(
  "grok.com",
  'div[contenteditable="true"][role="combobox"][aria-label="Ask Grok anything"]'
);