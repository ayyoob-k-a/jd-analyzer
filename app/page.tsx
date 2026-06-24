'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AnalyzeForm from '@/components/AnalyzeForm';
import BulkForm from '@/components/BulkForm';
import LoadingScreen from '@/components/LoadingScreen';
import Footer from '@/components/Footer';
import { saveResult, saveBulkResults, hasShownSplash, setSplashShown } from '@/lib/store';
import type { AnalysisResult, RankedRole } from '@/lib/types';
import { toast } from 'sonner';

type AppView = 'form' | 'loading' | 'error';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [view, setView] = useState<AppView>('form');
  const [appError, setAppError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(!hasShownSplash);
  const router = useRouter();

  useEffect(() => {
    if (showSplash) {
      setSplashShown();
      const timer = setTimeout(() => setShowSplash(false), 2400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resultReadyRef = useRef(false);
  const animationDoneRef = useRef(false);

  const tryNavigate = () => {
    if (resultReadyRef.current && animationDoneRef.current) {
      router.push('/results');
    }
  };

  const handleLoadingStart = () => {
    resultReadyRef.current = false;
    animationDoneRef.current = false;
    setView('loading');
  };

  const handleError = (msg: string) => {
    setAppError(msg);
    setView('error');
  };

  const handleSuccess = (result: AnalysisResult) => {
    saveResult(result);
    resultReadyRef.current = true;
    tryNavigate();
  };

  const handleBulkSuccess = (roles: RankedRole[]) => {
    saveBulkResults(roles);
    resultReadyRef.current = true;
    tryNavigate();
  };

  const handleAnimationComplete = () => {
    animationDoneRef.current = true;
    tryNavigate();
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-background"
          >
            <div className="flex items-center">
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight flex items-center">
                {"JD Analyzer".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1, delay: i * 0.1 }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-[4px] h-9 md:h-10 bg-primary ml-1"
                />
              </h1>
            </div>
          </motion.div>
        ) : view === 'loading' ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 bg-background"
          >
            <LoadingScreen onComplete={handleAnimationComplete} />
          </motion.div>
        ) : view === 'error' ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center px-6"
          >
            <div className="max-w-md w-full bg-card rounded-3xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              {/* Subtle top red border accent */}
              <div className="h-1.5 w-full bg-rose-500" />
              
              <div className="p-8 md:p-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Service Interruption</h1>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  We encountered an unexpected technical issue while processing your request. Our systems have logged the failure.
                </p>

                {/* Technical Error Box */}
                <div className="bg-muted/40 rounded-xl p-4 mb-8 border border-border/50">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Error Details</p>
                  <p className="text-xs font-mono text-foreground break-words leading-relaxed">
                    {appError || "ERR_INTERNAL_SERVER: The processing pipeline failed to return a valid response."}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setView('form');
                      setAppError(null);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-xl h-12 font-semibold text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Try Again
                  </button>
                  {/* <button
                    onClick={() => {
                      const ua = typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown';
                      const time = new Date().toISOString();
                      const body = `Hello JD Analyzer Support Team,%0D%0A%0D%0AI encountered an unexpected issue while using the platform. Below are the technical details:%0D%0A%0D%0A--------------------------------------------------%0D%0AError Message:%0D%0A${appError || 'Unknown API Error'}%0D%0A%0D%0ATimestamp: ${time}%0D%0ABrowser/OS: ${ua}%0D%0A--------------------------------------------------%0D%0A%0D%0AAdditional Context:%0D%0A[Please briefly describe what you were doing before the error occurred]%0D%0A%0D%0AThank you.`;
                      window.location.href = `mailto:heyayyoob@gmail.com?subject=JD Analyzer Error Report - ${new Date().getTime()}&body=${body}`;
                    }}
                    className="w-full bg-transparent text-muted-foreground border border-border hover:bg-muted/50 hover:text-foreground transition-colors rounded-xl h-12 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Contact Support
                  </button> */}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex flex-col"
          >
            <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="max-w-5xl mx-auto px-6 py-6 w-full flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'single' ? (
                  <motion.div
                    key="single"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AnalyzeForm
                      onSuccess={handleSuccess}
                      onLoadingStart={handleLoadingStart}
                      onError={handleError}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="bulk"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <BulkForm
                      onBulkSuccess={handleBulkSuccess}
                      onLoadingStart={handleLoadingStart}
                      onError={handleError}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

    
      {/* <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        <button
          onClick={() => toast.error('This is a simulated validation toast error!')}
          className="bg-zinc-800 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg opacity-30 hover:opacity-100 transition-opacity"
        >
          Test Toast Error
        </button>
        <button
          onClick={() => handleError('Simulated 500 Internal Server Error for testing the Error UI.')}
          className="bg-rose-600 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg opacity-30 hover:opacity-100 transition-opacity"
        >
          Test Server Error
        </button>
      </div> */}
      {/* ========================================================================= */}
    </div>
  );
}
