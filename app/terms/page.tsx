import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/terms`;

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The terms governing use of DeskPilot Academy.',
  alternates: { canonical: URL },
};

export default function TermsPage() {
  return (
    <Container className="py-16 max-w-3xl space-y-8 text-base">
      <Alert variant="warning">
        <AlertTitle>Draft — pending legal review</AlertTitle>
        <AlertDescription>
          The terms below outline our intended practices. Final language is pending review by counsel and may change before launch.
        </AlertDescription>
      </Alert>

      <SectionHeading title="Terms" />

      <section>
        <h2 className="text-xl font-semibold">Acceptance</h2>
        <p className="mt-2 text-muted-foreground">
          By using {SITE.name}, you agree to these terms. If you don&apos;t agree, please don&apos;t use the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Accounts</h2>
        <p className="mt-2 text-muted-foreground">
          When subscriptions become available, you will be responsible for keeping your account credentials safe and for the activity that occurs under your account. Sharing access in ways that violate these terms (e.g. team-license abuse) may result in suspension.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Content and licensing</h2>
        <p className="mt-2 text-muted-foreground">
          Course content, simulations, and resources are licensed for the personal or organizational use described in your subscription. You may not redistribute, resell, or rebrand the content without written permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Payments and refunds</h2>
        <p className="mt-2 text-muted-foreground">
          Monthly subscriptions cancel anytime and run through the end of the period. Annual subscriptions include a 7-day money-back guarantee. After 7 days, annual subscriptions are non-refundable but do not auto-renew without notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Disclaimers</h2>
        <p className="mt-2 text-muted-foreground">
          Training content is for professional development. It is not legal advice and does not replace the policies of your dealership or the requirements of applicable law. Compliance modules summarize federal and state guidance as of their effective dates — always confirm with your DMV, OEM, and counsel for your specific situation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Changes</h2>
        <p className="mt-2 text-muted-foreground">
          We may update these terms over time. Material changes will be communicated to active subscribers at least 30 days before they take effect.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Last updated: pending launch. Questions? Email {SITE.supportEmail}.
      </p>
    </Container>
  );
}
