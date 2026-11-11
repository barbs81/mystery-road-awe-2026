import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { DocumentTitle } from "./app/DocumentTitle.js";
import { Header } from "./app/Header.js";
import { RouteContent } from "./app/RouteContent.js";
import { BookmarkProvider } from "./contexts/BookmarkContext.js";
import { state } from "./state.js";
import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
  saveBookmarksToStorage,
  saveNoteForEvidence,
} from "./storage.js";
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.js";

type AppData = {
  caseData: CaseData;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
};

const API_BASE_URL = "http://localhost:3001/api";

export default function App() {
  console.log("App render"); //innerhalb App() aber außerhalb useEffect, wird bei jedem Rendern der App aufgerufen

  const [bookmarks, setBookmarks] = useState<string[]>(() => [
    ...state.bookmarks,
  ]);
  const [notes, setNotes] = useState<Record<string, string>>(() => ({
    ...state.notesStore,
  }));
  const [data, setData] = useState<AppData>({
    caseData: state.caseData,
    evidence: state.allEvidence,
    people: state.allPeople,
    locations: state.allLocations,
    timeline: state.allTimeline,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Use Effect in App"); //innerhalb useEffect, wird nur beim ersten Rendern der App aufgerufen
    loadBookmarksFromStorage();
    loadNotesFromStorage();
    setBookmarks([...state.bookmarks]);
    setNotes({ ...state.notesStore });

    async function loadData() {
      try {
        const [
          caseResponse,
          peopleResponse,
          locationsResponse,
          evidenceResponse,
          timelineResponse,
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/case`),
          fetch(`${API_BASE_URL}/people`),
          fetch(`${API_BASE_URL}/locations`),
          fetch(`${API_BASE_URL}/evidence`),
          fetch(`${API_BASE_URL}/timeline`),
        ]);

        if (
          !caseResponse.ok ||
          !peopleResponse.ok ||
          !locationsResponse.ok ||
          !evidenceResponse.ok ||
          !timelineResponse.ok
        ) {
          throw new Error("One or more case data files could not be loaded.");
        }

        const nextData: AppData = {
          caseData: (await caseResponse.json()) as CaseData,
          people: (await peopleResponse.json()) as Person[],
          locations: (await locationsResponse.json()) as Location[],
          evidence: (await evidenceResponse.json()) as Evidence[],
          timeline: (await timelineResponse.json()) as TimelineEvent[],
        };

        state.caseData = nextData.caseData;
        state.allPeople = nextData.people;
        state.allLocations = nextData.locations;
        state.allEvidence = nextData.evidence;
        state.allTimeline = nextData.timeline;
        setData(nextData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not load case data.";
        setDataError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, []);

  useEffect(() => {
    console.log("Resize effect gestartet");

    function handleResize() {
      console.log("Window width:", window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      console.log("Resize effect bereinigt");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function toggleBookmark(evidenceId: string) {
    const nextBookmarks = bookmarks.includes(evidenceId)
      ? bookmarks.filter((id) => id !== evidenceId)
      : [...bookmarks, evidenceId];

    setBookmarks(nextBookmarks);
    state.bookmarks = nextBookmarks;
    saveBookmarksToStorage();
  }

  function saveNote(evidenceId: string, text: string) {
    saveNoteForEvidence(evidenceId, text);
    setNotes({ ...state.notesStore });
  }

  return (
    <HashRouter>
      <BookmarkProvider value={{ bookmarks, onToggleBookmark: toggleBookmark }}>
        <DocumentTitle />
        <Header />
        {isLoading ? (
          <main className="app-main">
            <p>Loading case file...</p>
          </main>
        ) : dataError ? (
          <main className="app-main">
            <p role="alert">{dataError}</p>
          </main>
        ) : (
          <RouteContent data={data} notes={notes} onSaveNote={saveNote} />
        )}
      </BookmarkProvider>
    </HashRouter>
  );
}
