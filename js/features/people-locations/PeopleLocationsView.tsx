import type { Location, Person } from "../../types.js";
import { Panel } from "../../components/Panel.js";
import { LocationCard } from "./LocationCard.js";
import { PersonCard } from "./PersonCard.js";

export type PeopleLocationsViewProps = {
  people: Person[];
  locations: Location[];
};

export function PeopleLocationsView({
  people,
  locations,
}: PeopleLocationsViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="people-locations-title">
        <h2 id="people-locations-title">People &amp; Locations</h2>

        <Panel title="People">
          <div className="people-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </Panel>

        <Panel title="Locations">
          <div className="locations-grid">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </Panel>
      </section>
    </main>
  );
}
