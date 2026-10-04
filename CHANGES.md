# Aufgabe 1

---

BOOK
5.1 Classic scripts vs. module scripts - A normal <script> behaves like the older shared/global JavaScript environment. <scrip type ="module"> enables ES modules, so files can explicitly import and export things. Modules also have their own scope, use strict mode automatically, and are deferred by default. For Assignment 1, I am changing from a classic script into an entry-point module
5.2 Named vs. default exports - an export makes something available to another module. A named export exports specific names, such as export function formatDate() {...}, imported with import { formatDate } ... A default export represents one main exported value and is imported without {}. For task 1, it is important to decide which funtions each file should expose.
5.3 Module scope and live bindings - variables declared ina module belong to that module; they don't automatically become globals. So if allEvidence moves into state.js, evidence.js cannot see it anymore. It will need an appropriate export / import. A live binding means an imported binding reflects updates made to the exported bindings rather than being an unrelated copy.
5.4 Designing module boundaries - which responsibilities belong together? Instead of one large app.js, there should be data.js, state.js, storage.js, utils.js, and seperate view modules. The goal isn't to have many files, but to have files with understandable responsibilities.
5.5 Dependency direction - who needs to import whom? Ideally, lower-level modules such as utilities don't depend on higher level UI modules.
5.6 Circular dependencies - this is when modules depend on each other in circles: A -> B -> C -> A. ES modules can technically handle some cycles, but they make initialization and reasoning harder and can cause errors. For task 1, important to consider this when view modules start importing each other.
5.8 Behaviour-preserving refactoring - change the structure without changing what the program does. This is probably the most important practical rule for task 1. Split into modules, test frequently to make sure the behaviour remains the same.
---------------------------------------------------

The app.js file includes the following:
State
Data loading
Helpers
Navigation
Dashboard
Evidence
People
Timeline
Workspace
localStorage
Event listeners
Startup

It is necessary to group code according to responsibility = module boundary.

js/
app.js - entry point
state.js - shared application state
dataLoader.js - fetch/load JSON
storage.js - localStorage
utils.js - small reusable helpers
navigation.js - hash navigation
views/
dashboard.js
evidence.js
people.js
timeline.js
workspace.js

Notes:

