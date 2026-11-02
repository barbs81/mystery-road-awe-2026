import { useParams } from "react-router-dom";
import { Panel } from "../../components/Panel.js";
import type { Person } from "../../types.js";

export type PersonDetailViewProps = {
  people: Person[];
};

export function PersonDetailView({ people }: PersonDetailViewProps) {
  const { personId } = useParams<{ personId: string }>();
  const person = people.find((candidate) => candidate.id === personId);

  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="person-detail-title">
        {person ? (
          <>
            <h2 id="person-detail-title">{person.name}</h2>
            <Panel title="Person details">
              <p>
                <strong>Role:</strong> {person.role}
              </p>
              <p>
                <strong>Speciality:</strong> {person.speciality}
              </p>
              <p>{person.background}</p>
            </Panel>
          </>
        ) : (
          <>
            <h2 id="person-detail-title">Person not found</h2>
            <Panel title="Unknown person">
              <p>
                No person matches the ID <strong>{personId}</strong>.
              </p>
            </Panel>
          </>
        )}
      </section>
    </main>
  );
}
