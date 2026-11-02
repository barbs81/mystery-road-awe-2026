# Exercise 5 — React Interactivity, State & Reactive Programming

This is the fifth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3 and 4. This exercise builds and fully wires up the **final two views: Evidence Catalogue and Workspace**, the two most state-heavy parts of the app (search, multiple filters, sorting, bookmarking, notes, and
the hypothesis form).

This exercise is, on purpose, a chance to solve several problems you already fixed _imperatively_ back in Exercise 1: a dashboard count that could go stale, state that was represented in two places at once, and derived data that got confused with stored data.
Where relevant, the theory questions below ask you to explicitly compare your React solution to how you patched the same category of problem in vanilla JS.

**Out of scope for this exercise** (these come later): `useEffect`/data fetching (Exercise 6), a real backend, automated tests.

## Corresponding manuscript reading

This exercise corresponds to **Chapter 17, React State, Interactivity, and Reactive Data Flow** in the course manuscript, especially "Responding to events" through "Common state-design problems" on pp. 115–123. The chapter transition and summary follow on pp. 124–125.

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                               | Ready? |
| --- | -------------------------------------------------- | ------ |
| 1   | Migrate event handling from vanilla listeners      | ☐      |
| 2   | `useState` & controlled forms                      | ☐      |
| 3   | Immutable updates                                  | ☐      |
| 4   | Derived values vs. stored state                    | ☐      |
| 5   | Lifting state to the nearest common owner          | ☐      |
| 6   | Passing callbacks downward                         | ☐      |
| 7   | `useReducer` for the filter/search/sort state      | ☐      |
| 8   | Context, and when not to use it                    | ☐      |
| 9   | Diagnose & fix common state problems               | ☐      |
| 10  | Remove remaining direct DOM manipulation + wrap-up | ☐      |

---

## Demo 1 — Migrate event handling from vanilla listeners

**Tasks**

- [x] Build the Evidence Catalogue and Workspace views' static structure in React (cards, the filter toolbar, the notes list, the hypothesis form) if you haven't already, then migrate at least 3 real event handlers from the vanilla version (e.g. bookmark click, search input, save-note click) into React event handlers (`onClick`, `onChange`, `onSubmit`, etc.).

I’ll first map the existing vanilla Evidence and Workspace behavior plus the current React shell, then I’ll migrate the static structures and at least three handlers while preserving the existing shared data flow. Afterward I’ll run validation and give you a detailed notes-ready change list.

Find files matching `js/**/*.{tsx,ts}`

Search for `renderEvidence|renderWorkspace|bookmark|save-note|notes|addEventListener|inpu...`

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\ReactApp.tsx"
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\state.ts"
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\react-main.tsx"
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\package.json"
}

Read , lines 1 to 240
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\views\\evidence.ts",
"view_range": [
1,
240
]
}

Read , lines 240 to 540
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\views\\evidence.ts",
"view_range": [
240,
540
]
}

Read , lines 1 to 180
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\views\\workspace.ts",
"view_range": [
1,
180
]
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\index.html"
}

Search for `filter-|evidence-search|notesList|bookmarksList|hypothesis|workspace|app-main`

Read , lines 100 to 340
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\index.html",
"view_range": [
100,
340
]
}

Read , lines 1 to 145
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\app.ts",
"view_range": [
1,
145
]
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\storage.ts"
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\utils.ts"
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\vite.config.ts"
}

The existing React shell already has routes for Evidence and Workspace, but they are stubs; the legacy versions are still hidden underneath. I’m replacing those two stubs with feature components, using React state for the new Exercise 5 interactions while keeping bookmarks and notes persisted through the existing storage helpers.

Edit , ,

Edit , ,

Read , lines 1 to 120
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\features\\evidence\\EvidenceCatalogueView.tsx",
"view_range": [
1,
120
]
}

Read
Completed with input: {
"path": "C:\\Users\\barbs\\VS Programs\\Advance Web Engineering\\Exercise 1\\mystery-road-awe-2026\\js\\app\\RouteContent.tsx"
}

Ran terminal command: npm run build

Ran terminal command: npm run lint

