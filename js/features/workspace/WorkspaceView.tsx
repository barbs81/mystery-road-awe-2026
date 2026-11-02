import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Panel } from "../../components/Panel.js";
import { state } from "../../state.js";
import type { Evidence, Person } from "../../types.js";

const HYPOTHESIS_STORAGE_KEY = "remotion_hypothesis";

export type WorkspaceViewProps = {
  evidence: Evidence[];
  people: Person[];
};

export function WorkspaceView({ evidence, people }: WorkspaceViewProps) {
  const [hypothesisSaved, setHypothesisSaved] = useState(false);
  const [suspectId, setSuspectId] = useState("");
  const [nature, setNature] = useState("");
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [confidence, setConfidence] = useState("50");
  const [explanation, setExplanation] = useState("");
  const [alternative, setAlternative] = useState("");
  const bookmarkedEvidence = evidence.filter((item) =>
    state.bookmarks.includes(item.id),
  );
  const notes = evidence.filter((item) => state.notesStore[item.id]);

  function saveHypothesis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = {
      suspectId,
      nature,
      evidenceIds: selectedEvidenceIds,
      confidence,
      explanation,
      alternative,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(HYPOTHESIS_STORAGE_KEY, JSON.stringify(draft));
    setHypothesisSaved(true);
  }

  return (
    <main className="app-main react-route-content">
      <section className="react-view" aria-labelledby="workspace-title">
        <h2 id="workspace-title">Investigator Workspace</h2>
        <div className="workspace-grid">
          <Panel title="Bookmarked Evidence">
            {bookmarkedEvidence.length === 0 ? (
              <p>No bookmarked evidence yet.</p>
            ) : (
              bookmarkedEvidence.map((item) => (
                <div className="mini-list-item" key={item.id}>
                  <strong>{item.id}</strong> — {item.title}{" "}
                  <Link className="btn btn-small btn-secondary" to="/evidence">
                    Open
                  </Link>
                </div>
              ))
            )}
          </Panel>

          <Panel title="Personal Notes">
            <p className="hint-text">
              Notes are attached to evidence items from the Evidence view.
            </p>
            {notes.length === 0 ? (
              <p>No notes yet.</p>
            ) : (
              notes.map((item) => (
                <div className="mini-list-item" key={item.id}>
                  <strong>{item.id}</strong> — {item.title}
                  <div>{state.notesStore[item.id]}</div>
                </div>
              ))
            )}
          </Panel>
        </div>

        <Panel title="Hypothesis Draft">
          <form onSubmit={saveHypothesis}>
            <div className="form-row">
              <label htmlFor="react-hyp-suspect">
                Suspected responsible person
              </label>
              <select
                id="react-hyp-suspect"
                name="suspect"
                value={suspectId}
                onChange={(event) => setSuspectId(event.target.value)}
              >
                <option value="">Select a person...</option>
                {people.map((person) => (
                  <option value={person.id} key={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="react-hyp-nature">
                Accidental or deliberate incident
              </label>
              <select
                id="react-hyp-nature"
                name="nature"
                value={nature}
                onChange={(event) => setNature(event.target.value)}
              >
                <option value="">Select...</option>
                <option value="accidental">Accidental</option>
                <option value="deliberate">Deliberate</option>
                <option value="unclear">Unclear</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="react-hyp-evidence">
                Selected supporting evidence
              </label>
              <select
                id="react-hyp-evidence"
                name="evidence"
                multiple
                size={6}
                value={selectedEvidenceIds}
                onChange={(event) =>
                  setSelectedEvidenceIds(
                    Array.from(
                      event.target.selectedOptions,
                      (option) => option.value,
                    ),
                  )
                }
              >
                {evidence.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.id} - {item.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="react-hyp-confidence">Confidence (0-100)</label>
              <input
                id="react-hyp-confidence"
                name="confidence"
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(event) => setConfidence(event.target.value)}
              />
              <output htmlFor="react-hyp-confidence">{confidence}</output>
            </div>
            <div className="form-row">
              <label htmlFor="react-hyp-explanation">Written explanation</label>
              <textarea
                id="react-hyp-explanation"
                name="explanation"
                rows={4}
                placeholder="Explain your reasoning..."
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="react-hyp-alternative">
                Alternative explanation
              </label>
              <textarea
                id="react-hyp-alternative"
                name="alternative"
                rows={3}
                placeholder="What else could explain the evidence?"
                value={alternative}
                onChange={(event) => setAlternative(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save hypothesis draft
            </button>
            {hypothesisSaved && <span className="saved-msg">Saved</span>}
          </form>
        </Panel>
      </section>
    </main>
  );
}
