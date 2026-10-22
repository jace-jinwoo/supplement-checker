import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { GUIDES } from '@/lib/data';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '영양제 안내 글',
  description: '라벨 읽는 법, 중복 섭취 확인법, mg·µg·IU 단위 이해 등 수치 없이도 쓸 수 있는 실용 안내 글 모음입니다.',
  alternates: { canonical: '/guides/' },
  openGraph: { url: '/guides/', title: `영양제 안내 글 | ${SITE_NAME}` },
};

export default function GuidesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">영양제 안내 글</h1>
      <p className="mt-2 text-gray-700">특정 권장·상한 수치에 의존하지 않는 실용 안내입니다. 복용 여부 판단은 전문가와 상담하세요.</p>
      <ul className="mt-6 space-y-3">
        {GUIDES.map((g) => (
          <li key={g.slug} className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{g.date}</p>
            <h2 className="text-lg font-semibold"><Link href={`/guides/${g.slug}/`} className="text-brand-700 hover:underline">{g.title}</Link></h2>
            <p className="mt-1 text-sm text-gray-700">{g.summary}</p>
          </li>
        ))}
      </ul>
      <AdSlot placement="content" />
    </div>
  );
}
