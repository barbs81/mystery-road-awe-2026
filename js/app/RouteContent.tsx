import { state } from "../state.js";
import { DashboardContainer } from "../features/dashboard/DashboardContainer.js";
import { EvidenceCatalogueView } from "../features/evidence/EvidenceCatalogueView.js";
import { LocationsView } from "../features/people-locations/LocationsView.js";
import { PersonDetailView } from "../features/people-locations/PersonDetailView.js";
import { PeopleView } from "../features/people-locations/PeopleView.js";
import { TimelineView } from "../features/timeline/TimelineView.js";
import { WorkspaceView } from "../features/workspace/WorkspaceView.js";
import { Navigate, Route, Routes } from "react-router-dom";

export type RouteContentProps = {
  bookmarks: string[];
  notes: Record<string, string>;
  onToggleBookmark: (evidenceId: string) => void;
  onSaveNote: (evidenceId: string, text: string) => void;
};

export function RouteContent({
  bookmarks,
  notes,
  onToggleBookmark,
  onSaveNote,
}: RouteContentProps) {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<DashboardContainer bookmarks={bookmarks} />}
      />
      <Route
        path="/team/people"
        element={<PeopleView people={state.allPeople} />}
      />
      <Route
        path="/team/people/:personId"
        element={<PersonDetailView people={state.allPeople} />}
      />
      <Route
        path="/team/locations"
        element={<LocationsView locations={state.allLocations} />}
      />
      <Route path="/people" element={<Navigate to="/team/people" replace />} />
      <Route
        path="/timeline"
        element={
          <TimelineView events={state.allTimeline} people={state.allPeople} />
        }
      />
      <Route
        path="/evidence"
        element={
          <EvidenceCatalogueView
            evidence={state.allEvidence}
            people={state.allPeople}
            locations={state.allLocations}
            bookmarks={bookmarks}
            notes={notes}
            onToggleBookmark={onToggleBookmark}
            onSaveNote={onSaveNote}
          />
        }
      />
      <Route
        path="/workspace"
        element={
          <WorkspaceView
            evidence={state.allEvidence}
            people={state.allPeople}
            bookmarks={bookmarks}
            notes={notes}
          />
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
