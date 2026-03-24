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
      <label className="composer-label" htmlFor="problemtext">
        Maschine einspeisen
      </label>
      <textarea
        aria-label="Problemtext"
        id="problemtext"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Problemtext eingeben"
        rows={6}
      />
      <div className="composer-actions">
        <button disabled={loading || !text.trim()} type="submit">
          {loading ? "Analysiere..." : "Analyse starten"}
        </button>
      </div>
    </form>
  );
}
