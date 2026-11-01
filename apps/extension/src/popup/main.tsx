import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { ResponseMode } from "@precision-ai/core";
import "./style.css";

function Popup() {
  const [mode, setMode] = useState<ResponseMode>("ultra");
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    chrome.storage.sync.get(["mode", "enabled"]).then((data) => {
      setMode(data.mode ?? "ultra");
      setEnabled(data.enabled ?? true);
    });
  }, []);
  async function save(next: Partial<{ mode: ResponseMode; enabled: boolean }>) {
    const value = { mode, enabled, ...next };
    setMode(value.mode); setEnabled(value.enabled);
    await chrome.storage.sync.set(value);
  }
  return <main>
    <header><div className="logo">✦</div><div><h1>Precision AI</h1><p>Make every response count.</p></div><span className={enabled ? "status on" : "status"}>{enabled ? "ON" : "OFF"}</span></header>
    <label className="toggle"><span>Enable Precision AI</span><input type="checkbox" checked={enabled} onChange={(e) => void save({ enabled: e.target.checked })}/></label>
    <h2>Response style</h2>
    {([ ["ultra", "Ultra precise", "Shortest complete answer"], ["balanced", "Balanced", "Concise with useful context"], ["detailed", "Detailed", "Thorough explanations"] ] as const).map(([value, title, desc]) => <button key={value} className={`mode ${mode === value ? "selected" : ""}`} onClick={() => void save({ mode: value })}><span><b>{title}</b><small>{desc}</small></span><span>{mode === value ? "●" : "○"}</span></button>)}
    <p className="hint">On supported AI sites, use the ✦ Precision button beside the prompt box or press Alt + Shift + P.</p>
    <footer>v0.1.0 · Local prompt optimization</footer>
  </main>;
}

createRoot(document.getElementById("root")!).render(<Popup />);
