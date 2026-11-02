import type { Location } from "../../types.js";
import { Panel } from "../../components/Panel.js";
import { LocationCard } from "./LocationCard.js";

export type LocationsViewProps = {
  locations: Location[];
};

export function LocationsView({ locations }: LocationsViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="locations-title">
        <h2 id="locations-title">Locations</h2>

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
