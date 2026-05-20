import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'inline-flex items-center gap-2 font-semibold tracking-tight text-foreground',
        className,
      )}
      aria-label="DeskPilot Academy home"
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold"
      >
        D
      </span>
      <span className="text-lg">
        DeskPilot <span className="text-muted-foreground font-normal">Academy</span>
      </span>
    </Link>
  );
}
