'use client';

import { useEffect, useRef, useState } from 'react';

type StepStatus = 'pending' | 'active' | 'done';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEP_LABELS = [
  'Resume text extracted',
  'Matching against job description\u2026',
  'Generating improvement suggestions',
];

// Timing (ms)
const STEP1_DONE = 900;
const STEP2_DONE = 2050;
const STEP3_DONE = 2650;
const NAVIGATE_AT = 2950;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [steps, setSteps] = useState<StepStatus[]>(['active', 'pending', 'pending']);
  const [progress, setProgress] = useState(5);
  const onCompleteRef = useRef(onComplete);
  // Keep the ref in sync with the prop after every render (never during render)
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    const t1 = setTimeout(() => setSteps(['done', 'active', 'pending']), STEP1_DONE);
    const t2 = setTimeout(() => setSteps(['done', 'done', 'active']), STEP2_DONE);
    const t3 = setTimeout(() => {
      setSteps(['done', 'done', 'done']);
      setProgress(100);
    }, STEP3_DONE);
    const t4 = setTimeout(() => onCompleteRef.current(), NAVIGATE_AT);

    // Smooth progress: 5 % → 88 % over 2.5 s
    const startTime = Date.now();
    const iv = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const target = 5 + (elapsed / 2500) * 83;
      setProgress((prev) => (prev < 88 ? Math.min(88, target) : prev));
    }, 40);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearInterval(iv);
    };
  }, []); // intentionally empty — runs once on mount

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      {/* ── Document Scanning Animation ── */}
      <div className="relative w-20 h-24 mb-10 border-2 border-border rounded-xl bg-card overflow-hidden shadow-sm flex items-center justify-center">
        {/* Mock Document Lines */}
        <div className="w-full h-full p-4 flex flex-col gap-2 opacity-40">
          <div className="w-3/4 h-1.5 bg-muted-foreground rounded-full" />
          <div className="w-full h-1.5 bg-muted-foreground rounded-full" />
          <div className="w-5/6 h-1.5 bg-muted-foreground rounded-full" />
          <div className="w-full h-1.5 bg-muted-foreground rounded-full" />
          <div className="w-4/5 h-1.5 bg-muted-foreground rounded-full" />
        </div>
        
        {/* Scanning Laser Line */}
        <div className="absolute inset-x-0 h-0.5 bg-primary shadow-[0_0_8px_2px_hsl(var(--primary)/0.5)] animate-[scan_2s_ease-in-out_infinite] opacity-80" />
      </div>

      {/* ── Heading ── */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight text-center">
        Processing Document
      </h1>
      <p className="text-muted-foreground text-sm text-center mb-10 max-w-sm leading-relaxed">
        Extracting skills and calculating match criteria.
      </p>

      {/* ── Minimalist Steps List ── */}
      <div className="w-full max-w-[320px] flex flex-col gap-6">
        {STEP_LABELS.map((label, i) => {
          const status = steps[i];
          return (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {status === 'done' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : status === 'active' ? (
                  <svg className="animate-spin text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              <span className={`text-[15px] font-medium tracking-wide transition-colors duration-500 ${
                status === 'active' ? 'text-foreground animate-pulse' : 
                status === 'done' ? 'text-foreground' : 'text-muted-foreground/40'
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Sleek Progress Bar ── */}
      <div className="w-full max-w-[320px] mt-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Progress</span>
          <span className="text-xs font-bold text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