The new Evidence and Workspace components compile and lint cleanly. I’m now testing the actual user flows: Evidence search/filter rendering, bookmark toggling, note saving, and Workspace hypothesis submission.

Ran terminal command: npx vite --host 127.0.0.1 --port 5176

Read Terminal
Completed with input: {
"shellId": "53",
"delay": 5
}

Opened `Browser`

Read `Browser`

Search for `Evidence items|button|E18|bookmark|Evidence Catalogue`

Clicked bookmark button for Production calibration-service checksum in `Browser`

Search for `Toggle bookmark for Production|★|Evidence items`

Typed text in Evidence search in `Browser`

Clicked Production calibration-service evidence card in `Browser`

Typed text in Investigator note in `Browser`

Clicked Save note in `Browser`

Navigated to http://127.0.0.1:5176/mystery-road-awe-2026/#/workspace in `Browser`

The browser checks confirmed the migrated flows: Evidence renders real cards, search narrows the list, bookmark toggling updates the star and Workspace, opening a card exposes the note form, and saving the note appears in Workspace. I’m making a small documentation cleanup and removing the now-unused route stub before the final validation.

Edit ,

Ran terminal command: npm run build

Ran terminal command: npm run lint

Ran terminal command: git diff --check; git status --short; git diff --stat

Ran terminal command: git diff -- EXERCISE_5.md | Select-Object -First 80

Edit

Ran terminal command: npm run build

Ran terminal command: npm run lint

Ran terminal command: git diff --check -- js/ARCHITECTURE.md js/app/RouteContent.tsx; git status --short

Stop Terminal Session
Completed with input: {
"shellId": "53"
}

Exercise 5 Demo 1 is implemented and verified.

## Files added

- `EvidenceCatalogueView.tsx`
  - React Evidence Catalogue structure.
  - Evidence cards.
  - Search input.
  - Type, person, location, status, and relevance filters.
  - Sorting controls.
  - Clear filters button.
  - Evidence detail panel.
  - Bookmark button.
  - Investigator note form.

- `WorkspaceView.tsx`
  - React Workspace structure.
  - Bookmarked Evidence list.
  - Personal Notes list.
  - Hypothesis Draft form.
  - Suspect selector.
  - Incident nature selector.
  - Supporting evidence multi-select.
  - Confidence range input.
  - Explanation and alternative explanation fields.
  - Save hypothesis button.

- `index.ts`
  - Exports the Evidence Catalogue component.

## Files updated

- `RouteContent.tsx`
  - Replaced the Evidence stub with `EvidenceCatalogueView`.
  - Replaced the Workspace stub with `WorkspaceView`.
  - Passed the existing evidence, people, and location data into those components.
  - Removed the unused `StubView`.

- `ARCHITECTURE.md`
  - Added the Evidence and Workspace feature folders to the documented project structure.

## React event handlers migrated

More than the required three handlers are now implemented in React:

1. **Evidence search**

   ```tsx
   onChange={(event) => setSearch(event.target.value)}
   ```

2. **Evidence filters**
   - Type filter
   - Person filter
   - Location filter
   - Status filter
   - Relevance filter

3. **Evidence sorting**

   ```tsx
   onChange={(event) => setSort(...)}
   ```

4. **Clear filters**

   ```tsx
   onClick={() => {
     setSearch("");
     setTypeFilter("");
     ...
   }}
   ```

5. **Bookmark click**

   ```tsx
   onClick={() => toggleBookmark(item)}
   ```

   This updates the shared bookmark list and persists it through the existing storage helper.

6. **Opening evidence details**

   ```tsx
   onClick={() => setSelectedEvidenceId(item.id)}
   ```

7. **Save-note action**

   ```tsx
   <form onSubmit={saveNote}>
   ```

   The note is saved through the existing `saveNoteForEvidence` helper.

8. **Close evidence details**

   ```tsx
   onClick={() => setSelectedEvidenceId(null)}
   ```

9. **Save hypothesis draft**
   ```tsx
   <form onSubmit={saveHypothesis}>
   ```
   The draft is saved to `localStorage`.

