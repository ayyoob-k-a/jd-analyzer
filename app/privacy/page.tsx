import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-black text-foreground mb-6 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-invert prose-zinc max-w-none text-muted-foreground space-y-6">
          <p>Last updated: June 2026</p>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
            <p>We collect the resume documents you upload and the job descriptions you provide solely for the purpose of running our AI analysis. We do not require account creation, and we do not collect personally identifiable information unless it is contained within your uploaded documents.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p>Your data is processed transiently by our servers and OpenAI's secure enterprise API to generate match scores and tailored improvement tips. Your resumes are never used to train our AI models, nor are they used to train third-party language models.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Data Retention</h2>
            <p>We practice strict data minimization. Your uploaded PDF files and job descriptions are processed entirely in memory. Once the analysis is generated and returned to your browser, all data is immediately discarded from our servers.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Contact Us</h2>
            <p>If you have any questions regarding this Privacy Policy, please contact us at <a href="mailto:heyayyoob@gmail.com" className="text-primary hover:underline">heyayyoob@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
