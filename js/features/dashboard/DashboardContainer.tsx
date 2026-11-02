import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../../types.js";
import { useBookmarks } from "../../contexts/BookmarkContext.js";
import { DashboardView } from "./DashboardView.js";

export type DashboardContainerProps = {
  caseData: CaseData;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
};

export function DashboardContainer({
  caseData,
  evidence,
  people,
  locations,
  timeline,
}: DashboardContainerProps) {
  const { bookmarks } = useBookmarks();
  const reviewedCount = evidence.filter(
    (evidence) => evidence.status.toLowerCase() === "reviewed",
  ).length;

  const progress = evidence.length
    ? Math.round((reviewedCount / evidence.length) * 100)
    : 0;

  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <DashboardView
      caseData={caseData}
      peopleCount={people.length}
      locationsCount={locations.length}
      bookmarkCount={bookmarks.length}
      reviewedCount={reviewedCount}
      progress={progress}
      evidenceCount={evidence.length}
      recentEvidence={recentEvidence}
      recentTimeline={recentTimeline}
    />
  );
}
