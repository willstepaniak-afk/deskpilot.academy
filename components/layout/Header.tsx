import Link from 'next/link';
import { Container } from './Container';
import { Wordmark } from './Wordmark';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/campuses', label: 'Campuses' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/for-dealers', label: 'For Dealers' },
  { href: '/about', label: 'About' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Wordmark />
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/faq">FAQ</Link>
          </Button>
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link href="/#waitlist">Join the waitlist</Link>
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
