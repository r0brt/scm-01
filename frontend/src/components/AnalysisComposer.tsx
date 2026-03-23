import type { FormEvent } from "react";

type AnalysisComposerProps = {
  text: string;
  loading: boolean;
  onTextChange: (nextValue: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AnalysisComposer({
  text,
  loading,
  onTextChange,
  onSubmit,
}: AnalysisComposerProps) {
  return (
    <form className="composer-panel" onSubmit={onSubmit}>
      <div className="composer-header">
        <div>
          <p className="eyebrow">Einspeisung</p>
          <h1>Deterministische Filterstrecke</h1>
          <p className="composer-copy">
            Ein frei formulierter Problemtext wird kontrolliert durch sechs Ebenen gefuehrt und
            im Frontend bewusst sequentiell sichtbar gemacht.
          </p>
        </div>
        <span className="buffer-indicator">Buffer: {text.length}/5000 chars</span>
      </div>
      <label htmlFor="problemtext">Problemtext</label>
      <textarea
        id="problemtext"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Problemtext, Feed-Auszug oder Transkript eingeben, um die Filterstrecke zu starten."
        rows={7}
      />
      <div className="composer-actions">
        <p className="composer-note">Der Analysevertrag bleibt synchron, die Darstellung entfaltet sich didaktisch.</p>
        <button disabled={loading || !text.trim()} type="submit">
          {loading ? "Analysiere..." : "Analyse starten"}
        </button>
      </div>
    </form>
  );
}