- After changing the structure and adding type="module" to <script> in the index.html file, I was not able to load the different menu items like Evidence, Timeline and was getting an error in the Browser Console. This is because app.js does not treat app.js as a classic script file but executes it as a module script, meaning that the functions inside app.js are not considered global to the HTML file. So the functions have to be explicitly imported / exported now.
- utils.js - move the simplest code first and functions that don't depend on the global state: formatDate(), getStatusBadgeClass(), getRelevanceBadgeClass()
- storage.js, but actually state.js first - keep in mind that the storage functions like saveBookmarksToStorage() depend on global variables (CONSTANTS). Several of the storage functions belong together: saveBookmarksToStorage(), loadBookmarksFromStorage(), saveNoteForEvidence(), loadNoteForEvidence(), loadNotesFromStorage(), loadNoteAsync() --> before doing anything in storage.js, it is important to handle state.js, because storage needs shared state. Dependency is now app.js -> storage.js -> state.js. Move global state variables like bookmarks and notesStore to state.js as a state object, and then add state. in front of state.bookmark and state.notesStore in the existing app.js
- storage.js - extract the localStorage functions into storage.js (extract STORAGE_KEY_BOOKMARKS and STORAGE_KEY_NOTES). Don't move STORAGE_KEY_HYPOTHESIS yet, because it is used in workspace/hypothesis functionality. Also import stae from state.js into storage.js, and move the following functions into storage.js: saveBookmarksToStorage(), loadBookmarksFromStorage(), saveNoteForEvidence(), loadNoteForEvidence(), loadNotesFromStorage(), loadNoteAsync(), export and import them. The CONSTANTS don't have to be exposed in app.js, because they are used only by storage.js
- dataLoader.js - move the remaining "data" state into state.js like allEvidence, allPeople, allLocations, etc. Best to move them into the already existing state object. And change the corresponding variables to state. in the app.js file. Don't move the data loading functions yet because they call a bunch of other functions.
- dashboard.js - it is relatively self-contained and will help move some of the UI from app.js, so that dashboard.js becomes responsible for loading dashboard.js only. Export only renderDashboard and not statCardHTML, because the exported uses the other.
- people.js - cleaner than moving evidence first. Move functions: renderLocations() into people.js, since the other functions have dependencies on other functions. Import and export it.
- utils.js - move evidenceMentionsPerson() to utils.js, import and export
- people.js - import the evidenceMentionsPerson() and the function countEvidenceForperson(), import and export. Move also renderPeople() into people.js. At the bottom of renderPeople() there is a dependency on navigateTo() and renderEvidenceList(), so these have to be refactored too.
- navigation.js - move navigateTo(viewName) into navigation.js, export it and import it to people.js so that the function renderPeople() can use it. Import it temporarily to app.js, because app.js is using navigateTo() still.
- evidence.js - move renderEvidenceList() and renderEvidenceCardHTML(), the functions have dependencies that also have to be handled. In evidence.js also import state, and functions from utils.js. Then import getFilteredEvidence() and keep it private, because it is a dependency.
- utils.js - the evidence.js functions have dependencies findPersonById and evidenceMentionsPerson(). These are general helper functions and should be moved to utils.js (although evidenceMentionsPerson is already there) and made available in evidence.js. Make state available in utils.js. In evidence.js extend the utils.js imports. Make sure findPersonById is still imported from utils.js in app.js
- evidence.js - then move the function handleEvidenceListClick() to evidence.js and then handle its dependencies (handleBookmarkClick and openEvidenceDetail). handleBoomarkClick has a dependency for a function in storage.js, so make sure to import it into evidence.js. It also has a dependency findEvidenceId() which should be moved to util.js since it is a general helper function. Also import it to app.js, since there is still a dependency there.
- state.js - there is a currentPage dependency in the previous function moved to evidence.js that should be movd into state. And replace currentPage in app.js with state.currentPage, and also add state. to the handleBookmarkClick function saved in evidence.js.
- evidence.js - move openEvidenceDetail() & export, closeEvidenceDetail(), renderEvidenceDetail(), statusOptionHTML(), saveCurrentNote() to evidence.js. They form one logical group: opening, rendering, closing and interacting with an evidence in detail. Those functions use dependencies from storage.js, so add those. The function renderEvidenceDetail() also uses findLocationById(), which should be moved from app.js to util.js and imported into evidence.js
- Fixing the renderEvidenceDetail() function since it generates inline handlers like onclick="closeEvidenceDetail" and onclick="saveCurrentNote()" -> module scoped functions aren't automatically available as globals, so they have to be replaced with event listeners. Add Event listeners after section.innerHTML = html
- evidence.js - move the function populateEvidenceDropdowns() from app.js into evidence.js and export because it is still used in app.js. Move handleSortChange(), clearFilters(), simulateAsyncSearch() and handleSearchInput() and the variable latestSearchRequestId to evidence.js. Export those that app.js is still using. Note filteredEvidence is still in app.js and a dependency in handleSortChange(). Move it to evidence.js.
- timeline.js - move populateTimelineDropdowns(), renderTimeline(), certaintyBadgeClass(), openEvidenceModal() into timeline.js and add the state, utils, navigate, and evidence imports that timeline.js needs. Import timeline.js into app.js. Move the modalCloseListenerCount to the timeline.js as it is only used there.
- workspace.js - move renderWorkspace(), renderBookmarksList(), renderNotesList() and import from state, navigation, evidence into workspace.js. export the function renderWorkspace, because the other ones are just dependencies. Import the exported function into app.js
- workspace.js - move the remaining hypothesis-related code into it. Move the constant STORAGE_KEY_HYPOTHESIS to workspace.js, also from app.js. and export what the app.js needs, and add the imports in the app.js from workspace.js
- people.js - move switchPeopleTab() from app.js, also move the variable var currentPeopleTab = "people"; to people.js. Mark the function with export and upate the import in app.js.
- workspace.js - move the functions showLoadingOverlay(), hideLoadingStep(), loadAllData(), as well as loadCorePeopleAndLocations, loadEvidenceData, loadTimelineData from app.js to workspace.js. Some of the functions have dependencies on the other functions. IMport the renderDashboard dependency from dashboard.js, and from evidence.js, timeline.js, and workspace.js Export only loadAllData to app.js. One of the functions has a dependency populateAllDropdowns() that is still in app.js. It should be imported to the dataLoader because otherwise we would have an "upward" dependency and that is not good practice in modular design. The function populateAllDropdowns does not get called anywhere else, only in dataLoader.js, so moving it there is appropriate.
- navigation.js - move the whole function handleHashChanges to navigation.js and export it. Import all the dependencies it has in state.js, dashboard, evidence, people, timeline, workspace. Also move viewRenedered from app.js to navigation.js as it is a dependency, since only the routing logic needs it.
- Final cleanup - remove all unnecessary gloal variables form app.js and if they are not already in the other files, move them where they are dependencies. Delete no longer needed imports.

