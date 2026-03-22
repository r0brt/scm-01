import type { AnalysisRun } from "./types";

const API_BASE = "";

export async function createAnalysis(text: string): Promise<AnalysisRun> {
  const response = await fetch(`${API_BASE}/api/v1/analyses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Analyse konnte nicht erstellt werden.");
  }

  return response.json();
}

export async function listAnalyses(): Promise<AnalysisRun[]> {
  const response = await fetch(`${API_BASE}/api/v1/analyses`);
  if (!response.ok) {
    throw new Error("Runs konnten nicht geladen werden.");
  }
  return response.json();
}

export async function getAnalysis(id: number): Promise<AnalysisRun> {
  const response = await fetch(`${API_BASE}/api/v1/analyses/${id}`);
  if (!response.ok) {
    throw new Error("Run konnte nicht geladen werden.");
  }
  return response.json();
}
