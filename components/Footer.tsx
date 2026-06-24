import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12 bg-background/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-foreground text-background font-black text-sm tracking-tighter">
                JD
              </div>
              <span className="font-bold text-foreground text-lg tracking-tight">Analyzer</span>
              <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                v1.0
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The AI-powered workbench that instantly matches your resume to industry-leading job descriptions, helping you land your next dream role.
            </p>
          </div>

          {/* Links: Legal */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground text-sm mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Data Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Support */}
          <div className="col-span-1">
            <h3 className="font-semibold text-foreground text-sm mb-4 uppercase tracking-wider">Support</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:heyayyoob@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How it Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} JD Analyzer. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Resumes are analyzed securely and never stored permanently.
          </p>
        </div>
      </div>
    </footer>
  );
}
