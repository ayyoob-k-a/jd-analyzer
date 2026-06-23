export interface Improvement {
  title: string;
  detail: string;
  action?: string; // e.g. "View Examples", "Learn How", "Get Templates"
}

export interface AnalysisResult {
  match_score: number;          // 0–100 integer
  missing_keywords: string[];   // keywords NOT found in resume
  matched_keywords: string[];   // keywords found in resume
  improvements: Improvement[];  // exactly 3
}

/** One analyzed role entry used in bulk mode */
export interface AnalyzedRole {
  name: string;           // display name for the tab (derived from JD first line)
  result: AnalysisResult;
}
