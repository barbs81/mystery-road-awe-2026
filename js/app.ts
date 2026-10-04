declare global {
  interface Window {
    navigateTo: (viewName: string) => void;
    handleSortChange: () => void;
  }
}

import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
  loadNoteAsync,
} from "./storage.js";
import { navigateTo, handleHashChange } from "./navigation.js";
import {
  renderEvidenceList,
  clearFilters,
  handleSearchInput,
} from "./views/evidence.js";
import { renderTimeline } from "./views/timeline.js";
import { loadAllData } from "./dataLoader.js";

window.navigateTo = navigateTo;
window.handleSortChange = () => {
  const sortSelect = document.getElementById(
    "sortEvidence",
  ) as HTMLSelectElement | null;
  if (sortSelect) {
    sortSelect.dispatchEvent(new Event("change"));
  }
};

function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  const navButtons = document.querySelectorAll<HTMLButtonElement>(".nav-btn");
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  });

  const evidenceSearch = document.getElementById(
    "evidenceSearch",
  ) as HTMLInputElement | null;
  evidenceSearch?.addEventListener("input", handleSearchInput);

  const filterType = document.getElementById(
    "filterType",
  ) as HTMLSelectElement | null;
  const filterPerson = document.getElementById(
    "filterPerson",
  ) as HTMLSelectElement | null;
  const filterLocation = document.getElementById(
    "filterLocation",
  ) as HTMLSelectElement | null;
  const filterStatus = document.getElementById(
    "filterStatus",
  ) as HTMLSelectElement | null;
  const filterRelevance = document.getElementById(
    "filterRelevance",
  ) as HTMLSelectElement | null;
  const clearFiltersBtn = document.getElementById(
    "clearFiltersBtn",
  ) as HTMLButtonElement | null;
  const timelineOrder = document.getElementById(
    "timelineOrder",
  ) as HTMLSelectElement | null;
  const timelinePersonFilter = document.getElementById(
    "timelinePersonFilter",
  ) as HTMLSelectElement | null;
  const timelineLocationFilter = document.getElementById(
    "timelineLocationFilter",
  ) as HTMLSelectElement | null;
  const timelineTypeFilter = document.getElementById(
    "timelineTypeFilter",
  ) as HTMLSelectElement | null;

  filterType?.addEventListener("change", renderEvidenceList);
  filterPerson?.addEventListener("change", renderEvidenceList);
  filterLocation?.addEventListener("change", renderEvidenceList);
  filterStatus?.addEventListener("change", renderEvidenceList);
  filterRelevance?.addEventListener("change", renderEvidenceList);
  clearFiltersBtn?.addEventListener("click", clearFilters);
  timelineOrder?.addEventListener("change", renderTimeline);
  timelinePersonFilter?.addEventListener("change", renderTimeline);
  timelineLocationFilter?.addEventListener("change", renderTimeline);
  timelineTypeFilter?.addEventListener("change", renderTimeline);

  const confidenceSlider = document.getElementById(
    "hypConfidence",
  ) as HTMLInputElement | null;
  const confidenceValue = document.getElementById(
    "hypConfidenceValue",
  ) as HTMLElement | null;
  confidenceSlider?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement | null;
    if (confidenceValue && target) {
      confidenceValue.textContent = target.value;
    }
  });
}

async function initApp(): Promise<void> {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  await loadAllData();
  console.log("loadAllData finished");

  handleHashChange();
  const firstNote = await loadNoteAsync("E01");
  console.log("First note preview:", firstNote);
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);

export {};
