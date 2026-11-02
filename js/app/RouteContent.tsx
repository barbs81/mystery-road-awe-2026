import { DashboardContainer } from "../features/dashboard/DashboardContainer.js";
import { EvidenceCatalogueView } from "../features/evidence/EvidenceCatalogueView.js";
import { LocationsView } from "../features/people-locations/LocationsView.js";
import { PersonDetailView } from "../features/people-locations/PersonDetailView.js";
import { PeopleView } from "../features/people-locations/PeopleView.js";
import { TimelineView } from "../features/timeline/TimelineView.js";
import { WorkspaceView } from "../features/workspace/WorkspaceView.js";
import { Navigate, Route, Routes } from "react-router-dom";
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../types.js";

export type RouteContentProps = {
  data: {
    caseData: CaseData;
    evidence: Evidence[];
    people: Person[];
    locations: Location[];
    timeline: TimelineEvent[];
  };
  notes: Record<string, string>;
  onSaveNote: (evidenceId: string, text: string) => void;
};

export function RouteContent({ data, notes, onSaveNote }: RouteContentProps) {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <DashboardContainer
            caseData={data.caseData}
            evidence={data.evidence}
            people={data.people}
            locations={data.locations}
            timeline={data.timeline}
          />
        }
      />
      <Route
        path="/team/people"
        element={<PeopleView people={data.people} />}
      />
      <Route
        path="/team/people/:personId"
        element={<PersonDetailView people={data.people} />}
      />
      <Route
        path="/team/locations"
        element={<LocationsView locations={data.locations} />}
      />
      <Route path="/people" element={<Navigate to="/team/people" replace />} />
      <Route
        path="/timeline"
        element={<TimelineView events={data.timeline} people={data.people} />}
      />
      <Route
        path="/evidence"
        element={
          <EvidenceCatalogueView
            evidence={data.evidence}
            people={data.people}
            locations={data.locations}
            notes={notes}
            onSaveNote={onSaveNote}
          />
        }
      />
      <Route
        path="/workspace"
        element={
          <WorkspaceView
            evidence={data.evidence}
            people={data.people}
            notes={notes}
          />
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
