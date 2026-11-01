// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adapterForUrl } from "../src/content/adapters/index.js";
import { genericAdapter } from "../src/content/adapters/generic.js";

const storageGet = vi.fn(async () => ({ mode: "ultra", enabled: true }));

async function loadContentScript(): Promise<void> {
  vi.resetModules();
  await import("../src/content/content.js");
}

describe("content composer binding", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.stubGlobal("location", new URL("https://chatgpt.com"));
    vi.stubGlobal("chrome", {
      storage: { sync: { get: storageGet } },
      runtime: { onMessage: { addListener: vi.fn() } }
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 400,
      height: 40,
      top: 0,
      right: 400,
      bottom: 40,
      left: 0,
      toJSON: () => ({})
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("modifies the composer associated with its button in a shared parent", async () => {
    vi.stubGlobal("location", new URL("https://claude.ai"));
    const parent = document.createElement("div");
    const first = document.createElement("textarea");
    const second = document.createElement("textarea");
    first.setAttribute("aria-label", "Chat with ChatGPT");
    second.setAttribute("aria-label", "Chat with ChatGPT");
    first.value = "first prompt";
    second.value = "second prompt";
    parent.append(first, second);
    document.body.append(parent);

    await loadContentScript();
    const buttons = parent.querySelectorAll<HTMLButtonElement>("[data-precision-ai-apply]");
    expect(buttons).toHaveLength(2);

    buttons[1].click();
    await vi.waitFor(() => expect(second.value).toContain("PRECISION AI"));
    expect(first.value).toBe("first prompt");
  });

  it("detects a visible text input composer", async () => {
    vi.stubGlobal("location", new URL("https://claude.ai"));
    const input = document.createElement("input");
    input.type = "text";
    input.value = "input prompt";
    document.body.append(input);

    await loadContentScript();

    expect(document.querySelector("[data-precision-ai-apply]")).not.toBeNull();
  });

  it("falls back to generic composer detection when a site selector misses", async () => {
    vi.stubGlobal("location", new URL("https://claude.ai"));
    const textarea = document.createElement("textarea");
    textarea.setAttribute("aria-label", "updated composer selector");
    textarea.value = "fallback prompt";
    document.body.append(textarea);

    await loadContentScript();
    document.querySelector<HTMLButtonElement>("[data-precision-ai-apply]")!.click();
    await vi.waitFor(() => expect(textarea.value).toContain("---PRECISION-AI---"));

    expect(textarea.value).toContain("fallback prompt");
  });

  it("replaces a legacy block on click without changing the original prompt", async () => {
    const originalPrompt = "  preserve this prompt exactly\n";
    const form = document.createElement("form");
    form.innerHTML = '<div id="prompt-textarea" contenteditable="true"><p></p></div><div class="actions"><button data-testid="send-button"></button></div>';
    const composer = form.querySelector<HTMLElement>("#prompt-textarea")!;
    composer.textContent = `${originalPrompt}\n\n[PRECISION AI — RESPONSE PREFERENCES]\nlegacy rules\n[/PRECISION AI]`;
    document.body.append(form);

    await loadContentScript();
    document.querySelector<HTMLButtonElement>("[data-precision-ai-apply]")!.click();
    await vi.waitFor(() => expect(composer.textContent).toContain("---PRECISION-AI---"));

    expect(composer.textContent?.startsWith(originalPrompt)).toBe(true);
    expect(composer.textContent).not.toContain("legacy rules");
    expect((composer.textContent?.match(/---PRECISION-AI---/g) || [])).toHaveLength(1);
  });
});

describe("inspected platform adapters", () => {
  const fixtures = [
    {
      name: "ChatGPT",
      url: "https://chatgpt.com",
      selector: 'div.ProseMirror[contenteditable="true"]',
      markup: '<form><div class="editor-container"><div contenteditable="true" class="ProseMirror"><p></p></div></div></form>'
    },
    {
      name: "Gemini",
      url: "https://gemini.google.com",
      selector: 'div[contenteditable="true"][role="textbox"][aria-label="Enter a prompt for Gemini"]',
      markup: '<div contenteditable="true" role="textbox" aria-label="Enter a prompt for Gemini"></div>'
    },
    {
      name: "Grok",
      url: "https://grok.com",
      selector: 'div[contenteditable="true"][role="combobox"][aria-label="Ask Grok anything"]',
      markup: '<div contenteditable="true" role="combobox" aria-label="Ask Grok anything"></div>'
    },
    {
      name: "Perplexity",
      url: "https://www.perplexity.ai",
      selector: 'div[contenteditable="true"][role="textbox"][aria-label="Ask anything…"]',
      markup: '<div contenteditable="true" role="textbox" aria-label="Ask anything…"></div>'
    }
  ];

  beforeEach(() => {
    document.body.replaceChildren();
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 400,
      height: 40,
      top: 0,
      right: 400,
      bottom: 40,
      left: 0,
      toJSON: () => ({})
    });
  });

  afterEach(() => vi.restoreAllMocks());

  for (const fixture of fixtures) {
    it(`selects the observed ${fixture.name} composer`, () => {
      document.body.innerHTML = fixture.markup;
      const url = new URL(fixture.url);
      const adapter = adapterForUrl(url);

      expect(adapter.match(url)).toBe(true);
      expect(adapter.getComposer()).toBe(document.querySelector(fixture.selector));
    });
  }

  it("finds a ChatGPT contenteditable composer without a known ID", () => {
    document.body.innerHTML = '<main><form><div contenteditable="true" class="ProseMirror"><p>Ask here</p></div></form></main>';
    const adapter = adapterForUrl(new URL("https://chatgpt.com"));

    expect(adapter.getComposer()).toBe(document.querySelector('main form div[contenteditable="true"]'));
  });

  it("finds a textarea inside the ChatGPT main area as fallback", () => {
    document.body.innerHTML = '<main><form><textarea></textarea></form></main>';
    const adapter = adapterForUrl(new URL("https://chatgpt.com"));

    expect(adapter.getComposer()).toBe(document.querySelector("main form textarea"));
  });

  it("appends its button to the composer parent without a send button", () => {
    document.body.innerHTML = '<form><div class="editor-container"><div class="ProseMirror" contenteditable="true"><p></p></div></div></form>';
    const composer = document.querySelector<HTMLElement>("div.ProseMirror[contenteditable=true]")!;
    const parent = composer.parentElement;
    const button = document.createElement("button");
    const adapter = adapterForUrl(new URL("https://chatgpt.com"));

    expect(adapter.attachButton(composer, button)).toBe(true);

    expect(button.parentElement).toBe(parent);
    expect(parent?.lastElementChild).toBe(button);
  });

  it("finds a contenteditable div without the ProseMirror class", () => {
    document.body.innerHTML = '<main><div contenteditable="true"><p>Prompt</p></div></main>';
    const adapter = adapterForUrl(new URL("https://chatgpt.com"));

    expect(adapter.getComposer()).toBe(document.querySelector('main div[contenteditable="true"]'));
  });

});

