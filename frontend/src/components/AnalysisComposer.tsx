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
      <h1 className="composer-label">Problem eingeben</h1>
      <textarea
        aria-label="Problemtext"
        id="problemtext"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Problemtext eingeben"
        rows={4}
      />
      <div className="composer-actions">
        <button disabled={loading || !text.trim()} type="submit">
          {loading ? "Analysiere..." : "Analyse starten"}
        </button>
      </div>
    </form>
  );
}
