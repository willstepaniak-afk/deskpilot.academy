import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Wordmark } from '@/components/layout/Wordmark';

// Bare auth shell — no marketing Header/Footer. The root layout no longer
// renders chrome, so these pages render clean and centered.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Wordmark />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ← Back to deskpilot.academy
        </Link>
      </p>
    </div>
  );
}
