import { state } from "../state.js";
import { navigateTo } from "../navigation.js";
import { openEvidenceDetail } from "./evidence.js";

const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function renderWorkspace(): void {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList(): void {
  const container = document.getElementById(
    "bookmarksList",
  ) as HTMLElement | null;
  if (!container) return;

  const bookmarkedItems = state.allEvidence.filter((ev) => ev.bookmarked);

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < bookmarkedItems.length; i++) {
    const ev = bookmarkedItems[i];
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll<HTMLButtonElement>(
    "[data-open-evidence]",
  );
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      navigateTo("evidence");
      const id = target.getAttribute("data-open-evidence") ?? "";
      setTimeout(() => {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList(): void {
  const container = document.getElementById("notesList") as HTMLElement | null;
  if (!container) return;

  const noteEntries: Array<{
    index: number;
    evidenceId: string;
    title: string;
    text: string;
  }> = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const note = state.notesStore[state.allEvidence[i].id];
    if (note) {
      noteEntries.push({
        index: i,
        evidenceId: state.allEvidence[i].id,
        title: state.allEvidence[i].title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (let n = 0; n < noteEntries.length; n++) {
    const entry = noteEntries[n];
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html +=
      '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>";
  }
  container.innerHTML = html;
}

export function populateHypothesisDropdowns(): void {
  const suspectSelect = document.getElementById(
    "hypSuspect",
  ) as HTMLSelectElement | null;
  const evidenceSelect = document.getElementById(
    "hypEvidence",
  ) as HTMLSelectElement | null;
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    suspectSelect.innerHTML +=
      '<option value="' +
      state.allPeople[p].id +
      '">' +
      state.allPeople[p].name +
      "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (let i = 0; i < state.allEvidence.length; i++) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      state.allEvidence[i].id +
      '">' +
      state.allEvidence[i].id +
      " - " +
      state.allEvidence[i].title +
      "</option>";
  }
}

export function saveHypothesis(): void {
  const suspectSelect = document.getElementById(
    "hypSuspect",
  ) as HTMLSelectElement | null;
  const natureInput = document.getElementById(
    "hypNature",
  ) as HTMLInputElement | null;
  const evidenceSelect = document.getElementById(
    "hypEvidence",
  ) as HTMLSelectElement | null;
  const confidenceInput = document.getElementById(
    "hypConfidence",
  ) as HTMLInputElement | null;
  const explanationInput = document.getElementById(
    "hypExplanation",
  ) as HTMLTextAreaElement | null;
  const alternativeInput = document.getElementById(
    "hypAlternative",
  ) as HTMLTextAreaElement | null;

  if (
    !suspectSelect ||
    !natureInput ||
    !evidenceSelect ||
    !confidenceInput ||
    !explanationInput ||
    !alternativeInput
  )
    return;

  const draft = {
    suspectId: suspectSelect.value,
    nature: natureInput.value,
    evidenceIds: getSelectedOptions(evidenceSelect),
    confidence: confidenceInput.value,
    explanation: explanationInput.value,
    alternative: alternativeInput.value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById(
    "hypothesisSavedMsg",
  ) as HTMLElement | null;
  msg?.classList.remove("hidden");
  setTimeout(() => {
    msg?.classList.add("hidden");
  }, 2000);
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
  }
  return result;
}

function loadHypothesisFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  const draft = JSON.parse(raw) as {
    suspectId?: string;
    nature?: string;
    confidence?: string | number;
    explanation?: string;
    alternative?: string;
    evidenceIds?: string[];
  };

  const suspectSelect = document.getElementById(
    "hypSuspect",
  ) as HTMLSelectElement | null;
  const natureInput = document.getElementById(
    "hypNature",
  ) as HTMLInputElement | null;
  const confidenceInput = document.getElementById(
    "hypConfidence",
  ) as HTMLInputElement | null;
  const confidenceValue = document.getElementById(
    "hypConfidenceValue",
  ) as HTMLElement | null;
  const explanationInput = document.getElementById(
    "hypExplanation",
  ) as HTMLTextAreaElement | null;
  const alternativeInput = document.getElementById(
    "hypAlternative",
  ) as HTMLTextAreaElement | null;
  const evidenceSelect = document.getElementById(
    "hypEvidence",
  ) as HTMLSelectElement | null;

  if (suspectSelect) suspectSelect.value = draft.suspectId || "";
  if (natureInput) natureInput.value = draft.nature || "";
  if (confidenceInput) confidenceInput.value = String(draft.confidence ?? 50);
  if (confidenceValue)
    confidenceValue.textContent = String(draft.confidence ?? 50);
  if (explanationInput) explanationInput.value = draft.explanation || "";
  if (alternativeInput) alternativeInput.value = draft.alternative || "";

  if (!evidenceSelect) return;
  const savedIds = draft.evidenceIds || [];
  for (let i = 0; i < evidenceSelect.options.length; i++) {
    evidenceSelect.options[i].selected =
      savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
  }
}
