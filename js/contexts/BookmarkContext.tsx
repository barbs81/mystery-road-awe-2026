import { createContext, useContext } from "react";

export type BookmarkContextValue = {
  bookmarks: string[];
  onToggleBookmark: (evidenceId: string) => void;
};

const BookmarkContext = createContext<BookmarkContextValue | undefined>(
  undefined,
);

export const BookmarkProvider = BookmarkContext.Provider;

export function useBookmarks(): BookmarkContextValue {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