## Existing storage behavior preserved

- Bookmarks continue to use the existing `state.bookmarks` source of truth.
- Bookmarks continue to persist through `saveBookmarksToStorage()`.
- Evidence notes continue to use `state.notesStore`.
- Notes continue to persist through `saveNoteForEvidence()`.
- Hypothesis drafts continue to use `localStorage`, using the existing storage key.

## Browser verification

Verified that:

- `#/evidence` renders the Evidence Catalogue.
- Evidence cards render after data loading.
- Searching filters the evidence list.
- Bookmarking changes the star from `☆` to `★`.
- Bookmarked evidence appears in `#/workspace`.
- Opening an evidence card displays the detail panel.
- Saving an investigator note makes it appear in Workspace.
- `#/workspace` renders the hypothesis form.

## Validation

- `npm run build` passed.
- `npm run lint` passed.

- [x] For each one, confirm the vanilla version's inline `onclick` attribute or manually-attached `addEventListener` is gone. React should own the event, not the DOM.

I’ll verify the migrated Evidence and Workspace React components contain no inline `onclick` attributes or manual `addEventListener` calls, confirm the handlers are attached through JSX, and then mark this checklist item complete without changing the legacy code that still supports the unmigrated views.

Search for `onclick|addEventListener`

Search for `onClick|onChange|onSubmit`

Search for `For each one, confirm`

Confirmed. The migrated React components use React-owned event handlers:

- `EvidenceCatalogueView.tsx`
  - `onChange` for search and filters.
  - `onClick` for bookmarks, opening details, clearing filters, and closing details.
  - `onSubmit` for saving notes.

- `WorkspaceView.tsx`
  - `onSubmit` for saving the hypothesis draft.

A targeted search found:

- No inline `onclick` attributes.
- No `addEventListener` calls.
- React owns the migrated events through JSX props such as `onClick`, `onChange`, and `onSubmit`.

The corresponding item is already marked complete in `EXERCISE_5.md`.

The old vanilla Evidence and Workspace files still contain their original DOM listeners because they are legacy code, but the active React routes now use the React implementations instead.

**Questions** (depend on the tasks above)

- [x] How do you attach a click handler to a button in React versus how the vanilla version did it (inline `onclick="..."` in the HTML string, or `addEventListener` in JS)? What actually receives the event object in each approach, and is it the same kind of object?

In React, the handler is attached directly in JSX using `onClick`:

```tsx
<button type="button" onClick={() => toggleBookmark(item)}>
  Bookmark
</button>
```

Or, when the event object is needed:

```tsx
<button
  type="button"
  onClick={(event) => {
    event.stopPropagation();
    toggleBookmark(item);
  }}
>
  Bookmark
</button>
```

React calls the handler and passes it a React event object. In TypeScript, a button click can be typed as:

```tsx
(event: React.MouseEvent<HTMLButtonElement>)
```

In the vanilla version, the event was attached either inline:

```html
<button onclick="handleBookmarkClick()">Bookmark</button>
```

or with JavaScript:

```ts
button.addEventListener("click", handleBookmarkClick);
```

The vanilla handler receives the browser’s native `MouseEvent`:

```ts
function handleBookmarkClick(event: MouseEvent) {
  event.stopPropagation();
}
```

### Are they the same kind of object?

They represent the same user action and provide similar properties and methods, such as:

- `target`
- `currentTarget`
- `stopPropagation()`
- `preventDefault()`

However, they are not exactly the same object:

- **Vanilla JavaScript:** receives the browser’s native `MouseEvent`.
- **React:** receives React’s event wrapper, commonly called a `SyntheticEvent`, which provides a consistent React interface and exposes the original browser event through `event.nativeEvent`.

In our migrated code, React owns the event:

```tsx
onClick={() => toggleBookmark(item)}
```

The browser is still the source of the click, but React attaches and manages the handler as part of the component tree.

- [ ] The vanilla version's evidence-list click handling used event delegation (one listener on the container, checking `event.target`) partly to work around listeners being re-registered on every render. Do you still need that pattern in React? Why or why not?

---

## Demo 2 — `useState` & controlled forms

