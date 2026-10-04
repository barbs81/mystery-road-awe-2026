# Exercise 1 — Refactoring the App

This is the first exercise in Advanced Web Engineering Course (CSDC). You will **not add any new
features** in this exercise. The goal is to make the existing application correct and more
maintainable, understand advanced JavaScript topics, and get comfortable with your browser's
developer tools along the way.

**Out of scope for this exercise** (these come later in the course): migrating to TypeScript,
introducing a build tool, splitting into a full separation-of-concerns architecture beyond plain
modules, parallelizing/optimizing the async data loading, and any framework migration. If you
notice things related to those topics while you work, write them down (you'll come back to them).

Keep a running note of what you changed and why (a `CHANGES.md`, or commit messages, your choice!).
Several theory questions ask you to explain a specific change you made, and for bug fixes, **using
real commits is the easiest way to show a before/after live in class**. E.g. commit the reproduction
state (or just note the commit hash before your fix) so you can diff it against your fix on demand.

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. Every task and every question has its own checkbox — you can't answer a
question convincingly without having actually done its task first.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are
able to present in the Moodle course. **Before class, go through and tick only what you can
genuinely demonstrate or answer on the spot, live.** An unticked box is fine, but remember that you
need to at least tick ~70% of tasks on all exercises for a positive course grade. "I fixed it" is
not enough for any bug-related item: you need to be able to explain _why_ it was broken and _why_
your fix works.

| #   | Demo                                                    | Ready? |
| --- | ------------------------------------------------------- | ------ |
| 1   | Split the app into JS modules                           | ☐      |
| 2   | Bug hunt — mutation/reference bug                       | ☐      |
| 3   | Bug hunt — an asynchronous/Promise-handling bug         | ☐      |
| 4   | Bug hunt — silent (console-only) bug                    | ☐      |
| 5   | Bug hunt — full walkthrough & reflection                | ☐      |
| 6   | Use the JavaScript debugger                             | ☐      |
| 7   | DevTools tour (Console/Network/Application/Elements)    | ☐      |
| 8   | Clean coding: globals, `var`/`let`/`const`, code smells | ☐      |
| 9   | Refactor nested Promises to `async`/`await`             | ☐      |
| 10  | Refactor to arrow functions                             | ☐      |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Split the app into JS modules

`app.js` is currently one file, well over a thousand lines, mixing data loading, global state,
rendering for every view, event handling, and utility functions. Split it into multiple files using
native ES modules (`import`/`export`). No bundler, no build step, just modules the browser loads
directly.

**Tasks**

- [x] Design a module boundary you can justify, and implement it (e.g. data loading, shared state,
      one module per view's rendering, `localStorage` helpers, small formatting/lookup utilities,
      and an entry-point module that wires up navigation and event listeners on startup).
- [x] Update `index.html` to load your entry point with `<script type="module" src="...">` instead
      of the current plain `<script src="app.js">`.
- [x] Do this as a **pure refactor first**: the app must behave identically before and after (bugs
      and all — you are not fixing anything yet in this demo). Re-run the app after every few
      changes and confirm nothing new broke.
- [x] Decide deliberately, function by function, what needs to be exported and what can stay
      private to its module. Not everything needs to be public.

**Questions** (depend on the tasks above)

- [x] What is the difference between a classic `<script>` and a `<script type="module">`? Name at
      least two behavioral differences that are relevant to this app.
- [x] Before your refactor, `allEvidence` was a global `var`, readable and writable from anywhere in
      `app.js`. After splitting into modules, what has to happen for a different module to read or
      change that value? What error do you get if you forget, and why is that error actually
      useful?
- [x] What's the difference between a named export and a default export? Point to one place in your
      refactor where you chose one over the other, and explain why.
- [x] Why won't `type="module"` scripts run at all if you open `index.html` directly from disk
      (`file://...`) instead of through a local HTTP server? (You already need a server for
      `fetch()` — is this the same reason, a different one, or both?)

---

## Demo 2 — Bug hunt: a mutation/reference bug

The app has several independent defects hidden across its views. Find them the way you would on a real project: by using the app thoroughly,
reading error output, debugging and reasoning about the code once you have a reproducible symptom.

For this demo specifically, find and fix a bug where an array or object gets changed in a place
that surprises you (something is mutated that shouldn't have been, or two things that were supposed
to be independent turn out to be linked).

**Tasks**

- [x] Reproduce the bug reliably and write down the exact steps.
- [x] Form a hypothesis for the root cause and confirm it (not just patch the symptom).
- [x] Fix it, and verify the fix doesn't break anything else nearby.

**Questions** (depend on the task above)

- [ ] Explain — in your own words — the difference between a _reference_ and a _copy_ in
      JavaScript, and how that distinction explains what you observed.
- [ ] Walk through the exact user actions and system state that trigger the bug. Could you have
      found it by reading the code top-to-bottom without running it? Why or why not?

---

## Demo 3 — Bug hunt: an asynchronous/Promise-handling bug

Find and fix a bug caused by how the app handles a Promise-based operation — for example,
something that should update once an async operation finishes but doesn't, or state that gets
checked before (or without ever) being properly set by an async callback. This does not have to be
flaky or timing-sensitive to reproduce. The point is that you can't explain the root cause without talking about
_when_, relative to a Promise/callback, something did or didn't happen.

**Tasks**

- [x] Reproduce the bug reliably and write down the exact steps.
- [x] Form a hypothesis for the root cause, expressed in terms of the async operation involved (what
      was supposed to happen once it resolved, and what actually happened instead), and confirm it.
- [x] Fix it, and verify the fix actually addresses the async handling rather than papering over the
      symptom (e.g. don't just add a delay or a retry if the real issue is a missing state update).

**Questions** (depend on the task above)

- [x] Explain the async operation this bug revolves around: what does it fetch/return, and at what
      point in its lifecycle (before it starts, while pending, on success, on failure) does the bug
      actually happen? How did you confirm that, rather than just guessing?

---

## Demo 4 — Bug hunt: a silent bug

Open DevTools _before_ you start clicking around, and keep the Console tab visible for your entire
testing session. Find a bug that produces **no visible change in the UI** — only console output
(an error, a warning, or an unexpected logged value).

See above # Aufgabe 3.1 -> in the console, the Promise object was being returned in the console.log rather than the result of the Promise.

**Tasks**

- [x] Reproduce the bug and capture the exact console output.
- [x] Trace it back to the line(s) of code responsible.
- [x] Fix it, and confirm the console is clean for that scenario afterward.

**Questions** (depend on the task above)

- [x] How did you notice this bug in the first place, given that nothing looked broken? Why is
      "nothing looks broken" not the same as "nothing is broken"?

---

## Demo 5 — Bug hunt: full walkthrough & reflection

Use every feature, in every view, more than once. Dashboard stats, evidence search/filter/sort/
bookmark/detail/notes, people & locations tabs and their cross-links, timeline sorting/filtering/
evidence links, and the workspace (bookmarks list, notes, hypothesis form — including reloading the
page afterward to check what persisted). Try things a "well-behaved" user wouldn't, eg click buttons
rapidly, type quickly and delete what you typed, navigate away mid-action, reload at odd times,
resize the window, inspect and hand-edit `localStorage` in DevTools, leave a field empty, select the
same filter twice. Keep going past Demos 2–4 — this app does not have only three bugs.

**Tasks**

- [ ] For every bug you find (beyond the three already covered), write down: reproduction steps,
      expected vs. actual behavior, root cause, the fix, and how you verified it.
- [ ] Pick one bug from your full list (any of them, including Demos 2–4) and prepare to show it
      live: the broken behavior, then your fix. **Commit the pre-fix state (or note its commit
      hash) so you can diff broken vs. fixed on demand in class.**

**Questions** (depend on the tasks above)

- [ ] For the bug you chose to present: walk through the exact user actions and system state that
      trigger it, live, starting from the pre-fix commit.
- [ ] Across all the bugs you found, did fixing one ever change the symptoms of, reveal, or
      accidentally fix another? If so, explain the relationship. If not, how did you confirm your
      fixes were properly isolated from each other?

---

## Demo 6 — Use the JavaScript debugger

`console.log` is a debugging tool, not _the_ debugging tool. This demo is about using the browser's
actual debugger or a VS Code extension for debugging — ideally on one of the bugs from Demos 2–5.

Do it in Firefox debugger
Set a breakpoint on loadEvidenceData()
Reload the page. Execution should eventually pause there.
Start with the steppinig requirement

**Tasks**

- [x] Set at least one real breakpoint (not a `console.log`) inside a function connected to a bug
      you investigated, and step through it line by line.

      Set a breakpoint on loadAllData()

- [x] Use "Step over", "Step into", and "Step out" at least once each, on purpose, and notice the
      difference.

      Step over - Schritt darüber -> Execute the current line, but don't enter functions called by that line
      Step into -> Schritt hinein -> Step Into enters the function being called so I can inspect its execution. It shows the fetch() statement
      Schritt heraus -> Step out -> Finish executing this function and pause back in the code that called it. So stepping out helps you see the relationship between the called function and its caller.

- [?] While paused at a breakpoint, open the Call Stack panel and explain, for a real example, "who
  called this function, and with what."
- [x] Use a **conditional breakpoint** or a **logpoint** at least once (e.g. only break when a loop
      variable equals a specific value, or a specific ID is being processed).
- [x] While paused, use the Scope/Watch panel (or hover over variables) to track a value across
      several steps of execution, and edit a variable's value live to test a hypothesis before
      writing the actual code change.

**Questions** (depend on the tasks above)

- [x] What's the difference between "Step over" and "Step into"? Give a concrete example from this
      app where using the wrong one would waste your time.

Step Into enters the function being called, while Step Over executes that function without entering it and pauses at the next line. For example, when debugging loadAllData(), stepping into showLoadingOverlay() would waste time because the loading overlay is unrelated to the Promise-ordering bug, so I would Step Over it.

- [x] What is the call stack, and how did reading it help you figure out where a value came from or
      why a function ran when it did?

The call stack shows the sequence of currently active function calls, allowing me to see which function called the current function. This helped me trace execution from initApp() to loadAllData() and understand why a particular function was executing at that point.

- [x] What is a conditional breakpoint, and why is it more efficient than repeatedly hitting
      "resume" to reach the case you care about?

A conditional breakpoint only pauses execution when a specified JavaScript condition is true, such as i === 3. This is more efficient because the debugger automatically ignores all the cases I am not interested in instead of making me repeatedly resume execution.

- [x] What's the difference between a breakpoint you set in the DevTools UI and a `debugger;`
      statement written directly in the source code? When would you prefer one over the other?

A DevTools breakpoint pauses execution without modifying the source code, while a debugger; statement is actually written into the JavaScript and causes DevTools to pause there when it is open. I would normally use a DevTools breakpoint for temporary investigation and debugger; when I deliberately want the pause location to be part of the code during development.

- [x] Describe a moment where `console.log` alone would _not_ have been enough to find a bug, but
      stepping through with the debugger was. What did the debugger show you that logging couldn't?

When investigating the asynchronous loading code, stepping showed me that execution could leave loadCorePeopleAndLocations() after starting a Promise-based operation and later resume inside its .then() callback. The debugger let me pause at those exact moments and inspect values such as caseJson and the execution path, rather than only seeing values that I had decided to log beforehand.

---

## Demo 7 — DevTools tour: Console, Network, Application, Elements

A guided tour, so you know where things live before you need them.

**Tasks**

- [x] **Console:** filter down to only errors, then only warnings, using the log-level filter. Use
      the text filter box to search for one specific message. Try "Preserve log" and explain what
      it changes.
- [x] **Network:** reload with the Network tab open, find the requests for the app's JSON data
      files, and for one request inspect its status code, response body, and timing. Throttle the
      connection (e.g. "Slow 3G") and reload.
- [x] **Application** (Chrome) / **Storage** (Firefox): find this app's `localStorage` entries,
      inspect their values, edit one directly in DevTools, and reload to see the effect. Replace a
      value with text that isn't valid JSON and see what happens.
- [x] **Elements:** inspect a rendered evidence card or person card in the DOM, and connect what you
      see there back to the code that generated it.

**Questions** (depend on the tasks above)

- [x] What's the practical difference between `console.log`, `console.warn`, and `console.error`,
      beyond just the color?

      console.log is for general diagnostic information, console.warn indicates something unexpected or potentially problematic, and console.error communicates that an operation has failed. DevTools can also filter these severity levels separately, making warnings and errors easier to identify among ordinary logs.

- [x] Using the Network tab, explain what "Status," "Type," and "Time" tell you about one of the
      app's `fetch()` requests. If that request returned a 404 instead of a 200, how would the app
      currently react?

      For a request such as evidence.json, Status shows the HTTP result such as 200, Type identifies the resource/request type, and Time shows how long the request took. Importantly, fetch() does not automatically reject just because the response is 404, and because this code does not check res.ok or res.status, it would still attempt res.json(); whether the later .catch() runs then depends on whether parsing or subsequent processing fails.

- [x] List this app's `localStorage` keys and what each one is for. What happens if you manually
      corrupt one of them and reload — and _why_ does that happen, according to the code that reads
      it back out?

      The keys are remotion_bookmarks for bookmarks, remotion_notes for evidence notes, and remotion_hypothesis for the saved hypothesis draft. Corrupting bookmarks is handled by try/catch and resets them to [], whereas malformed JSON for notes or the hypothesis can cause JSON.parse() to throw because those reads are not protected by equivalent error handling.

- [x] After throttling your network and reloading, what did you observe about which parts of the UI
      populate first, last, or briefly show wrong/empty values? Why does the order matter here?

      The picture loaded really slowly. The order matters because handleHashChange() can therefore trigger rendering while required state such as evidence or timeline data is still pending, even though the later loader callbacks may rerender the UI and hide the problem.

---

## Demo 8 — Clean coding: globals, `var`/`let`/`const`, code smells

**Tasks**

- [x] List every top-level `var` at the top of the original `app.js`. For at least three of them, explain what could go wrong if two unrelated pieces of code both tried to use a variable with that name — and how your module split from Demo 1 already prevents (or doesn't yet prevent) that.

      Why are global variables dangerous? And how do ES modules help prevent that?
      First, what does top level 'var' mean? In the original app.js file, I had variables like:
      var allEvidence = [];
      var filteredEvidence = [];
      var selectedEvidence = null;
      var bookmarks = [];
      var currentPage = "dashboard";

      var allPeople = [];
      var allLocations = [];
      var allTimeline = [];
      var caseData = {};

      var currentPeopleTab = "people";
      var loadingStepsRemaining = 2;

      Top Level simply means the variable is declared outside of any function.

      If there are two gloal level variables that have the same name, the pieces of code can interfere with each other. Once part of the application could unexpectadly override the other value.

      I still have the state variables in my app that are in state.js. So variables that are scoped in modules do not automatically impact each other if they have the same name, however, those defined in state.js or if they are given access to by other modules, they can be uninentionally modified.

      Three examples of what could go wrong
      1) allEvidence
      If two unrelated pieces of code both tried to use allEvidence, they could overwrite each other’s data unexpectedly.

      Example:

      a data loader assigns allEvidence = fetchedData
      a filter/render function reassigns allEvidence = filteredResults
      a dashboard function then reads the wrong data and renders the wrong numbers
      This is bad because the whole app is meant to share one canonical list of evidence. If one part silently rebinds that name, other code suddenly reads stale or partial data.

      How the module split helps:

      In the refactor, this is no longer a bare global. It lives in state.allEvidence inside state.js.
      Different modules import state and access state.allEvidence instead of creating or overwriting a global variable.
      So two unrelated files cannot accidentally “clobber” each other by simply naming a variable allEvidence.

      2) filteredEvidence
      This is a classic collision risk because search/filter/sort logic often manipulates the same list from multiple places.

      Example:

      the search box sets filteredEvidence = results
      a sort change also does filteredEvidence = ...
      a detail view reads filteredEvidence and ends up showing the wrong item list because another function just replaced it
      This can create “looks fine, but the wrong list is displayed” bugs.

      How the module split helps:

      Now the filtering state is kept inside evidence.js as module-local state instead of a single app-wide variable.
      Another module cannot casually modify it unless it imports and calls a function or exposes a controlled API.
      That still does not prevent collisions inside the same module, but it removes the cross-file global problem.
      3) selectedEvidence
      If one piece of code selects an item for the details panel and another piece selects a different item for note-saving or bookmark actions, whichever assignment runs last wins.

      Example:

      one function sets selectedEvidence = ev
      another unrelated action sets selectedEvidence = anotherItem
      the UI details panel now displays the wrong evidence item, and a note may be attached to the wrong record
      How the module split helps:

      This state is kept inside evidence.js, so it is module-scoped.
      It is no longer a global variable readable from unrelated parts of the app.
      That prevents accidental cross-view interference between different features.

