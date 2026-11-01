import { createPlatformAdapter } from "./platform.js";

export const geminiAdapter = createPlatformAdapter(
  "gemini.google.com",
  'div[contenteditable="true"][role="textbox"][aria-label="Enter a prompt for Gemini"]'
);