Questions:

1. What is the difference between a classic <script> and a <script type="module">
   Classic shares the global scope, while a module script has its own module scope and supports import and export. In our app, this means functions like navigateTo() are not longer available to inline HTML event handlers, and module scripts are also deferred automatically.
2. What happens to allEvidence after splitting into modules?
   After the refactor, another modules must explicitly import the shared state object and access or modify the value using state.allEvidence. If the required variable or import is missing, JS typically thros a RefrenceError, which is useful b/c it exposes hidden dependencies that were previously possible with shared/global scope.
3. Named export vs. default export?
   A named export exports a specific identifier that must be imported by its exported name, while a default provides one main value that the importing module can name itself. I used named exports such as renderEvidenceList from evidence.js because the module provies several related functions rather than having one obvious default export.
4. Why won't modules work when opening index.html with file://?
   ES modules are normally loaded through web-origin rules, and browsers restrict module imports from file://, so the application should be served through an HTTP protocol. thi sis related to the existing fetch() problem: both are affected by browser security/origin restrictions on local files, although module loading and fetch() are separate browser mechanisms.

# Aufgabe 2

Error 1: I am unable to navigate by clicking on the 'Evidence', 'People & Locations', etc. buttons in the Navigation. I can only access the pages if I input the path in the broswer like localhost:3000/#people. In the developer tools console, I have the following error:

(index):29 Uncaught ReferenceError: navigateTo is not defined
at HTMLButtonElement.onclick ((index):29:99)
onclick @ (index):29

Cause: After the refactor, the index.html still contains things like onclick="navigateTo('dashboard')" but the function is now exported from navigation.js and imported into app.js and called inside the relevant HTML element in the onclick attributed. An imported function is not automatically a global 'window' function, so the inline HTML cannot see it and throws the ReferenceError.

Fix: Add window.navigateTo = navigateTo; in the app.js file. This makes the navigateTo function available globally in the browser. When it is imported, it still only exists inside the navigate.js module. When the relevant HTML code is called, the inline onclick looks for navigateTo on the browsers's global window object. It cannot see module-scoped functions. By adding window.navigateTo, it makes it available.

Error 2: I also not when I click on buttons like 'Evidence Catelogue' or 'People & Locations' in the Dashboard. In the developer tools console, I have the following error:

app.js:27 Uncaught TypeError: Cannot read properties of undefined (reading 'getAttribute')
at HTMLButtonElement.<anonymous> (app.js:27:38)

Cause: The problematic code is in the app.js setupEventListeners() function, in this snippet:

