import { state } from "../state.js";
import { DashboardContainer } from "../features/dashboard/DashboardContainer.js";
import { LocationsView } from "../features/people-locations/LocationsView.js";
import { PersonDetailView } from "../features/people-locations/PersonDetailView.js";
import { PeopleView } from "../features/people-locations/PeopleView.js";
import { TimelineView } from "../features/timeline/TimelineView.js";
import { Navigate, Route, Routes } from "react-router-dom";

function StubView({ title }: { title: string }) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="stub-page-title">
        <h2 id="stub-page-title">{title}</h2>
        <div className="intro-card">
          <h3>{title} view</h3>
          <p>
            This page is ready for the {title.toLowerCase()} features planned
            for the next exercise.
          </p>
        </div>
      </section>
    </main>
  );
}

export function RouteContent() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardContainer />} />
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
      <Route path="/evidence" element={<StubView title="Evidence" />} />
      <Route path="/workspace" element={<StubView title="Workspace" />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
