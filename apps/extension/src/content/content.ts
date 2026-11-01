import { appendOptimizationInstruction, type ResponseMode } from "@precision-ai/core";
import { adapterForUrl } from "./adapters/index.js";
import { genericAdapter } from "./adapters/generic.js";

async function applyPrecision(element: HTMLElement, adapter: ReturnType<typeof adapterForUrl>): Promise<void> {
  const { mode = "ultra", enabled = true } = await chrome.storage.sync.get(["mode", "enabled"]);
  if (!enabled) return;
  const originalPrompt = adapter.getValue(element);
  if (!originalPrompt.trim()) {
    console.warn("Precision AI: composer is empty; no changes made.");
    return;
  }
  const optimized = appendOptimizationInstruction(originalPrompt, { mode: mode as ResponseMode });
  if (optimized !== originalPrompt) adapter.setValue(element, optimized);
}

function addButton(element: HTMLElement, adapter: ReturnType<typeof adapterForUrl>): void {
  if (!element.parentElement || element.dataset.precisionAiButton === "true") return;
  const button = document.createElement("button");
  button.dataset.precisionAiApply = "";
  button.type = "button";
  button.textContent = "✦ Precision";
  button.title = "Append your Precision AI response preferences to this prompt";
  button.setAttribute("aria-label", "Apply Precision AI preferences to this prompt");
  Object.assign(button.style, {
    border: "1px solid #64748b", borderRadius: "999px", padding: "5px 10px",
    background: "#172033", color: "white", font: "12px system-ui", cursor: "pointer"
  });
  button.addEventListener("click", () => void applyPrecision(element, adapter));
  if (!adapter.attachButton(element, button)) return;
  console.log("Precision AI: Injecting button...");
  element.dataset.precisionAiButton = "true";
}

function scan(): void {
  const url = new URL(location.href);
  let adapter = adapterForUrl(url);
  if (!adapter.match(url)) return;
  let composers = adapter.getComposers();
  if (composers.length === 0 && adapter !== genericAdapter && adapter.allowGenericFallback !== false) {
    adapter = genericAdapter;
    composers = adapter.getComposers();
  }
  for (const composer of composers) addButton(composer, adapter);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "PRECISION_APPLY") {
    let adapter = adapterForUrl(new URL(location.href));
    let composer = adapter.getComposer();
    if (!composer && adapter !== genericAdapter && adapter.allowGenericFallback !== false) {
      adapter = genericAdapter;
      composer = adapter.getComposer();
    }
    if (composer) void applyPrecision(composer, adapter);
  }
});

const observer = new MutationObserver(() => scan());
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class", "contenteditable"]
});
scan();
