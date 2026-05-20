import { notFound } from 'next/navigation';

export default function BlogIndexPage() {
  if (process.env.BLOG_ENABLED !== 'true') notFound();
  return null;
}
