'use client';

import { useRef, useState } from 'react';
import { analyzeResume } from '@/lib/api';
import type { AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { setSessionData } from '@/lib/store';
import { toast } from 'sonner';

const SAMPLE_JD = `We are looking for a Senior UX Designer to join our Cloud team. Key requirements include experience with complex B2B systems, accessibility standards (WCAG), and a strong portfolio demonstrating leadership in the design process.

Minimum qualifications:
• 7+ years of experience in end-to-end product design
• Portfolio of shipped work demonstrating measurable impact
• Proficiency in Figma and prototyping tools
• Experience leading design sprints and cross-functional workshops

Preferred qualifications:
• Experience with Figma and prototyping...
• Experience with design systems and component libraries
• Familiarity with accessibility guidelines (WCAG 2.1)
• Ability to work with cross-functional teams across engineering and product`;

interface AnalyzeFormProps {
  onSuccess: (result: AnalysisResult) => void;
  onLoadingStart?: () => void;
  onError: (msg: string) => void;
}

export default function AnalyzeForm({ onSuccess, onLoadingStart, onError }: AnalyzeFormProps) {
  const [jd, setJd] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSet = (selected: File) => {
    setFile(selected);
    setFileName(selected.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFileSet(selected);
  };

  const handleFileClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSet(dropped);
  };

  const validate = (): boolean => {
    if (jd.trim().length < 50) {
      toast.error('Please paste a complete job description (at least 50 characters).');
      return false;
    }
    if (!file) {
      toast.error('Please upload your resume as a PDF.');
      return false;
    } else if (file.size < 500) {
      toast.error('The uploaded PDF appears to be empty or corrupted.');
      return false;
    } else if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit. Please upload a smaller PDF.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    onLoadingStart?.();
    try {
      const result = await analyzeResume(jd, file!);
      setSessionData(file!, jd);
      onSuccess(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      if (typeof onError === 'function') {
        onError(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div className="text-center mb-8 md:mb-12 mt-2">
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
          Master Your Career Fit.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Instantly compare your resume against industry-leading roles. Identify
          skill gaps and optimize your profile for the world&apos;s top tech companies.
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Two-column cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          {/* ── Left: Target Role card ── */}
          <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Target Role</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Paste the job description below
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setJd(SAMPLE_JD);
                }}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Load Sample
              </button>
            </div>

            {/* Textarea */}
            <div className="flex-1 px-5 py-4 flex flex-col">
              <label htmlFor="jd-textarea" className="sr-only">
                Job Description
              </label>
              <textarea
                id="jd-textarea"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder={
                  'Role: Senior UX Designer at Google...\n\nMinimum qualifications:\n• 5+ years of experience in end-to-end product design\n• Portfolio of shipped work...\n\nPreferred qualifications:\n• Experience with Figma and prototyping...\n• Ability to work with cross-functional teams...'
                }
                className="flex-1 w-full text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary rounded-xl p-3 bg-transparent leading-relaxed"
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          {/* ── Right: Your Resume card ── */}
          <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col">
            {/* Card header */}
            <div className="flex items-center gap-3 px-6 pt-6">
              <div className="text-muted-foreground flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Your Resume</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Securely upload your latest CV
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col px-5 py-4 gap-4">
              {/* Drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Upload resume file"
                className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-8 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDragOver
                    ? 'border-primary/50 bg-primary/10'
                    : file
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-border hover:border-primary/30 hover:bg-primary/5'
                }`}
                style={{ minHeight: '160px' }}
              >
                {file ? (
                  /* File selected */
                  <>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/20"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">
                        {fileName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ready to analyze
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleFileClear}
                      className="text-xs text-gray-400 hover:text-rose-500 transition-colors underline"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  /* Empty state */
                  <>
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center bg-primary/10"
                    >
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        Drop your PDF here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOCX, or RTF formats accepted
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="border border-border bg-card rounded-full px-5 py-2 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                    >
                      Browse Local Files
                    </button>
                  </>
                )}
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2.5 p-3.5 bg-muted rounded-xl">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Privacy First:</span>{' '}
                  Your data is encrypted at rest and never sold to third parties.
                  We use industry-standard processing for all analysis.
                </p>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              id="resume-file-input"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
        </div>

        {/* ── Submit + trust badges ── */}
        <div className="flex flex-col items-center gap-4">
          <Button
            id="analyze-submit-btn"
            type="submit"
            disabled={loading}
            className="rounded-full px-10 h-14 font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98] w-[260px]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing your resume…
              </>
            ) : (
              <>
                Run Fit Analysis
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </Button>

          {/* Trust badges */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              5 Free Scans / Month
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
