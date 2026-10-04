import { state } from "./state.js";

import { renderDashboard } from "./views/dashboard.js";

import {
  renderEvidenceList,
  applyStoredBookmarkFlags,
  populateEvidenceDropdowns,
} from "./views/evidence.js";

import { renderTimeline, populateTimelineDropdowns } from "./views/timeline.js";

import { populateHypothesisDropdowns } from "./views/workspace.js";

import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.js";

function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep(): void {
  state.loadingStepsRemaining--;
  if (state.loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

async function loadCorePeopleAndLocations(): Promise<void> {
  const caseRes = await fetch("data/case.json");
  const caseJson = (await caseRes.json()) as CaseData;
  state.caseData = caseJson;

  const peopleRes = await fetch("data/people.json");
  const peopleJson = (await peopleRes.json()) as Person[];
  state.allPeople = peopleJson;

  const locationsRes = await fetch("data/locations.json");
  const locationsJson = (await locationsRes.json()) as Location[];
  state.allLocations = locationsJson;

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData(): Promise<void> {
  try {
    const res = await fetch("data/evidence.json");
    const data = (await res.json()) as Evidence[];
    state.allEvidence = data;

    console.log("EVIDENCE FINISHED");

    applyStoredBookmarkFlags();
    renderDashboard();
    populateAllDropdowns();
    if (state.currentPage === "evidence") renderEvidenceList();
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

async function loadTimelineData(): Promise<void> {
  try {
    const res = await fetch("data/timeline.json");
    const data = (await res.json()) as TimelineEvent[];
    state.allTimeline = data;

    console.log("TIMELINE FINISHED");

    renderDashboard();
    if (state.currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    console.log("timeline load error", err);
  } finally {
    hideLoadingStep();
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  state.loadingStepsRemaining = 2;
  await loadCorePeopleAndLocations();
  await Promise.all([loadEvidenceData(), loadTimelineData()]);
}

function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}
