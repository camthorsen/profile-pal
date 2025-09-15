export interface ClipScore {
  label: string;
  score: number;
}

export interface ProfileResponse {
  clipScores: ClipScore[];
  labels: string[];
  transcript: string;
  summary: string;
}
