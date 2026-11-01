import type { ComposerAdapter } from "./types.js";

const supportedHosts = [
  "chatgpt.com",
  "claude.ai",
  "gemini.google.com",
  "deepseek.com",
  "grok.com",
  "perplexity.ai"
];

function getComposerElements(): HTMLElement[] {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(
    'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
  ));

  return candidates.filter((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 180 && rect.height > 20 && style.visibility !== "hidden" && style.display !== "none";
  });
}

export const genericAdapter: ComposerAdapter = {
  match(url) {
    return supportedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  },
  getComposer() {
    return getComposerElements().at(-1) ?? null;
  },
  getComposers() {
    return getComposerElements();
  },
  getValue(element) {
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) return element.value;
    return element.innerText || element.textContent || "";
  },
  setValue(element, text) {
    element.focus();
    if (element instanceof HTMLTextAreaElement) {
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
      setter?.call(element, text);
      const previousHeight = element.style.height;
      element.style.height = "auto";
      const contentHeight = element.scrollHeight;
      element.style.height = contentHeight > 0 ? `${contentHeight}px` : previousHeight;
    } else if (element instanceof HTMLInputElement) {
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
      setter?.call(element, text);
    } else {
      element.style.whiteSpace = "pre-wrap";
      element.replaceChildren(document.createTextNode(text));
    }
    element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
  },
  attachButton(element, button) {
    const parent = element.parentElement;
    if (!parent) return false;
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const previousPosition = getComputedStyle(parent).position;
    if (previousPosition === "static") parent.style.position = "relative";
    Object.assign(button.style, {
      position: "absolute",
      zIndex: "999999",
      left: `${elementRect.left - parentRect.left}px`,
      top: `${elementRect.top - parentRect.top - 34}px`
    });
    parent.append(button);
    return true;
  }
};