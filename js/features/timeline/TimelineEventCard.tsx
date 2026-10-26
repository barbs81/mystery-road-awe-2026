import type { TimelineEvent } from "../../types.js";
import { formatDate } from "../../utils.js";

export type TimelineEventCardProps = {
  event: TimelineEvent;
};

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  const certaintyBadgeClasses: Record<TimelineEvent["certainty"], string> = {
    confirmed: "badge-reviewed",
    reported: "badge-flagged",
    contradictory: "badge-critical",
  };

  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)} &middot;{" "}
        <span className={`badge ${certaintyBadgeClasses[event.certainty]}`}>
          {event.certainty}
        </span>
      </div>

      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </article>
  );
}