**Tasks**

- [ ] Make the Evidence search box a controlled input (`value` + `onChange` backed by `useState`).
- [ ] Make the entire hypothesis form (suspect select, nature select, evidence multi-select,
      confidence range, explanation and alternative textareas) fully controlled.
- [ ] Wire the "Save hypothesis draft" action to read from your controlled state and persist it (still to `localStorage` for now).

**Questions** (depend on the tasks above)

- [ ] What makes an input "controlled" versus "uncontrolled" in React? Show what happens if you try to type in one of your controlled inputs without wiring its `onChange` and explain, in terms of React's render cycle, _why_ that happens.
- [ ] The hypothesis form has several different input types (select, multi-select, range, textarea). Did you use one `useState` per field, or a single object? Justify your choice — and note this question again once you get to Demo 7 (`useReducer`), which asks you to reconsider it for a different form.

---

## Demo 3 — Immutable updates

**Tasks**

- [ ] Find at least one place where your first instinct (or an early draft) would have mutated state directly (e.g. `evidence.bookmarked = true`, or pushing directly into a state array), and rewrite it as an immutable update.
- [ ] Add a case to your bookmark toggle logic that specifically exercises this: toggling a bookmark must produce a _new_ array/object, not a mutated one.

**Questions** (depend on the tasks above)

- [ ] Why does mutating state directly in React sometimes still appear to "work" on screen, but
      cause real (possibly hard-to-track) bugs elsewhere? What is React actually comparing when it decides whether to re-render?
- [ ] The original vanilla app had a real bug where sorting evidence mutated the master array via a shared reference, permanently losing the original order. Show how your React state update for the equivalent action (bookmark toggle, or sort, if you implement it) avoids that exact class of bug. Be specific about what's different, not just "React handles it."

---

## Demo 4 — Derived values vs. stored state

**Tasks**

- [ ] Implement the Evidence Catalogue's filtering/sorting so that the _filtered, sorted list is computed from_ the full evidence list and the current filter/sort state, every render. Never stored as its own separate piece of state that could drift out of sync.
- [ ] Do the same for the Dashboard's bookmark count and the Workspace's bookmarked-items list: both should be derived from the same single source of truth for bookmarks, not duplicated state.

**Questions** (depend on the tasks above)

- [ ] What's the rule for deciding whether something belongs in `useState` versus being computed inline (or via `useMemo`) during render? Apply that rule to the filtered evidence list and justify your answer.
- [ ] The vanilla app had two related bugs here: a dashboard bookmark count that could go stale (because it only re-rendered on a view's first visit), and a `filteredEvidence` variable that was sometimes literally the _same array reference_ as the master list. Explain, concretely, why deriving these values during render instead of storing them makes **both** of those bug classes structurally impossible, not just less likely.

---

## Demo 5 — Lifting state to the nearest common owner

**Tasks**

- [ ] Identify the lowest common ancestor component of everywhere bookmark state needs to be read or changed (at minimum: an Evidence card's bookmark button, the Dashboard's bookmark count, and the Workspace's bookmarked-items list), and move the actual `useState` for bookmarks up to live there.
- [ ] Confirm that toggling a bookmark from the Evidence view is immediately reflected on the
      Dashboard the next time it's rendered.

**Questions** (depend on the tasks above)

- [ ] What does "lifting state up" actually mean, mechanically? Walk through where the bookmark state lived before you lifted it, and where it lives now.
- [ ] What would go wrong (be specific) if you had instead kept a separate `useState` for bookmarks inside each of the Dashboard, Evidence, and Workspace components?

---

## Demo 6 — Passing callbacks downward

**Tasks**

- [ ] From wherever you lifted bookmark state to (Demo 5), pass a callback (e.g. `onToggleBookmark`) down through props to every component that needs to trigger a change, rather than letting child components reach up and mutate anything themselves.
- [ ] Do the same for at least one more interaction that needs to affect state owned by a parent (e.g. saving a note, or changing evidence review status from the detail view).

**Questions** (depend on the tasks above)

- [ ] Why can't (or shouldn't) a deeply nested child component just directly modify state that lives in a distant ancestor? What does passing a callback down get you instead?
- [ ] Trace one callback all the way from where it's defined (with the actual `useState` setter
      inside it) down to the component that calls it. How many component layers does it pass through, and does that feel like "too many". Is prop drilling becoming a real problem here?