- [x] Go through the codebase and replace `var` with `const` or `let` everywhere it's declared, deciding `const` vs. `let` deliberately for each one.

      This assignment is mainly about understandign whether a variable is actually supposed to change. With var, you can always reassign the variable:

      var currentPage = "dashboard"
      currentPage = "evidence"

      Modern JS generally makes you be more explicit with let:

      let currentPage = "dashboard"
      currentPage = "evvidence"

      versus using const:
      const container = document.getElementById("evidenceList");

      Here, container never needs to point to a different element, so const communicates: this variable will not be reassigned.

      The rule is generally use const by default and let only when the variable itself needs to be reassigned.

      Another important reason for this:

      let and const are block-scoped (code surrounded by {}), var is function scoped (entire function including its {})

      What I changed and why
      1) const for values that never need reassignment
      I used const for things like:

      storage keys like STORAGE_KEY_BOOKMARKS
      DOM elements that are read once and not reassigned
      fixed lookup objects like viewRendered (the object itself stays constant, while its properties are mutated)
      Example:

      const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";
      const container = document.getElementById("...");
      This is better because it makes intent clear: “this binding should never be reassigned.”

      2) let for values that do change
      I used let for counters and temporary values that are reassigned during the app lifecycle, such as:

      latestSearchRequestId
      currentPeopleTab
      loop counters like i, p, t
      mutable local values like hash, html, results
      This matches the real behavior: these variables are intentionally updated later.

      3) Kept module scoping clean
      A big part of this refactor is that ES modules already give each file its own scope. So using const/let prevents the classic var problem of accidental globals and hoisting bugs. --> the issue is that var and const are function scoped and so a function might keep the same variable value when working with a loop, changing it to let makes it block scoped, so that if the value should not be kept in memory, it won't be.

