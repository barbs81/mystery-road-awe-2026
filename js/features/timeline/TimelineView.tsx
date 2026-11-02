import type { Person, TimelineEvent } from "../../types.js";
import { Panel } from "../../components/Panel.js";
import { TimelineEventCard } from "./TimelineEventCard.js";
import { useSearchParams } from "react-router-dom";

export type TimelineViewProps = {
  events: TimelineEvent[];
  people: Person[];
};

export function TimelineView({ events, people }: TimelineViewProps) {
  const [searchParams] = useSearchParams();
  const personId = searchParams.get("person");
  const selectedPerson = people.find((person) => person.id === personId);
  const visibleEvents = personId
    ? selectedPerson
      ? events.filter((event) => event.personIds.includes(selectedPerson.id))
      : []
    : events;

  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Timeline</h2>

        <Panel title="Timeline events">
          {personId && selectedPerson && (
            <p>
              Showing events involving <strong>{selectedPerson.name}</strong>.
            </p>
          )}
          {personId && !selectedPerson && (
            <p>
              No person matches the requested filter:{" "}
              <strong>{personId}</strong>.
            </p>
          )}
          {visibleEvents.length === 0 && events.length === 0 ? (
            <p>No timeline events loaded yet.</p>
          ) : visibleEvents.length === 0 ? (
            <p>No timeline events match this person.</p>
          ) : (
            visibleEvents.map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))
          )}
        </Panel>
      </section>
    </main>
  );
}
