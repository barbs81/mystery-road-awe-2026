# Exercise 3 — React Foundations & First Migration

This is the third exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 1 and 2. This exercise adds
React to that project and migrates the **application shell and one representative view (the Dashboard)** to it. The rest of the app stays vanilla TS for now. You'll migrate more of it in Exercises 4 and 5.

Keep a running note of what you changed and why, and commit as you go. Several theory questions ask you to point at a specific decision or diff you made.

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 12, From Static Documents to Rich Web Applications** — PDF pp. 85–88
- **Chapter 13, Rendering and Navigation Architectures** — PDF pp. 90–95
- **Chapter 14, Hybrid Rendering and Modern Web Architectures** — PDF pp. 96–100
- **Chapter 15, React Foundations** — PDF pp. 102–109

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                               | Ready? |
| --- | -------------------------------------------------- | ------ |
| 1   | Historical view of the web                         | ☐      |
| 2   | SSR vs. CSR                                        | ☐      |
| 3   | The virtual DOM                                    | ☐      |
| 4   | SPA vs. MPA: state & routing                       | ☐      |
| 5   | React introduction                                 | ☐      |
| 6   | React + TypeScript entry point in the Vite project | ☐      |
| 7   | Component hierarchy for the whole app              | ☐      |
| 8   | Architecture Decision Record: why SPA/React        | ☐      |
| 9   | Migrate the application shell                      | ☐      |
| 10  | Migrate the Dashboard view                         | ☐      |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Historical view of the web

**Tasks**

- [x] Give a concise explanation of how web applications evolved over the years and place the app from the exercises on the timeline. Justify where you put it.

Early web: Websites were mostly static HTML documents. Clicking a link requested an entirely new page from the server.

Server-rendered dynamic web: Servers began generating HTML dynamically using technologies such as PHP, JSP, or ASP.NET, but navigation still generally caused full-page reloads.

      Example: Old PHP website with a URL like: products.php?id=42
      PHP could look like:
      <h1><?php echo $productName; ?></h1>
      <p><?php echo $productDescription; ?></p>
      The browser doesn't receive the PHP code. PHP executes on the server, and the browser receives ordinary HTML:
      <h1>Laptop</h1>
      <p>A very nice laptop.</p>

      What does "navigation caused a full-page reload" mean?
      Request: /products.php and click: /about.php
      The browser would make a new HTTP request:
      Browser
      ↓
      GET /about.php
      ↓
      Server runs PHP
      ↓
      Server generates an entire HTML document
      ↓
      Browser receives it
      ↓
      Old document is replaced with the new document
      The browser received and rendered a new HTML document.
      It doesn't necessarily mean every page was literally a .html file on disk. A URL such as about.php could dynamically generate the HTML page. The important point is that navigating normally meant requesting a new document from the server.

AJAX era: JavaScript and AJAX allowed browsers to request data and update parts of a page without reloading everything. Libraries such as jQuery made this easier, leading to much more interactive web applications.

      AJAX: JavaScript makes an HTTP request in the background without the browser loading a new page, meaning when parts of the page need to be refreshed or uploaded, only this part would be updated.

      User clicks "Show more"
        ↓
      JavaScript sends HTTP request
        ↓
      Server returns some data
        ↓
      JavaScript receives it
        ↓
      JavaScript updates part of the DOM
        ↓
      No full-page reload

      jQuery was used for .get commands and passing endpoints as parameters, however, now modern Java Script can do it with fetch()

SPA era: Frameworks and libraries such as Angular, React, and Vue made it practical to build large client-side applications from components, manage application state, and change views without full-page reloads.

      Main idea of SPA is the browser initially loads one main HTML document, and then JavaScrip takes responsibility for changing what the user sees.

      Angular example:
      const routes = [
      { path: "dashboard", component: DashboardComponent },
      { path: "people", component: PeopleComponent },
      { path: "evidence", component: EvidenceComponent }
      ];

      Whenever the user navigated from /dashboard to /people, Angular would render PeopleComponent. It didn't ask the server to deliver a completely new HTML document.

Modern web: Today there is a mixture of approaches—CSR/SPAs, SSR, static generation, and hybrid architectures—depending on the application's requirements.

I would place the original Mystery Road application in the SPA/client-side application era, but before its migration to a modern framework.

That's because it already behaves like a Single-Page Application: navigation between #dashboard, #evidence, etc. happens without loading a new HTML page, and JavaScript/TypeScript controls which view is displayed. However, it implements those SPA concepts manually rather than using React or another SPA framework.

      Our application at this point is one HTML page containing a JavaScrip/TypeScrip application inside of it.
      When you first open Mystery Road, the browser loads the main index.html. The TypeScript code then loads the application's data and controls what content is displayed. When I navigate, I am not asking the server for another HTML document.

      index.html
      ↓
      TypeScript application starts
      ↓
      Loads data
      ↓
      Looks at the URL hash
      ↓
      Chooses a view
      ↓
      Renders that view into the existing page

      For example, when the user navigates to /mystery-road-awe-2026/#dashboard
      The important part is #dashboard - this is called the URL hash or fragment
      When I click Evidence it changes to #evidence
      Changing this hash does not cause the browser to request a HTML page from the server.
      Instead JavaScript/TypeScript, using the handleHashChange() function to decide which view to render:
      #dashboard → show Dashboard
      #evidence  → show Evidence
      #people    → show People
      #timeline  → show Timeline

**Questions** (depend on the tasks above)

- [x] What specific problem was AJAX (and libraries like jQuery) solving that plain server-rendered pages couldn't? What new problems did that approach introduce, that SPA frameworks then tried to solve?

AJAX solved the problem of having to reload the entire page whenever the browser needed new data from the server. JavaScript could make requests in the background and update only part of the DOM, making websites much more interactive. Libraries like jQuery made these requests and DOM manipulation easier.

However, as applications became larger, developers had to manually manage lots of DOM updates, event handlers, application state, and navigation, which became difficult to keep synchronized and maintain. SPA frameworks and libraries such as Angular, React, and Vue introduced more structured ways to organize the application into components, manage state, and keep the UI synchronized with that state.

Full-page reloads → AJAX solved that → JavaScript applications became complicated → SPA frameworks helped organize that complexity.

- [x] This app currently uses hash-based routing (`#dashboard`, `#evidence`, ...) with no full page reload between views. Which era does that pattern belong to, and what does it tell you about when this architectural choice became common?

This pattern belongs to the AJAX/early SPA era, when web applications increasingly used JavaScript to change views and content without requesting a completely new page from the server. Hash-based routing became a common way to represent different client-side views in the URL because changing the hash does not trigger a full-page reload.

