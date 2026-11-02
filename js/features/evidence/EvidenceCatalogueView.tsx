import { useReducer, useState } from "react";
import type { FormEvent } from "react";
import { Panel } from "../../components/Panel.js";
import { useBookmarks } from "../../contexts/BookmarkContext.js";
import {
  evidenceMentionsPerson,
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
} from "../../utils.js";
import type { Evidence, Location, Person } from "../../types.js";

type EvidenceSort = "date-desc" | "date-asc" | "title-asc" | "title-desc";

type EvidenceFilters = {
  search: string;
  typeFilter: string;
  personFilter: string;
  locationFilter: string;
  statusFilter: string;
  relevanceFilter: string;
  sort: EvidenceSort;
};

type EvidenceFiltersAction =
  | {
      type: "set-filter";
      field: Exclude<keyof EvidenceFilters, "sort">;
      value: string;
    }
  | { type: "set-sort"; value: EvidenceSort }
  | { type: "clear-filters" };

const initialEvidenceFilters: EvidenceFilters = {
  search: "",
  typeFilter: "",
  personFilter: "",
  locationFilter: "",
  statusFilter: "",
  relevanceFilter: "",
  sort: "date-desc",
};

function evidenceFiltersReducer(
  filters: EvidenceFilters,
  action: EvidenceFiltersAction,
): EvidenceFilters {
  switch (action.type) {
    case "set-filter":
      return { ...filters, [action.field]: action.value };
    case "set-sort":
      return { ...filters, sort: action.value };
    case "clear-filters":
      return initialEvidenceFilters;
  }
}

export type EvidenceCatalogueViewProps = {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  notes: Record<string, string>;
  onSaveNote: (evidenceId: string, text: string) => void;
};

