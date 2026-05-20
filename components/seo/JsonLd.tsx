import type { JsonLd as JsonLdType } from '@/lib/seo';

export function JsonLd({ data }: { data: JsonLdType | JsonLdType[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