- [x] Identify at least two more "code smells" anywhere in the app, beyond the globals above. Fix them, and explain why they were bad and how your fix addresses that.

**Questions** (depend on the tasks above)

- [x] What is the difference between `var`, `let`, and `const` in terms of scope and reassignment?
      Give a concrete example — from this codebase or a hypothetical grounded in a pattern you saw
      — of a bug that `var`'s scoping rules make _possible_ and `let` would prevent.
      See above #8
- [x] What is an "accidental global," and how does non-strict-mode JavaScript allow it to happen by simply forgetting a keyword? Now that your code runs as ES modules (which are always strict mode), what happens instead if you make that same mistake?
      See above #8
- [x] "The code technically works" and "the code is clean" are not the same bar. Give one concrete example from this app of something that worked correctly but was still worth refactoring — and explain what real cost the messy version has (bug risk, onboarding time, review difficulty...).
      See above #8

      I found two real listener leaks: the evidence list re-attaches its click handler on every render, and the timeline modal re-attaches its click handler every time it opens. Both are classic “it works once, then multiplies actions” smells, so I’m fixing them at the source.

      Evidence list listener duplication in evidence.js
      Timeline modal listener duplication in timeline.js

      1) Code smell: duplicate click listeners on every render
      In the evidence view, renderEvidenceList() was doing this each time it re-rendered:

      it replaced the list HTML
      then it called container.addEventListener("click", handleEvidenceListClick);
      That meant each re-render added another click handler to the same container.

      Why it was bad:

      one click could fire multiple handlers
      filters/sorts/re-renders stacked behavior
      users could trigger the same action several times unintentionally
      it is a classic event-listener leak / code smell
      Fix:

      I attach the listener once using a guard flag (evidenceListHandlerAttached)
      the render logic still updates the HTML, but it does not keep stacking listeners
      This keeps the event delegation pattern, but removes the repeated registration.

      2) Code smell: modal click listeners kept piling up
      In the timeline quick-view modal, each time a modal opened, it added a fresh click handler to the same modal element.

      Why it was bad:

      open/close cycles could produce multiple handlers
      one click could trigger multiple open/full-detail flows
      the console log showed the number of active listeners growing
      this is another obvious “handler leak” smell
      Fix:

      I attach the modal click handler only once per modal instance with a guard flag
      the same handler checks whether the click is on the close button, backdrop, or “open full evidence” button
      This keeps the modal behavior while removing duplicate event registration.

