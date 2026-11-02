import type { Person } from "../../types.js";
import { Panel } from "../../components/Panel.js";
import { PersonCard } from "./PersonCard.js";

export type PeopleViewProps = {
  people: Person[];
};

export function PeopleView({ people }: PeopleViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="people-title">
        <h2 id="people-title">People</h2>

        <Panel title="People">
          <div className="people-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}