---

## Demo 7 — `useReducer` for the filter/search/sort state

**Tasks**

- [ ] Identify the Evidence Catalogue's combined filter state (search term, type, person, location, status, relevance, and sort order — 7+ related values that often change together or need to be reset together) as a single non-trivial state domain, and replace its `useState` calls with a single `useReducer`.
- [ ] Implement at least 3 distinct action types (e.g. `SET_FILTER`, `SET_SORT`, `CLEAR_FILTERS`).

**Questions** (depend on the tasks above)

- [ ] Why is this particular piece of state ("evidence filters") a better fit for `useReducer` than for a pile of individual `useState` calls? What specifically got easier once you switched?
- [ ] Show your `CLEAR_FILTERS` action. How does a reducer make "reset several related values at once, consistently" easier to get right than resetting them individually?
- [ ] Is `useReducer` fundamentally different from `useState`, or is `useState` essentially a
      special case of the same underlying idea? Justify your answer.

---

## Demo 8 — Context, and when not to use it

**Tasks**

- [ ] Pick one piece of state from this exercise (bookmark state is a strong candidate, given Demo 6's prop-drilling question) and actually implement it via React Context, replacing the prop-drilled version.
- [ ] Explain a short, honest decision: for _this specific app_, at its _current_ size, is Context actually the right call for this state, or is prop-drilling (or lifting state, without
      Context) good enough? Be ready to defend whichever answer you land on.

**Questions** (depend on the tasks above)

- [ ] What problem does Context actually solve? What does it _not_ solve (people sometimes expect it to behave like global state management. Where does that expectation break down)?
- [ ] Revisit Demo 6's callback-depth question. Was prop drilling there actually a real problem
      (annoying, error-prone, worth solving) or a manageable one? What's your threshold for reaching for Context instead of just drilling one more level?
- [ ] "Unnecessary global state" is explicitly named as a common problem. Could using Context here be an example of that, even though Context isn't technically the same as a global variable?

---

## Demo 9 — Diagnose & fix common state problems

**Tasks**

- [ ] Review your own Evidence/Workspace/Dashboard code specifically for: duplicated state (the same fact represented in two places), stale state (a value that doesn't update when it should), excessive prop drilling, unnecessary global state, and any remaining direct mutation.
- [ ] Find and fix at least 2 real instances (they can be ones you introduced yourself while
      building this exercise, that's normal and expected, not a failure).

**Questions** (depend on the tasks above)

- [ ] For each of the 2 issues you fixed: which of the five named categories did it fall into, and how did you notice it (a visible bug, a code-review-style re-read, React DevTools, something else)?
- [ ] Of the five named problems (duplicated state, stale state, prop drilling, unnecessary global state, mutation), which one is this app's history (Exercise 1's bugs) most clearly an example of? Explain the connection directly.

---

## Demo 10 — Remove remaining direct DOM manipulation + wrap-up

**Tasks**

- [ ] Do a final sweep of the Evidence Catalogue and Workspace views (and re-check Dashboard/People & Locations/Timeline from Exercises 3–4) for any remaining direct DOM manipulation, e.g. `document.querySelector`, manual `classList` changes, `innerHTML`, anything not going through React's render, and remove it.
- [ ] Confirm the whole app (all 5 views) now runs entirely on React state and props, with zero manual DOM manipulation anywhere.

**Questions** (depend on the tasks above)

- [ ] Show one state-management decision you made somewhere in this exercise (state ownership, `useState` vs. `useReducer`, prop drilling vs. Context, or something else) that you're not 100% sure was the right call. Explain the trade-off honestly, both directions.
- [ ] Across Exercises 3–5, name one bug category from the _original_ vanilla app (Exercise 1's defect list) that is now, by construction, no longer possible in your React version — not just fixed, but structurally prevented. Explain why the React architecture rules it out.

---
