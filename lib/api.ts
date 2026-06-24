import type { AnalysisResult, TailoredTipsResult, RankedRole } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://jd-analyzer-backend-54rx.onrender.com';

export async function analyzeResume(
  jd: string,
  resume: File
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append('jd_text', jd);
  form.append('resume', resume);

  const res = await fetch(`${BASE}/api/v1/analyze`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string }).detail ?? `Server error ${res.status}`
    );
  }

  const json = await res.json();
  console.log('API Response:', json);

  if (json.status !== 'success' || !json.data) {
    throw new Error('Invalid response from server');
  }

  const data = json.data;

  // Map backend response structure to frontend types
  return {
    match_score: data.match_score ?? 0,
    missing_keywords: data.missing_keywords ?? [],
    matched_keywords: data.matched_keywords ?? [],
    improvements: (data.improvements ?? []).map(
      (imp: { jd_reference?: string; suggestion?: string }) => ({
        title: imp.jd_reference ?? 'Improvement Area',
        detail: imp.suggestion ?? '',
      })
    ),
  };
}

export async function analyzeBulkResume(
  jds: string[],
  resume: File
): Promise<RankedRole[]> {
  const form = new FormData();
  form.append('jds_json', JSON.stringify(jds));
  form.append('resume', resume);

  const res = await fetch(`${BASE}/api/v1/bulk-analyze`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string }).detail ?? `Server error ${res.status}`
    );
  }

  const json = await res.json();
  console.log('Bulk API Response:', json);

  if (json.status !== 'success' || !json.data?.ranked_roles) {
    throw new Error('Invalid response from server');
  }

  return json.data.ranked_roles.map((data: { role_title?: string; match_score?: number; primary_reason?: string }) => ({
    role_title: data.role_title ?? 'Unknown Role',
    match_score: data.match_score ?? 0,
    primary_reason: data.primary_reason ?? 'No reason provided.',
  }));
}

export async function generateTailoredTips(
  jd: string,
  resume: File
): Promise<TailoredTipsResult> {
  const form = new FormData();
  form.append('jd_text', jd);
  form.append('resume', resume);

  const res = await fetch(`${BASE}/api/v1/tailored-tips`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string }).detail ?? `Server error ${res.status}`
    );
  }

  const json = await res.json();
  console.log('Tailored Tips Response:', json);

  if (json.status !== 'success' || !json.data) {
    throw new Error('Invalid response from server');
  }

  return json.data as TailoredTipsResult;
}
