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

/** Ranked role entry returned by bulk analysis */
export interface RankedRole {
  role_title: string;
  match_score: number;
  primary_reason: string;
}

export interface TailoredTipsResult {
  executive_summary: string;
  bullet_point_rewrites: string[];
  interview_prep_focus: string[];
}
