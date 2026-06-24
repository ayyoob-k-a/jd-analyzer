'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ScoreGauge from '@/components/ScoreGauge';
import { loadResult, loadBulkResults, clearAll, currentFile, currentJd } from '@/lib/store';
import { generateTailoredTips } from '@/lib/api';
import type { AnalysisResult, RankedRole } from '@/lib/types';
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
      <section className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8" aria-label="Match score">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-10">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

// ── Bulk Result View (Leaderboard) ────────────────────────────────────────────
function BulkLeaderboardView({ roles }: { roles: RankedRole[] }) {
  const sortedRoles = [...roles].sort((a, b) => b.match_score - a.match_score);

  return (
    <div className="flex flex-col gap-8 md:gap-12 mt-4 md:mt-8">
      <div className="text-center mb-2">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
          Role Leaderboard
        </h2>
        <p className="text-muted-foreground mt-4 text-lg md:text-xl font-medium max-w-xl mx-auto">
          Here is how your resume stacks up against your target roles.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sortedRoles.map((role, i) => {
          const meta = getMatchMeta(role.match_score);
          const isTop = i === 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className={`relative group overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                isTop 
                  ? 'bg-gradient-to-br from-background to-muted border-[1.5px] border-primary/30 shadow-lg' 
                  : 'bg-card border border-border shadow-sm hover:border-primary/20'
              }`}
            >
              {/* Subtle glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative z-10">
                
                {/* Rank Badge & Score */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-2xl mb-4 font-black text-xl shadow-sm ${
                    isTop ? 'bg-primary text-primary-foreground shadow-primary/30' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isTop ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                    ) : (
                      `#${i + 1}`
                    )}
                  </div>
                  <ScoreGauge score={role.match_score} />
                  <span className={`mt-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${meta.badgeBgClass} ${meta.iconClass}`}>
                    {meta.label}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left md:mt-2">
                  <h3 className={`font-bold tracking-tight text-foreground ${isTop ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                    {role.role_title}
                  </h3>
                  <div className="mt-4 text-muted-foreground leading-relaxed text-sm md:text-base">
                    {role.primary_reason}
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();

  // Load whichever result type was saved (bulk takes priority, falls back to single)
  const [bulkRoles] = useState<RankedRole[] | null>(() =>
    typeof window !== 'undefined' ? loadBulkResults() : null
  );
  const [singleResult] = useState<AnalysisResult | null>(() =>
    typeof window !== 'undefined' ? (bulkRoles ? null : loadResult()) : null
  );


  const [isDownloading, setIsDownloading] = useState(false);

  const isBulk = bulkRoles !== null && bulkRoles.length > 1;
  const hasData = isBulk || singleResult !== null || (bulkRoles && bulkRoles.length === 1);

  useEffect(() => {
    if (!hasData) router.replace('/');
  }, [hasData, router]);

  const handleAnalyzeAnother = () => {
    clearAll();
    router.push('/');
  };

  const handleDownloadTips = async () => {
    try {
      const resume = currentFile;
      const jd = currentJd;

      if (!resume || !jd) {
        alert('Session data expired. Please analyze your resume again.');
        return;
      }

      setIsDownloading(true);
      const tipsData = await generateTailoredTips(jd, resume);
      const { generatePdfDocument } = await import('@/lib/pdf');
      generatePdfDocument(tipsData);
    } catch (err) {
      console.error(err);
      alert('Failed to generate tips. Please try again.');
    } finally {
      setIsDownloading(false);
    }
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

  return (
    <div className="min-h-screen pb-24 bg-background">
      <header className="max-w-4xl mx-auto px-6 pt-8 pb-2">
        <Button
          variant="ghost"
          onClick={handleAnalyzeAnother}
          className="text-muted-foreground hover:text-foreground pl-0 group -ml-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-2 transition-transform group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Button>
      </header>

      <motion.main 
        className="max-w-4xl mx-auto px-6 py-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {isBulk ? (
          <BulkLeaderboardView roles={bulkRoles!} />
        ) : (
          <ResultView result={singleResult!} />
        )}
      </motion.main>

      {/* ── Sticky footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 pb-safe">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {isBulk
              ? `${bulkRoles!.length} roles analyzed · just now`
              : 'Last updated just now'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              id="download-tips-btn"
              variant="outline"
              className="rounded-full h-10 flex-1 sm:flex-none"
              onClick={handleDownloadTips}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Tips
                </>
              )}
            </Button>

            <Button
              id="analyze-another-btn"
              onClick={handleAnalyzeAnother}
              className="rounded-full h-10 flex-1 sm:flex-none"
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
