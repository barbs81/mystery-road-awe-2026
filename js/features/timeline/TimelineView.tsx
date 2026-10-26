import type { TimelineEvent } from "../../types.js";
import { Panel } from "../../components/Panel.js";
import { TimelineEventCard } from "./TimelineEventCard.js";

export type TimelineViewProps = {
  events: TimelineEvent[];
};

export function TimelineView({ events }: TimelineViewProps) {
  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="timeline-title">
        <h2 id="timeline-title">Timeline</h2>

        <Panel title="Timeline events">
          {events.length === 0 ? (
            <p>No timeline events loaded yet.</p>
          ) : (
            events.map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))
          )}
        </Panel>
      </section>
    </main>
  );
}
