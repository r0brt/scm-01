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
          <p className="eyebrow">Raw Input</p>
          <h1>Deterministische Filterstrecke</h1>
        </div>
        <span className="buffer-indicator">Buffer: {text.length}/5000 chars</span>
      </div>
      <label htmlFor="problemtext">Problemtext</label>
      <textarea
        id="problemtext"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Paste social feed, article or transcript for structured purification."
        rows={7}
      />
      <button disabled={loading || !text.trim()} type="submit">
        {loading ? "Analysiere..." : "Analyse starten"}
      </button>
    </form>
  );
}
