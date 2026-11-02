import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./app/Header.js";
import { RouteContent } from "./app/RouteContent.js";
import { BookmarkProvider } from "./contexts/BookmarkContext.js";
import { state } from "./state.js";
import { saveBookmarksToStorage, saveNoteForEvidence } from "./storage.js";

export default function App() {
  const [, setDataVersion] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>(() => [
    ...state.bookmarks,
  ]);
  const [notes, setNotes] = useState<Record<string, string>>(() => ({
    ...state.notesStore,
  }));

  useEffect(() => {
    const handleDataChange = () => {
      setBookmarks([...state.bookmarks]);
      setNotes({ ...state.notesStore });
      setDataVersion((version) => version + 1);
    };
    window.addEventListener("appdatachange", handleDataChange);
    return () => window.removeEventListener("appdatachange", handleDataChange);
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

  useEffect(() => {
    const legacyContent = document.getElementById("app");
    legacyContent?.classList.add("react-dashboard-hidden");
  }, []);

  return (
    <HashRouter>
      <BookmarkProvider value={{ bookmarks, onToggleBookmark: toggleBookmark }}>
        <Header />
        <RouteContent notes={notes} onSaveNote={saveNote} />
      </BookmarkProvider>
    </HashRouter>
  );
}
