import { state } from "../state.js";
import { DashboardContainer } from "../features/dashboard/DashboardContainer.js";
import { PeopleLocationsView } from "../features/people-locations/PeopleLocationsView.js";
import { TimelineView } from "../features/timeline/TimelineView.js";
import { routes } from "./routes.js";

type RouteContentProps = {
  currentRoute: string;
};

export function RouteContent({ currentRoute }: RouteContentProps) {
  if (currentRoute === "dashboard") {
    return <DashboardContainer />;
  }

  if (currentRoute === "people") {
    return (
      <PeopleLocationsView
        people={state.allPeople}
        locations={state.allLocations}
      />
    );
  }

  if (currentRoute === "timeline") {
    return <TimelineView events={state.allTimeline} />;
  }

  const route = routes.find(({ id }) => id === currentRoute);

  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="stub-page-title">
        <h2 id="stub-page-title">{route?.label}</h2>
        <div className="intro-card">
          <h3>{route?.label} view</h3>
          <p>
            This page is ready for the {route?.label.toLowerCase()} features
            planned for the next exercise.
          </p>
        </div>
      </section>
    </main>
  );
}
