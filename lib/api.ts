import type { AnalysisResult } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ── Mock mode ─────────────────────────────────────────────────────────────────
// Set USE_MOCK = false when your real backend is ready.
const USE_MOCK = true;

/** Three distinct mock results so bulk mode shows varied scores per role */
const MOCK_RESULTS: AnalysisResult[] = [
  {
    match_score: 75,
    missing_keywords: ['Kubernetes', 'AWS Lambda', 'Microservices', 'Terraform', 'Agile Coaching'],
    matched_keywords: ['TypeScript', 'React Native', 'GraphQL', 'System Design', 'CI/CD Pipelines', 'Node.js'],
    improvements: [
      {
        title: 'Quantify Impact',
        detail: 'Add specific metrics to your "React Native" project, such as "reduced load time by 30%."',
        action: 'View Examples',
      },
      {
        title: 'Bridge the Cloud Gap',
        detail: "You mentioned 'Cloud Architecture' but missed 'AWS Lambda'. Explicitly name the services you used.",
        action: 'Learn How',
      },
      {
        title: 'Lead with Keywords',
        detail: "Move your 'TypeScript' proficiency to your professional summary for immediate ATS visibility.",
        action: 'Get Templates',
      },
    ],
  },
  {
    match_score: 52,
    missing_keywords: ['Docker', 'Kubernetes', 'Machine Learning', 'Python', 'Data Pipelines'],
    matched_keywords: ['JavaScript', 'React', 'REST APIs', 'PostgreSQL', 'Agile'],
    improvements: [
      {
        title: 'Add Cloud Skills',
        detail: "The JD emphasizes Docker and Kubernetes heavily. Even a personal project deploying to AWS ECS would strengthen your profile.",
        action: 'Find Courses',
      },
      {
        title: 'Show Leadership',
        detail: "Add a bullet for each role where you mentored others or led a project — leadership signals matter at this level.",
        action: 'See Examples',
      },
      {
        title: 'Reorder Your Stack',
        detail: "List your most relevant technologies first. Currently 'JavaScript' appears after less relevant items.",
        action: 'Get Templates',
      },
    ],
  },
  {
    match_score: 38,
    missing_keywords: ['Go', 'Rust', 'Distributed Systems', 'gRPC', 'Apache Kafka', 'Elasticsearch'],
    matched_keywords: ['JavaScript', 'Git', 'Agile'],
    improvements: [
      {
        title: 'Build Core Skills',
        detail: "This role requires distributed-systems experience. Start with a side project using Kafka or RabbitMQ to fill the gap.",
        action: 'Find Resources',
      },
      {
        title: 'Get Certifications',
        detail: "AWS or GCP certifications would immediately signal backend credibility to this hiring team.",
        action: 'View Paths',
      },
      {
        title: 'Target Similar Roles',
        detail: "Your current experience is a strong match for mid-level roles. Consider those to build toward this position.",
        action: 'See Options',
      },
    ],
  },
];

/** Round-robin index so each parallel call in a bulk session gets a different mock */
let mockCallIndex = 0;

function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// ─────────────────────────────────────────────────────────────────────────────

export async function analyzeResume(
  jd: string,
  resume: File
): Promise<AnalysisResult> {
  if (USE_MOCK) {
    // Capture the index synchronously before the await so parallel calls each get a different result
    const idx = mockCallIndex++ % MOCK_RESULTS.length;
    await mockDelay(2500);
    return MOCK_RESULTS[idx];
  }

  const form = new FormData();
  form.append('jd', jd);
  form.append('resume', resume);

  const res = await fetch(`${BASE}/api/analyze`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? `Server error ${res.status}`
    );
  }

  return res.json();
}