describe("dynamic ChatGPT composer", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    vi.stubGlobal("location", new URL("https://chatgpt.com"));
    vi.stubGlobal("chrome", {
      storage: { sync: { get: storageGet } },
      runtime: { onMessage: { addListener: vi.fn() } }
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      width: 400,
      height: 40,
      top: 0,
      right: 400,
      bottom: 40,
      left: 0,
      toJSON: () => ({})
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("adds the button when the ProseMirror composer arrives later", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await loadContentScript();
    const form = document.createElement("form");
    form.innerHTML = '<div class="editor-container"><div contenteditable="true" class="ProseMirror"><p></p></div></div>';
    document.body.append(form);

    await vi.waitFor(() => expect(form.querySelector("[data-precision-ai-apply]")).not.toBeNull());
    const button = form.querySelector("[data-precision-ai-apply]")!;
    expect(button.parentElement).toBe(form.querySelector(".editor-container"));
    expect(form.querySelectorAll("[data-precision-ai-apply]")).toHaveLength(1);
    expect(log).toHaveBeenCalledWith("Precision AI: Injecting button...");
  });

  it("detects an existing ProseMirror div when it becomes contenteditable", async () => {
    await loadContentScript();
    const form = document.createElement("form");
    form.innerHTML = '<div class="editor-container"><div class="ProseMirror"><p></p></div></div>';
    const composer = form.querySelector<HTMLElement>(".ProseMirror")!;
    document.body.append(form);

    composer.setAttribute("contenteditable", "true");

    await vi.waitFor(() => expect(form.querySelector("[data-precision-ai-apply]")).not.toBeNull());
    expect(form.querySelector("[data-precision-ai-apply]")?.parentElement).toBe(form.querySelector(".editor-container"));
  });
});

describe("composer text rendering", () => {
  it("resizes a textarea to its content after setting the value", () => {
    const textarea = document.createElement("textarea");
    Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 176 });

    genericAdapter.setValue(textarea, "first line\nsecond line");

    expect(textarea.value).toBe("first line\nsecond line");
    expect(textarea.style.height).toBe("176px");
  });

  it("preserves and visually renders contenteditable newlines", () => {
    const composer = document.createElement("div");
    composer.contentEditable = "true";
    const inputEvents: InputEvent[] = [];
    composer.addEventListener("input", (event) => inputEvents.push(event as InputEvent));

    genericAdapter.setValue(composer, "first line\nsecond line");

    expect(composer.textContent).toBe("first line\nsecond line");
    expect(composer.style.whiteSpace).toBe("pre-wrap");
    expect(inputEvents[0].data).toBe("first line\nsecond line");
  });
});