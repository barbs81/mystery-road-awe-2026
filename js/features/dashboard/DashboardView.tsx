import type { CaseData, Evidence, TimelineEvent } from "../../types.js";
import { formatDate, getStatusBadgeClass } from "../../utils.js";

export type DashboardViewProps = {
  caseData: CaseData;
  evidenceCount: number;
  peopleCount: number;
  locationsCount: number;
  bookmarkCount: number;
  reviewedCount: number;
  progress: number;
  recentEvidence: Evidence[];
  recentTimeline: TimelineEvent[];
};

export function DashboardView({
  caseData,
  evidenceCount,
  peopleCount,
  locationsCount,
  bookmarkCount,
  reviewedCount,
  progress,
  recentEvidence,
  recentTimeline,
}: DashboardViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="dashboard-title">
        <h2 id="dashboard-title">Case Dashboard</h2>

        <div className="case-summary-card">
          <h3>{caseData.title || "Case"}</h3>
          <p>
            <span className="badge badge-flagged">
              {(caseData.status || "unknown").toUpperCase()}
            </span>
          </p>
          <p>{caseData.summary || "Loading case summary..."}</p>
        </div>

        <div className="stat-grid">
          <StatCard value={evidenceCount} label="Evidence items" />
          <StatCard value={peopleCount} label="People" />
          <StatCard value={locationsCount} label="Locations" />
          <StatCard value={bookmarkCount} label="Bookmarked" />
          <StatCard value={reviewedCount} label="Reviewed" />
        </div>

        <ReviewProgress progress={progress} />

        <div className="dashboard-columns">
          <div className="dashboard-panel">
            <h3>Recent evidence</h3>
            {recentEvidence.length === 0 ? (
              <p>No evidence loaded yet.</p>
            ) : (
              recentEvidence.map((evidence) => (
                <div className="mini-list-item" key={evidence.id}>
                  <strong>{evidence.id}</strong> &mdash; {evidence.title}{" "}
                  <span
                    className={`badge ${getStatusBadgeClass(evidence.status)}`}
                  >
                    {evidence.status}
                  </span>
                </div>
              ))
            )}
          </div>

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
        </div>
      </section>
    </main>
  );
}

type StatCardProps = {
  value: number;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

type ReviewProgressProps = {
  progress: number;
};

function ReviewProgress({ progress }: ReviewProgressProps) {
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