var navButtons = document.querySelectorAll(".nav-btn");
for (var i = 0; i < navButtons.length; i++) {
navButtons[i].addEventListener("click", function () {
var targetView = navButtons[i].getAttribute("data-view");
console.log("nav clicked:", targetView);
});
}

var i ist function-scoped and is shared by all of those click callbacks. The loop finishes before you click anything, so when a click eventually happens, i is already equal to navButtons.length, which makes it undefined, since it is outside of the total nav buttons in the array.

Fix: Changing the var to let makes is block-scoped, so that each iteration gets the appropriate i value for its calleback.

Error 3: When I am on the Evidence page and try to get results of the search and I try to choose from the sixth drop-down list that includes choices like Newest first, oldest first, title (a-z) etc. I get the following errors:

Uncaught ReferenceError: handleSortChange is not defined
at HTMLSelectElement.onchange (VM2016 :1:1)

VM2016 :1 Uncaught ReferenceError: handleSortChange is not defined
at HTMLSelectElement.onchange (VM2016 :1:1)

Cause: The index.html has the following code: <select id="sortEvidence" onchange="handleSortChange()"> and while I import it in the app.js from the evidence.js module, I do not give window access to it, so it is not globally visible to inline HTML.

Fix: Add window.handleSortChange = handleSortChange; to app.js

Error 4: When trying to sort the evidence alphabetically, the results remain unsorted, regardles of direction a-z or z-a.

Cause: This happens because renderEvidenceList() calles getFilteredEvidence() and getFilteredEvidence() just constructs a new array and assigns it to filteredEvidence.

Fix: Make sorting happen as part of a getFilteredEvidence, so get all evidence -> apply filters -> apply sorting -> store in filteredEvidence -> return it -> render it. This means, remove sorting from handleSortChange and add it to getFilteredEvidence.

Error 5: When trying to sort by status 'Reviewed', 'Unreviewed' etc. there is an error:
Uncaught ReferenceError: renderEvidenceList is not defined
at HTMLSelectElement.onchange (VM2406 :1:1)

Cause: This happens because in my setupEventListeners(), I have document.getElementById("filterStatus")
.addEventListener("change", renderEvidenceList); however, after that there is also document.getElementById("filterStatus")
.setAttribute("onchange", "renderEvidenceList()"); The second line creates an inline onchange="renderEvidenceListe()" which tries to find a global renderEvidenceList, which is not availabe because it is inside the module system, hence not global.

Fix: Remove the second line, since I already have a global event listener.

Error 6: In the People & Locations page, clicking on view takes the user back to the Evidence page with the error:

people.js:64 Uncaught ReferenceError: renderEvidenceList is not defined
at people.js:64:9

Cause: The renderPeople() function in people.js does navigateTo('evidence') and includes the function renderEvidenceList. People.js no longer automatically nows functions defined or exported by evidence.js.

Fix: Add import { renderEvidenceList } from "./evidence.js"; at the top of people.js

Error 7: Change the review status or relvance of a specific evidence item causes:

Uncaught ReferenceError: viewRendered is not defined
at HTMLSelectElement.<anonymous> (evidence.js:263:5)
(anonymous) @ evidence.js:263

evidence.js:258 Uncaught ReferenceError: viewRendered is not defined
at HTMLSelectElement.<anonymous> (evidence.js:258:5)

Cause: in evidence.js the status/relevance handlers contain if (viewRendered.evidence) renderEvidenceList(); The viewRendered stayed somewhere else after the refactor and evidence.js no loger has access to it. The error happenes after ev.status or ev.relevance has already been changed.

Fix: the viewRendered was no longer available after the refactor in evidence.js. Removing code if (viewRendered.evidence) and replacing with rendering evidence function.

Error 8: Saving details of evidence like review status or relevance does not save after a refresh

