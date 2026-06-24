import Link from 'next/link';

export default function FAQPage() {
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
        <h1 className="text-4xl font-black text-foreground mb-6 tracking-tight">Frequently Asked Questions</h1>
        <div className="space-y-8 mt-10">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Is my resume data safe?</h3>
            <p className="text-muted-foreground">Yes. We do not store your resumes or use them to train AI models. Everything is processed purely in-memory and discarded instantly.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">What file formats are supported?</h3>
            <p className="text-muted-foreground">Currently, we only support PDF format (.pdf) to ensure the highest accuracy when parsing your resume layout and text.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">What is Bulk Analysis Mode?</h3>
            <p className="text-muted-foreground">Bulk mode allows you to paste multiple job descriptions at once. Our AI will rank them against your resume to tell you which job you are most qualified for.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">How do I contact support?</h3>
            <p className="text-muted-foreground">You can reach us at <a href="mailto:heyayyoob@gmail.com" className="text-primary hover:underline">heyayyoob@gmail.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