It shows that SPA-style navigation existed before modern frameworks such as React became dominant. Developers were already building client-side applications and implementing routing manually; frameworks later provided more structured ways to handle the same concepts.

---

## Demo 2 — SSR (Server-Side Rendering) vs. CSR (Client-Side Rendering)

**Tasks**

- [x] Present a short comparison table for Server-Side Rendering and Client-Side Rendering. Explain what the server sends on first request, what the browser has to do before the user sees content, and what happens on subsequent navigation.

See document: Aufgabe 3_Demo 2_1st Question

- [x] Pick one real, publicly known website and argue whether it's (primarily) SSR or CSR, using observable evidence (view source, network tab, etc.).

      AMS - Forschungsnetzwerk - https://forschungsnetzwerk.ams.at/

      Page Source - tells what HTML the server initially sent. If the meantingful page content is already present there, that is evidence of SSR. If it's mostly an empty shell with JavaScript files, that is evidence of CSR.

            - The server has already delivered substantial and meaningful page content:
            <h1>Publikationen in der E-Library</h1>
            - a pure CSR application might look like
            <body>
                  <div id="root"></div>
                  <script src="app.js"></script>
            </body>
            where JS would construct the meaningful content. You can see the app.js being delivered (from cache)
            - Navigating to another page also brings in a HTML document that is substantially rendered.
            - I then put something in the search field and rendered a search list. In this case, the page has something like:
            <div
                  id="searchapp"
                  data-ams-widget-search
                  data-vue-widget-search
                  data-vue-widget-search-ajax-url="/suche.ajax"
                  ...
            ></div>
            The search results are not on the HTML page. The server sends an empty <div id="searchapp"> and tells the browser that the search widget has an AJAX endpoint: /suche.ajax. So this works like:

            Server sends search page
                  ↓
            HTML contains empty #searchapp
                  ↓
            Vue JavaScript starts
                  ↓
            Vue attaches itself to #searchapp
                  ↓
            Vue requests search data from /suche.ajax
                  ↓
            Server returns search data
                  ↓
            Vue renders the search results into #searchapp

            The AMS site is primarily server-side rendered, but it uses client-side rendering for specific interactive components such as search.

      Network tab - does clicking a link cause the Browser to request a new HTML document, or whether JavaScrip fetches data and changes the page without a document upload.

            - Loading the page - forschungsnetzwerk.ams.at is a document, then the Browser request additional artefacts like .png and css files, etc. and then the app.js is loaded.
            - Testing search withot refreshing the network tab: similar behaviour, there is suche.html and then some artefacts like images and then app.js

      So it is very much a server side rendering app with some client-side enhancements.

      Assumption: Modern websites are often hybrid, so the site may be a mix of both.

**Questions** (depend on the tasks above)

- [x] Explain why this exercise application is SSR or CSR and why. Walk through, step by step, what happens between the browser requesting the page and the Dashboard actually being visible.

The Forschungsnetzwerk website is primarily server-side rendered (SSR). When the browser requests a page, the server returns an HTML document that already contains meaningful page content such as headings, navigation, publication information and text. The browser can therefore display this content without JavaScript first having to create it. JavaScript and Vue are also loaded, but they mainly add interactive functionality to parts of the already-rendered page. We also observed in the Network tab that navigating or submitting a search caused a new HTML document, such as suche.html, to be requested from the server.

- [x] Name one real cost of what the architecture pays for that choice (think about what a user with JavaScript disabled, or a slow connection, or a search engine crawler would see) and why.

One cost of using CSR is that the application depends heavily on JavaScript. The server initially provides only the basic page structure, and the browser needs to download and execute the JavaScript before the Dashboard can be rendered. On a slow connection, this can delay when useful content becomes visible. If JavaScript is disabled or fails to load, the Dashboard may not appear at all.

SSR has costs too. The main one is that the server has to do more work.
One cost of SSR is increased server workload. Because the server has to generate the HTML for page requests, more computation happens on the server. With many simultaneous users, this can require more server resources and increase infrastructure costs. For this reason, caching might be an important configuration to have.

---

## Demo 3 — The virtual DOM

**Tasks**

- [x] In your own words (a few sentences, not a copied definition), explain what the virtual DOM is and what problem it solves.

DOM - Document Object Model = browswer's in-memory representation of the HTML page
e.g.,
<body>
  <h1>Dashboard</h1>
  <p>3 pieces of evidence</p>
</body>

DOM (structural representation of the page)
document
└── body
├── h1
│ └── "Dashboard"
└── p
└── "3 pieces of evidence"

Note: JS can manipulate the DOM: document.querySelector("h1").textContent = "Evidence";

What React does is that it changes the live DOM that the user sees.

The virtual DOM is React's in-memory representation of what the page's DOM should look like (not what is currently looks like to the user - real DOM belongs to the browser, virtual DOM belongs to React). When application data or state changes, React creates an updated representation and compares it with the previous one to determine what actually changed. It then updates the Real DOM with only the necessary parts instead of us manually finding and modifying DOM elements.

The main problem it solves is keeping the UI synchronized with application state without developers having to manually manage lots of DOM updates.

Instead of your Mystery Road TypeScript manually doing lots of querySelector, innerHTML, classList, etc., React's internal JS takes responsibility for keeping the DOM synchronized with your application state.

- [x] Find one concrete example in the _original_ vanilla `app.js` (from before Exercise 1) where a small state change (e.g. toggling one bookmark) caused a large chunk of real DOM to be recreated via `innerHTML`, even though only a tiny part of it actually needed to change.

When you click the bookmark star, handleBookmarkClick() changes only a tiny piece of state: whether that evidence item is bookmarked. After saving the bookmark, it calls renderEvidenceList() again.

Important* is what renderEvidenceListe() does.

- Loops through all matching evidence
- Rebuilds the HTMP string for every evidence card
- Does container.innerHTML = html; = replaces the contents of the entire evidence-list container
  The only visual change required is to have the start appear filled in.
  The other evidence cards have not changed at all.
  Also the function renderEvidenceCardHTML() shows that the bookmark state only affects the bookmark button's active class and whether it displays a filled it star or not.
  So in reality, only the bookmark button of one card needed to change from unbookmarked to bookmarked.

This is still present even after Excercises 1 and 2 have been completed.

**Questions** (depend on the tasks above)

- [x] Using the example you found: how would a virtual-DOM-based approach (conceptually, not necessarily React-specific) avoid recreating the parts that didn't change?

