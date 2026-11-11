# Exercise 6 — Effects, Data Fetching & a Backend

This is the sixth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 3–5. All 5 views should already be fully working in React, reading their data from the static `data/*.json` files. This exercise replaces those static files with a small **Node.js backend**, and uses that to properly teach effects, loading/error/empty states, and request cancellation. Things that are hard to demonstrate convincingly against files that can only ever be "instant" or
"404."

**Scope of the backend, deliberately kept small:** a minimal Node server (Express or equivalent) that serves the same 5 JSON files as **read-only** REST endpoints. No write endpoints, no persistence. Bookmarks, notes, and the hypothesis draft stay in `localStorage` exactly as before. Only _reading_ the case data moves to the network. **The backend runs locally in development only, it is not deployed.** Exercise 2's GitHub Pages workflow still builds and deploys the static frontend. Wiring up a real deployed backend is out of scope here.

## Corresponding manuscript reading

The closest corresponding sections in the course manuscript:

- **Chapter 6, Promises, `async`/`await`, and Error Flow** — especially error handling, cleanup, cancellation, and relevance, PDF pp. 47–52
- **Chapter 13, Rendering and Navigation Architectures** — “SPA communication flow” and “State in long-lived applications,” PDF pp. 91–93
- **Chapter 15, React Foundations** — “Function components and purity” and “React owns its root DOM,” PDF pp. 104 and 108
- **Chapter 16, React Component Design and Routing** — “Conditional rendering,” PDF p. 110

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.
These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                           | Ready? |
| --- | ---------------------------------------------- | ------ |
| 1   | Render logic vs. effects                       | ☐      |
| 2   | `useEffect` mental model & dependency arrays   | ☐      |
| 3   | Cleanup: timers & subscriptions                | ☐      |
| 4   | Build the read-only Node backend               | ☐      |
| 5   | Consume the backend from React                 | ☐      |
| 6   | Loading, error, and empty states               | ☐      |
| 7   | Request races & cancellation                   | ☐      |
| 8   | Extract a reusable custom hook                 | ☐      |
| 9   | Separate UI, application logic, and API access | ☐      |
| 10  | Data-flow wrap-up & a written UX decision      | ☐      |

---

###

EXPLANATION OF EXERCISE 6 - Demos 1 - 5

Ich lese zuerst die fünf Demo-Aufgaben aus `EXERCISE_6.md` und fasse danach die zentralen Konzepte und ihren Zusammenhang verständlich zusammen.

Exercise 6 focuses on moving from a purely static React application to one that communicates with a local backend. The first five Demos build these concepts step by step.

## Demo 1 — Render logic vs. effects

### Main concept

Understand the difference between:

- **Render logic:** calculating what the UI should display.
- **Side effects:** doing something outside the calculation of JSX.

Render logic should be predictable and free of external changes:

```tsx
const visibleEvidence = evidence.filter(...);
```

Examples of side effects include:

```tsx
localStorage.setItem("key", value);
document.title = "Dashboard";
window.addEventListener("resize", handler);
fetch("/api/evidence");
```

These should not happen directly during render because React may run a component more than once. If the component writes to storage, starts a request, or registers a listener during render, the operation could happen repeatedly or unexpectedly.

### Rule

> Render calculates the UI from current props and state. Effects synchronize React with something outside React.

A derived value such as the filtered Evidence list is **not** a side effect. It only calculates a value and does not change anything outside the component.

---

## Demo 2 — `useEffect` and dependency arrays

### Main concept

Learn when an effect runs and how its dependency array controls that behavior.

```tsx
useEffect(() => {
  // effect code
}, []);
```

Runs after the component mounts, and its cleanup runs when it unmounts.

```tsx
useEffect(() => {
  // effect code
}, [currentView]);
```

Runs after the initial render and whenever `currentView` changes.

```tsx
useEffect(() => {
  // effect code
});
```

Runs after every render.

### In this exercise

A simple example could synchronize the browser title with the current route:

```tsx
useEffect(() => {
  document.title = "Investigation Portal";
}, []);
```

The dependency array tells React which values the effect uses from the component. React compares dependency values between renders using reference/value comparison. If a dependency changes, React runs the effect again.

### Important rule

Every reactive value used by an effect should normally appear in its dependency array. Omitting one can cause the effect to use an old value.

---

## Demo 3 — Cleanup

### Main concept

Some effects create ongoing work or subscriptions. They must return a cleanup function.

