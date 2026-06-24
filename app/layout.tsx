import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'JD Analyzer',
  description: 'Match your resume to any job description instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning is required by next-themes */}
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-center" expand={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
