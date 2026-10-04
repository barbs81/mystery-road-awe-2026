import { state } from "../state.js";
import { formatDate, findLocationById, findEvidenceById } from "../utils.js";
import { navigateTo } from "../navigation.js";
import { openEvidenceDetail } from "./evidence.js";
import type { TimelineEvent } from "../types.js";

let quickViewModalClickHandlerAttached = false;

export function populateTimelineDropdowns(): void {
  const personSelect = document.getElementById(
    "timelinePersonFilter",
  ) as HTMLSelectElement | null;
  const locationSelect = document.getElementById(
    "timelineLocationFilter",
  ) as HTMLSelectElement | null;
  const typeSelect = document.getElementById(
    "timelineTypeFilter",
  ) as HTMLSelectElement | null;
  if (!personSelect || !locationSelect || !typeSelect) return;

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
      "</option>";
  }

  const types: string[] = [];
  for (let i = 0; i < state.allTimeline.length; i++) {
    if (types.indexOf(state.allTimeline[i].type) === -1)
      types.push(state.allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (let t = 0; t < types.length; t++) {
    typeSelect.innerHTML +=
      '<option value="' + types[t] + '">' + types[t] + "</option>";
  }
}

export function renderTimeline(): void {
  const container = document.getElementById(
    "timelineContainer",
  ) as HTMLElement | null;
  if (!container) return;

  const orderSelect = document.getElementById(
    "timelineOrder",
  ) as HTMLSelectElement | null;
  const personFilterSelect = document.getElementById(
    "timelinePersonFilter",
  ) as HTMLSelectElement | null;
  const locationFilterSelect = document.getElementById(
    "timelineLocationFilter",
  ) as HTMLSelectElement | null;
  const typeFilterSelect = document.getElementById(
    "timelineTypeFilter",
  ) as HTMLSelectElement | null;
  if (
    !orderSelect ||
    !personFilterSelect ||
    !locationFilterSelect ||
    !typeFilterSelect
  )
    return;

  const order = orderSelect.value;
  const personFilter = personFilterSelect.value;
  const locationFilter = locationFilterSelect.value;
  const typeFilter = typeFilterSelect.value;

  const events: TimelineEvent[] = [];
  for (let i = 0; i < state.allTimeline.length; i++) {
    const evt = state.allTimeline[i];
    if (personFilter && evt.personIds.indexOf(personFilter) === -1) continue;
    if (locationFilter && evt.locationIds.indexOf(locationFilter) === -1)
      continue;
    if (typeFilter && evt.type !== typeFilter) continue;
    events.push(evt);
  }

  events.sort((a, b) => {
    const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
    return order === "desc" ? -diff : diff;
  });

  let html = "";
  for (let e = 0; e < events.length; e++) {
    const item = events[e];
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames: string[] = [];
    for (let el = 0; el < item.locationIds.length; el++) {
      const evtLoc = findLocationById(item.locationIds[el]);
      eventLocationNames.push(
        evtLoc ? `${evtLoc.id} - ${evtLoc.name}` : item.locationIds[el],
      );
    }
    if (eventLocationNames.length > 0) {
      html +=
        '<p class="evidence-meta">Location: ' +
        eventLocationNames.join(", ") +
        "</p>";
    }

    for (let ev2 = 0; ev2 < item.evidenceIds.length; ev2++) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        item.evidenceIds[ev2] +
        '">View ' +
        item.evidenceIds[ev2] +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  const linkButtons =
    container.querySelectorAll<HTMLButtonElement>(".evidence-link-btn");
  for (let b = 0; b < linkButtons.length; b++) {
    linkButtons[b].addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const evidenceId = target?.getAttribute("data-evidence-id") ?? "";
      openEvidenceModal(evidenceId);
    });
  }
}

function certaintyBadgeClass(certainty: string): string {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}

function openEvidenceModal(evidenceId: string): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal") as HTMLElement | null;
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";

  if (!quickViewModalClickHandlerAttached) {
    modal.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.classList.contains("modal-close-btn") ||
        target.classList.contains("modal-backdrop")
      ) {
        modal.innerHTML = "";
      }
      const openFullId = target.getAttribute("data-open-full");
      if (openFullId) {
        modal.innerHTML = "";
        navigateTo("evidence");
        setTimeout(() => {
          openEvidenceDetail(openFullId);
        }, 0);
      }
    });
    quickViewModalClickHandlerAttached = true;
  }
}
