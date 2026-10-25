# Exercise 4 — React UI & Component Design

This is the fourth exercise in Advanced Web Engineering Course (CSDC). It builds on Exercise 3. This exercise migrates **two more views — People & Locations, and Timeline** — bringing the running total to 3 of the app's 5 views fully in React. **Evidence Catalogue and Workspace are deliberately not part of this exercise**. They need real interactivity (`useState`, controlled forms, a reducer) to make sense, and that's Exercise 5.

**This exercise is about structure, not behavior.** Migrate these views as presentational-first, e.g.
reusable components, typed props, lists and conditional content, and (for Timeline) filter controls that are visually complete but not required to be functionally wired to `onChange` handlers yet. "No state management beyond what is necessary to render the initial view" is the rule. It's fine (expected, even) for Timeline's filter dropdowns to not filter anything yet when changed by the user.

**Hard rules for every component you write in this exercise:**

- [x] No `innerHTML`.
- [x] No manual DOM creation (`document.createElement`, `.appendChild`, etc.).
- [x] No state beyond what's needed to render the initial view (reading a query param once to decide _what_ to show initially is fine).

**Out of scope for this exercise**: Evidence Catalogue, Workspace, `useState` and any interactivity beyond what's needed to render the initial view, forms that actually submit
or validate anything, global/shared state, and accessibility (not covered in this course).

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 15, React Foundations** — “JSX is JavaScript syntax for UI descriptions” through “The component tree,” PDF pp. 104–106
- **Chapter 16, React Component Design and Routing** — all sections, PDF pp. 110–114

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| #   | Demo                                                           | Ready? |
| --- | -------------------------------------------------------------- | ------ |
| 1   | JSX, function components, typed props, composition & children  | ☐      |
| 2   | Conditional rendering                                          | ☐      |
| 3   | Rendering collections                                          | ☐      |
| 4   | Stable keys and list identity                                  | ☐      |
| 5   | Presentational vs. feature components and component boundaries | ☐      |
| 6   | Feature-oriented folder structure                              | ☐      |
| 7   | Reusable UI elements                                           | ☐      |
| 8   | Routing: People & Locations as real routes                     | ☐      |
| 9   | Route parameters                                               | ☐      |
| 10  | Query parameters as URL state + migration wrap-up              | ☐      |

---

## Demo 1 — JSX, function components, typed props, composition & children

**Tasks**

- [x] Build at least 3 small components for the People & Locations or Timeline views using JSX, each with an explicitly typed props interface/type (no untyped or `any` props).

Typed JSX components:
Created and used three React function components with explicitly typed props:

PersonCard — displays a person’s details.
LocationCard — displays a location and its contents.
TimelineEventCard — displays a timeline event.
They use the existing Person, Location, and TimelineEvent types from types.ts and render data using JSX rather than manual DOM manipulation.

- [X] Build at least one component that takes `children` (composition) rather than a data prop, and use it in a real place in the app (e.g. a generic card/panel wrapper).

Composition with children:
Created a reusable Panel component with typed props:
type PanelProps = {
  title: string;
  children: ReactNode;
};

Panel is used in the People & Locations and Timeline views. It receives its inner content through children, allowing it to wrap different content such as people cards, location cards, and timeline events.

This demonstrates component composition and reuse.


**Questions** (depend on the tasks above)

- [X] Show one JSX expression in your code that embeds a JavaScript value or expression (not just static markup). For example `{person.name}` or a computed value. What can and can't go inside `{...}` in JSX?

One JSX expression in the code is in the PersonCard component:
<h3>{person.name}</h3>
{person.name} embeds the JavaScript value of the person’s name inside the JSX heading.
Another example is:
<p>
  <strong>Speciality:</strong> {person.speciality}
</p>
A computed expression is also used here:
<section className={`react-view`}>
and in the timeline component:
<div className={`timeline-event certainty-${event.certainty}`}>
The value of event.certainty is inserted into the CSS class name.
Inside JSX curly braces, you can use JavaScript expressions that produce a value, such as:
{person.name}
{event.title}
{people.length}
{formatDate(event.time)}
{condition ? "Yes" : "No"}
{items.map((item) => <li key={item}>{item}</li>)}