Cause: When ev.status = e.target.value is executed, the change exists only in the JS object current memory, but nothing saved the status back to evidence.json or to localStorage, meaning change status happens and the state.allEvidence object changes in memory, the UI shows the new status, but after a refresh evidence.json load again and the original status returns. Status change is not persistent.

Fix: ???

Questions:

1. Explain — in your own words — the difference between a _reference_ and a _copy_ in
   JavaScript, and how that distinction explains what you observed.
2. Walk through the exact user actions and system state that trigger the bug. Could you have
   found it by reading the code top-to-bottom without running it? Why or why not?

# Aufgabe 3

# Aufgabe 3.1

The task says to fix a bug caused by how the app handles a Promise-based operation.

Explanation/definitions:
The assignment probably tests whether there is an understanding of the order in which JS executes things.
Synchronous = this type of code executes in order, meaning one code snippet has to finish before another one starts. For example, if information is needed for a variable that is executed in step 2, the program has to wait for step 1 to complete in order to collect the information needed for step 2.
Asynchronous - some operations can take time and they could be started and allowed to continue and the result will be dealt with at a later time. Those actions include fetching a JSON file, contacting a serverm waiting for a timer, etc.
Promise - is a JS object that represents a result that may be available later. Promises generally move through states: pending/waiting, operation completed, either fulfilled/rejected.
Getting the value out of a promise is generally done with .then() -> asyncLoad().then(result) { console.log(result) }
Callback - is a function you give to other code so that it can call that function later or when something happens. Main points is that the programmer does not call the function themselves, but instead gives it to another function so that the browser can call it later. For example, when a click happens, the browser should do following:
button.addEventListener("click", function () {
console.log("Button clicked!");
});
Promises are ususally used in async operations.

Observation in the assignment application:

- When the startpage of the project is loaded, the console shows the following message and refers to app.js:69:
  First note preview: Promise {<fulfilled>: ''}
  [[Prototype]]: Promise
  [[PromiseState]]: "fulfilled"
  [[PromiseResult]]: ""
  The line Prototype: Promise can be further opened to see catch: f catch(), constructor Promise() finally: finally() then then() , etc. -> These are methods available to a Promise object.
  catch() -> handles a promise being fullfilled or rejected (sends an error message)
  then() -> what should happen on fulfillment/success.
  finally() -> code to run once the Promise settles regardless of fullfillment or rejection
  Meaning: the browser is showing the inside/state of the promise object. It has been fulfilled but the result is an empty string. This is state and result.
  A promise usually can be fulfilled or rejected.

At this point this is a clue, but I am not sure if it works incorrectly. The relevant code in app.js is:
function initApp() {
loadBookmarksFromStorage();
loadNotesFromStorage();
setupEventListeners();

loadAllData().then(function () { -> loadAllData is a function in dataLoader.js and is responsible for loading application data (evidence, people, etc.). loadNoteAsync = user input data
handleHashChange();
var firstNote = loadNoteAsync("E01");
console.log("First note preview:", firstNote);
});
}
Important to check loadNoteAsync to see what it does: the function is in storage.js:
export function loadNoteAsync(evidenceId) {
return new Promise(function (resolve) { -> the Promise constructor expects a function as its argument (the function is anonymous and its body on the next line)
resolve(state.notesStore[evidenceId] || ""); -> the result of the promise is notesStores Array element at index evidenceId or if not then an empty string
});
}

Problem is loadNoteAsync("E01") in storage.js creates and returns a Promise. The Promise resolves with the note stored at state.notesStore["E01"], or an empty string if there is no note. In app.js, the returned Promise is assigned directly to firstNote, and console.log("First note preview:", firstNote) executes without waiting for the Promise's resolved value. Therefore, the console logs the Promise object instead of the actual note, meaning it does not wait for the Promise to be resolved first. This is why instead of the Console printing out a Note or "" (empty string), it prints out Promise { <fulfilled>: ''} because it is printing out the Prommise object, that also includes its resolved value.

Because loadNoteAsync("E01") returns a Promise (not the result of the Promise), the variable in which the return value of the function loadNoteAsync is saved is a Promise, not its result.

