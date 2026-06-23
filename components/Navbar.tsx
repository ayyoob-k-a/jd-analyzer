'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface NavbarProps {
  activeTab: 'single' | 'bulk';
  onTabChange: (tab: 'single' | 'bulk') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid hydration mismatch — only show toggle after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isDark = resolvedTheme === 'dark';

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-foreground text-background"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15l2 2 4-4"></path>
            </svg>
          </div>
          <span className="font-bold text-foreground text-[15px] tracking-tight">
            JD Analyzer
          </span>
        </div>

        {/* ── Single / Bulk tab toggle ── */}
        <div
          className="flex items-center rounded-full p-1 gap-0.5 bg-muted"
          role="tablist"
          aria-label="Analysis mode"
        >
          <button
            id="tab-single"
            role="tab"
            aria-selected={activeTab === 'single'}
            onClick={() => onTabChange('single')}
            className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === 'single'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Single
          </button>
          <button
            id="tab-bulk"
            role="tab"
            aria-selected={activeTab === 'bulk'}
            onClick={() => onTabChange('bulk')}
            className={`px-5 py-1.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === 'bulk'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bulk
          </button>
        </div>

        {/* ── Right side: dark toggle + Analyze badge ── */}
        <div className="flex items-center gap-4">
          {/* Dark / Light toggle */}
          {mounted && (
            <div className="flex items-center gap-2" aria-label="Toggle colour scheme">
              {/* Sun icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors ${isDark ? 'text-muted-foreground' : 'text-foreground'}`}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>

              <Switch
                id="theme-toggle"
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              />

              {/* Moon icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors ${isDark ? 'text-foreground' : 'text-muted-foreground'}`}
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          )}

          {/* Current page badge */}
          <div
            className="px-4 py-1.5 rounded-full text-sm font-semibold text-primary-foreground select-none bg-primary"
            aria-current="page"
          >
            Analyze
          </div>
        </div>
      </div>
    </nav>
  );
}
