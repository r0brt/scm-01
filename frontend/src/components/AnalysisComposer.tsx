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
      <h1 className="composer-label">Problem</h1>
      <textarea
        aria-label="Problemtext"
        id="problemtext"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Beschreibe das Problem kurz..."
        rows={3}
      />
      <div
        aria-label="Transparenzhinweis"
        className="composer-transparency"
        role="note"
      >
        <p className="composer-transparency-title">ⓘ Hinweis zur KI-Analyse</p>
        <div className="composer-transparency-copy">
          <p>Die Analyse strukturiert den eingegebenen Text, bewertet ihn aber nicht.</p>
          <p>Sie ersetzt keine Fakten-, Wahrheits- oder Rechtsprüfung.</p>
        </div>
        <div className="composer-transparency-copy composer-transparency-copy-secondary">
          <p>Bitte keine sensiblen oder personenbezogenen Daten eingeben.</p>
          <p>Eingaben und Resultate können im Archiv gespeichert werden.</p>
        </div>
      </div>
      <div className="composer-actions">
        <button disabled={loading || !text.trim()} type="submit">
          {loading ? "Analysiere..." : "Analyse starten"}
        </button>
      </div>
    </form>
  );
}
