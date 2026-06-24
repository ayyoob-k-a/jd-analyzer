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
      {/* ── Sleek Gradient Spinner ── */}
      <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
        {/* Outer rotating thin ring */}
        <svg className="absolute inset-0 w-full h-full animate-[spin_2.5s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted/30" />
          <circle cx="50" cy="50" r="48" fill="none" stroke="url(#loading-gradient)" strokeWidth="2" strokeDasharray="150 150" strokeLinecap="round" />
          <defs>
            <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Inner pulsing core */}
        <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse flex items-center justify-center blur-[2px]" />
        <div className="absolute w-3 h-3 rounded-full bg-primary animate-ping opacity-80" />
      </div>

      {/* ── Heading ── */}
      <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight text-center">
        Analyzing Match...
      </h1>
      <p className="text-muted-foreground text-base text-center mb-12 max-w-sm leading-relaxed">
        Our AI is meticulously evaluating your experience against the job requirements.
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