Example:

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    console.log("checking data");
  }, 1000);

  return () => {
    window.clearInterval(timer);
  };
}, []);
```

The cleanup function runs when:

1. The component unmounts.
2. The effect is about to run again because a dependency changed.

Another example is an event listener:

```tsx
useEffect(() => {
  function handleResize() {
    console.log(window.innerWidth);
  }

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

Without cleanup, the application could:

- register the same listener multiple times,
- execute duplicated handlers,
- update an unmounted component,
- make old requests or timers continue running,
- produce confusing repeated behavior.

The general rule is:

> If an effect starts something that continues after the effect function finishes, the effect should usually clean it up.

---

## Demo 4 — Build the read-only Node backend

### Main concept

Create a local backend that serves the case data through HTTP endpoints instead of reading the JSON files directly from the frontend.

Possible endpoints:

```text
GET /api/case
GET /api/evidence
GET /api/people
GET /api/locations
GET /api/timeline
```

The backend reads or serves the same data shapes as the existing JSON files.

The frontend then communicates with the backend over HTTP:

```text
React frontend
    ↓ fetch()
Node backend
    ↓
case/evidence/people/location/timeline data
```

### Why not only use static JSON?

Static files usually respond very quickly and predictably. That makes it difficult to demonstrate:

- loading states,
- network delays,
- failed requests,
- error handling,
- request cancellation,
- race conditions.

The backend should therefore support testing controls such as:

```text
/api/evidence?delay=2000
/api/evidence?error=true
```

The backend is development-only. It is not necessarily deployed with the GitHub Pages frontend.

### CORS

Because Vite and the backend may run on different ports, the browser may treat them as different origins:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

The backend may need CORS configuration so the frontend is allowed to request data from it.

---

## Demo 5 — Consume the backend from React

### Main concept

Replace the frontend’s static data-loading path with API requests inside `useEffect`.

Before:

```text
React
  ↓
local data/*.json files
```

After:

```text
React component
  ↓ useEffect
fetch("/api/evidence")
  ↓
Node backend
  ↓
setEvidence(...)
  ↓
React re-renders
```

A simplified component might look like this:

```tsx
const [evidence, setEvidence] = useState<Evidence[]>([]);

useEffect(() => {
  async function loadEvidence() {
    const response = await fetch("http://localhost:3000/api/evidence");
    const data = (await response.json()) as Evidence[];
    setEvidence(data);
  }

  void loadEvidence();
}, []);
```

### What happens in order?

1. React renders the component initially.
2. The component has no fetched data yet.
3. React runs the effect after the render.
4. The effect starts the `fetch()` request.
5. The backend returns the evidence data.
6. The code calls `setEvidence(data)`.
7. React re-renders the component.
8. The Evidence list is now rendered from the fetched state.

### What changes compared with static data?

When data came from local files, the application could often assume that the data was immediately available or that loading would be very fast.

With a backend request, the component must account for additional states:

```text
loading
error
loaded with data
loaded successfully but empty
```

It also needs to handle:

- failed requests,
- delayed responses,
- cancellation when the component unmounts,
- potentially multiple requests,
- whether a response is still relevant.

## Overall progression

The first five Demos follow this sequence:

```text
Demo 1:
What belongs in render and what belongs in an effect?

Demo 2:
When does an effect run?

Demo 3:
How is an effect cleaned up?

Demo 4:
How can a backend provide realistic network conditions?

Demo 5:
How does React consume backend data?
```

The core architecture becomes:

```text
Node backend
  ↓ HTTP response
useEffect
  ↓ setState
React state
  ↓ props/context
React components
  ↓
rendered UI
```

One important distinction from Exercise 5 is that bookmarks, notes, and the hypothesis draft remain browser-side user data in `localStorage`. Exercise 6 moves only the read-only case data to the backend.

###

## Demo 1 — Render logic vs. effects

**Tasks**

- [x] Find (or deliberately write, then remove) an example of a **side effect performed directly during a component's render**. For example, mutating a variable outside the component, calling `console.log` for debugging on every render, or reading `localStorage` inline in the function body instead of in an effect, and explain why it's a side effect even though it "seems to work."

Ich werde Datenweg teilweise ändern:
Vorher:
React → lokale JSON-Dateien

Nachher:
React → Node-Backend → JSON-Daten

RENDER LOGIK (Aufgabe: state + props -> JSX für die Benutzeroberfläche):
Bestehende Render Logik (direkt im Component)
return (
<HashRouter>
...
</HashRouter>
);
Erstellen von Werten aus vorhanden Daten gehört zu Render Logik:
const nextData = ...

SIDE EFFECTS: Ein Side Effect ist eine Aktion, die etwas außerhalb des React-Renderings verändert oder mit etwas außerhalb von React kommuniziert.
z.B.: fetch("data/evidence.json")
und
loadBookmarksFromStorage();
loadNotesFromStorage();
Diese Aktion befindet sich im useEffect(()) -> mit useEffect wird nach Rendering externe Aktionen durchgeführt

console.log

in der App() Funktion - die Anwendung scheint zu funktionieren, ist trotzdem ein Side Effect, weil etwas außerhalb der React-Komponente geändert wird -> es wird in die Browser-Console geschrieben -> es wäre nicht gewünscht z.B. fetch() Funktionen innerhalb der App() Funktion zu haben.

- [x] Write, in your own words, a short rule for what belongs in render versus what belongs in an effect.

Render-Logik berechnet anhand von Props und State, was angezeigt werden soll. Side Effects kommunizieren mit der Außenwelt, zum Beispiel über fetch, localStorage, document oder Event-Listener. Solche Aktionen gehören in useEffect, damit sie nicht bei jedem Render unkontrolliert ausgeführt werden.

**Questions** (depend on the tasks above)

- [x] Why can React call a component's render function more than once, or at times you don't expect (e.g. in development with Strict Mode)? What would go wrong with the side-effect example you found if render ran twice?

## Warum kann React eine Komponente mehrmals rendern?

React rendert eine Komponente immer dann erneut, wenn sich ihre Eingaben ändern, zum Beispiel:

- wenn sich ihr eigener State mit `setState` ändert,
- wenn sich Props des Elternteils ändern,
- wenn sich ein verwendeter Context ändert,
- wenn die Komponente nach einer Navigation erneut angezeigt wird.

In der Entwicklungsumgebung kann zusätzlich **React Strict Mode** aktiv sein. Strict Mode lässt bestimmte Komponenten absichtlich mehrfach rendern, damit problematische Side Effects sichtbar werden. Das hilft dabei, Code zu finden, der während des Renderns etwas außerhalb von React verändert.

Ein mehrfacher Render ist also normal und darf nicht als einmalige Ausführung betrachtet werden.

## Was würde mit dem Side Effect passieren?

Wenn dein Beispiel lautet:

```tsx
export default function App() {
  console.log("App render");

  return ...;
}
```

würde die Ausgabe mehrfach in der Konsole erscheinen:

```text
App render
App render
```

Das scheint zunächst harmlos, zeigt aber, dass die Aktion bei jedem Render wiederholt wird.

Bei einem `fetch` im Render wäre es problematischer:

```tsx
function App() {
  fetch("data/evidence.json");

  return ...;
}
```

Bei zwei Rendern würden zwei Requests gestartet:

```text
Render 1 → Request 1
Render 2 → Request 2
```

Das kann zu:

- unnötigen Netzwerk-Requests,
- doppelten Datenverarbeitungen,
- Race Conditions,
- schlechter Performance,
- schwer nachvollziehbarem Verhalten

führen.

Bei einem Event-Listener könnte derselbe Listener mehrfach registriert werden. Bei `localStorage.setItem` würde dieselbe externe Änderung mehrfach ausgeführt.

## Bezug zu deinem Code

In der Anwendung werden das Laden der JSON-Daten und das Lesen von `localStorage` korrekt in `useEffect` ausgeführt:

```tsx
useEffect(() => {
  loadBookmarksFromStorage();
  loadNotesFromStorage();

  // fetch-Aufrufe
}, []);
```

Dadurch werden diese Aktionen nicht direkt bei jedem Render neu gestartet.

- [x] Is calculating a derived value (like the filtered evidence list from Exercise 5) a side
      effect? Why or why not, and how does that distinction inform the rule you wrote?

Nein, das Berechnen eines abgeleiteten Wertes wie der gefilterten Evidence-Liste ist **kein Side Effect**.

## Warum nicht?

Die gefilterte Liste wird nur aus den aktuellen Eingaben berechnet:

```tsx
const filteredEvidence = evidence
  .filter(...)
  .sort(...);
```

Dabei passiert nichts außerhalb von React:

- keine Änderung am DOM,
- kein Schreiben in `localStorage`,
- kein Netzwerkaufruf,
- kein Event-Listener,
- keine Änderung an einer globalen Variable.

Die Berechnung nimmt Daten und erzeugt daraus ein Ergebnis:

```text
evidence + filters + sort
        ↓
filteredEvidence
```

Das ist eine reine Berechnung.

## Unterschied zu einem Side Effect

Ein Side Effect verändert etwas außerhalb der Berechnung oder kommuniziert mit der Außenwelt:

```tsx
fetch("data/evidence.json");
localStorage.setItem("key", "value");
document.title = "Evidence";
window.addEventListener("resize", handler);
```

Diese Aktionen gehören in `useEffect`.

Die Filterberechnung dagegen kann direkt während des Renderns stattfinden:

```tsx
function EvidenceCatalogueView({ evidence }: Props) {
  const filteredEvidence = evidence.filter(...);

  return (
    <div>
      {filteredEvidence.map(...)}
    </div>
  );
}
```

## Warum ist das wichtig?

Die Regel lautet:

> Während des Renderns soll die Komponente nur aus aktuellen Props und aktuellem State berechnen, was angezeigt wird. Aktionen, die etwas außerhalb von React verändern, gehören in `useEffect`.

Die gefilterte Liste folgt genau dieser Regel:

```text
Props und State
    ↓
Berechnung
    ↓
JSX
```

Ein `fetch` würde dagegen so aussehen:

```text
Render
    ↓
Netzwerkaktion außerhalb von React
```

Deshalb gehört `fetch` nicht direkt in den Render-Body.

## Wichtiger Hinweis zu `.sort()`

In diesem Code:

```tsx
const filteredEvidence = evidence
  .filter(...)
  .sort(...);
```

erstellt `filter()` zuerst ein neues Array. Dadurch verändert `sort()` nicht das ursprüngliche `evidence`-Array.

Das ist wichtig, weil eine direkte Mutation des Props problematisch wäre:

```tsx
evidence.sort(...); // soll nicht gemacht werden
```

Die aktuelle Variante bleibt eine Berechnung ohne unerwünschte Veränderung der Quelldaten.

---

## Demo 2 — `useEffect` mental model & dependency arrays

**Tasks**

- [x] Write a small `useEffect` example (can be a throwaway one first) with an empty dependency array, one with a populated dependency array, and one with no array at all, and observe how often each one actually runs.

## Demo 2 – Teil 1: Drei `useEffect`-Varianten vergleichen

Du sollst drei Effects vergleichen:

1. `useEffect` mit leerem Dependency-Array: `[]`
2. `useEffect` mit einer Abhängigkeit: `[demoValue]`
3. `useEffect` ohne Dependency-Array

### 1. Temporären Test-State hinzufügen

In `ReactApp.tsx`.

Ich habe dort bereits:

```tsx
import { useEffect, useState } from "react";
```

Füge innerhalb der `App`-Funktion vor dem ersten `useEffect` diesen temporären State ein:

```tsx
const [demoValue, setDemoValue] = useState(0);
```

### 2. Drei temporäre Effects hinzufügen

Füge direkt darunter diese drei Effects ein:

```tsx
useEffect(() => {
  console.log("Effect mit leerem Array: []");
}, []);

useEffect(() => {
  console.log("Effect mit Dependency: [demoValue]", demoValue);
}, [demoValue]);

useEffect(() => {
  console.log("Effect ohne Dependency-Array");
});
```

### 3. Temporären Button hinzufügen

Füge im JSX innerhalb des `BookmarkProvider`, zum Beispiel direkt vor `<Header />`, diesen Button ein:

```tsx
<button type="button" onClick={() => setDemoValue((value) => value + 1)}>
  Test value: {demoValue}
</button>
```

Damit kann man bewusst einen State-Change auslösen.

## Was zu beobachten ist

### Effect mit `[]`

```tsx
useEffect(() => {
  console.log("Effect mit leerem Array: []");
}, []);
```

Er läuft nach dem ersten Render.

In der Entwicklungsumgebung kann React Strict Mode ihn absichtlich mehrmals ausführen. Deshalb können eventuell zwei Ausgaben erscheinen. Das ist ein Entwicklungsverhalten.

### Effect mit `[demoValue]`

```tsx
useEffect(() => {
  console.log("Effect mit Dependency: [demoValue]", demoValue);
}, [demoValue]);
```

Er läuft:

- einmal nach dem ersten Render,
- erneut, wenn `demoValue` geändert wird,
- nicht bei einem Render, wenn `demoValue` unverändert bleibt.

Wenn man den Button dreimal klickt:

```text
Effect mit Dependency: [demoValue] 0
Effect mit Dependency: [demoValue] 1
Effect mit Dependency: [demoValue] 2
Effect mit Dependency: [demoValue] 3
```

### Effect ohne Array

```tsx
useEffect(() => {
  console.log("Effect ohne Dependency-Array");
});
```

Er läuft nach jedem Render.

Zum Beispiel:

```text
Render 1 → Effect
Render 2 → Effect
Render 3 → Effect
```

## Erwartete Zusammenfassung

| Effect                       | Wann läuft er?                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `useEffect(fn, [])`          | Nach dem initialen Render; in Strict Mode eventuell zusätzlich zur Entwicklungskontrolle |
| `useEffect(fn, [demoValue])` | Nach dem initialen Render und wenn `demoValue` sich ändert                               |
| `useEffect(fn)`              | Nach jedem Render                                                                        |

## Wichtig

Nach dem Test alles entfernen:

- `demoValue`
- die drei Test-Effects
- den temporären Button

Diese Beispiele sind nur zum Beobachten gedacht. Der eigentliche Zweck ist, das Verhalten von Dependency-Arrays praktisch zu sehen.

- [x] Find a real, justified use for `useEffect` you'll need in this app (loading data is coming in Demo 5, so pick something else — e.g. syncing the document title to the current view).

Die Aufgabe verlangt ausdrücklich, eine echte, begründete Verwendung von `useEffect` zu finden und zu implementieren.

Ein gutes Beispiel für die App ist die Synchronisierung des Browser-Titels mit der aktuellen Route:

```text
#/dashboard  → Project ReMotion – Dashboard
#/evidence   → Project ReMotion – Evidence
#/workspace  → Project ReMotion – Workspace
```

Der Browser-Titel gehört nicht direkt zur React-UI. Er verändert die externe Browser-Umgebung:

```tsx
document.title = "Project ReMotion – Evidence";
```

Deshalb gehört diese Aktion in `useEffect` und nicht einfach direkt in den Render-Code.

Eine passende Umsetzung könnte in einer kleinen Komponente innerhalb von `ReactApp.tsx` oder im Header erfolgen:

```tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function DocumentTitle() {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/dashboard": "Project ReMotion – Dashboard",
      "/evidence": "Project ReMotion – Evidence",
      "/workspace": "Project ReMotion – Workspace",
      "/timeline": "Project ReMotion – Timeline",
      "/team/people": "Project ReMotion – People",
      "/team/locations": "Project ReMotion – Locations",
    };

    document.title =
      titles[location.pathname] ?? "Project ReMotion – Investigation Portal";
  }, [location.pathname]);

  return null;
}
```

Diese Komponente müsste innerhalb des `HashRouter` gerendert werden:

```tsx
<HashRouter>
  <DocumentTitle />
  <Header />
  ...
</HashRouter>
```

Der Ablauf wäre:

```text
Route ändert sich
    ↓
location.pathname ändert sich
    ↓
React rendert DocumentTitle erneut
    ↓
useEffect läuft wegen [location.pathname]
    ↓
document.title wird aktualisiert
```

> Ich habe `useEffect` verwendet, um den Browser-Titel mit der aktuellen Route zu synchronisieren. Der Titel gehört nicht zur React-Komponente selbst, sondern zum Browser-Dokument. Deshalb handelt es sich um einen Side Effect. Die Abhängigkeit `location.pathname` sorgt dafür, dass der Effect nur ausgeführt wird, wenn sich die Route ändert.

Der Unterschied zu den temporären drei Test-Effects ist:

- Die Test-Effects waren nur zum Beobachten.
- Die Titel-Synchronisierung ist eine echte, sinnvolle Funktion der Anwendung.

**Questions** (depend on the tasks above)

- [x] What does React actually compare, between renders, to decide whether to re-run an effect with a populated dependency array? What happens if you omit a value your effect actually uses from that array?

React vergleicht bei einem Effect mit Dependency-Array die **aktuellen Dependency-Werte mit den Werten des vorherigen Renders**.

Beispiel:

```tsx
useEffect(() => {
  document.title = pageTitles[location.pathname] ?? "Project ReMotion";
}, [location.pathname]);
```

React merkt sich den vorherigen Wert von:

```tsx
location.pathname;
```

und vergleicht ihn beim nächsten Render mit dem aktuellen Wert.

Vereinfacht:

```text
vorher: "/dashboard"
aktuell: "/dashboard"
→ Effect läuft nicht erneut

vorher: "/dashboard"
aktuell: "/evidence"
→ Effect läuft erneut
```

React vergleicht dabei nicht alle Werte tiefgehend, sondern verwendet eine Referenz-/Wertprüfung, die im Wesentlichen `Object.is` entspricht.

## Was passiert bei fehlender Dependency?

Wenn der Effect einen Wert verwendet, dieser aber nicht im Dependency-Array steht, weiß React nicht, dass der Effect bei einer Änderung dieses Wertes erneut ausgeführt werden müsste.

Beispiel:

```tsx
useEffect(() => {
  document.title = `Evidence: ${search}`;
}, []);
```

Der Effect verwendet `search`, aber `search` fehlt im Array.

Dann passiert:

1. Der Effect läuft beim initialen Render.
2. Danach ändert sich `search`.
3. React rendert erneut.
4. Der Effect läuft trotzdem nicht erneut.
5. Der Dokumenttitel enthält möglicherweise noch den alten Suchwert.

Der Effect arbeitet dann mit einem veralteten Wert. Das wird häufig als **stale closure** oder veralteter Abschluss bezeichnet.

Korrekt wäre:

```tsx
useEffect(() => {
  document.title = `Evidence: ${search}`;
}, [search]);
```

Jetzt weiß React:

> Wenn sich `search` ändert, muss dieser Effect erneut ausgeführt werden.

## Bezug zu der `DocumentTitle`-Komponente

Der Effect verwendet:

```tsx
location.pathname;
```

Deshalb steht genau dieser Wert in den Dependencies:

```tsx
}, [location.pathname]);
```

Wenn der Benutzer von Dashboard zu Evidence navigiert:

```text
location.pathname:
"/dashboard" → "/evidence"
```

React erkennt die Änderung und führt den Effect erneut aus.

## Kurz gesagt

> React vergleicht bei einem Effect mit Dependency-Array jeden aktuellen Dependency-Wert mit dem Wert des vorherigen Renders. Wenn sich mindestens ein Wert ändert, wird der Effect erneut ausgeführt. Wenn ein verwendeter Wert im Dependency-Array fehlt, erkennt React seine Änderung nicht. Der Effect läuft dann nicht erneut und kann mit einem veralteten Wert arbeiten. Deshalb müssen alle reaktiven Werte, die der Effect verwendet, normalerweise im Dependency-Array stehen.

- [x] What's the difference, in practice, between `useEffect(fn, [])` and just writing `fn()` directly in the component body? Why doesn't the second one work the way you'd expect for "run once"?

Ja.

## `useEffect(fn, [])`

```tsx
useEffect(() => {
  console.log("Effect läuft");
}, []);
```

Das bedeutet:

> Führe diesen Effect nach dem ersten Rendern beziehungsweise nach dem Mount der Komponente aus.

Der leere Dependency-Array sagt React, dass der Effect keine Werte beobachtet, die eine erneute Ausführung auslösen.

Wichtig: In React Strict Mode kann der Effect in der Entwicklungsumgebung absichtlich zusätzlich ausgeführt werden, um problematische Effects zu erkennen. „Einmal“ bedeutet daher praktisch: einmal pro Mount im normalen Verhalten, nicht zwingend exakt einmal in jedem Development-Test.

## `fn()` direkt im Component Body

```tsx
function App() {
  console.log("App render");

  return ...;
}
```

Das wird bei **jedem Render** ausgeführt.

Ein Render kann passieren, wenn:

- sich eigener State ändert,
- sich Props ändern,
- sich Context ändert,
- die Komponente erneut in der UI erscheint.

Beispiel:

```tsx
function App() {
  fetch("data/evidence.json");

  return <div>...</div>;
}
```

Das scheint zunächst zu funktionieren, aber bei mehreren Rendern entstehen mehrere Requests:

```text
Render 1 → Request 1
Render 2 → Request 2
Render 3 → Request 3
```

Dasselbe Problem gilt für:

```tsx
localStorage.setItem(...);
document.title = "...";
window.addEventListener(...);
```

Diese Aktionen würden bei jedem Render wiederholt werden.

## Warum funktioniert `fn()` nicht für „run once“?

Weil der Component Body keine einmalige Initialisierung ist. Er ist der Render-Code und kann beliebig oft ausgeführt werden.

```text
Komponente wird gerendert
    ↓
Component Body läuft
    ↓
State ändert sich
    ↓
Komponente wird erneut gerendert
    ↓
Component Body läuft erneut
```

`useEffect(fn, [])` teilt React dagegen mit, dass die Aktion als Effect nach dem Rendern ausgeführt und an den Lebenszyklus der Komponente gebunden werden soll.

## Vergleich

| Variante                 | Ausführung                                     |
| ------------------------ | ---------------------------------------------- |
| `fn()` im Component Body | bei jedem Render, direkt während des Renderns  |
| `useEffect(fn, [])`      | nach dem Mount, normalerweise einmal pro Mount |
| `useEffect(fn)`          | nach jedem Render, aber nach dem Rendern       |
| `useEffect(fn, [value])` | nach dem Mount und wenn `value` sich ändert    |

### Kurzgesagt

> `fn()` direkt im Component Body wird bei jedem Render ausgeführt und eignet sich deshalb nicht für „run once“. Ein Render kann durch State-, Props- oder Context-Änderungen mehrfach stattfinden. `useEffect(fn, [])` wird dagegen nach dem Mount ausgeführt und nicht bei jedem normalen Re-Render erneut. Außerdem gehören externe Aktionen wie Fetch, Storage, Event-Listener oder `document.title` in einen Effect, weil der Render selbst nur die UI aus aktuellem State und Props berechnen sollte.

---

## Demo 3 — Cleanup: timers & subscriptions

**Tasks**

- [x] Implement at least one effect that sets up something needing cleanup (a `setTimeout`/`setInterval`, a `window` event listener, or similar) and returns a proper cleanup function.

Für **Demo 3 Teil 1** muss man einen echten `useEffect` implementieren, der etwas startet, das nach dem Start weiterläuft oder registriert bleibt, und deshalb später wieder entfernt werden muss.

Ein gutes Beispiel für die Anwendung ist ein **`window`-Event-Listener**.

## Was bedeutet das?

Ich registrier einen Listener:

```tsx
window.addEventListener("resize", handleResize);
```

Dieser Listener bleibt aktiv, bis ich ihn entferne:

```tsx
window.removeEventListener("resize", handleResize);
```

Die Entfernung kommt in die Cleanup-Funktion des Effects.

## Beispiel-Implementierung

In `ReactApp.tsx` kamm ich innerhalb von `App` ergänzen:

```tsx
useEffect(() => {
  function handleResize() {
    console.log("Window width:", window.innerWidth);
  }

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

## Was passiert?

Beim Mount:

```text
App wird geladen
    ↓
useEffect läuft
    ↓
resize-Listener wird registriert
```

Wenn das Browserfenster verändert wird:

```text
Fenstergröße ändert sich
    ↓
handleResize wird aufgerufen
```

Beim Unmount:

```text
App wird entfernt
    ↓
Cleanup läuft
    ↓
resize-Listener wird entfernt
```

## Warum ist Cleanup nötig?

Ohne Cleanup:

```tsx
useEffect(() => {
  window.addEventListener("resize", handleResize);
}, []);
```

würde der Listener im Browser bleiben, auch wenn die Komponente nicht mehr angezeigt wird. Bei späteren Mounts könnten mehrere Listener aktiv sein:

```text
Mount 1 → Listener 1
Unmount → Listener 1 bleibt
Mount 2 → Listener 2
```

Dann würde `handleResize` mehrfach ausgeführt.

## Alternative mit Timer

Ich könnte auch einen Timer verwenden:

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    console.log("Checking application status");
  }, 5000);

  return () => {
    window.clearInterval(timer);
  };
}, []);
```

Der Listener ist für die App aber wahrscheinlich leichter zu erklären.

### Kurzgesagt

> Ich registriere im Effect einen `resize`-Listener auf dem `window`. Da dieser Listener außerhalb von React weiter aktiv bleibt, gebe ich eine Cleanup-Funktion zurück, die ihn beim Unmount wieder entfernt. Dadurch entstehen beim erneuten Mounten keine mehrfachen Listener und keine veralteten Event-Handler.

- [x] Demonstrate what happens (e.g. via a console log in both the effect and its cleanup) when the component unmounts or the dependencies change, with and without the cleanup function present.

Ich ergänze nur Logs im bereits vorhandenen `resize`-Effect und in dessen Cleanup. So kann man mit „Preserve log“ und einem Neuladen den Ablauf zeigen, ohne eine neue Komponente oder einen zusätzlichen Button einzubauen.

Die Start- und Cleanup-Logs sind ergänzt.

Der bestehende `resize`-Effect in `ReactApp.tsx` enthält jetzt Logs für Start und Cleanup:

```tsx
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
```

## Zu demonstrieren

1. Starte die App.
2. Öffne die DevTools mit `F12`.
3. Öffne **Console**.
4. Aktiviere **Preserve log**.
5. Lade die Seite.
6. Ändere die Fenstergröße.

ich soll sehen:

```text
Resize effect gestartet
Window width: ...
```

7. Lade die Seite mit `Ctrl+R` neu.

Beim Unmount der alten App sollte erscheinen:

```text
Resize effect bereinigt
```

Danach wird die neue App gemountet:

```text
Resize effect gestartet
```

Der Cleanup entfernt den alten Listener, bevor die neue App-Version ihren Listener registriert.

Der Effect registriert beim Mount einen resize-Listener und gibt eine Cleanup-Funktion zurück, die ihn beim Unmount entfernt. Ein vollständiger Browser-Refresh beendet zwar die alte React-Anwendung, aber der Cleanup-Log ist dabei im Browser nicht zuverlässig sichtbar. Für einen eindeutig sichtbaren Unmount-Test müsste der Listener in einer routeabhängigen Komponente liegen, die beim Routenwechsel tatsächlich entfernt wird, oder es müsste eine Ein-/Ausblend-Funktion geben.

**Questions** (depend on the tasks above)

- [x] What actually calls your cleanup function, and when? Name at least two distinct situations that trigger it.

Die Cleanup-Funktion wird von **React selbst** aufgerufen. Sie wird nicht direkt durch den Browser oder durch den Entwickler aufgerufen.

Zwei typische Situationen sind:

1. **Wenn die Komponente unmounted wird**  
   Also wenn die Komponente aus dem React-Baum entfernt wird, zum Beispiel wenn eine Route oder ein bedingter UI-Bereich nicht mehr angezeigt wird.

2. **Bevor ein Effect wegen geänderter Dependencies erneut ausgeführt wird**  
   Wenn sich ein Wert im Dependency-Array verändert, ruft React zuerst den alten Cleanup auf und führt danach den Effect mit den neuen Werten erneut aus.

Beispiel:

```tsx
useEffect(() => {
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

In diesem Beispiel wird der Cleanup beim **Unmount** der Komponente ausgeführt. Da das Dependency-Array leer ist, wird er nicht bei einem normalen Routenwechsel oder jeder Größenänderung ausgeführt.

Zusammenfassung:

> React calls the cleanup function before an effect runs again because one of its dependencies changed, and when the component unmounts. For example, cleanup can remove an event listener before a new listener is registered, or when the component is removed from the React tree. In development, React Strict Mode may also run setup and cleanup an extra time to detect unsafe effects.

- [x] What real, observable bug would you get in this app if you set up a subscription/timer in an effect but forgot the cleanup function? Be specific, not just "a memory leak."

Ein konkreter Fehler wäre beim `resize`-Listener:

Wenn die Komponente erneut gemountet wird oder der Effect wegen einer Dependency erneut läuft, aber der alte Listener nicht entfernt wird, bleibt er aktiv. Bei jeder Fenstergrößenänderung werden dann mehrere Listener ausgeführt.

Beobachtbares Verhalten:

- `Window width: ...` erscheint mehrfach für ein einziges Resize-Ereignis.
- Die Anwendung führt dieselbe Resize-Logik unnötig mehrfach aus.
- Bei einem Timer könnten mehrere `setInterval`- oder `setTimeout`-Aufrufe gleichzeitig laufen.
- Dadurch könnten beispielsweise Daten mehrfach geladen, Zustände mehrfach aktualisiert oder UI-Updates unnötig oft ausgelöst werden.

Zusammenfassung:

> In this app, if the resize effect added a `window` resize listener but did not remove it in its cleanup function, remounting the component or re-running the effect could register multiple listeners. Then one window resize would trigger the handler several times, so the console would log the window width repeatedly and any resize-related UI update would happen multiple times. With a timer, the same problem could cause repeated or duplicate updates because old timers would continue running.

---

## Demo 4 — Build the read-only Node backend

**Tasks**

- [x] Set up a minimal Node.js server (Express or equivalent) with one GET endpoint per data resource (case, evidence, people, locations, timeline), each returning the same shape of data as the corresponding `data/*.json` file does today.

## Demo 4 Teil 1 wurde implementiert

Ich habe einen kleinen lokalen Node.js-Server erstellt:

- Datei: `server/server.js`
- Start-Script in `package.json`
- Dokumentation in `README.md`

### Die fünf GET-Endpunkte

Der Server stellt diese Routen bereit:

```text
GET http://localhost:3001/api/case
GET http://localhost:3001/api/evidence
GET http://localhost:3001/api/people
GET http://localhost:3001/api/locations
GET http://localhost:3001/api/timeline
```

Jede Route liest die entsprechende Datei aus `public/data`:

```text
/api/case       → public/data/case.json
/api/evidence   → public/data/evidence.json
/api/people     → public/data/people.json
/api/locations  → public/data/locations.json
/api/timeline   → public/data/timeline.json
```

Die Daten werden also nicht neu geschrieben oder verändert. Der Server liefert dieselben Datenstrukturen wie die vorhandenen JSON-Dateien:

- `case` liefert ein Objekt
- `evidence` liefert ein Array
- `people` liefert ein Array
- `locations` liefert ein Array
- `timeline` liefert ein Array

### Wie startet man den Server?

Im ersten Terminal:

```bash
npm run server
```

Der Server läuft dann unter:

```text
http://localhost:3001
```

In einem zweiten Terminal startet man Vite:

```bash
npm run dev
```

Dann laufen Frontend und Backend gleichzeitig:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

Ich habe außerdem CORS für `http://localhost:5173` aktiviert. Dadurch darf das React-Frontend später Daten vom Node-Server laden.

### Fehlerbehandlung

Der Server unterstützt außerdem bereits grundlegende Fehlerantworten:

- Nicht vorhandene Route → `404`
- Andere HTTP-Methode als `GET` → `405`
- Fehler beim Lesen einer JSON-Datei → `500`

Die fünf API-Endpunkte haben beim Testen jeweils korrekt mit `HTTP 200` geantwortet.

- [x] Add a way to deliberately simulate real-world conditions for testing later demos: an artificial delay (configurable, e.g. via a query param or env var) on at least one endpoint, and a way to make one endpoint return an error response (e.g. a 500) on demand.

Ich ergänze die Simulation direkt im bestehenden Server: `?delay=...` wartet die angegebene Millisekundenanzahl, und `?error=1` liefert absichtlich HTTP 500. Danach dokumentiere ich konkrete Test-URLs und prüfe die Antworten.

## Was wurde gemacht?

Im Server `server.js` gibt es jetzt zwei Query-Parameter.

### 1. Künstliche Verzögerung

Mit `delay` kann man eine Verzögerung in Millisekunden simulieren:

```text
http://localhost:3001/api/evidence?delay=3000
```

Das bedeutet:

- Der Server wartet 3 Sekunden.
- Danach liefert er die normalen Evidence-Daten.
- Der Wert ist auf maximal 10 Sekunden begrenzt.

Das ist später nützlich, um im React-Frontend den Loading-Zustand sichtbar zu machen.

Beispiel:

```text
http://localhost:3001/api/case?delay=5000
```

### 2. Absichtlicher Serverfehler

Mit `error=1` kannst du eine HTTP-500-Fehlerantwort auslösen:

```text
http://localhost:3001/api/evidence?error=1
```

Der Server liefert dann:

```json
{
  "error": "Simulated server error for Exercise 6 testing."
}
```

Das ist später nützlich, um den Error-State im React-Frontend zu testen.

### 3. Beide Situationen kombinieren

Du kannst Verzögerung und Fehler kombinieren:

```text
http://localhost:3001/api/evidence?delay=3000&error=1
```

Dann wartet der Server drei Sekunden und gibt anschließend einen Fehler mit HTTP 500 zurück.

## Dokumentation

Die Test-URLs wurden in `README.md` ergänzt.

Außerdem wurde die Aufgabe in `EXERCISE_6.md` als erledigt markiert.

## Überprüfung

Ich habe getestet:

```text
/api/case       → HTTP 200
/api/evidence   → HTTP 200
/api/people     → HTTP 200
/api/locations  → HTTP 200
/api/timeline   → HTTP 200
```

Zusätzlich:

```text
/api/evidence?delay=300
```

lieferte die Daten nach ungefähr 300 Millisekunden.

Und:

```text
/api/evidence?error=1
```

lieferte korrekt:

````text
HTTP 500
``

- [X] Confirm the server runs locally alongside `vite dev` and is documented (a README section is enough) as dev-only (not part of the Exercise 2 deploy pipeline).

http://localhost:5173 --> npm run dev
http://localhost:3001/api/case --> npm run server

**Questions** (depend on the tasks above)

- [X] Why does this exercise ask for artificial delay/error controls on the backend, instead of just pointing the frontend at the static JSON files directly (as it already could)? What could you _not_ teach convincingly without them?

Die künstliche Verzögerung und die absichtlich auslösbaren Fehler werden benötigt, damit das Verhalten einer echten Netzwerkverbindung sichtbar und testbar wird.

Bei statischen JSON-Dateien vom lokalen Vite-Server antwortet `fetch()` normalerweise sehr schnell und zuverlässig. Dadurch sieht man den Loading- oder Error-Zustand oft gar nicht oder nur sehr kurz.

Mit den Backend-Steuerungen kann man realistische Situationen simulieren:

- langsame Netzwerkverbindung
- verzögerte Serverantwort
- nicht erreichbarer oder fehlerhafter Server
- HTTP-Fehler wie `500 Internal Server Error`

Ohne diese Funktionen könnte man folgende Dinge nicht überzeugend demonstrieren:

1. **Loading-State**
   Man könnte kaum sichtbar zeigen, dass während eines laufenden Requests ein Ladehinweis erscheint.

2. **Error-State**
   Man könnte nicht realistisch zeigen, wie React auf einen fehlgeschlagenen Request oder eine HTTP-500-Antwort reagiert.

3. **Request-Abbruch und Cleanup**
   Später kann man demonstrieren, dass ein laufender Request beim Unmount oder bei einer neuen Anfrage mit `AbortController` abgebrochen wird.

4. **Robuster Umgang mit asynchronen Daten**
   Man kann zeigen, dass die Benutzeroberfläche nicht einfach leer bleibt, sondern zwischen `loading`, `error`, `success` und später auch `empty` unterscheidet.

Auf Englisch:

> The artificial delay and error controls make asynchronous behavior observable and testable. Static JSON files usually respond immediately and successfully, so the loading and error states would be too fast or impossible to trigger reliably. Without these controls, we could not convincingly demonstrate a visible loading state, handling of HTTP errors, request cancellation with `AbortController`, or robust UI behavior while data is still unavailable.


- [X] What is CORS, and did you have to deal with it running your frontend (from Vite's dev server) against this separate backend server? If yes, what did you configure and why? If no, why not?

**CORS** steht für **Cross-Origin Resource Sharing**. Es ist eine Browser-Sicherheitsregel, die verhindert, dass eine Webseite ohne Erlaubnis Anfragen an einen anderen Ursprung sendet.

In unserem Fall sind Frontend und Backend unterschiedliche Origins:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
````

Obwohl beide `localhost` verwenden, sind die Ports unterschiedlich. Deshalb behandelt der Browser sie als verschiedene Origins.

Ja, ich habe CORS im Backend berücksichtigt. In `server.js` wird folgende Antwort-Header-Konfiguration gesetzt:

```js
"Access-Control-Allow-Origin": "http://localhost:5173"
```

Dadurch erlaubt der Node-Server dem Vite-Frontend, die API-Daten abzurufen. Ohne diesen Header könnte der Browser die Anfrage blockieren, obwohl der Server technisch erreichbar ist.

Auf Englisch:

> CORS stands for Cross-Origin Resource Sharing. It is a browser security mechanism that controls whether a frontend from one origin may request resources from another origin. In this project, the Vite frontend runs on `http://localhost:5173`, while the Node backend runs on `http://localhost:3001`. Because the ports are different, they are different origins. I configured the backend to return `Access-Control-Allow-Origin: http://localhost:5173`, which allows the frontend to fetch data from the backend during local development. This configuration is restricted to the Vite development origin rather than allowing every origin.

---

## Demo 5 — Consume the backend from React

**Tasks**

- [x] Replace at least one view's data source (previously the static `data/*.json` fetch/import) with a real `fetch()` call to your new backend, wired up inside a `useEffect`.

Ich stelle die zentrale Datenladung in `ReactApp` von den statischen JSON-Pfaden auf die neue API um. Dadurch beziehen anschließend alle Views ihre Daten über diesen einen `useEffect`, ohne dass die einzelnen Views selbst geändert werden müssen.

Der bestehende Lade-Effect ruft jetzt die fünf API-Routen auf. Ich überprüfe nun TypeScript/Build, Linter und ob die API-Routen erreichbar sind, damit die Anwendung nicht nur kompiliert, sondern auch lokal mit dem Backend funktioniert.

## Was wurde geändert?

In `ReactApp.tsx` wurde die Datenquelle im bestehenden `useEffect` geändert.

Vorher wurden die JSON-Dateien direkt geladen:

```tsx
fetch("data/case.json");
fetch("data/people.json");
fetch("data/locations.json");
fetch("data/evidence.json");
fetch("data/timeline.json");
```

Jetzt werden die Daten vom Node.js-Backend geladen:

```tsx
fetch("http://localhost:3001/api/case");
fetch("http://localhost:3001/api/people");
fetch("http://localhost:3001/api/locations");
fetch("http://localhost:3001/api/evidence");
fetch("http://localhost:3001/api/timeline");
```

Dafür gibt es diese Konstante:

```tsx
const API_BASE_URL = "http://localhost:3001/api";
```

Die Requests werden weiterhin innerhalb des vorhandenen `useEffect` ausgeführt und mit `Promise.all` parallel geladen:

```tsx
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
```

## Was bedeutet das für die Views?

Die einzelnen Views mussten nicht separat geändert werden. Alle Daten werden zentral in `ReactApp` geladen und anschließend über `RouteContent` an die Views weitergegeben.

Damit erhalten jetzt alle Views ihre Daten über das Backend:

- Dashboard
- Evidence
- People
- Locations
- Timeline
- Workspace

Die statischen JSON-Dateien werden von der React-Anwendung für diese Datenladung nicht mehr direkt verwendet.

### Terminal 1: Backend

```bash
npm run server
```

### Terminal 2: Frontend

```bash
npm run dev
```

Danach
http://localhost:5173

## Überprüfung

Die fünf API-Endpunkte antworteten jeweils mit `HTTP 200`.

- [x] Do the same for the rest of the app's data sources, so the whole app now reads from your backend rather than static files.

Im Teil 1 der Demo 5 erledigt

**Questions** (depend on the tasks above)

- [x] Walk through exactly what happens, in order, from the component mounting to the data actually being available to render: what does the effect do, when does it run, and what causes the component to re-render once the data arrives?

Der Ablauf ist in dieser Anwendung folgender:

1. **`App` wird zum ersten Mal gerendert.**  
   Zu diesem Zeitpunkt enthält `data` zunächst die Anfangswerte aus `state`. Außerdem ist:

   ```tsx
   isLoading === true;
   ```

   Deshalb zeigt die Anwendung zunächst:

   ```text
   Loading case file...
   ```

2. **Nach dem Rendern führt React den `useEffect` aus.**  
   Der Effect besitzt ein leeres Dependency-Array:

   ```tsx
   useEffect(() => {
     // Daten laden
   }, []);
   ```

   Deshalb läuft er normalerweise einmal pro Mount der Komponente. Wichtig: `useEffect` läuft nach dem ersten Rendern, nicht während des Renderns.

3. **Der Effect startet `loadData()`.**  
   Diese Funktion sendet fünf parallele `fetch`-Anfragen an das Backend:

   ```text
   /api/case
   /api/people
   /api/locations
   /api/evidence
   /api/timeline
   ```

   Dafür wird `Promise.all` verwendet. Die Funktion wartet, bis alle fünf Requests abgeschlossen sind.

4. **Die Antworten werden geprüft.**  
   Wenn eine Antwort keinen erfolgreichen HTTP-Status besitzt, wird ein Fehler ausgelöst:

   ```tsx
   if (!caseResponse.ok || ...) {
     throw new Error(...);
   }
   ```

5. **Die JSON-Daten werden aus den Responses gelesen.**  
   Danach werden die Daten in ein gemeinsames `nextData`-Objekt zusammengefasst:

   ```tsx
   const nextData: AppData = {
     caseData: await caseResponse.json(),
     people: await peopleResponse.json(),
     locations: await locationsResponse.json(),
     evidence: await evidenceResponse.json(),
     timeline: await timelineResponse.json(),
   };
   ```

6. **React-State wird aktualisiert.**  
   Die geladenen Daten werden mit:

   ```tsx
   setData(nextData);
   ```

   in den React-State geschrieben.

   Zusätzlich wird:

   ```tsx
   setIsLoading(false);
   ```

   gesetzt, damit die Loading-Anzeige verschwindet.

7. **Die State-Änderung löst einen neuen Render aus.**  
   `setData` und `setIsLoading` informieren React darüber, dass sich State geändert hat. React rendert `App` deshalb erneut.

8. **Beim erneuten Rendern sind die Daten verfügbar.**  
   Jetzt ist `isLoading` `false`, `data` enthält die Backend-Daten und React rendert:

   ```tsx
   <RouteContent data={data} ... />
   ```

   `RouteContent` gibt die Daten anschließend an die jeweilige View weiter, zum Beispiel an Dashboard, Evidence, People, Locations und Timeline.

Auf Englisch:

> When `App` mounts, it renders first with its initial state. `isLoading` is `true`, so the loading message is displayed. After the initial render, React runs the `useEffect` because it has an empty dependency array. The effect starts the asynchronous `loadData` function, which sends five parallel `fetch` requests to the backend using `Promise.all`. Once all responses arrive, the code checks that they were successful, parses the JSON data, and stores the result with `setData`. It also sets `isLoading` to `false`. These state updates cause React to render the component again. During that render, the loaded data is passed through `RouteContent` to the appropriate views, so the actual case data becomes available in the UI. If the requests fail, the error state is set instead and an error message is rendered.

- [x] What's different about your component now compared to before (when data came from a static import/fetch of a local file). Specifically in terms of what state it needs to track that it didn't need before?

---

## Demo 6 — Loading, error, and empty states

**Tasks**

- [ ] For at least one view, implement all three states explicitly: a loading indicator while the fetch is pending, a real error message if it fails (using your backend's on-demand error endpoint from Demo 4 to trigger it live), and a distinct "no data" empty state if the response is successful but contains nothing.
- [ ] Make sure these three states are visually and structurally distinguishable from each other, not all three collapsing into "shows nothing."

**Questions** (depend on the tasks above)

- [ ] Trigger your backend's error endpoint live and show the error state appearing. What state variable(s) are you tracking to distinguish "loading," "error," and "loaded successfully but empty" from each other?
- [ ] The original vanilla app had a bug where a failed fetch could leave a loading spinner stuck forever because the cleanup/hide-loading step was never called on the error path. Explain specifically how your React version's state management makes that particular mistake
      harder to make (or show that it doesn't, and fix it).

---

## Demo 7 — Request races & cancellation

**Tasks**

- [ ] Using your backend's artificial-delay control, construct a request race: trigger a request, then trigger another one (for the same data) before the first resolves, and observe
      what happens if you do nothing special about it. Does the UI ever show a result from the
      _older_ request after a newer one already resolved?
- [ ] Fix it using `AbortController` (or a request-id/"ignore stale response" guard, your choice), so the UI can never show a stale result.

**Questions** (depend on the tasks above)

- [ ] Reproduce the race live (with artificial delay dialed up) before your fix, then show the fix preventing it. What exact sequence of events causes the stale result to win without the fix?
- [ ] `AbortController` cancels the _request_. Does the effect's cleanup function run separately, or is aborting the fetch itself what you're doing inside the cleanup? Explain how the two connect in your implementation.

---

## Demo 8 — Extract a reusable custom hook

**Tasks**

- [ ] Extract the data-fetching logic (loading/error/empty state, the effect, cancellation) you've built across Demos 5–7 into at least one reusable custom hook (e.g. `useFetch<T>(url)` or a more specific `useEvidence()`), and use it in at least two different places.

**Questions** (depend on the tasks above)

- [ ] What makes something a legitimate custom hook rather than just a regular helper function? What rule(s) does React enforce about how/where hooks (including your custom one) can be called?
- [ ] Show the two places using your hook. What did extracting it save you from duplicating, and is there anything about the two usages that _couldn't_ be shared and had to stay specific to each call site?

---

## Demo 9 — Separate UI, application logic, and API access

**Tasks**

- [ ] Organize your data-fetching code into distinct layers: a thin API-access layer (raw `fetch` calls, knows the backend's URLs/shapes and nothing else), your custom hook(s) from Demo 8 (application logic: loading/error/cancellation), and your components (UI only, no direct `fetch` calls anywhere in a component).
- [ ] Confirm no component in the app calls `fetch` directly anymore.

**Questions** (depend on the tasks above)

- [ ] If your backend's endpoint URLs or response shape changed tomorrow, how many files would you need to touch, and which ones? Would any component need to change?
- [ ] What's the argument _against_ this separation for a small app like this one? E.g. when would the extra layering be overkill rather than helpful? Do you think it's justified here?

---

## Demo 10 — Data-flow wrap-up & a written UX decision

**Tasks**

- [ ] Illustrate the full data flow for one piece of data, end to end: the JSON file -> your backend endpoint -> the API-access layer -> your custom hook -> the component -> what's on screen.
- [ ] Explain a short, honest justification for one loading/error/empty-state UX decision you made (e.g. what your loading indicator looks like, how errors are worded, what "empty" looks like) and note one thing you'd do differently with more time.

**Questions** (depend on the tasks above)

- [ ] Walk through your diagram/illustration live, and for one step, explain what would break (and how you'd notice) if that step silently stopped happening.
- [ ] Across Exercises 3–6, this app went from "read static files instantly" to "fetch from a real, sometimes-slow, sometimes-failing server". What did that change force you to add that wasn't needed before and was any of it needed _conceptually_ even back when the data source was a static file, just less visible?

---
