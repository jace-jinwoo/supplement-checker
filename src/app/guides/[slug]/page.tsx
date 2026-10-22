import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { GUIDES } from '@/lib/data';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug)!;
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: `/guides/${slug}/` },
    openGraph: { type: 'article', url: `/guides/${slug}/`, title: `${g.title} | ${SITE_NAME}` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = GUIDES.find((x) => x.slug === slug)!;
  return (
    <article className="space-y-5 text-gray-700">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, datePublished: g.date, inLanguage: 'ko', mainEntityOfPage: absoluteUrl(`/guides/${slug}/`) }} />
      <h1 className="text-3xl font-bold text-gray-900">{g.title}</h1>
      <p className="text-sm text-gray-500">작성일 {g.date}</p>
      {g.sections.map((s) => (
        <section key={s.h}><h2 className="text-xl font-semibold text-gray-900">{s.h}</h2>
          {s.p.map((t) => <p key={t} className="mt-2">{t}</p>)}</section>
      ))}
      <AdSlot placement="content" />
      <p className="text-sm">관련 도구: <Link className="text-brand-700 underline" href="/intake-checker/">섭취량 합산</Link> · <Link className="text-brand-700 underline" href="/ingredients/">성분 조회</Link> · <Link className="text-brand-700 underline" href="/guides/">다른 안내 글</Link></p>
    </article>
  );
}
