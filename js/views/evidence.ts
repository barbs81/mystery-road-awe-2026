import { state } from "../state.js";
import {
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
  evidenceMentionsPerson,
  findPersonById,
  findEvidenceById,
  findLocationById,
} from "../utils.js";
import {
  saveBookmarksToStorage,
  loadNoteForEvidence,
  saveNoteForEvidence,
} from "../storage.js";
import type { Evidence } from "../types.js";

let latestSearchRequestId = 0;
let filteredEvidence: Evidence[] = [];
let selectedEvidence: Evidence | null = null;
let evidenceViewLoading = false;
let evidenceListHandlerAttached = false;

export function renderEvidenceList(): void {
  const container = document.getElementById(
    "evidenceList",
  ) as HTMLElement | null;
  if (!container) return;

  if (!evidenceListHandlerAttached) {
    container.addEventListener("click", handleEvidenceListClick);
    evidenceListHandlerAttached = true;
  }

  const loadingIndicator = document.getElementById(
    "evidenceLoadingIndicator",
  ) as HTMLElement | null;
  if (evidenceViewLoading) {
    loadingIndicator?.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  loadingIndicator?.classList.add("hidden");

  const results = getFilteredEvidence();
  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (let i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = state.bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    "</span>";
  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    "</span>";
  html += "<div>";
  for (let t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }
  html += "</div>";
  html += "</div>";
  return html;
}

function getFilteredEvidence(): Evidence[] {
  const searchBox = document.getElementById(
    "evidenceSearch",
  ) as HTMLInputElement | null;
  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const typeSelect = document.getElementById(
    "filterType",
  ) as HTMLSelectElement | null;
  const personSelect = document.getElementById(
    "filterPerson",
  ) as HTMLSelectElement | null;
  const locationSelect = document.getElementById(
    "filterLocation",
  ) as HTMLSelectElement | null;
  const statusSelect = document.getElementById(
    "filterStatus",
  ) as HTMLSelectElement | null;
  const relevanceSelect = document.getElementById(
    "filterRelevance",
  ) as HTMLSelectElement | null;
  const sortSelect = document.getElementById(
    "sortEvidence",
  ) as HTMLSelectElement | null;

  const typeVal = typeSelect?.value ?? "";
  const personVal = personSelect?.value ?? "";
  const locationVal = locationSelect?.value ?? "";
  const statusVal = statusSelect?.value ?? "";
  const relevanceVal = relevanceSelect?.value ?? "";
  const sortValue = sortSelect?.value ?? "date-desc";

  const results: Evidence[] = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const item = state.allEvidence[i];
    let matches = true;

    if (searchTerm) {
      const haystack = (
        item.title +
        " " +
        item.summary +
        " " +
        item.tags.join(" ")
      ).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal)
      matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1)
      matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal)
      matches = false;
    if (
      matches &&
      relevanceVal &&
      (item.relevance || "").toLowerCase() !== relevanceVal
    )
      matches = false;

    if (matches) results.push(item);
  }

  if (sortValue === "title-asc") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "title-desc") {
    results.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === "date-asc") {
    results.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  } else {
    results.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  filteredEvidence = results;
  return results;
}

function handleEvidenceListClick(event: MouseEvent): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;

  if (target.dataset.action === "bookmark") {
    event.stopPropagation();
    handleBookmarkClick(target.dataset.id ?? "");
    return;
  }

  const card = target.closest(".evidence-card") as HTMLElement | null;
  if (card) {
    openEvidenceDetail(card.getAttribute("data-id") ?? "");
  }
}