export function EvidenceCatalogueView({
  evidence,
  people,
  locations,
  notes,
  onSaveNote,
}: EvidenceCatalogueViewProps) {
  const { bookmarks, onToggleBookmark } = useBookmarks();
  const [filters, dispatchFilters] = useReducer(
    evidenceFiltersReducer,
    initialEvidenceFilters,
  );
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    null,
  );

  const types = [...new Set(evidence.map((item) => item.type.toLowerCase()))];
  const selectedPerson = people.find(
    (person) => person.id === filters.personFilter,
  );
  const filteredEvidence = evidence
    .filter((item) => {
      const searchTerm = filters.search.trim().toLowerCase();
      const haystack =
        `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return (
        (!searchTerm || haystack.includes(searchTerm)) &&
        (!filters.typeFilter ||
          item.type.toLowerCase() === filters.typeFilter) &&
        (!filters.personFilter ||
          (selectedPerson
            ? evidenceMentionsPerson(item, selectedPerson)
            : false)) &&
        (!filters.locationFilter ||
          item.locationIds.includes(filters.locationFilter)) &&
        (!filters.statusFilter ||
          item.status.toLowerCase() === filters.statusFilter) &&
        (!filters.relevanceFilter ||
          item.relevance.toLowerCase() === filters.relevanceFilter)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "title-asc") return a.title.localeCompare(b.title);
      if (filters.sort === "title-desc") return b.title.localeCompare(a.title);
      const dateDifference =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return filters.sort === "date-asc" ? dateDifference : -dateDifference;
    });

  const selectedEvidence = evidence.find(
    (item) => item.id === selectedEvidenceId,
  );

  function toggleBookmark(item: Evidence) {
    onToggleBookmark(item.id);
  }

  function stateBookmarksContain(id: string) {
    return bookmarks.includes(id);
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedEvidence) return;
    const formData = new FormData(event.currentTarget);
    const note = String(formData.get("note") ?? "");
    onSaveNote(selectedEvidence.id, note);
  }

  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="evidence-title">
        <h2 id="evidence-title">Evidence Catalogue</h2>

        <div className="toolbar" aria-label="Evidence filters">
          <div className="toolbar-row">
            <label htmlFor="react-evidence-search" className="visually-hidden">
              Search evidence
            </label>
            <input
              id="react-evidence-search"
              type="search"
              placeholder="Search evidence by title, summary, or tag..."
              value={filters.search}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-filter",
                  field: "search",
                  value: event.target.value,
                })
              }
            />
            <select
              aria-label="Filter by type"
              value={filters.typeFilter}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-filter",
                  field: "typeFilter",
                  value: event.target.value,
                })
              }
            >
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by person"
              value={filters.personFilter}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-filter",
                  field: "personFilter",
                  value: event.target.value,
                })
              }
            >
              <option value="">All people</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by location"
              value={filters.locationFilter}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-filter",
                  field: "locationFilter",
                  value: event.target.value,
                })
              }
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.id} - {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="toolbar-row">
            <select
              aria-label="Filter by status"
              value={filters.statusFilter}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-filter",
                  field: "statusFilter",
                  value: event.target.value,
                })
              }
            >
              <option value="">All statuses</option>
              <option value="unreviewed">Unreviewed</option>
              <option value="reviewed">Reviewed</option>
              <option value="flagged">Flagged</option>
            </select>
            <select
              aria-label="Filter by relevance"
              value={filters.relevanceFilter}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-filter",
                  field: "relevanceFilter",
                  value: event.target.value,
                })
              }
            >
              <option value="">All relevance</option>
              <option value="unknown">Unknown</option>
              <option value="relevant">Relevant</option>
              <option value="irrelevant">Irrelevant</option>
            </select>
            <select
              aria-label="Sort evidence"
              value={filters.sort}
              onChange={(event) =>
                dispatchFilters({
                  type: "set-sort",
                  value: event.target.value as EvidenceSort,
                })
              }
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => dispatchFilters({ type: "clear-filters" })}
            >
              Clear filters
            </button>
          </div>
        </div>

        <Panel title="Evidence items">
          {filteredEvidence.length === 0 ? (
            <p>No evidence matches the current filters.</p>
          ) : (
            <div className="evidence-grid">
              {filteredEvidence.map((item) => (
                <article className="evidence-card" key={item.id}>
                  <button
                    type="button"
                    className={`bookmark-btn${
                      stateBookmarksContain(item.id) ? " active" : ""
                    }`}
                    aria-label={`Toggle bookmark for ${item.title}`}
                    onClick={() => toggleBookmark(item)}
                  >
                    <span className="bookmark-icon">
                      {stateBookmarksContain(item.id) ? "★" : "☆"}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="evidence-card-button"
                    onClick={() => setSelectedEvidenceId(item.id)}
                  >
                    <h3>{item.title}</h3>
                    <div className="evidence-meta">
                      {item.id} &middot; {item.type} &middot;{" "}
                      {formatDate(item.timestamp)}
                    </div>
                    <div className="evidence-summary">{item.summary}</div>
                  </button>
                  {item.tags.includes("critical") && (
                    <span className="badge badge-critical">Critical</span>
                  )}
                  <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                  <span
                    className={`badge ${getRelevanceBadgeClass(item.relevance)}`}
                  >
                    {item.relevance}
                  </span>
                  <div>
                    {item.tags.map((tag) => (
                      <span className="tag-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>

        {selectedEvidence && (
          <Panel title={selectedEvidence.title}>
            <p>{selectedEvidence.content}</p>
            <form key={selectedEvidence.id} onSubmit={saveNote}>
              <label htmlFor="react-evidence-note">Investigator note</label>
              <textarea
                id="react-evidence-note"
                name="note"
                className="note-textarea"
                rows={3}
                defaultValue={notes[selectedEvidence.id] ?? ""}
                placeholder="Add a private note about this evidence..."
              />
              <button type="submit" className="btn btn-primary btn-small">
                Save note
              </button>
            </form>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => setSelectedEvidenceId(null)}
            >
              Close
            </button>
          </Panel>
        )}
      </section>
    </main>
  );
}
