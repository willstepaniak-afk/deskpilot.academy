import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SectionHeading } from '@/components/marketing/SectionHeading';
import { SITE } from '@/lib/site';

const URL = `${SITE.url}/privacy`;

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How DeskPilot Academy collects, uses, and protects your information.',
  alternates: { canonical: URL },
};

export default function PrivacyPage() {
  return (
    <Container className="py-16 max-w-3xl space-y-8 text-base">
      <Alert variant="warning">
        <AlertTitle>Draft — pending legal review</AlertTitle>
        <AlertDescription>
          The text below describes our intended practices. Final language is pending review by counsel and may change before launch.
        </AlertDescription>
      </Alert>

      <SectionHeading title="Privacy" />

      <section>
        <h2 className="text-xl font-semibold">What we collect</h2>
        <p className="mt-2 text-muted-foreground">
          We collect the email address you submit to forms (waitlist, dealer inquiry, resource downloads). Dealer-inquiry submissions also include your name, dealer group, role, rooftop count, estimated seats, and any message you choose to send. We use server-side analytics to count page views and form events.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">How we use it</h2>
        <p className="mt-2 text-muted-foreground">
          We use your information to follow up about Academy access, respond to your inquiry, and improve the product. We do not sell your data. We do not share it with third parties except service providers who process it on our behalf (e.g. database hosting, email delivery, analytics).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">How long we keep it</h2>
        <p className="mt-2 text-muted-foreground">
          We retain form submissions until you ask us to delete them or until they are no longer needed for the purpose collected.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Your rights</h2>
        <p className="mt-2 text-muted-foreground">
          You can request a copy of your data or ask us to delete it by emailing {SITE.supportEmail}. We will respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Cookies and analytics</h2>
        <p className="mt-2 text-muted-foreground">
          We use first-party analytics to understand how the site is used. Analytics events are tied to anonymous identifiers, not to your account or email unless you submit a form. We do not run third-party advertising trackers.
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        Last updated: pending launch. Questions? Email {SITE.supportEmail}.
      </p>
    </Container>
  );
}
