import { notFound } from 'next/navigation';

export default async function BlogPostPage(_props: { params: Promise<{ slug: string }> }) {
  if (process.env.BLOG_ENABLED !== 'true') notFound();
  return null;
}
