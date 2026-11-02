import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./app/Header.js";
import { RouteContent } from "./app/RouteContent.js";
import { state } from "./state.js";
import { saveBookmarksToStorage } from "./storage.js";

export default function App() {
  const [, setDataVersion] = useState(0);
  const [bookmarks, setBookmarks] = useState<string[]>(() => [
    ...state.bookmarks,
  ]);

  useEffect(() => {
    const handleDataChange = () => {
      setBookmarks([...state.bookmarks]);
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

  useEffect(() => {
    const legacyContent = document.getElementById("app");
    legacyContent?.classList.add("react-dashboard-hidden");
  }, []);

  return (
    <HashRouter>
      <Header />
      <RouteContent bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />
    </HashRouter>
  );
}