---

## Demo 9 — Refactor nested Promises to `async`/`await`

**Tasks**

- [x] Find the most deeply nested chain of `.then()` calls in the data-loading code. Before touching it, sketch/describe its shape (how many levels deep, and what has to succeed before the next level even starts).

      The deepest chain is in `loadCorePeopleAndLocations()`: it does `fetch(case.json)` -> `caseRes.json()`
      -> `fetch(people.json)` -> `peopleRes.json()` -> `fetch(locations.json)` -> `locationsRes.json()`.
      The next fetch does not start until the previous JSON parse succeeds, so the chain is 3 nested
      async levels deep before the state is updated and the dashboard/dropdowns are repopulated.

- [x] Rewrite it as an `async` function using `await`, preserving its exact current behavior — **including** that it currently loads its requests one after another rather than in parallel (don't fix that yet, that's a later exercise).

      I changed the loader to `async`/`await` and kept the same sequential order: case → people → locations, then the app rerenders. I also converted the evidence and timeline loaders to `async`/`await` while preserving their original `.catch()` and `.finally()` behavior.

- [x] Do the same conversion for at least one more place in the app that currently uses `.then()`/`.catch()`/`.finally()`, making sure any error handling the original had is still present.

      I also converted the app startup sequence in `app.js` from `.then()` chaining to `async`/`await`, and the delayed evidence-search request in `evidence.js` to the same pattern. The original sequencing and logic stayed the same: load all data before rendering, and only apply the most
      recent search result if it is still the newest request.

