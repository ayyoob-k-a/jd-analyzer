'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import AnalyzeForm from '@/components/AnalyzeForm';
import BulkForm from '@/components/BulkForm';
import LoadingScreen from '@/components/LoadingScreen';
import { saveResult, saveBulkResults, hasShownSplash, setSplashShown } from '@/lib/store';
import type { AnalysisResult, RankedRole } from '@/lib/types';

type AppView = 'form' | 'loading';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [view, setView] = useState<AppView>('form');
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
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
