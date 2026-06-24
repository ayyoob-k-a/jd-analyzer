import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Link>
        <h1 className="text-4xl font-black text-foreground mb-6 tracking-tight">Terms of Service</h1>
        <div className="prose prose-invert prose-zinc max-w-none text-muted-foreground space-y-6">
          <p>Last updated: June 2026</p>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using JD Analyzer, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Use License</h2>
            <p>JD Analyzer grants you a personal, non-exclusive, non-transferable license to use our platform strictly for personal career advancement and resume optimization purposes.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Accuracy of AI Output</h2>
            <p>While we use advanced AI to provide resume feedback, JD Analyzer makes no warranties, expressed or implied, that the insights generated will guarantee an interview or a job offer. The generated tailored tips are suggestions and should be reviewed by you before submitting your resume to any employer.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Contact Information</h2>
            <p>If you have any questions regarding these Terms, please contact us at <a href="mailto:heyayyoob@gmail.com" className="text-primary hover:underline">heyayyoob@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
