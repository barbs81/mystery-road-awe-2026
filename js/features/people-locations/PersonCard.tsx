import type { Person } from "../../types.js";

export type PersonCardProps = {
  person: Person;
};

export function PersonCard({ person }: PersonCardProps) {
  return (
    <article className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={person.avatar}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>

      <ul>
        {person.responsibilities.map((responsibility) => (
          <li key={responsibility}>{responsibility}</li>
        ))}
      </ul>

      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
    </article>
  );
}
