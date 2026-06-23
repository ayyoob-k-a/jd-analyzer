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
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-background"
    >
      {/* ── Animated icon ── */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer ping ring */}
        <div
          className="absolute rounded-full animate-ping bg-primary/20"
          style={{ width: '130px', height: '130px' }}
        />
        {/* Middle static ring */}
        <div
          className="absolute rounded-full bg-primary/30"
          style={{ width: '104px', height: '104px' }}
        />
        {/* Blue circle */}
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl bg-primary"
        >
          {/* Sparkle / stars icon */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
          >
            <path d="M12 2 L13.8 8.4 L20 9.3 L15.7 13.5 L16.8 19.7 L12 16.9 L7.2 19.7 L8.3 13.5 L4 9.3 L10.2 8.4 Z" />
            <circle cx="19.5" cy="3.5" r="1.4" opacity="0.7" />
            <circle cx="4.5" cy="19" r="1" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* ── Heading ── */}
      <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
        Analyzing your resume&hellip;
      </h1>
      <p className="text-muted-foreground text-base text-center mb-10 max-w-sm leading-relaxed">
        Our AI is meticulously scanning your skills and experiences to find the
        perfect match.
      </p>

      {/* ── Steps card ── */}
      <div
        className="bg-card rounded-2xl shadow-sm border border-border w-full p-7"
        style={{ maxWidth: '440px' }}
      >
        <div className="flex flex-col gap-5 mb-7">
          {STEP_LABELS.map((label, i) => {
            const status = steps[i];
            return (
              <div key={i} className="flex items-center gap-4">
                {/* Step icon */}
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                  {status === 'done' ? (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-emerald-600 dark:text-emerald-400"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : status === 'active' ? (
                    /* Spinning ring */
                    <svg
                      className="animate-spin"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-label="Loading"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="hsl(var(--border))"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="hsl(var(--primary))"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    /* Empty circle */
                    <div className="w-7 h-7 rounded-full border-2 border-border" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-sm ${
                    status === 'active'
                      ? 'font-semibold text-foreground'
                      : status === 'done'
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground">Analysis progress</span>
            <span className="text-xs font-semibold text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Time estimate ── */}
      <div className="flex items-center gap-2 mt-6 text-sm text-primary">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Usually takes less than 30 seconds
      </div>
    </div>
  );
}
