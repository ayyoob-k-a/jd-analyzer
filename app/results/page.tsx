'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScoreGauge from '@/components/ScoreGauge';
import { loadResult, loadBulkResults, clearAll } from '@/lib/store';
import type { AnalysisResult, AnalyzedRole } from '@/lib/types';
import { Button } from '@/components/ui/button';

// ── Improvement icons ─────────────────────────────────────────────────────────
function IconWand() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 4V2m0 18v-2M4 9H2m18 0h-2M5.636 5.636 4.222 4.222m13.556 13.556-1.414-1.414M5.636 18.364 4.222 19.778M19.192 4.808l-1.414 1.414"/>
      <path d="M12 8 9 21l3-3 3 3L12 8z"/>
    </svg>
  );
}
function IconTarget() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function IconDocument() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
const IMPROVEMENT_ICONS = [<IconWand key="wand" />, <IconTarget key="target" />, <IconDocument key="doc" />];

// ── Match metadata ────────────────────────────────────────────────────────────
interface MatchMeta {
  label: string;
  badgeBgClass: string;
  iconClass: string;
  tabBadgeClass: string;
  description: string;
}

function getMatchMeta(score: number): MatchMeta {
  if (score >= 70) {
    return {
      label: 'Strong Match',
      badgeBgClass: 'bg-emerald-100 dark:bg-emerald-500/20',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
      tabBadgeClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description:
        "You have a significant portion of the core requirements. With a few minor adjustments to your resume, you'll be a top contender for this role.",
    };
  }
  if (score >= 40) {
    return {
      label: 'Partial Match',
      badgeBgClass: 'bg-amber-100 dark:bg-amber-500/20',
      iconClass: 'text-amber-600 dark:text-amber-400',
      tabBadgeClass: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
      description:
        'Your background aligns with several key requirements. Focus on bridging the identified skill gaps to strengthen your application.',
    };
  }
  return {
    label: 'Weak Match',
    badgeBgClass: 'bg-rose-100 dark:bg-rose-500/20',
    iconClass: 'text-rose-600 dark:text-rose-400',
    tabBadgeClass: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    description:
      'There are significant gaps between your profile and this role. Consider building the missing skills or targeting roles that better match your current experience.',
  };
}

// ── Single result view ────────────────────────────────────────────────────────
function ResultView({ result }: { result: AnalysisResult }) {
  const meta = getMatchMeta(result.match_score);
  const matchedKeywords: string[] = result.matched_keywords ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Score + match strength */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-8" aria-label="Match score">
        <div className="flex items-center gap-10">
          <ScoreGauge score={result.match_score} />
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${meta.badgeBgClass}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={meta.iconClass} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-foreground text-2xl font-bold">{meta.label}</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">{meta.description}</p>
          </div>
        </div>
      </section>

      {/* Keywords */}
      <div className="grid grid-cols-2 gap-4">
        <section className="bg-card rounded-2xl border border-border shadow-sm p-6" aria-label="Missing keywords">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-rose-500 dark:text-rose-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h2 className="text-sm font-bold text-foreground">Missing Keywords</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((kw) => (
              <span key={kw} className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-full px-3 py-1 text-xs font-medium">
                <span className="text-rose-400 dark:text-rose-500 font-bold leading-none">×</span>
                {kw}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-2xl border border-border shadow-sm p-6" aria-label="Matched keywords">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h2 className="text-sm font-bold text-foreground">Matched Keywords</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <span key={kw} className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full px-3 py-1 text-xs font-medium">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {kw}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Improvements */}
      <section className="bg-card rounded-2xl border border-border shadow-sm p-8" aria-label="Improvement suggestions">
        <h2 className="text-xl font-bold text-foreground text-center mb-7">
          3 Ways to Strengthen Your Resume
        </h2>
        <div className="grid grid-cols-3 gap-5">
          {result.improvements.map((item, i) => (
            <div key={i} className="rounded-xl border border-border p-5 flex flex-col bg-card" style={{ borderLeftWidth: '3px', borderLeftColor: 'hsl(var(--primary))' }}>
              <div className="mb-3">{IMPROVEMENT_ICONS[i]}</div>
              <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{item.detail}</p>
              <a
                href="#"
                className="mt-4 text-xs font-semibold text-primary hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {item.action ?? 'Learn More'} &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();

  // Load whichever result type was saved (bulk takes priority, falls back to single)
  const [bulkRoles] = useState<AnalyzedRole[] | null>(() =>
    typeof window !== 'undefined' ? loadBulkResults() : null
  );
  const [singleResult] = useState<AnalysisResult | null>(() =>
    typeof window !== 'undefined' ? (bulkRoles ? null : loadResult()) : null
  );

  const [activeRoleIndex, setActiveRoleIndex] = useState(0);

  const isBulk = bulkRoles !== null && bulkRoles.length > 1;
  const hasData = isBulk || singleResult !== null || (bulkRoles && bulkRoles.length === 1);

  useEffect(() => {
    if (!hasData) router.replace('/');
  }, [hasData, router]);

  const handleAnalyzeAnother = () => {
    clearAll();
    router.push('/');
  };

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-label="Loading…">
        <svg className="animate-spin h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  // Determine which single result to show
  const activeResult: AnalysisResult = isBulk
    ? bulkRoles![activeRoleIndex].result
    : (bulkRoles?.[0]?.result ?? singleResult!);

  return (
    <div className="min-h-screen pb-24 bg-background">
      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Bulk tab bar (only shown when >1 role) ── */}
        {isBulk && (
          <nav
            className="bg-card rounded-2xl border border-border shadow-sm p-3 mb-4 flex items-center gap-2 overflow-x-auto"
            aria-label="Role tabs"
          >
            {bulkRoles!.map((role, i) => {
              const meta = getMatchMeta(role.result.match_score);
              const isActive = i === activeRoleIndex;
              return (
                <button
                  key={i}
                  id={`role-tab-${i}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="role-panel"
                  onClick={() => setActiveRoleIndex(i)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {/* Role number circle */}
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </span>

                  {/* Role name (truncated) */}
                  <span className="max-w-[140px] truncate">{role.name}</span>

                  {/* Score badge */}
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : meta.tabBadgeClass
                    }`}
                  >
                    {role.result.match_score}%
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* ── Result content ── */}
        <div id="role-panel" role="tabpanel" aria-labelledby={isBulk ? `role-tab-${activeRoleIndex}` : undefined}>
          <ResultView result={activeResult} />
        </div>

      </main>

      {/* ── Sticky footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {isBulk
              ? `${bulkRoles!.length} roles analyzed · just now`
              : 'Last updated just now'}
          </div>

          <div className="flex items-center gap-3">
            <Button
              id="download-tips-btn"
              variant="outline"
              className="rounded-full h-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Tips
            </Button>

            <Button
              id="analyze-another-btn"
              onClick={handleAnalyzeAnother}
              className="rounded-full h-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Analyze Another
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
