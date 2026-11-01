import { genericAdapter } from "./generic.js";
import type { ComposerAdapter } from "./types.js";

export function createPlatformAdapter(host: string, selector: string): ComposerAdapter {
  function getComposers(): HTMLElement[] {
    return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 180 && rect.height > 20 && style.visibility !== "hidden" && style.display !== "none";
    });
  }

  return {
    match(url) {
      return url.hostname === host || url.hostname.endsWith(`.${host}`);
    },
    getComposer() {
      return getComposers().at(-1) ?? null;
    },
    getComposers,
    getValue: genericAdapter.getValue,
    setValue: genericAdapter.setValue,
    attachButton: genericAdapter.attachButton
  };
}