You can also use:

Variables
Property access
Function calls
Arithmetic or other computed expressions
Ternary expressions
Logical expressions
Array .map() expressions that return JSX

You cannot put statements directly inside JSX curly braces, such as:
{if (person.name) { ... }}
or
{for (const person of people) { ... }}

Statements such as if and for must be handled outside the returned JSX, or replaced with JSX-compatible expressions such as a ternary, logical &&, or .map().

You also should not place ordinary object literals directly into JSX as visible content, because React cannot render plain objects directly:

{person} // not valid visible output

Instead, render a property:

{person.name}

In short, JSX curly braces allow JavaScript expressions, not JavaScript statements.

- [X] For one component's typed props: what would TypeScript catch if you passed the wrong shape of data to it? Demonstrate a real type error by passing something wrong on purpose.

For PersonCard, the props are explicitly typed:

type PersonCardProps = {
  person: Person;
};

function PersonCard({ person }: PersonCardProps) {
  return <h3>{person.name}</h3>;
}

The Person type requires all of these properties:

id
name
role
speciality
responsibilities
statement
background
avatar

To demonstrate a real type error, temporarily add this somewhere in a component:

<PersonCard
  person={{
    name: "Patch Vector",
  }}
/>

TypeScript will report an error similar to:
Type '{ name: string; }' is missing the following properties
from type 'Person':
id, role, speciality, responsibilities, statement, background, avatar

This happens because the object passed to person does not have the complete shape required by the Person interface.

TypeScript would also catch a property with the wrong type:

<PersonCard
  person={{
    id: "P01",
    name: "Patch Vector",
    role: "Engineer",
    speciality: "Robotics",
    responsibilities: "Safety testing",
    statement: "Example statement",
    background: "Example background",
    avatar: "assets/people/patch-vector.png",
  }}
/>

Here, responsibilities should be a string[], but a single string was supplied. TypeScript would report:

Type 'string' is not assignable to type 'string[]'

- [X] What's the difference between passing data as a named prop versus passing it as `children`? Why did you choose `children` for the component you built with it?

A named prop passes a specific piece of data to a component using an explicit property name:
<PersonCard person={person} />

Here, person is a named prop. PersonCard expects that prop to be a Person object:

The component then uses the data as:

person.name
person.role
person.speciality

children is different. It represents whatever JSX is placed between the component’s opening and closing tags:

<Panel title="People">
  <div className="people-grid">
    {people.map((person) => (
      <PersonCard key={person.id} person={person} />
    ))}
  </div>
</Panel>

The Panel component receives the inner JSX through its children prop:

type PanelProps = {
  title: string;
  children: ReactNode;
};

It renders that content like this:

function Panel({ title, children }: PanelProps) {
  return (
    <section className="dashboard-panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

Why children was chosen for Panel

Panel is a generic layout component. It provides the common structure:

A panel container
A heading
A consistent CSS class
But it should not know whether its content is:

Person cards
Location cards
Timeline event cards
An empty-state message
Any other JSX content
Using children lets the parent supply the exact content while Panel controls only the shared wrapper structure.

In contrast, PersonCard uses a named person prop because it is specifically designed to display one Person object.

So:

Use a named prop when a component expects a specific piece of data.
Use children when a component wraps or composes arbitrary JSX content.


- [X] Why does direct DOM manipulation (as the old vanilla `app.js` did constantly, e.g. `innerHTML`, `classList.add/remove`, manually building elements) conflict with React's rendering model? What assumption does React make about who "owns" the DOM that direct manipulation breaks?

Direct DOM manipulation conflicts with React because both the vanilla code and React try to control the same parts of the page.

The old vanilla application directly changed the DOM using methods such as:

element.innerHTML = html;
element.classList.add("active");
element.classList.remove("hidden");
document.createElement("div");
element.appendChild(child);

React works differently. React treats JSX as a description of what the UI should look like based on the current props and state:

<PersonCard person={person} />

React then creates and updates the corresponding DOM elements itself.

React’s assumption
React assumes that React owns the DOM inside its root element:

<div id="react-root"></div>

React expects to be the authority responsible for deciding:

Which elements exist
Which elements should be removed
What text and attributes they contain
Which classes are applied
When the UI should be updated
When code outside React directly changes those elements, React’s internal representation can become inconsistent with the actual DOM.

For example, if vanilla code does this:

section.classList.remove("active");

but React’s JSX still says the section should be visible, React may later re-render and restore its own version. The result can be:

Changes being overwritten
Stale or missing content
Unexpected class names
Event handlers no longer matching the visible UI
Parts of the interface disappearing

Similarly, if vanilla code uses:

container.innerHTML = "...";

inside an area React rendered, it replaces React-managed elements behind React’s back. React still assumes those elements are present and may later try to update or remove them.

In this project
The old vanilla router originally manipulated .view elements using classList.add() and classList.remove(). That caused a real issue when it removed the active class from the React Dashboard section.

The React version now uses a separate react-view class so the vanilla router does not hide React-managed content. This is a transitional solution while the application is being migrated.

The long-term solution would be to let React fully own the migrated views and remove the corresponding vanilla DOM manipulation for those areas. The vanilla code could continue managing views that have not yet been migrated, but the two systems should not both manage the same DOM elements.

---

## Demo 2 — Conditional rendering

**Tasks**

- [ ] Implement at least two real conditional-rendering cases in the views you're migrating. For example: an empty state (e.g. "no timeline events match" if applicable), and a state-dependent style/label (e.g. the active People/Locations tab, or a certainty badge's variant on a timeline event).
- [ ] Use at least two different conditional-rendering techniques (e.g. a ternary, `&&`, early-return, or a lookup/mapping function) and be ready to justify which you used where.

**Questions** (depend on the tasks above)

- [ ] Show one place where you used `condition && <Component />}` instead of a ternary. What would go wrong if `condition` were a number like `0` instead of a boolean and does that risk apply to your actual code?
- [ ] Why might returning `null` from a component be preferable to returning an empty `<div>` in some cases? Did you use either, and why?

---

## Demo 3 — Rendering collections

**Tasks**

- [ ] Render the people list, the locations list, and the timeline events list, each as a mapped collection of components, each with a proper `key` prop.

**Questions** (depend on the tasks above)

- [ ] What does React actually use `key` for internally?

---

## Demo 4 — Stable keys and list identity

**Tasks**

- [ ] Deliberately use `key={index}` in one throwaway example, then demonstrate (e.g. by reordering or filtering the underlying array) a case where it produces a visibly wrong result, before replacing it with a real stable id.

**Questions** (depend on the tasks above)

- [ ] What goes wrong, concretely, when keys are missing, duplicated, or based on array index for a list that can reorder or filter?
- [ ] The _original_ vanilla version of this app had a real bug where one feature used an array index as an identifier instead of a stable id. Would that same mistake, ported directly into React as `key={index}`, have caused a symptom a user could notice, or only a console warning? Explain why.
- [ ] All of this app's real data (people, locations, timeline events) already has stable ids. Is there ever a legitimate reason to use `key={index}` anyway? When?

---

## Demo 5 — Presentational vs. feature components and component boundaries

**Tasks**

- [ ] Classify every component you've built so far as either "presentational" or "feature/container". Explain why.
- [ ] Find at least one component that's currently doing more than one job, and split it into two components with a clear boundary between them.

**Questions** (depend on the tasks above)

- [ ] For the component you split: what was the single responsibility of each half after the split? If an implementation detail in one half changed, would that change affect the other half? Why or why not?
- [ ] Give one concrete rule you used to decide "this belongs in a presentational component" versus "this belongs in a feature component."

---

## Demo 6 — Feature-oriented folder structure

**Tasks**

- [ ] Reorganize your React source into a feature-oriented structure (e.g. grouping by
      `people-locations/`, `timeline/`, `dashboard/`, shared `components/`, rather than one flat
      folder of files). Including the Dashboard and shell from Exercise 3.
- [ ] Document the structure you landed on (a short `ARCHITECTURE.md` section or README snippet is enough) and the rule you used to decide what's "shared" versus "feature-local."

**Questions** (depend on the tasks above)

- [ ] What's the difference between organizing files "by type" (all components in one folder, all hooks in another) and "by feature"? What made you choose the structure you chose for this app specifically?
- [ ] Where did you draw the line between a component that lives inside one feature folder and one that belongs in a shared/common folder? Give one real example of each from your own structure.

---

## Demo 7 — Reusable UI elements

**Tasks**

- [ ] Extract at least one presentational component that is genuinely reused in **two or more different places** in the app (e.g. a badge, a card shell, a button variant), with a typed props API that makes it flexible enough for both uses without becoming a special-cased mess.

**Questions** (depend on the tasks above)

- [ ] Show the two (or more) places your reusable component is used. What varies between them via props, and what stays fixed inside the component itself? How did you decide where that line goes?
- [ ] The original vanilla app had duplicated HTML-template code (the same card markup written out twice, slightly differently, in two functions). Compare that directly to what you just built. What does a reusable component give you that copy-pasted template strings didn't?

---

## Demo 8 — Routing: People & Locations as real routes

**Tasks**

- [ ] Install a routing library (React Router or an equivalent of your choice, justified) and
      replace the shell's placeholder navigation from Exercise 3 with real routes for at least Dashboard, People & Locations, and Timeline.
- [ ] Convert the People/Locations tab toggle from local component state into two real,
      navigable, bookmarkable routes (e.g. `/team/people` and `/team/locations`) instead of a click handler that only changes what's shown without changing the URL.

**Questions** (depend on the tasks above)

- [ ] Why does making the People/Locations tab a real route (versus keeping it as internal
      component state) matter for the user? Name a concrete capability the user gains.
- [ ] What does your router do when the URL doesn't match any route you've defined? Compare this to how the vanilla app's `handleHashChange()` fell back to the dashboard for an invalid hash.

---

## Demo 9 — Route parameters

**Tasks**

- [ ] Add at least one route that takes a parameter (e.g. a person or location id in the URL, such as `/team/people/:personId`), and use that parameter inside the corresponding component to determine what to render.
- [ ] Make at least one place in the app link to that parameterized route (not just typing the URL by hand). For example, a person's name in a related-evidence context, or a "view on team page" link.

**Questions** (depend on the tasks above)

- [ ] How do you read a route parameter's value inside your component, and what type is it as far as TypeScript is concerned by default? What did you have to do to use it safely (e.g. what if the id in the URL doesn't match any real person)?
- [ ] What's the practical difference, for the user, between `/team/people/nova-byte` (a route
      param) and `/team/people?person=nova-byte` (a query param)? Why is one more appropriate than
      the other for this specific case?

---

## Demo 10 — Query parameters as URL state + migration wrap-up

**Tasks**

- [ ] On the Timeline view, read a query parameter (e.g. `?person=...`) when the page loads, and use it to determine the _initial_ rendered list (for example, pre-selecting a person filter if the app is opened via a link that includes one). Remember, the filter controls themselves don't need to be interactive yet. This is about parameterizing the initial render from the URL, not wiring `onChange`.
- [ ] Do a final pass confirming: Dashboard, People & Locations, and Timeline are fully React, none of them use `innerHTML` or manual DOM creation anywhere, and all three are reachable via real, bookmarkable routes.

**Questions** (depend on the tasks above)

- [ ] Why is reading a query parameter once, on initial render, still consistent with this exercise's "no state beyond what's necessary to render the initial view" rule? What would cross the line into "real interactivity" that's out of scope until Exercise 5?
- [ ] What would you need to add to make Timeline's filters _actually_ filter the list when a user changes them? (You don't have to build it. Just name the concept you'd need)
- [ ] Across the 3 views you've now fully migrated, what's one piece of duplicated logic or markup you noticed but didn't extract yet? Why didn't you, and would you if you had more time?

---