Solution: Use .then(). We want to use the resolved value inside the Promise rather than assigning the Promise itself to fistNote.

The code:
var firstNote = loadNoteAsync("E01");
console.log("First note preview:", firstNote);

needs to be changed to:
loadNoteAsync("E01").then(function (firstNote) { -> this is the callback
console.log("First note preview:", firstNote);
});

Use .then(). We want to use the resolved value of the Promise rather than assigning the Promise itself to firstNote.

The .then() method registers a callback that executes when the Promise returned by loadNoteAsync("E01") is fulfilled. The resolved value of the Promise is passed into the callback as the firstNote parameter. The console.log() inside the callback can therefore print the actual note value rather than the Promise object.

loadNoteAsync("E01")
↓
returns Promise
↓
Promise resolves with note
↓
.then(...) callback executes
↓
firstNote = resolved note
↓
console.log(firstNote)

After the change is made the result of the promise is returned, rather than the Promise object itself.

Questions:

1. Explain the async operation this bug revolves around: what does it fetch/return, and at what point in its lifecycle (before it starts, while pending, on success, on failure) does the bug actually happen? How did you confirm that, rather than just guessing?

The asynchronous operation revolves around loadNoteAsync("E01"). This function returns a Promise that resolves with a note stored in state.notesStore["E01"], or with an empty string ("") if no note exists. The bug happens when the Promise is returned but its resolved value is not accessed correctly. In the original code, the Promise itself is assigned to firstNote and immediately passed to console.log(). Therefore, firstNote refers to the Promise object rather than the note that the Promise resolves with.

I confirmed this using the browser console. With the original code, refreshing the application consistently produced First note preview: Promise {<fulfilled>: ''}. Inspecting the object showed that it was a Promise with [[PromiseState]]: "fulfilled" and [[PromiseResult]]: "". I then changed the code to use .then(), so that console.log() runs inside the callback and receives the resolved value as its firstNote parameter. After refreshing again, the console displayed First note preview: with no Promise object after it. The blank value was expected because there was currently no saved note for E01, so the Promise had resolved with an empty string. This confirmed that the problem was not that the Promise failed. The problem was that the original code used the Promise object instead of consuming its resolved value

# Aufgabe 3.2

The dataLoader.js has a function called:

export function loadAllData() {
showLoadingOverlay("Loading case file…"); -> JS searches for elements with specific Ids. If element with Id loadingText found, change content to msg. If element with Id loadingOverlay is found, then remove its css class 'hidden' to make it visible.
state.loadingStepsRemaining = 2; -> sets the shared/global state property loadingStepsRemaining to 2. Keeps track of how many loading steps still need to finish.
return loadCorePeopleAndLocations().then(function () { -> loadCorePeopleAndFunctions is all about creating Promise Objects that when eventually resolved, get saved in global variables state.caseData, state.allPeople, state.allLocations. The function also includes a function to hide the overlay is loading steps less or equal to 0. The function also renders the dashboard with state variables like: state.caseData state.allEvidence, state.allPeople, state.allLocations, state.allTimeline, state.bookmarks, while those functions may still not be fully completed ....
loadEvidenceData(); -> loads evidence data from JSON and renders the Dashboard with the evidence data collected - also uses Promises
loadTimelineData(); -> loads timeline data from JSON and renders the Dashboard with the timeline data collected - also users Promises ... The only difference here is that the function also hides the loading step, just like loadCorePeopleAndLocations.
});
}

It seems like because there are all of these asynchronous functions and at the same time the overlay is being monitored, not all steps are being executed as they should. The intended logic appears to be:

loadingStepsRemaining = 2

show overlay
↓
first loading step finishes
↓
2 → 1
↓
keep showing overlay
↓
second loading step finishes
↓
1 → 0
↓
hide overlay