Using the bookmark example, a virtual DOM approach would first create a new representation of the UI after the bookmark state changes. It would then compare that new representation with the previous one and see that almost everything is identifical - only one bookmark button changed.

Conceptually:

OLD NEW

Evidence A Evidence A
☆ Bookmark ★ Bookmark ← changed
Title Title
Summary Summary

Evidence B Evidence B
☆ Bookmark ☆ Bookmark ← unchanged
Title Title
Summary Summary

Instead of doing what the current code does - rebuilding every card and replacing the whole evidence container with innerHTML - the virtual DOM can determine that 'only one bookmark / this bookmark differs', and it can update just that corresponding part of th real DOM, leaving the other evidence cards untouched.

- [x] Is the virtual DOM a "faster" way to update the real DOM than directly calling `innerHTML`? Explain precisely what's actually being traded off (think about the diffing work itself).

I would say not necessarily, because the virtual DOM also adds extra work because the library has to create a new virtual representation and compare (diff) it with the previous one before touching the real DOM.

For example:

Virtual DOM approach:

Bookmark state changes
↓
Create new virtual representation
↓
Compare old vs new ← extra computation
↓
Discover only ★ changed
↓
Update that small part of the real DOM

The current innerHTML approach avoids that diffing step, but then replaces the entire evidence list even though only one bookmark changed.

Important* if we manually wrote perfectly targeted DOM code that changed only that one star, that could actually be cheaper than using a virtual DOM. The virtual DOM's big advantage is that the developers don't have to manually manage all those targeted updates themselves.

- [x] Does using a virtual DOM library automatically make your app fast? What could still make a React app slow despite it?

No, the virtual DOM is a strategy for managing UI updates, and not a performance improving feature. It only reduces developer's involvement and reduces unnecessary changes to the real DOM, but the application can still perform poorly, depending on how much content is displayed and when data or resources are large and slow to load. for example, a React App could still:

- render very large lists or complex components (if not handled dynamically CSR with .js),
- cause components to re-render unnecessarily (when state changes, React needs to run components again to figure out what the UI should look like, the virtual DOM only helps afterward by avoiding unnecessary changes to the real DOM --> A component re-render means React runs the component function again and calculates its output. The virtual DOM comparison happens after that and may conclude that nothing visible changed so the DOM does not have to modify. So the app can still waste CPU doing lots of component functions, calculations, and virtual-DOM comparisons even if React ultimately makes very few real DOM changes.),
- perform expensive calculations every time something renders (if calculations in source code),
- make too many or slow network/API requests (without caching strategy),
- load very large JavaScript bundles or images (without caching strategy).

---

## Demo 4 — SPA vs. MPA: state & routing

**Tasks**

- [x] Diagram or illustrate live how navigation currently works in this app: what triggers a view change, what code runs, and what does _not_ happen (that would happen in a classic multi-page site).

User is on:
#dashboard

        ↓

Clicks "Evidence"

        ↓

URL hash changes:
#dashboard → #evidence

        ↓

Browser fires the "hashchange" event

        ↓

handleHashChange() runs

        ↓

Code checks the hash:
"What view should be active?"

        ↓

currentPage becomes "evidence"

        ↓

Code hides the Dashboard
and shows/renders the Evidence view

        ↓

User sees Evidence

Important* is what does not happen:

NO new HTML document is requested
NO full-page reload occurs
NO navigation to evidence.html occurs

The same JavaScript application keeps running. This is why the assignment describes the current routing as hand-built hash routing: handleHashChange() decides which view to display and the code manually changes CSS classes to show/hide the appropriate view.

In a classic multi-page application, it would instead be more like:

Click Evidence
↓
Browser requests /evidence.html
↓
Server sends a new HTML document
↓
Browser replaces the current document
↓
New page loads

DevTools → Network, click between Dashboard and Evidence, and point out that changing #dashboard to #evidence does not cause a new document request.

- [x] List every piece of state in the current app that would be lost on a full page reload, versus what's preserved (hint: check what's in `localStorage` versus what's only in memory).

localStorage - can survive the reload:

- bookmarks
- saved notes
- saved hypothesis draft

looking for calls to localStorage.setItem() and localStorage.getItem(), there is code like:
localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
when the application starts:
var raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
Same pattern for notes:
localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
var raw = localStorage.getItem(STORAGE_KEY_NOTES);

- URL hash/current route (not in localStorage, but can survive reload)
  Because #dashboard is not JavaScript state and not localStorage. It's part of the browser's URL. When you reload, the browser requests the page again, but the URL in the address bar still contains #dashboard.

lost/reset after full reload

- current filtered evidence results
- current opened evidence detail
- current people/locations tab
- search text and selected filters
- timeline filter/order selections
- loading/render bookkeeping such as evidenceViewLoading, viewRendered, listener counters
- any unsaved hypothesis form changes

These are stored in temporary application memory or the DOM, and not all are state variables. These are ordinary in memory variables.

**Questions** (depend on the tasks above)

- [x] In a traditional multi-page app, where does "the current page's data" live between requests? Where does it live in this SPA instead, and what are the consequences of that difference (for good and for bad)?

In a traditional multi-page application, the current page's data is typically associated with the server and the HTML document returned for each request. When the user navigates to another page, the browser requests a new document and the server provides the data needed for that page. In this SPA, much of the current data and UI state lives in JavaScript memory and the DOM in the browser, while some persistent state such as bookmarks, notes, and saved hypotheses is stored in localStorage. The advantage is that navigation can be faster and smoother because the application can change views without reloading the whole page and can keep state while navigating. The disadvantage is that client-side state has to be managed carefully: temporary state can be lost on a reload, and the application must keep its data, state, URL, and UI synchronized.

- [x] This app currently implements routing by hand (`handleHashChange()`, a `switch`-like chain of `if`s, and manually toggling CSS classes). What is a router library actually responsible for that this hand-rolled version does _not_ handle?

The current app implements only basic routing manually: it reads the URL hash, determines which view should be active, and toggles CSS classes to show or hide views. A router library provides a structured mapping between URLs and application views or components and handles additional concerns such as route parameters, nested routes, redirects, unknown routes, and navigation/history behavior. This reduces the amount of manual routing logic and makes routing easier to maintain as an application becomes more complex.

- [x] If the user hits the browser's back button right now, what happens in this app, and why?

Because your routing is based on the URL hash, the browser keeps each hash change in its navigation history. If you right-click the back-button, you can see the Browsers navigation history <--

#dashboard → #evidence → #people

If you press Back, the browser changes the URL back to: #evidence

That hash change triggers the browser's hashchange event, which your app listens for:
window.addEventListener("hashchange", handleHashChange);

