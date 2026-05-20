import Link from 'next/link';
import { Container } from './Container';
import { Wordmark } from './Wordmark';
import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-24">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Wordmark />
            <p className="text-sm text-muted-foreground max-w-sm">
              Operator-built automotive dealership training. Founded by working operators for the people who run the desk every day.
            </p>
            <p className="text-xs text-muted-foreground">
              Contact: <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/campuses" className="hover:text-foreground">Campuses</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/for-dealers" className="hover:text-foreground">For Dealers</Link></li>
              <li><Link href="/free-resources" className="hover:text-foreground">Free Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>
            Working on the SaaS side? Visit{' '}
            <a className="underline" href={SITE.saasUrl} target="_blank" rel="noreferrer">
              deskpilot.ai
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