In the current implementation, the loading steps are minused 1 during the 'loadCorePeopleAndLocations' function execution and during the execution of 'loadTimelineData', but not during the 'loadEvidenceData' execution. So the overlay can effectively say that loading is finished, even if evidence data is still being loaded.

It is also important to point out that loadTimelineData() has a return statement at the beginning, whereas loadEvidenceData() does not. The fetch happens internally, so it gives the caller undefined in return.

Additinally, loadAllData returns loadCorePeopleAndLocations, but it does not return anything from its callback function, there is no return statement in front of loadTimelineData and no return statement in front of loadEvidenceData.

Additionally, loadAllData executes handleHashChange. This function is basically the App's navigation/rendering function, it looks at the URL hash and determines which page shoud be shown and renders that page, so #evidence. It checks if that's a real page, anything invalid sends you to the dashboard. The most important part of the function are the if (hash === ....) else if ... statements because this part renders the selected page. So if the user opens #timeline, the function renderTimeline() will be executed. This could mean that views are rendered prior to data being available.

To summarise up to now:

- loading overlay does not track evidence completion
- promise chain does not return/track evidence or timeline completion

How did I go about it:

- [x] Reproduce the bug reliably and write down the exact steps.
      In order to see if everything loads accurately, I used the trottle mechanism in the developer tools and set the speed to 2G to see how the page reacts with a slower connection
      I then placed the tab on Alles to see what is loaded and in which sequence and I deactivated cache
      I first loaded http://localhost:3000/ and then loaded the other pages - I did not notice any problems with pages loading, only that the #people page loaded slowly, but that could have been due to the connection
      I also noticed in the app.js initApp() function that following loadAllData().then ... inside the callback function is handleHashChange() which is the loading of the UI for all of the pages of the app. This means that if handleHashChange() calls renderEvidenceList() and that needs state.allEvidence, then that variable will be undefined. This tells me that all data for the page, including the core app data as well as evidence and timeline should be loaded prior to this function executing, however, when I included console.log in loadAllData(), and loadEvidenceData() and loadTimelineData(), I noticed that loadAllData() completed prior to evidence and timeline data loading. The console order was:

  loadAllData finished
  First note preview: <empty string>
  TIMELINE FINISHED
  EVIDENCE FINISHED

  There appears to be an incorrect Promise completion order. For example loadEvidenceData() starts a Promise chain with fetch() but doesn't return it. So if another function does var result = loadEvidenceData(), then the result would be undefined. Secondly, the loadAllData() function starts the evidence and timeline loading, but doesn't return anything that represents those operations.

  Better said:
  The problem appears to be caused by the Promise chains not being properly returned/chained. loadEvidenceData() starts a Promise-based fetch operation without returning its Promise, and loadAllData() starts the evidence and timeline loading operations inside its .then() callback without returning Promises representing their completion. As a result, the Promise returned by loadAllData() can fulfill while these asynchronous operations are still pending.

- [x] Form a hypothesis for the root cause, expressed in terms of the async operation involved (what
      was supposed to happen once it resolved, and what actually happened instead), and confirm it.

  See my notes above.