Then handleHashChange() runs again and displays the Evidence view.
---

## Demo 5 — React introduction

**Tasks**

- [x] Read enough of the React docs (or equivalent) to write, from scratch, a single tiny component (it can live in a throwaway sandbox, not necessarily this project yet) that renders a piece of static data as JSX. No state, no props even, just to prove you can write and reason about JSX.

React defines a component as essentially a JavaScript function whose name starts with a capital letter and which returns JSX. JSX is the HTML-like syntax used to describe what React should render.

function CaseTitle() {
return <h1>Mystery Road Investigation</h1>;
}

That's a valid tiny React component.

function CaseTitle() { --> This is a normal JavaScript/TypeScript function. Capital C matters because React treats capitalized JSX names as components.

return <h1>Mystery Road Investigation</h1>; --> Instead of returning a number/string/object like an ordinary function might, it returns JSX describing UI.

I could then re-use your component inside another component like an HTML element:

function App() {
return <CaseTitle />;
}

Compare React to current JS implementation:

container.innerHTML = `
  <h2>Mystery Road</h2>
  <p>Evidence collected: 12</p>
`;

function CaseSummary() {
return (
<section>
<h2>Mystery Road</h2>
<p>Evidence collected: 12</p>
<p>Case status: Open</p>
</section>
);
}

With React we're describing what the UI should look like, rather than manually telling the DOM container what HTML to insert. That declarative approach is one of the central ideas.

- [x] Identify, in your own words, what "component" means in React, and how it differs from a plain JavaScript function that happens to return an HTML string (which is essentially what several functions in the old `app.js` did, e.g. `renderEvidenceCardHTML()`).

A React component is a reusable unit of UI, usually written as a function that returns JSX describing what should appear on the page. React understands the returned JSX as part of its component tree and is responsible for rendering it and keeping the real DOM synchronized when the component changes.

A plain JavaScript function such as renderEvidenceCardHTML() only returns an HTML string. The application then has to manually insert that string into the DOM, for example using innerHTML, and manually update it again when the data changes. So although both can describe some UI, a React component participates in React's rendering system, while an HTML-string function is just producing text that the application must manage itself.

Old approach:
data → function → HTML string → manually put into DOM

React:
data → component → JSX → React manages rendering/update

**Questions** (depend on the tasks above)

- [x] What is JSX, actually? What does it compile to?

JSX is basically syntax that lets you describe UI using HTML-like markup inside JavaScript/TypeScript. The browser does not understand JSX directly, so a build tool transforms it into ordinary JavaScript.

function CaseTitle() {
return <h1>Mystery Road</h1>;
}

Conceptually, that JSX is transformed into JavaScript that creates a React element, roughly:

function CaseTitle() {
return React.createElement("h1", null, "Mystery Road");
}

Important* JSX is not HTML, and <h1>...</h1> in a .tsx file isn't an HTML string either. It's syntax that gets transformed into JavaScript which creates a description of the UI.

- [x] Compare your tiny component to the old `renderEvidenceCardHTML(ev)` function (string concatenation returning an HTML string). What is fundamentally different about how each one's output becomes real DOM?

The fundamental difference is who turns the output into real DOM and manages it afterward.

The old function works roughly like this:

renderEvidenceCardHTML(ev)
↓
returns a STRING
"<div class='card'>...</div>"
↓
the code uses innerHTML
↓
browser parses that string
↓
real DOM elements

So the application manually decides when and where to insert or replace that HTML.

With the React component:

CaseSummary()
↓
returns JSX
↓
JSX becomes React elements (JavaScript objects)
↓
React compares/manages the UI
↓
React updates the necessary real DOM

renderEvidenceCardHTML(ev) returns an HTML string, which our code must manually insert into the DOM using something like innerHTML. The browser then parses that string and creates DOM elements. A React component returns JSX, which is compiled into JavaScript that creates React elements describing the desired UI. React then takes responsibility for turning that description into real DOM and updating the DOM when necessary. So the old approach manually generates and inserts HTML strings, while the React approach describes the UI and lets React manage its DOM representation.

- [x] What does it mean that "components are just functions" in React? What would break if a component's function body had a side effect (e.g. mutated a global variable) every time it rendered?

“Components are just functions” means React can call the component function whenever it needs to figure out what the UI should look like.

For example:

function CaseTitle() {
return <h1>Mystery Road</h1>;
}

React calls CaseTitle() → gets a description of the UI → uses that to render/reconcile the UI.

Important* rendering should be pure: calling the component with the same inputs should describe the same UI without changing anything outside the component.

For example:

let renderCount = 0;

function CaseTitle() {
renderCount++; // side effect
return <h1>Mystery Road</h1>;
}

Assumption might be that the component appears once and so the function runs once, and the renderCount is always equal to 1

But React is allowed to render components more than once. It may re-render because a parent rendered, state changed, or because React is checking/rendering work that doesn't ultimately become a DOM update.

So one could unexpectadly get:

CaseTitle() called
→ renderCount = 1

CaseTitle() called again
→ renderCount = 2

but perhaps only one meaningful DOM update happened

That's why rendering a component should describe UI, not cause external changes.

Summary:

Saying that React components are functions means React calls the component function to obtain a description of the UI it should render. These functions should be pure during rendering: they should calculate their JSX from their inputs without changing external state. If a component mutated a global variable every time it rendered, the result would be unreliable because React may call the component function multiple times and a render does not necessarily correspond one-to-one with a DOM update. The side effect could therefore happen more often than expected and make application state unpredictable.

Important* This also connects directly to the earlier question about unnecessary re-renders: a component function being executed does not necessarily mean React changed the real DOM.

---

## Demo 6 — React + TypeScript entry point in the Vite project

**Tasks**

- [x] Add React and TypeScript support to the existing Vite project from Exercise 2 (the right Vite plugin, `tsx` support, React types).

At the start of the Demo 6, I had following:

Vite
TypeScript
vite.config.ts
tsconfig.json with strict TypeScript
Vanilla application in .ts files
No React dependencies yet
No React Vite plugin yet
My tsconfig currently includes only js/**/*.ts, not .tsx

Install React: npm install react react-dom

react contains React itself—the component/rendering model
react-dom is the part that connects React to the browser DOM. Later I'll use it to mount <App /> into my actual HTML page.

React and React DOM installed successfully

Next, install Vite plugin for React --> this shows Vite how to properly process React/JSX during development and builds.

npm install --save-dev @vitejs/plugin-react

--save-dev is appropriate because the Vite plugin is a development/build dependency; it isn't code my deployed application directly needs at runtime.

Install TypeScript definitions for React. React is JavaScript at runtime, but TypeScript needs type information so it can understand things like JSX elements and React APIs.

npm install --save-dev @types/react @types/react-dom

After installation, configure vite.config.ts, tsconfig.json, rather than create new configuration files.

Additions to vite.config.ts:
import react from "@vitejs/plugin-react"; --> imports the plugin I just installed
plugins: [react()], --> tells Vite when processing the project the React plugin should be used

Additions to tsconfig.json for .tsx:
Change "include": ["js/**/\*.ts"] to "include": ["js/**/_.ts", "js/\**/_.tsx"]

React components containing JSX normally use the .tsx extension:
.ts → normal TypeScript files
.tsx → TypeScript files containing JSX/React markup

Verify the project builds: npm run build

- [x] Create a minimal entry point (e.g. a root `<App />` component mounted into the page) that
      renders _something_ visible, without removing the working vanilla app yet.

1. Give React somewhere to mount: React needs an HTML element that it can take control of.
   Add: <div id="react-root"></div> in index.html

Conceptually:

index.html
│
├── #react-root ← React will control this
│
└── existing HTML ← vanilla TypeScript still controls this

Inside of the js folder, create ReactApp.tsx --> The file will contain TypeScript + JSX
Add:
export default function App() {
return <h1>Hello from React!</h1>;
}

Important* the index.html react div is not yet connected to App.tsx

Then, create the React entry point that actually mounts <App /> into the <div> So inside js folder add a file called react-main.tsx and add:

import { createRoot } from "react-dom/client";
import App from "./ReactApp";

const rootElement = document.getElementById("react-root");

if (rootElement) {
createRoot(rootElement).render(<App />);
}

What this does:

find #react-root in index.html
↓
createRoot(rootElement)
↓
tell React to control that element
↓
render <App />
↓
App returns <h1>Hello from React!</h1>

When I add this to the file, I have the following error:

Cannot use JSX unless the '--jsx' flag is provided.

I configured TypeScript to include .tsx files, but I have not told TypeScript how to handle JSX

Inside tsconfig.json add:
"jsx": "react-jsx" in compiler options

Now I have a React component and a React entry point. There is one final connection to make:
In index.html add:
<script type="module" src="/js/react-main.tsx"></script>

Now both entry points are loaded: Vanilla App and React App

- [x] Decide and document how the two versions coexist during the migration (e.g. a separate route/ flag to view the React version, or a full swap-over. Your call, but be ready to justify it).

I would choose 'coexistence during migration, rather than a full swap-over'
I have a working vanilla TypeScript app and this exercise 3 asks that we migrate parts of it, replacing everything would create unnecessary risk.

During the migration, I will keep the existing vanilla TypeScript application working and mount the React application separately. This allows individual parts of the application to be migrated and tested incrementally without breaking the existing functionality. Once the required React components and views are working correctly, the corresponding vanilla implementation can be replaced. I chose this incremental approach because it makes it easier to compare the old and new implementations and reduces the risk of breaking the whole application at once.

What I have right now:

index.html
│
├── Existing vanilla application
│ └── still works normally
│
└── #react-root
└── ReactApp
└── Hello from React!

**Questions** (depend on the tasks above)

- [x] What did you actually have to install and configure to get JSX compiling through Vite? What is each piece responsible for?

To get JSX compiling through Vite, I installed react and react-dom, the Vite React plugin @vitejs/plugin-react, and the TypeScript type packages @types/react and @types/react-dom. react provides the React component and rendering model, while react-dom connects React to the browser DOM. @vitejs/plugin-react adds React/JSX support to Vite's development and build process. The @types packages provide TypeScript with type information for React and React DOM. I also configured vite.config.ts to use the React plugin and updated tsconfig.json to include .tsx files and use "jsx": "react-jsx", which tells TypeScript how JSX should be handled.

Piece Responsibility
react React itself: components, JSX-based UI model, etc.
react-dom Connects React to the browser's DOM
@vitejs/plugin-react Lets Vite properly process React/JSX
@types/react React type information for TypeScript
@types/react-dom React DOM type information for TypeScript
plugins: [react()] Activates the React plugin in Vite
**/*.tsx in include Makes TypeScript include your TSX files
"jsx": "react-jsx" Tells TypeScript to use React's modern JSX transform

- [x] How does your `<App />` component get from source code onto the actual page? Trace the path from your `.tsx` file to the DOM.

ReactApp.tsx
↓
react-main.tsx
↓
index.html
↓
Vite processes the TSX/JSX
↓
Browser executes the JavaScript
↓
React finds #react-root
↓
React creates/updates the real DOM

My <App /> component is defined in ReactApp.tsx and imported into react-main.tsx. The index.html loads react-main.tsx as a module. Vite processes the TypeScript and JSX into JavaScript that the browser can execute. In react-main.tsx, document.getElementById("react-root") finds the empty <div id="react-root"> in the HTML. createRoot() tells React to manage that DOM element, and .render(<App />) tells React what UI should appear there. React then creates the necessary real DOM elements inside #react-root.

in index.html
<div id="react-root">
  <h1>Hello from React!</h1>
</div>

in react-main.tsx
createRoot(rootElement).render(<App />);

createRoot() = “React, take control of this part of the DOM.”
.render(<App />) = “This is what I want React to display there.”

- [x] What decision did you make about how the vanilla and React versions coexist during migration, and why? What would go wrong with an opposite choice?

I chose an incremental migration where the existing vanilla TypeScript application continues to work while React is introduced alongside it. React currently has its own root, and individual parts of the application can gradually be migrated and tested before their vanilla implementations are replaced. I chose this because it reduces risk and allows the old and new implementations to be compared while keeping the application functional. With the opposite approach—a full swap-over immediately—we would have to replace much more working functionality at once. That would make regressions more likely and make it harder to determine whether a problem was caused by React setup, the migration itself, or existing application logic.

---

## Demo 7 — Component hierarchy for the whole app

**Tasks**

- [x] Design and diagram a proposed component hierarchy for the **entire application**, not just the part you're building this exercise. E.g. pages (one per current view) and the reusable components you expect to extract (cards, badges, buttons, form controls, etc.), even though most of them won't be built until Exercises 4 and 5.

What is component hierarchy? Tree for the UI. The application currently has five main views: Dashboard, Evidence, People/Locations, Timeline, and Workspace.

App
│
├── Header
├── Navigation
│
└── Current Page
├── DashboardPage
├── EvidencePage
├── PeoplePage
├── TimelinePage
└── WorkspacePage

App -> represents the whole application
Header, Navigation -> belong to the application shell because they appear regardless of which page I am viewing.
Dashboard,Evidence,People,Timeline,Workspace -> represent the five views that the current hash router switches between.

THEN: The Dashboard already contains distinct pieces: The current renderDashboard() already renders a case summary, multiple stat cards and review progress

DashboardPage
│
├── CaseSummary
├── StatGrid
│ ├── StatCard
│ ├── StatCard
│ ├── StatCard
│ └── ...
├── ReviewProgress
├── RecentEvidence
└── RecentTimeline

The entire diagram would be:

App
│
├── Header
│
├── Navigation
│
├── DashboardPage
│ ├── CaseSummary
│ ├── StatGrid
│ │ └── StatCard
│ ├── ReviewProgress
│ ├── RecentEvidenceList
│ │ └── EvidenceCard
│ └── RecentTimelineList
│ └── TimelineItem
│
├── EvidencePage
│ ├── EvidenceSearch
│ ├── EvidenceFilters
│ │ └── FilterSelect
│ ├── EvidenceList
│ │ └── EvidenceCard
│ │ ├── StatusBadge
│ │ └── BookmarkButton
│ └── EvidenceDetail
│ ├── StatusBadge
│ └── NotesEditor
│
├── PeoplePage
│ ├── PeopleLocationTabs
│ ├── PeopleList
│ │ └── PersonCard
│ └── LocationList
│ └── LocationCard
│
├── TimelinePage
│ ├── TimelineFilters
│ │ └── FilterSelect
│ └── TimelineList
│ └── TimelineItem
│
└── WorkspacePage
├── BookmarkedEvidenceList
│ └── EvidenceCard
└── HypothesisForm
├── FormSelect
├── ConfidenceSlider
├── EvidenceSelector
├── TextArea
└── SaveButton

Reusable components: Doesn't necessarily mean used on multiple pages. It can also mean the same UI structure is repeated several times with different data.

StatCard — reusable even though it's primarily used on the Dashboard, because the Dashboard contains several cards with exactly the same structure but different data: Evidence items, People, Locations, Bookmarked, Reviewed. The vanilla implementation already effectively does this through repeated calls to statCardHTML(...). Pasted code In React, that naturally becomes one StatCard component receiving value and label as props.

In JS, we have:

statCardHTML(allEvidence.length, "Evidence items");
statCardHTML(allPeople.length, "People");
statCardHTML(allLocations.length, "Locations");

And in React:

<StatCard value={allEvidence.length} label="Evidence items" />
<StatCard value={allPeople.length} label="People" />
<StatCard value={allLocations.length} label="Locations" />

EvidenceCard — Evidence is shown in the main Evidence page, but evidence also appears in other contexts such as recent evidence and bookmarked evidence. Instead of recreating the markup each time, the same card could receive an Evidence object as a prop.

Badge / StatusBadge — useful for displaying statuses consistently. The Dashboard already uses a badge for the case status. The Evidence Page has status badges. Timeline has status badges, etc.

- [x] For at least 5 components in your diagram, briefly note what data/props each one would need and where that data comes from.

Component Props/data it would need Where the data comes from

CaseSummary Case title, status, summary Case data loaded from case.json

StatCard A numeric value and a label Calculated from loaded app data, e.g. number of evidence items, people, locations, bookmarks

EvidenceCard An Evidence object and bookmark state Evidence loaded from evidence.json; bookmarks from application/localStorage state

StatusBadge A status/severity value, e.g. critical Passed down from the case/evidence object being displayed

TimelineItem A timeline event containing things such as date/time and event information Timeline data loaded from the timeline JSON

PersonCard A Person object containing the person's information
People data loaded from the people JSON

LocationCard A Location object containing the location information

**Questions** (depend on the tasks above)

- [x] What criteria did you use to decide something should be its own component versus staying inline inside a bigger one?

I made something its own component when it represented a meaningful part of the UI, was repeated or reusable, had its own data or behavior, or was complex enough that separating it would make the code easier to understand and maintain. For example, StatCard is a separate component because the same structure is repeated with different values, and EvidenceCard can be reused in several parts of the application. Smaller markup that is only used once and has no separate behavior or reuse can stay inline inside its parent component. I also tried not to split the UI into components unnecessarily, because making every small element a component would add complexity without much benefit.

Rule: Separate it when it has its own responsibility, behavior, or reuse. Keep it inline when splitting it wouldn't provide a clear benefit.

- [x] Pick one component in your diagram that appears in more than one place in the app. What made you extract it instead of duplicating its markup, and how does that compare to how the original vanilla app handled (or didn't handle) that same duplication?

I extracted EvidenceCard because evidence is displayed in several parts of the application. Instead of duplicating similar markup each time, one reusable component can receive an evidence item as a prop and display it consistently. This also means that if the design of an evidence card changes, it can be changed in one place. In the original vanilla app, evidence markup was generated separately in different rendering functions, so similar evidence displays were handled manually rather than through one shared UI component.

- [x] Your diagram includes components you won't build until later exercises. Why is it useful to design the whole hierarchy now rather than only diagramming what you're about to build?

Designing the whole hierarchy now gives us a plan for how the application will eventually be structured. It helps identify which components can be reused across different pages and how the different parts of the application relate to each other. This can prevent us from designing components now that would need to be heavily changed or duplicated when we migrate the other pages in later exercises. The hierarchy can still be adjusted later as the application develops.

---

## Demo 8 — Architecture Decision Record: why SPA/React

**Tasks**

- [x] Argue whether an SPA built with React is actually the right architecture for _this specific app_, given what it does.

A React SPA is appropriate for the Mystery Road app because it is a highly interactive application with several views, such as Dashboard, Evidence, People, Timeline, and Workspace, that share the same application state. Users frequently navigate between these views, filter and inspect evidence, bookmark items, write notes, and build a hypothesis. An SPA allows these interactions and navigation to happen without repeatedly loading new HTML documents. React also helps manage the repeated UI and state through reusable components such as EvidenceCard and StatusBadge. However, React does add complexity compared with the original vanilla TypeScript implementation, so for a very small or mostly static site it would probably be unnecessary. For this app, the amount of interaction, shared state, and reusable UI makes that additional structure worthwhile.

Main argument: it’s not a good choice simply because React is popular; it’s a good choice because this app behaves more like an interactive application than a collection of mostly independent web pages.

- [x] Include honest trade-offs or downsides of the SPA/React choice for this app, not just the benefits.

A React SPA is appropriate for the Mystery Road app because it is highly interactive and has several views that share application state. Users navigate between views, filter and inspect evidence, bookmark items, write notes, and build a hypothesis. React can make this easier to manage through reusable components and structured state handling.

However, there are trade-offs. React adds dependencies, build configuration, and architectural complexity that the vanilla TypeScript version does not have (and architectural complexity that the vanilla TypeScript version does not have).

Which component owns this data?
↓
Should it be state or a prop?
↓
Which child components need it?
↓
Where should an event handler live?
↓
When should something re-render?

The browser also needs to download and execute more JavaScript, and developers need to understand React concepts such as components, props, state, and effects. Some parts of Mystery Road are relatively simple and could work perfectly well with vanilla TypeScript, so React may be more technology than those individual features require. There is also migration effort because the existing application already works.

Overall, I think the React SPA architecture is justified for this app because its interactive features, shared state, and reusable UI benefit from React's structure, but those benefits need to be weighed against the additional complexity and JavaScript overhead.

**Questions** (depend on the tasks above)

- [x] What would you lose by keeping this app as server-rendered vanilla HTML/JS instead? What would you lose by choosing React specifically over a _different_ SPA approach (e.g. vanilla JS with a router, or a lighter library)?

What would you lose by keeping this app as server-rendered vanilla HTML/JS instead?
If Mystery Road were server-rendered, we would lose some of the smooth client-side experience of the SPA. Navigation between the Dashboard, Evidence, People, Timeline, and Workspace could require new page requests, and sharing state such as filters, selected evidence, bookmarks, or other UI state between pages would require more work. For an application where the user frequently moves between related data and interacts with it, keeping the application loaded in the browser is useful. On the other hand, server rendering could reduce the amount of JavaScript required and make the initial HTML less dependent on JavaScript.

What would you lose by choosing React specifically over a _different_ SPA approach (e.g. vanilla JS with a router, or a lighter library)?
Choosing React means accepting its additional dependencies, concepts, and bundle size. Mystery Road could still be an SPA using vanilla TypeScript with a router—in fact, the original application already has basic hash-based SPA routing—or it could use a lighter library. Those approaches could achieve similar navigation with less framework overhead. What we would lose by choosing React is some simplicity and control over the implementation. The trade-off is that React provides a well-established component and state model, which becomes more useful as the application grows.

- [x] If this app needed to support users on very low-end devices or poor connections as a hard requirement, would you stick with SPA or change the architecture? Why or why not?

If supporting very low-end devices or poor connections were a hard requirement, I would reconsider using a React SPA and probably favor a more server-rendered or progressively enhanced architecture. A React SPA requires the browser to download, parse, and execute JavaScript before much of the application can function, which can be expensive on slow devices and unreliable connections. Server-rendered HTML could provide useful content with less client-side processing and JavaScript.

I would still use JavaScript for interactive features such as filtering, bookmarking, and the workspace, but only where it provides a clear benefit. This would reduce the amount of JavaScript sent to the user while keeping the important interactive functionality.

---

## Demo 9 — Migrate the application shell

**Tasks**

- [x] Build the header/branding, the navigation bar, and a routing skeleton (even a minimal one, a full router library is not required yet) in React + TypeScript. - React + TypeScript header and branding - React navigation bar - Active navigation state - Hash-based routing skeleton - Existing dashboard, evidence, people, timeline, and workspace views preserved
      *The main implementation is in ReactApp.tsx and index.html
- [x] Wire it up so navigating between (stub) pages actually changes what's rendered, mirroring the current five views even though only the Dashboard will have real content this exercise. - Dashboard - shows the existing real dashboard content - Evidence - shows a react stub page title evidence - People & Locations - shows a react stub page titled 'Timeline' - Workspace - Shows a React Stub Page titled 'Workspace' - The active navigation button updates correctly - Legacy content is hidden when viewing the React Stub pages, so pages do not overlap
      *The main updates ReactApp.tsx, and styles.css

**Questions** (depend on the tasks above)

- [x] How does "the current view" get tracked in your React shell? Compare this directly to how `currentPage` and `handleHashChange()` did it in the vanilla version? What's actually different, and what's superficially different but conceptually the same?
      In the React shell, the current view is tracked with the currentRoute state variable in ReactApp.tsx.
      const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);
      getCurrentRoute() reads the current URL hash:
      function getCurrentRoute(): string {
      const route = window.location.hash.slice(1);
      return routes.some(({ id }) => id === route) ? route : "dashboard";
      }
      When a navigation button is clicked, the hash changes:
      function navigateTo(route: string): void {
      window.location.hash = route;
      }
      The React component listens for that change:
      useEffect(() => {
      const handleRouteChange = () => setCurrentRoute(getCurrentRoute());
      window.addEventListener("hashchange", handleRouteChange);
      return () => window.removeEventListener("hashchange", handleRouteChange);
      }, []);
      Calling setCurrentRoute() causes React to re-render. The updated value is then used to:
      -Add the active class to the selected navigation button.
      -Set aria-current="page" on the active button.
      -Decide whether to show the real Dashboard.
      -Render a stub page for Evidence, People & Locations, Timeline, or Workspace

Comparison with the vanilla version:
In the vanilla version, the current page is stored in state.currentPage. The implementation is in state.ts and navigation.ts.
The vanilla handleHashChange() function:

Reads the hash from window.location.hash.
-Checks whether it is one of the valid views.
-Stores the result in state.currentPage.
-Removes the active class from all legacy view sections.
-Adds active to the matching section.
-Adds the active class to the matching navigation button.
-Calls the appropriate rendering function, such as renderDashboard() or renderTimeline().

Conceptually:
state.currentPage = hash;

is the vanilla equivalent of:
setCurrentRoute(getCurrentRoute());

What is actually different?
The main difference is who updates the DOM:

Vanilla version: handleHashChange() manually queries and modifies DOM elements using methods such as querySelectorAll(), classList.add(), and classList.remove().
React version: the route is stored in React state, and React re-renders the affected JSX automatically when currentRoute changes.
Both versions still use the URL hash as the routing mechanism. The React shell is therefore not using a full router library; it is a small hash-based routing implementation.

Currently, both systems coexist:

React tracks currentRoute and renders the header and stub pages.
The vanilla handleHashChange() still tracks state.currentPage and controls the original Dashboard content.
The React shell hides the original legacy content when a stub route is selected.
So the React version mirrors the purpose of currentPage and handleHashChange(), but replaces manual DOM manipulation with React state and conditional rendering.

- [x] What happens in your shell if a user navigates to a view that doesn't exist? How does that compare to the vanilla app's fallback-to-dashboard behavior?
      In the React shell, an invalid view falls back to the Dashboard.
      This happens in getCurrentRoute() in ReactApp.tsx:
      function getCurrentRoute(): string {
      const route = window.location.hash.slice(1);
      return routes.some(({ id }) => id === route) ? route : "dashboard";
      }
      The function:
      -Reads the value after # in the URL.
      -Checks whether it matches one of the five valid route IDs.
      -Returns the requested route if it is valid.
      -Returns "dashboard" if it is invalid or missing.

The React shell then sets currentRoute to "dashboard", displays the Dashboard, and marks the Dashboard navigation button as active. The URL hash itself is not automatically rewritten, so the browser may still display #mystery even though the Dashboard is being shown.

The vanilla application behaves similarly in navigation.ts:
let hash = window.location.hash.replace("#", "");

if (!validViews.includes(hash)) {
hash = "dashboard";
}

state.currentPage = hash;

It also:

Treats an invalid or missing hash as "dashboard".
-Sets state.currentPage to "dashboard".
-Activates the Dashboard section.
-Activates the Dashboard navigation button.
-Therefore, both implementations have the same fallback behavior: an unknown view does not produce an error or blank page; it displays the Dashboard instead. The main difference is that React derives the displayed content from currentRoute, while the vanilla version manually updates the DOM through handleHashChange().

---

## Demo 10 — Migrate the Dashboard view

**Tasks**

- [x] Rebuild the Dashboard view as React components (using your hierarchy from Demo 7 as a starting point), rendering the case summary, stat cards, review progress, and the recent evidence/timeline lists. Reading from the same data your app already loads.
- [x] Confirm it renders correctly with real data, and that navigating away and back doesn't lose or corrupt anything.

**Questions** (depend on the tasks above)

- [x] Where does the Dashboard's data (case info, evidence, timeline) come from in your React version, and how does it get to the components that render it? Is this the final architecture you intend to keep, or a placeholder you know you'll change in a later exercise?

The Dashboard data comes from the same JSON files used by the original vanilla application:

Case information comes from public/data/case.json
Evidence comes from public/data/evidence.json
Timeline events come from public/data/timeline.json
People and locations come from their corresponding JSON files

The loading flow is:

dataLoader.ts fetches the JSON files.
The loaded data is stored in the shared state object from state.ts:

state.caseData = caseJson;
state.allEvidence = data;
state.allTimeline = data;

The React components in ReactApp.tsx read directly from that shared state:
state.caseData
state.allEvidence
state.allTimeline

Once the loader finishes a data request, it dispatches an appdatachange event. The React shell listens for that event and updates its state version, which causes the Dashboard components to render again with the loaded data.

The component structure is approximately:

App
├── Header
└── RouteContent
└── Dashboard
├── CaseSummary
├── StatCard
├── ReviewProgress
├── RecentEvidence
└── RecentTimeline

Is this the final architecture?
No. This is a transitional architecture for this exercise.

It allows the React Dashboard to reuse the existing vanilla application’s data-loading system while the project is being migrated incrementally. However, the React components currently depend directly on a mutable global state object and a custom browser event. That is not the ideal long-term React architecture.

In a later exercise, this could be improved by:

Moving data loading into React hooks or a context provider
Storing the loaded data with useState or useReducer
Passing data to components through props
Handling loading and error states directly in React
Removing the dependency on the vanilla renderer and custom appdatachange event
So the current design is deliberate reuse of the existing application infrastructure, but it is expected to be replaced or refactored as more of the application is migrated to React.

- [x] The old vanilla dashboard had a real bug where it could show stale numbers because it only re-rendered on a view's _first_ visit (a manual render-cache flag). Does your React version have an equivalent risk? Why or why not, given how React re-renders?

The React version does not have the same manual “render only on first visit” bug.

The old vanilla implementation used a cache such as viewRendered.dashboard. Once the Dashboard had rendered once, later visits could skip renderDashboard(), even if the underlying data had changed. That could leave stale counts or lists on screen.

In the React version:

currentRoute is React state.
Navigating away and back changes currentRoute.
React re-renders RouteContent and Dashboard whenever the route state changes.
The Dashboard components read the current values from state, so they recalculate the counts and lists during the render.
Data loading dispatches an appdatachange event, which increments a React state version and forces the Dashboard to render again when loaded data changes.
Therefore, there is no equivalent “first visit only” render cache in the React Dashboard.

However, there is still a limitation because this is a transitional architecture. The data itself is stored in a mutable global object:

state.allEvidence
state.allTimeline
state.caseData

React does not automatically detect arbitrary mutations to that object. If another part of the application changed state.allEvidence but did not:

Change a React state value,
Change the route, or
Dispatch appdatachange,
then the Dashboard could still display stale data until another render was triggered.

So the comparison is:

Old vanilla problem: an explicit render-cache flag prevented later renders.
Current React behavior: React re-renders on route changes and data-change notifications, so normal navigation does not cause stale Dashboard values.
Remaining architectural risk: direct mutation of shared global state without notifying React.
A future React architecture would eliminate this limitation by keeping the loaded data in React state, context, or a reducer and passing it to the Dashboard components through props.

- [x] What, if anything, does your React Dashboard do differently from the vanilla one in terms of _when_ it recalculates derived values (like the review-progress percentage)?

The React Dashboard and vanilla Dashboard calculate the review percentage using the same basic formula:
reviewedCount / totalEvidence * 100

The difference is when that calculation happens.

Vanilla Dashboard
The vanilla version calculates the value inside renderDashboard():

const progressPct =
state.allEvidence.length === 0
? 0
: Math.round((reviewedCount / state.allEvidence.length) * 100);

That function must be called manually. In the old implementation, the Dashboard could fail to recalculate if its first-render cache flag prevented renderDashboard() from running again.

React Dashboard
The React version calculates the value during every render of the Dashboard component:

const reviewedCount = state.allEvidence.filter(
(evidence) => evidence.status.toLowerCase() === "reviewed",
).length;

const progress = state.allEvidence.length
? Math.round((reviewedCount / state.allEvidence.length) * 100)
: 0;

React recalculates it whenever the Dashboard renders, including when:

The application first loads.
The user navigates back to Dashboard.
The data loader dispatches the appdatachange event.
The React state version changes.
This means the React version does not use a manual viewRendered.dashboard flag. Its derived values are recalculated as part of the normal React render cycle.

The current implementation does not use useMemo, which is appropriate here because the calculation is small. If the evidence list became very large or the calculation expensive, useMemo could be considered, but it would not be necessary for this application.

---

## What to bring to class

For each of the 10 demos: your changed code/diagrams/documents (ideally as commits you can show live), and the ticked checkboxes above reflecting what you can genuinely demonstrate and answer _right now_.
