import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.js";

export const state: {
  bookmarks: string[];
  notesStore: Record<string, string>;
  allEvidence: Evidence[];
  allPeople: Person[];
  allLocations: Location[];
  allTimeline: TimelineEvent[];
  caseData: CaseData;
  loadingStepsRemaining: number;
  currentPage: string;
} = {
  bookmarks: [],
  notesStore: {},
  allEvidence: [],
  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: {} as CaseData,
  loadingStepsRemaining: 2,
  currentPage: "dashboard",
};