- [x] Fix it, and verify the fix actually addresses the async handling rather than papering over the
      symptom (e.g. don't just add a delay or a retry if the real issue is a missing state update).

      - Make loadEvidenceData() return its Promise - currently it starts fetch() but the function itself returns undefined because it doesn't return anything. Place the keyword return in front of fetch()
      - The function loadTimelineData() already resturns its Promise, so nothing has to be done here
      - Make loadAllData() wait for both of its Promises
      - Add Promise.all before loadEvidenceData() and loadTimelineData(). This way Promise.all receives the two Promises and produces one Promise that waits for both of them to finish, so laodCorePeopleAndLocations() will finish and then start Evidence Promise (return) and Timeline Promise (return) -> Promise.all will collec them when they finish, and only then will loadAllData get resolved. Once that is done, then the initApp's .then() callback handleHashChange() will be executed. Without placing return in front of Promise.all, we woul actually be recreating the same problem on a higher level, we'd create a Promise that waits for both operations but fails to connect to it to the outer Promise Chain.

      Verifying if the fix worked:
      The console now shows the following:
      TIMELINE FINISHED
      EVIDENCE FINISHED
      loadAllData finished

Question:
Explain the async operation this bug revolves around: what does it fetch/return, and at what point in its lifecycle (before it starts, while pending, on success, on failure) does the bug actually happen? How did you confirm that, rather than just guessing?

- The bug revolves around the asynchronous loading of the evidence and timeline data. loadEvidenceData() fetches evidence.json, onverts the response to JSON, and then stores the resultign data in state.allEvidence.
- loadTimelineData() similarly fetches timeline.json, converts the response to JSON, and stores it in state.allTimeline
- The bug happens while these asynchronous operations are still pending. After the core data has loaded, loadAllData() starts loadEvidenceData() and loadTimelineData(), but originally it did not return a Promise that represented the completion of these two operations. loadEvidenceData() also did not return its own fetch Promise. As a result, the Promise returned by loadAllData() could fulfill while the evidence and timeline requests were still pending.
- I confimed this using console logging rather than assuming it from the code. Before the fix, I observed:
  loadAllData finished
  TIMELINE FINISHED
  EVIDENCE FINISHED
  This showed that the .then() attached to loadAllData() was executing before the callbacks that populate the timeline and evidence state had executed.
  I fixed this by returning the Promise from loadEvidenceData() and returning Promise.all() for the evidence and timeline loading operations from loadAllData(). After the fix, the console order changed so that the evidence and timeline operations completed before loadAllData() was reported as finished.
- It should be noted that the Promises don't fail, but the relationship between them is wrong, even when the Evidence and Timeline are pending, loadAllData report completion.

# Aufgabe 4

See above # Aufgabe 3.1 -> in the console, the Promise object was being returned in the console.log rather than the result of the Promise.

Question:
How did you notice this bug in the first place, given that nothing looked broken? Why is "nothing looks broken" not the same as "nothing is broken"?
It did not look broken, but I just noticed that the console was giving out some information that I did not understand, so I investigated it. I usually always look in the console as the first place when I start an application, because it can reveal errors that are not immediately visible in the application.

# Aufgabe 5

# Aufgabe 6

`console.log` is a debugging tool, not _the_ debugging tool. This demo is about using the browser's
actual debugger or a VS Code extension for debugging — ideally on one of the bugs from Demos 2–5.

**Tasks**

- [ ] Set at least one real breakpoint (not a `console.log`) inside a function connected to a bug
      you investigated, and step through it line by line.
- [ ] Use "Step over", "Step into", and "Step out" at least once each, on purpose, and notice the
      difference.
- [ ] While paused at a breakpoint, open the Call Stack panel and explain, for a real example, "who
      called this function, and with what."
- [ ] Use a **conditional breakpoint** or a **logpoint** at least once (e.g. only break when a loop
      variable equals a specific value, or a specific ID is being processed).
- [ ] While paused, use the Scope/Watch panel (or hover over variables) to track a value across
      several steps of execution, and edit a variable's value live to test a hypothesis before
      writing the actual code change.

**Questions** (depend on the tasks above)

- [ ] What's the difference between "Step over" and "Step into"? Give a concrete example from this
      app where using the wrong one would waste your time.
- [ ] What is the call stack, and how did reading it help you figure out where a value came from or
      why a function ran when it did?
- [ ] What is a conditional breakpoint, and why is it more efficient than repeatedly hitting
      "resume" to reach the case you care about?
- [ ] What's the difference between a breakpoint you set in the DevTools UI and a `debugger;`
      statement written directly in the source code? When would you prefer one over the other?
- [ ] Describe a moment where `console.log` alone would _not_ have been enough to find a bug, but
      stepping through with the debugger was. What did the debugger show you that logging couldn't?
