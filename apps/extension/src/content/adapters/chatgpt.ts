import { createPlatformAdapter } from "./platform.js";
import { genericAdapter } from "./generic.js";

const baseAdapter = createPlatformAdapter(
  "chatgpt.com",
  'div.ProseMirror[contenteditable="true"], div[contenteditable="true"], main textarea, form textarea'
);

function getChatGPTComposers(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(
    'div.ProseMirror[contenteditable="true"], div[contenteditable="true"], main textarea, form textarea'
  )).filter((composer) => {
    const rect = composer.getBoundingClientRect();
    const style = getComputedStyle(composer);
    return rect.width > 180 && rect.height > 20 && style.visibility !== "hidden" && style.display !== "none";
  });
}

export const chatgptAdapter = {
  ...baseAdapter,
  allowGenericFallback: false,
  getComposer() {
    return getChatGPTComposers().at(-1) ?? null;
  },
  getComposers() {
    return getChatGPTComposers();
  },
  attachButton(element: HTMLElement, button: HTMLButtonElement) {
    const container = element.parentElement ?? element.closest("form");
    if (!container) return false;
    Object.assign(button.style, {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      margin: "8px 0"
    });
    container.append(button);
    return true;
  }
};