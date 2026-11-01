import { createCategory } from "./factory.js";

export const planningCategory = createCategory("planning", [
  { signal: "plan or schedule request", pattern: /\b(plan|schedule|roadmap|milestone|itinerary|timeline|project plan)\b/i },
  { signal: "organization or workflow", pattern: /\b(organize|organise|prioriti[sz]e|workflow|action plan)\b/i }
], {
  ultra: "Return the essential ordered actions and timing.",
  balanced: "Create a practical plan with priorities, milestones, and concise rationale.",
  detailed: "Build a sequenced plan with dependencies, milestones, risks, and success checks."
});