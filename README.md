# Precision AI

A TypeScript monorepo containing:

- `packages/core`: task classification and concise-response policy engine.
- `apps/extension`: Chrome Manifest V3 extension prototype.
- `apps/api`: standalone HTTP API for optimizing prompts before sending them to an LLM.

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- Google Chrome or Chromium

## Install

```bash
npm install
```

## Run tests

```bash
npm test
npm run typecheck
```

## Build all workspaces

```bash
npm run build
```

Build only the extension:

```bash
npm run build:extension
```

Then open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `apps/extension/dist`.

## Run the API

```bash
npm run dev:api
```

Health check: `http://localhost:8787/health`

For a compiled API build, run `npm run build:api`, then `npm --workspace @precision-ai/api run start`. The API binds to `127.0.0.1` by default. It has no authentication yet and must not be exposed publicly; production authentication and provider access remain future work.

Example:

```bash
curl -X POST http://localhost:8787/v1/optimize \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"Write a C++ program to add two numbers","mode":"ultra"}'
```

The API currently returns an optimized prompt; it is not yet a model-proxy or full LLM gateway. Provider adapters, streaming proxying, authentication, rate limits, and billing controls are later roadmap items.

## Extension prototype behavior

On the listed supported hosts, the extension attempts to place a **✦ Precision** button near detected prompt composers. Clicking it appends response preferences to the prompt. This is intentionally user-triggered in v0.1: silently rewriting every prompt can interfere with site editors, uploads, voice input, or user-authored instructions.

The generic composer detector is a fallback. Chat websites frequently change their DOM, so platform selectors require ongoing verification. The extension does not access private model APIs or bypass provider controls.

## Platform adapter status

Selectors below were inspected on public pages. The user reports a successful live extension test on ChatGPT; I could not reproduce it in the shared unauthenticated browser session. Other platforms have not been manually verified here, and login-gated pages did not expose composers.

| Platform | Observed composer selector | Manual test |
| --- | --- | --- |
| ChatGPT | `textarea[aria-label="Chat with ChatGPT"]` (observed in shared page) | Yes (user-reported) |
| Claude | Not observed; sign-in page only | No |
| Gemini | `div[contenteditable="true"][role="textbox"][aria-label="Enter a prompt for Gemini"]` | No |
| DeepSeek | Not observed; sign-in page only | No |
| Grok | `div[contenteditable="true"][role="combobox"][aria-label="Ask Grok anything"]` | No |
| Perplexity | `div[contenteditable="true"][role="textbox"][aria-label="Ask anything…"]` | No |

Claude and DeepSeek currently use the generic fallback. Platform adapters for them are deferred until their composer elements can be inspected.

## Provider coverage

The core engine is provider-independent. The current extension host list is only an initial set of targets, not a claim that every AI website is supported. Provider-specific API adapters and website adapters are added incrementally.

## Security principles

- Never put provider API keys in extension source code.
- Keep secrets on a backend or use the provider's supported secure key flow.
- Validate request sizes and provider responses.
- Do not silently transmit prompts to a third-party optimization service.
- Keep user prompts local unless the user explicitly enables a remote provider workflow.