- [x] Verify with the debugger (a breakpoint inside your new `async` function, stepping through with the Call Stack panel open) that the order of operations is unchanged from before your refactor.

**Questions** (depend on the tasks above)

- [x] Explain, in your own words, why the nested `.then()` chain you sketched is harder to reason about than the `async`/`await` version — even though they run identically.

The nested .then() chain has multiple levels of callbacks and return statements, so it is harder to follow which Promise depends on which. With async/await, the same asynchronous operations can be written from top to bottom, making the execution order much easier to read and understand.

- [x] What does the `await` keyword actually do to the execution of the `async` function it's inside? What is the rest of the _program_ doing while that function is "waiting"?

await pauses the async function it is inside until the Promise settles, and then that function continues with the result. It does not block the whole JavaScript program—while that function is waiting, JavaScript can continue handling other code, events, callbacks, and asynchronous operations.

- [x] An `async` function always returns a Promise, even if the code inside it does `return someValue;` for a plain value. Prove you understand this: what do you get if you call `.then()` on the result of your refactored function, and log it?

Calling .then() works because the async function returns a Promise. The callback passed to .then() receives whatever value the async function returned, so logging it shows that resolved value.

- [x] What is the `async`/`await` equivalent of a `.catch()`? What happens at runtime if you forget it and the `await`ed operation rejects?

