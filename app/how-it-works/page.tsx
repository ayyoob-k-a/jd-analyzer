import Link from 'next/link';

export default function HowItWorksPage() {
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
        <h1 className="text-4xl font-black text-foreground mb-6 tracking-tight">How it Works</h1>
        <div className="space-y-8 mt-10">
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">1. Upload your Resume</h3>
            <p className="text-muted-foreground">Simply upload your most recent CV in PDF format. We instantly parse the text locally and prepare it for analysis without permanently saving the file.</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">2. Paste Job Descriptions</h3>
            <p className="text-muted-foreground">Copy and paste the details of a target role (or multiple roles using our Bulk Mode). Our AI understands nuance, skills, and exact role requirements.</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">3. Instant AI Benchmarking</h3>
            <p className="text-muted-foreground">Our intelligent agent cross-references your experience against the job description, calculating a precise match score and finding critical skill gaps.</p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-foreground mb-2">4. Download Actionable Tips</h3>
            <p className="text-muted-foreground">Receive a meticulously formatted PDF report outlining exactly how to tailor your resume, what keywords to add, and which experiences to highlight to secure the interview.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