function handleBookmarkClick(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (state.bookmarks.indexOf(evidenceId) === -1) {
    state.bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    state.bookmarks = state.bookmarks.filter((id) => id !== evidenceId);
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (state.currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags(): void {
  for (let i = 0; i < state.allEvidence.length; i++) {
    state.allEvidence[i].bookmarked =
      state.bookmarks.indexOf(state.allEvidence[i].id) !== -1;
  }
}

export function openEvidenceDetail(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;
  selectedEvidence = ev;

  const section = document.getElementById(
    "evidenceDetailSection",
  ) as HTMLElement | null;
  if (!section) return;
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeEvidenceDetail(): void {
  const section = document.getElementById(
    "evidenceDetailSection",
  ) as HTMLElement | null;
  if (!section) return;
  section.classList.add("hidden");
  section.innerHTML = "";
  selectedEvidence = null;
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = document.getElementById(
    "evidenceDetailSection",
  ) as HTMLElement | null;
  if (!section) return;

  const personNames: string[] = [];
  for (let p = 0; p < ev.personIds.length; p++) {
    const person = findPersonById(ev.personIds[p]);
    personNames.push(person ? person.name : ev.personIds[p]);
  }

  const locationNames: string[] = [];
  for (let l = 0; l < ev.locationIds.length; l++) {
    const loc = findLocationById(ev.locationIds[l]);
    locationNames.push(loc ? loc.id + " - " + loc.name : ev.locationIds[l]);
  }

  let tagsHtml = "";
  for (let t = 0; t < ev.tags.length; t++) {
    tagsHtml += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";
  html +=
    '<button type="button" id="closeEvidenceDetailBtn" class="btn btn-secondary btn-small">Close</button>';
  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    ev.summary +
    "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";
  html +=
    '<button type="button" id="saveCurrentNoteBtn" class="btn btn-primary btn-small" style="margin-top:6px;">Save note</button>';
  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";
  section.innerHTML = html;

  const closeButton = document.getElementById(
    "closeEvidenceDetailBtn",
  ) as HTMLButtonElement | null;
  const saveButton = document.getElementById(
    "saveCurrentNoteBtn",
  ) as HTMLButtonElement | null;
  const detailStatusSelect = document.getElementById(
    "detailStatusSelect",
  ) as HTMLSelectElement | null;
  const detailRelevanceSelect = document.getElementById(
    "detailRelevanceSelect",
  ) as HTMLSelectElement | null;

  closeButton?.addEventListener("click", closeEvidenceDetail);
  saveButton?.addEventListener("click", saveCurrentNote);

  detailStatusSelect?.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;
    ev.status = target.value as Evidence["status"];
    renderEvidenceDetail(ev);
    renderEvidenceList();
  });

  detailRelevanceSelect?.addEventListener("change", (event) => {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;
    ev.relevance = target.value as Evidence["relevance"];
    renderEvidenceDetail(ev);
    renderEvidenceList();
  });
}

function statusOptionHTML(
  current: string | undefined,
  value: string,
  label: string,
): string {
  const currentLower = (current || "").toLowerCase();
  const selected = currentLower === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

function saveCurrentNote(): void {
  const textarea = document.getElementById(
    "evidenceNoteInput",
  ) as HTMLTextAreaElement | null;
  if (!textarea) return;
  const evidenceId = textarea.getAttribute("data-evidence-id");
  const text = textarea.value;
  if (!evidenceId) return;
  saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById("notePreview") as HTMLElement | null;
  if (preview) preview.innerHTML = text;
}

export function populateEvidenceDropdowns(): void {
  const typeSelect = document.getElementById(
    "filterType",
  ) as HTMLSelectElement | null;
  const personSelect = document.getElementById(
    "filterPerson",
  ) as HTMLSelectElement | null;
  const locationSelect = document.getElementById(
    "filterLocation",
  ) as HTMLSelectElement | null;
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];
  for (let i = 0; i < state.allEvidence.length; i++) {
    const t = state.allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (let ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML +=
      '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < state.allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' +
      state.allPeople[p].id +
      '">' +
      state.allPeople[p].name +
      "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < state.allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' +
      state.allLocations[l].id +
      '">' +
      state.allLocations[l].id +
      " - " +
      state.allLocations[l].name +
      "</option>";
  }
}

export function handleSortChange(): void {
  renderEvidenceList();
}

export function clearFilters(): void {
  const evidenceSearch = document.getElementById(
    "evidenceSearch",
  ) as HTMLInputElement | null;
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

  if (evidenceSearch) evidenceSearch.value = "";
  if (filterType) filterType.value = "";
  if (filterPerson) filterPerson.value = "";
  if (filterLocation) filterLocation.value = "";
  if (filterStatus) filterStatus.value = "";
  if (filterRelevance) filterRelevance.value = "";
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(term);
    }, 300);
  });
}

export async function handleSearchInput(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement | null;
  if (!target) return;
  const term = target.value;
  const requestId = ++latestSearchRequestId;

  await simulateAsyncSearch(term);
  if (requestId !== latestSearchRequestId) return;
  renderEvidenceList();
}
