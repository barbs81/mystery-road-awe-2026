import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { state } from "./state.js";
import { formatDate, getStatusBadgeClass } from "./utils.js";
import type { Location, Person, TimelineEvent } from "./types.js";

type Route = {
  id: string;
  label: string;
};

const routes: Route[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
];

function getCurrentRoute(): string {
  const route = window.location.hash.slice(1);
  return routes.some(({ id }) => id === route) ? route : "dashboard";
}

function navigateTo(route: string): void {
  window.location.hash = route;
}

function Header({ currentRoute }: { currentRoute: string }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a
          className="brand"
          href="#dashboard"
          aria-label="Project ReMotion dashboard"
        >
          <img
            src="assets/logo/logo.svg"
            alt="Project ReMotion logo"
            className="brand-logo"
          />
          <div>
            <h1>Project ReMotion</h1>
            <span className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </span>
          </div>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              className={`nav-btn${currentRoute === route.id ? " active" : ""}`}
              data-view={route.id}
              aria-current={currentRoute === route.id ? "page" : undefined}
              onClick={() => navigateTo(route.id)}
            >
              {route.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/*function RouteContent({ currentRoute }: { currentRoute: string }) {
  if (currentRoute === "dashboard") {
    return <Dashboard />;
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
}*/

//Assignment 4 Task 1
//#people now renders PeopleLocationsView.
//#timeline now renders TimelineView.
//The views receive data through typed props:
//people={state.allPeople}
//locations={state.allLocations}
//events={state.allTimeline}
//Evidence and Workspace remain stub pages, as required by the Assignment 4 scope.
//Dashboard behavior remains unchanged.

function RouteContent({ currentRoute }: { currentRoute: string }) {
  if (currentRoute === "dashboard") {
    return <Dashboard />;
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

//Assignment 4 Task 1
//PersonCardProps explicitly types the component’s props.
//person must have the complete Person shape from types.ts.
//JSX embeds values such as {person.name} and {person.role}.
//The responsibilities are rendered as a collection with .map().
//Each responsibility has a key.
//No innerHTML or manual DOM manipulation is used.

type PersonCardProps = {
  person: Person;
};

function PersonCard({ person }: PersonCardProps) {
  return (
    <article className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={person.avatar}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>

      <ul>
        {person.responsibilities.map((responsibility) => (
          <li key={responsibility}>{responsibility}</li>
        ))}
      </ul>

      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
    </article>
  );
}

//Assignment 4 Task 1
//LocationCardProps explicitly types the component props.
//The location prop must match the existing Location interface.
//JSX displays values from the object.
//The contains array is rendered with .map().
//Each list item has a stable key.
//The component uses JSX only and does not manipulate the DOM.

type LocationCardProps = {
  location: Location;
};

function LocationCard({ location }: LocationCardProps) {
  return (
    <article className="location-card">
      <h3>
        {location.id} &mdash; {location.name}
      </h3>

      <p>{location.description}</p>

      <p>
        <strong>Contains:</strong>
      </p>

      <ul>
        {location.contains.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

//Assignment 4 Task 1
//Explicitly typed props through TimelineEventCardProps
//Reuse of the existing TimelineEvent type
//A computed CSS class using a template literal
//Rendering a formatted date with the existing formatDate() helper
//JSX expressions such as {event.title} and {event.description}

type TimelineEventCardProps = {
  event: TimelineEvent;
};

//Assignment 4 Task 2
//The rendered CSS class depends on the event’s certainty:
//confirmed → badge-reviewed
//reported → badge-flagged
//contradictory → badge-critical
//The mapping is also type-safe because Record<TimelineEvent["certainty"], string> requires a class for every allowed certainty value.
//This completes the second real conditional case for Task A and uses a lookup/mapping technique for Task B.

//Open the Timeline route.
//Confirm that timeline events appear.
//Inspect the badges:
//Confirmed events should use the reviewed style.
//Reported events should use the flagged style.
//Contradictory events should use the critical style.
//The empty state can be demonstrated by temporarily changing the TimelineView call in RouteContent to:
//return <TimelineView events={[]} />;
//Then the page should display:
//No timeline events loaded yet.

function TimelineEventCard({ event }: TimelineEventCardProps) {
  const certaintyBadgeClasses: Record<TimelineEvent["certainty"], string> = {
    confirmed: "badge-reviewed",
    reported: "badge-flagged",
    contradictory: "badge-critical",
  };

  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)} &middot;{" "}
        <span className={`badge ${certaintyBadgeClasses[event.certainty]}`}>
          {event.certainty}
        </span>
        {/*<span className={`badge badge-${event.certainty}`}>
        {event.certainty}
        </span>*/}
      </div>

      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </article>
  );
}

//Assignment 4 Task 1
//This component is a reusable panel with a title and children content.
//Panel owns the common panel structure
//The content inside the panel is supplied by the parent component.
//This makes Panel reusable for different content instead of requiring a specific data object.

type PanelProps = {
  title: string;
  children: ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <section className="dashboard-panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

//Assignment 4 Task 1
//PeopleLocationsViewProps explicitly types two arrays.
//TimelineViewProps explicitly types the timeline array.
//The three typed components are now used in real view components.
//.map() renders collections of cards.
//Each mapped component has a stable key.
//Panel receives its content through children.
//The empty timeline message uses a conditional expression.
//No innerHTML, createElement, appendChild, or new state is used.

type PeopleLocationsViewProps = {
  people: Person[];
  locations: Location[];
};

function PeopleLocationsView({ people, locations }: PeopleLocationsViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="people-locations-title">
        <h2 id="people-locations-title">People &amp; Locations</h2>

        <Panel title="People">
          <div className="people-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </Panel>

        <Panel title="Locations">
          <div className="locations-grid">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}

type TimelineViewProps = {
  events: TimelineEvent[];
};

//Assignment 4 Task 2
/*{events.length === 0 ? (
  <p>No timeline events loaded yet.</p>
) : (
  events.map((event) => (
    <TimelineEventCard key={event.id} event={event} />
  ))
)}*/
//This renders either the empty message or the timeline event list.

function TimelineView({ events }: TimelineViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Timeline</h2>

        <Panel title="Timeline events">
          {events.length === 0 ? (
            <p>No timeline events loaded yet.</p>
          ) : (
            events.map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))
          )}
        </Panel>
      </section>
    </main>
  );
}

function Dashboard() {
  const reviewedCount = state.allEvidence.filter(
    (evidence) => evidence.status.toLowerCase() === "reviewed",
  ).length;
  const progress = state.allEvidence.length
    ? Math.round((reviewedCount / state.allEvidence.length) * 100)
    : 0;

  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="dashboard-title">
        <h2 id="dashboard-title">Case Dashboard</h2>
        <CaseSummary />
        <div className="stat-grid">
          <StatCard value={state.allEvidence.length} label="Evidence items" />
          <StatCard value={state.allPeople.length} label="People" />
          <StatCard value={state.allLocations.length} label="Locations" />
          <StatCard value={state.bookmarks.length} label="Bookmarked" />
          <StatCard value={reviewedCount} label="Reviewed" />
        </div>
        <ReviewProgress progress={progress} />
        <div className="dashboard-columns">
          <RecentEvidence />
          <RecentTimeline />
        </div>
      </section>
    </main>
  );
}

function CaseSummary() {
  return (
    <div className="case-summary-card">
      <h3>{state.caseData.title || "Case"}</h3>
      <p>
        <span className="badge badge-flagged">
          {(state.caseData.status || "unknown").toUpperCase()}
        </span>
      </p>
      <p>{state.caseData.summary || "Loading case summary..."}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ReviewProgress({ progress }: { progress: number }) {
  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
      </div>
      <p>{progress}% of evidence reviewed</p>
    </div>
  );
}

function RecentEvidence() {
  const recentEvidence = state.allEvidence.slice(-5).reverse();

  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {recentEvidence.length === 0 ? (
        <p>No evidence loaded yet.</p>
      ) : (
        recentEvidence.map((evidence) => (
          <div className="mini-list-item" key={evidence.id}>
            <strong>{evidence.id}</strong> &mdash; {evidence.title}{" "}
            <span className={`badge ${getStatusBadgeClass(evidence.status)}`}>
              {evidence.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function RecentTimeline() {
  const recentTimeline = state.allTimeline.slice(-5).reverse();

  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {recentTimeline.length === 0 ? (
        <p>No timeline events loaded yet.</p>
      ) : (
        recentTimeline.map((event) => (
          <div className="mini-list-item" key={event.id}>
            <strong>{formatDate(event.time)}</strong>
            <br />
            {event.title}
          </div>
        ))
      )}
    </div>
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => setCurrentRoute(getCurrentRoute());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  useEffect(() => {
    const handleDataChange = () => setDataVersion((version) => version + 1);
    window.addEventListener("appdatachange", handleDataChange);
    return () => window.removeEventListener("appdatachange", handleDataChange);
  }, []);

  useEffect(() => {
    const legacyContent = document.getElementById("app");
    legacyContent?.classList.add("react-dashboard-hidden");
  }, [currentRoute]);

  return (
    <>
      <Header currentRoute={currentRoute} />
      <RouteContent currentRoute={currentRoute} />
    </>
  );
}
