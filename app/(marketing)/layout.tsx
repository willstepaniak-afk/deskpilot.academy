import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Marketing chrome. The public site gets the Header (with waitlist CTA) and
// Footer here; the dashboard and auth route groups deliberately do not.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
