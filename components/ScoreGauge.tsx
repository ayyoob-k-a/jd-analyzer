'use client';

import { useEffect, useRef, useState } from 'react';

interface ScoreGaugeProps {
  score: number; // 0–100
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 1000;

  const cx = 80;
  const cy = 80;
  const r = 60;
  const circumference = 2 * Math.PI * r; // ≈ 376.99

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const strokeDashoffset = circumference * (1 - animatedScore / 100);

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: '160px', height: '160px' }}
      aria-label={`Match score: ${score} out of 100`}
      role="img"
    >
      <svg viewBox="0 0 160 160" width="160" height="160">
        {/* Background track — full circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="13"
        />
        {/* Animated score arc — starts from 12 o'clock */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          style={{ strokeDashoffset }}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </svg>

      {/* Centered score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground leading-none">
          {animatedScore}%
        </span>
        <span className="text-xs text-muted-foreground mt-1">Match Score</span>
      </div>
    </div>
  );
}
