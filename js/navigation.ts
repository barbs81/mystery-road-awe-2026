import { state } from "./state.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderEvidenceList } from "./views/evidence.js";
import { renderPeople, renderLocations } from "./views/people.js";
import { renderTimeline } from "./views/timeline.js";
import { renderWorkspace } from "./views/workspace.js";

const viewRendered: Record<string, boolean> = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

export function navigateTo(viewName: string): void {
  window.location.hash = viewName;
}

export function handleHashChange(): void {
  let hash = window.location.hash.replace("#", "");
  const validViews = [
    "dashboard",
    "evidence",
    "people",
    "timeline",
    "workspace",
  ];
  if (!validViews.includes(hash)) {
    hash = "dashboard";
  }

  state.currentPage = hash;

  const sections = document.querySelectorAll<HTMLElement>(".view");
  sections.forEach((section) => section.classList.remove("active"));

  const activeView = document.getElementById(
    "view-" + hash,
  ) as HTMLElement | null;
  activeView?.classList.add("active");

  const navButtons = document.querySelectorAll<HTMLButtonElement>(".nav-btn");
  navButtons.forEach((button) => {
    button.classList.remove("active");
    if (button.getAttribute("data-view") === hash) {
      button.classList.add("active");
    }
  });

  if (hash === "dashboard" && !viewRendered.dashboard) {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === "evidence" && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === "people" && !viewRendered.people) {
    renderPeople();
    renderLocations();
    viewRendered.people = true;
  } else if (hash === "timeline" && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === "workspace") {
    renderWorkspace();
  }
}
