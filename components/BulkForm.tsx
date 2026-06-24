'use client';

import { useRef, useState } from 'react';
import { analyzeBulkResume } from '@/lib/api';
import type { RankedRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { setSessionData } from '@/lib/store';
import { toast } from 'sonner';

interface Role {
  id: number;
  jd: string;
  isExpanded: boolean;
}

interface BulkFormProps {
  onBulkSuccess: (roles: RankedRole[]) => void;
  onLoadingStart?: () => void;
  onError: (msg: string) => void;
}

const MAX_ROLES = 3;

function getRoleTitle(jd: string, index: number): string {
  if (!jd.trim()) return `New Target Role ${index + 1}`;
  const firstLine = jd.trim().split('\n')[0];
  const stripped = firstLine.replace(/^role:\s*/i, '');
  return stripped.length > 45 ? stripped.slice(0, 45) + '…' : stripped;
}

function getRoleSubtitle(jd: string): string {
  if (!jd.trim()) return 'Paste job description';
  return 'Click to edit';
}

export default function BulkForm({ onBulkSuccess, onLoadingStart, onError }: BulkFormProps) {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, jd: '', isExpanded: true },
    { id: 2, jd: '', isExpanded: false },
    { id: 3, jd: '', isExpanded: false },
  ]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const toggleRole = (id: number) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isExpanded: !r.isExpanded } : r
      )
    );
  };

  const updateJd = (id: number, jd: string) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, jd } : r)));
  };

  const filledRoles = roles.filter((r) => r.jd.trim().length >= 50);
  const slotsAvailable = MAX_ROLES - filledRoles.length;

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first.');
      return;
    }
    if (file.size < 500) {
      toast.error('The uploaded PDF appears to be empty or corrupted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit. Please upload a smaller PDF.');
      return;
    }
    if (filledRoles.length < 2) {
      toast.error('Please add at least 2 complete job descriptions (50+ characters) for bulk analysis.');
      return;
    }

    setLoading(true);
    onLoadingStart?.();

    try {
      // Analyze all filled roles using the single bulk endpoint
      const jds = filledRoles.map((role) => role.jd);
      const results = await analyzeBulkResume(jds, file!);

      // Store the global file and the stringified JDs array for the Tailored Tips feature
      setSessionData(file!, JSON.stringify(jds));

      onBulkSuccess(results);
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
          Analyze Multiple Roles.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Upload your resume once and compare it against up to 3 target roles
          simultaneously. Discover which job is your strongest match.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-[260px_1fr] items-start">
        {/* ── Left: Resume card ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-sm font-bold text-foreground">Resume</span>
            </div>
            {file && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                ACTIVE
              </span>
            )}
          </div>

          {/* Upload zone — flex-1 so it fills remaining card height */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`mx-4 mt-4 mb-4 flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-5 gap-3 transition-all ${
              file
                ? 'border-border cursor-default'
                : 'border-border cursor-pointer hover:border-primary/30 hover:bg-primary/5'
            }`}
            role={file ? undefined : 'button'}
            tabIndex={file ? undefined : 0}
            aria-label={file ? undefined : 'Upload resume'}
            onKeyDown={
              file
                ? undefined
                : (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }
            }
          >
            {file ? (
              <>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground truncate w-[180px]">{fileName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Last updated just now</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="border border-border rounded-full px-4 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all bg-card shadow-sm"
                >
                  Replace File
                </button>
              </>
            ) : (
              <>
                <div className="text-muted-foreground">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Click to upload your resume PDF
                </p>
              </>
            )}
          </div>

          {/* System analysis bar — pinned to the bottom */}
          {file && (
            <div className="px-4 pt-0 pb-4 border-t border-border mt-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 mt-4">
                System Analysis
              </p>
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-xs text-muted-foreground">Parsing Confidence</p>
                <p className="text-xs font-bold text-emerald-600">98%</p>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '98%' }} />
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

        {/* ── Right: Target Roles card ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span className="text-sm font-bold text-foreground">Target Roles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {slotsAvailable} Slot{slotsAvailable !== 1 ? 's' : ''} Available
              </span>
              <span className="w-1.5 h-1.5 rounded-full inline-block bg-primary" />
            </div>
          </div>

          {/* Role accordion — flex-1 */}
          <div className="divide-y divide-border flex-1">
            {roles.map((role, index) => (
              <div key={role.id}>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors text-left focus:outline-none focus:bg-muted/50"
                  onClick={() => toggleRole(role.id)}
                  aria-expanded={role.isExpanded}
                  aria-controls={`bulk-jd-panel-${role.id}`}
                >
                  {/* Filled indicator dot */}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    {/* Green dot if this role has 50+ chars of JD */}
                    {role.jd.trim().length >= 50 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card bg-emerald-500"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {getRoleTitle(role.jd, index)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getRoleSubtitle(role.jd)}
                    </p>
                  </div>

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${role.isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {role.isExpanded && (
                  <div id={`bulk-jd-panel-${role.id}`} className="px-5 pb-5 bg-muted/30">
                    <label htmlFor={`bulk-jd-${role.id}`} className="sr-only">
                      Job description for role {index + 1}
                    </label>
                    <textarea
                      id={`bulk-jd-${role.id}`}
                      rows={6}
                      value={role.jd}
                      onChange={(e) => updateJd(role.id, e.target.value)}
                      placeholder="Paste the full job description here…"
                      className="w-full rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent leading-relaxed transition"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Errors handled via toast */}

          {/* Analyze All Roles button */}
          <div className="p-4 border-t border-border">
            {filledRoles.length > 0 && (
              <p className={`text-xs mb-2 text-center ${filledRoles.length >= 2 ? 'text-muted-foreground' : 'text-destructive'}`}>
                {filledRoles.length} role{filledRoles.length !== 1 ? 's' : ''} ready to analyze (Minimum 2 required)
              </p>
            )}
            <Button
              id="bulk-analyze-btn"
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Analyze All Roles
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