The async/await equivalent of .catch() is usually a try...catch block. If you don't catch an error and an awaited Promise rejects, the async function stops executing and the Promise returned by that function becomes rejected, potentially causing an unhandled Promise rejection if nothing else catches it.

- [x] Is `async`/`await` code _faster_ than the equivalent `.then()` chain? Explain precisely what does and doesn't change about execution when you do this kind of refactor.

No, async/await is not inherently faster than an equivalent .then() chain. The same asynchronous operations and Promises still happen in the same order; async/await mainly changes how the code is written and read, making sequential asynchronous logic easier to follow.

- [ ] Deliberately break your own refactor by removing one `await` you just added (leaving the function still `async`). What breaks, and how does that relate to a category of bug you may have already dealt with in Demos 2–5 (a Promise being treated as if it were already-resolved data)?

---

## Demo 10 — Refactor to arrow functions

**Tasks**

- [x] Choose at least two functions currently written as `function name(...) { ... }` or `function(...) { ... }`, and rewrite them as arrow functions — pick ones that are actually good candidates.

      I converted several short callback-style functions where `this` was not needed and the lexical-scoping behavior of arrows was a better fit. Examples include the nav click listener in `app.js`, the timeline sort callback in `timeline.js`, and the workspace bookmark handlers, which are all clearer when written as arrow functions.

      I updated the callback-style functions that were good arrow-function candidates in:

      app.js
      timeline.js
      workspace.js
      EXERCISE_1.md
      What changed
      The nav click handler in app.js now uses an arrow function.
      The hypothesis confidence input listener in app.js now uses an arrow function.
      The timeline sort callback in timeline.js was converted.
      The evidence modal click handler in timeline.js was converted.
      The bookmark filter and delayed “Open evidence” actions in workspace.js were converted.
      These are strong arrow-function candidates because they are callback-style functions, they do not rely on this, and they are cleaner to read as short inline callbacks.

      What is an arrow function? Different syntax for writing a JS function.
      Instead of:
      function sayHello() {
            console.log("Hello");
      }

      you write:

      const sayHello = () => {
            console.log("Hello");
      };

      It's just a shorter way of writing. However, not every function should be converted. The important connection to your assignment is: arrow functions don't create their own 'this' -> the element on which the function is executed, while regular function functions can. That's why we don't want to blindly converting every function to an arrow function.

