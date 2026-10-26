import { state } from "../../state.js";
import type { TimelineEvent } from "../../types.js";
import { DashboardView } from "./DashboardView.js";

export function DashboardContainer() {
  const reviewedCount = state.allEvidence.filter(
    (evidence) => evidence.status.toLowerCase() === "reviewed",
  ).length;

  const progress = state.allEvidence.length
    ? Math.round((reviewedCount / state.allEvidence.length) * 100)
    : 0;

  const recentEvidence = state.allEvidence.slice(-5).reverse();
  const recentTimeline: TimelineEvent[] = state.allTimeline.slice(-5).reverse();

  return (
    <DashboardView
      caseData={state.caseData}
      peopleCount={state.allPeople.length}
      locationsCount={state.allLocations.length}
      bookmarkCount={state.bookmarks.length}
      reviewedCount={reviewedCount}
      progress={progress}
      evidenceCount={state.allEvidence.length}
      recentEvidence={recentEvidence}
      recentTimeline={recentTimeline}
    />
  );
}
