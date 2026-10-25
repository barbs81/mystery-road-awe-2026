import { useEffect, useState } from "react";
import { state } from "./state.js";
import { formatDate, getStatusBadgeClass } from "./utils.js";

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

function RouteContent({ currentRoute }: { currentRoute: string }) {
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
}

type PersonCardProps = {
  person: Person;
};


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