- [x] Convert at least one anonymous `function(e) { ... }` callback passed to `addEventListener` into an arrow function.

      I converted the click handler for the timeline quick-view modal to an arrow function. It is a typical callback case: it reads the click event, decides which target was clicked, and does not rely on `this`.

- [x] Identify **one** function you deliberately did _not_ convert (or would refuse to, if asked), and be ready to explain why it would be unsafe or incorrect as an arrow function.

      A function with this.

**Questions** (depend on the tasks above)

- [x] What is different about how arrow functions handle `this` compared to regular functions? Why does that make arrow functions risky as object methods, but often preferable as callbacks?

Regular functions get their own this depending on how they are called, while arrow functions inherit this from the surrounding scope. This makes arrows risky as object methods that need this to refer to the object, but useful as callbacks when you want to preserve the surrounding this.

- [x] Arrow functions can't be used as constructors (no `new`) and have no `arguments` object of their own. Did either limitation affect which functions you were able to convert? Which one, and how?

No. In this app, neither limitation affected the functions I converted because I chose callbacks that were not used with new and did not use the arguments object.

- [x] Function declarations (`function foo() {}`) are hoisted, so you can call them before they appear later in the file; a `const`/`let` arrow function is not. Did this matter anywhere in your refactor? Explain why or why not.

No, it didn’t matter in my refactor because the arrow functions I converted were callbacks used only after they were defined. None of them needed to be called earlier in the file before their declaration.

- [ ] Show a concrete before/after of one function you converted. Is there any behavioral difference at runtime, or is this purely a readability/style change? Justify your answer.

- [x] This codebase mixes function declarations, function expressions, and (after this exercise) arrow functions, with no single consistent rule. Propose one rule your team could adopt for "when do we use which," and justify it.

Our rule would be: use function declarations for main named functions, and arrow functions for short callbacks. This keeps important functions easy to identify while making callbacks shorter and clearer; regular function expressions would mainly be used when we specifically need their this behavior.

---

## What to bring to class

For each of the 10 demos: your changed code (ideally as commits you can diff live), and the ticked
checkboxes above reflecting what you can genuinely demonstrate and answer _right now_. Be ready to
open DevTools live on request, not just describe what you did.
