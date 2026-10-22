import type { Metadata } from 'next';
import Link from 'next/link';
import { ConsultNotice, Faq, SourcesNote } from '@/components/Ui';
import { COMBINATIONS, INGREDIENTS } from '@/lib/data';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '영양제 주의할 조합',
  description: '함께 섭취할 때 확인이 필요한 영양 성분 조합을 공식 근거와 함께 안내합니다. 좋음/나쁨으로 단정하지 않고 전문가 상담을 안내합니다.',
  alternates: { canonical: '/combinations/' },
  openGraph: { url: '/combinations/', title: `영양제 주의할 조합 | ${SITE_NAME}` },
};

export default function CombinationsPage() {
  const name = (id: string) => INGREDIENTS.find((i) => i.id === id)?.name ?? id;
  const ok = COMBINATIONS.filter((c) => c.status === '확인됨');
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">주의할 조합</h1>
      <p className="text-gray-700">성분 조합을 &quot;좋다/나쁘다&quot;로 단정하지 않습니다. 공식 문서로 확인된 주의 정보만 근거와 함께 안내합니다.</p>
      {ok.length === 0 ? (
        <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <p className="font-semibold">검증된 조합 데이터가 없어 안내를 표시할 수 없습니다</p>
          <p className="mt-1 text-sm">공식 문서에서 직접 확인하지 못한 조합 정보는 수록하지 않습니다. 약물·건강 상태와 관련한 조합은 의사·약사와 상담하세요. 합산 수치는 <Link href="/intake-checker/" className="underline">섭취량 합산</Link>에서 확인할 수 있습니다.</p>
        </div>
      ) : (
        <ul className="space-y-3">{ok.map((c) => (
          <li key={c.id} className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="text-xs text-gray-500">{c.ingredientIds.map(name).join(' · ')}</p>
            <p className="mt-2 text-sm text-gray-700">{c.description}</p>
            <p className="mt-2 text-sm text-red-800">{c.consult}</p>
            <p className="mt-1 text-xs text-gray-500"><a href={c.sourceUrl} className="text-brand-700 underline" target="_blank" rel="noopener noreferrer">출처</a> · 확인일 {c.checkedAt}</p>
          </li>))}</ul>
      )}
      <ConsultNotice /><Faq /><SourcesNote />
    </div>
  );
}
