chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.sync.get(["mode", "enabled"]);
  await chrome.storage.sync.set({
    mode: current.mode ?? "ultra",
    enabled: current.enabled ?? true
  });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "apply-precision") return;
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: "PRECISION_APPLY" });
});
