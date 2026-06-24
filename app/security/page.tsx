import Link from 'next/link';

export default function SecurityPage() {
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
        <h1 className="text-4xl font-black text-foreground mb-6 tracking-tight">Data Security</h1>
        <div className="prose prose-invert prose-zinc max-w-none text-muted-foreground space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Zero Retention Policy</h2>
            <p>Your privacy and data security are our highest priorities. JD Analyzer operates on a strict zero-retention model. This means that your uploaded resumes and job descriptions are never saved to any database, disk, or long-term storage medium.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">In-Memory Processing</h2>
            <p>When you upload a document, it is securely transmitted over TLS 1.3 encryption directly to our processing servers. The PDF is parsed purely in memory, analyzed by our AI engine, and the resulting insights are streamed back to your browser. Once the network request closes, the memory buffer is immediately wiped.</p>
          </section>
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">AI Model Privacy</h2>
            <p>We utilize enterprise-grade APIs for our analysis. Our data processing agreements guarantee that your resumes are <strong>never</strong> used to train, fine-tune, or improve our AI models or third-party foundation models.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
