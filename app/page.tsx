'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AnalyzeForm from '@/components/AnalyzeForm';
import BulkForm from '@/components/BulkForm';
import LoadingScreen from '@/components/LoadingScreen';
import { saveResult, saveBulkResults } from '@/lib/store';
import type { AnalysisResult, AnalyzedRole } from '@/lib/types';

type AppView = 'form' | 'loading';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [view, setView] = useState<AppView>('form');
  const router = useRouter();

  /**
   * Navigation fires when BOTH conditions are true:
   *   1. API returned and results saved  (resultReadyRef)
   *   2. Loading animation finished      (animationDoneRef)
   */
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

  /** Single mode — AnalyzeForm */
  const handleSuccess = (result: AnalysisResult) => {
    saveResult(result);
    resultReadyRef.current = true;
    tryNavigate();
  };

  /** Bulk mode — BulkForm (multiple roles) */
  const handleBulkSuccess = (roles: AnalyzedRole[]) => {
    saveBulkResults(roles);
    resultReadyRef.current = true;
    tryNavigate();
  };

  const handleAnimationComplete = () => {
    animationDoneRef.current = true;
    tryNavigate();
  };

  return (
    <div className="min-h-screen bg-background">
      {view === 'form' && (
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {view === 'loading' ? (
        <LoadingScreen onComplete={handleAnimationComplete} />
      ) : (
        <main className="max-w-5xl mx-auto px-6 py-10">
          {activeTab === 'single' ? (
            <AnalyzeForm
              onSuccess={handleSuccess}
              onLoadingStart={handleLoadingStart}
            />
          ) : (
            <BulkForm
              onBulkSuccess={handleBulkSuccess}
              onLoadingStart={handleLoadingStart}
            />
          )}
        </main>
      )}
    </div>
  );
}
