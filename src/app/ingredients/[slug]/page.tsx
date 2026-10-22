import type { Metadata } from 'next';
import Link from 'next/link';
import { ConsultNotice, EmptyData, Faq, SourcesNote } from '@/components/Ui';
import { INGREDIENTS, COMBINATIONS } from '@/lib/data';
import { unitLabel } from '@/lib/intake';
import { SITE_NAME } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return INGREDIENTS.map((i) => ({ slug: i.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = INGREDIENTS.find((x) => x.slug === slug)!;
  return {
    title: `${i.name} 섭취량 기준 조회`,
    description: `${i.name}의 표시 단위, 대상별 기준값, 근거 문서와 확인일 정보입니다. ${i.status === '확인됨' ? '공식 문서로 확인된 값입니다.' : '기준값은 아직 확인되지 않았습니다.'}`,
    alternates: { canonical: `/ingredients/${slug}/` },
    openGraph: { url: `/ingredients/${slug}/`, title: `${i.name} 섭취량 기준 | ${SITE_NAME}` },
  };
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = INGREDIENTS.find((x) => x.slug === slug)!;
  const combos = COMBINATIONS.filter((c) => c.ingredientIds.includes(i.id));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{i.name}</h1>
      <p className="text-gray-700">{i.category} · 합산 기준 단위 {unitLabel(i.unit)}</p>
      <p className="text-gray-700">{i.summary}</p>
      {i.status !== '확인됨' || i.references.length === 0 ? <EmptyData /> : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="mb-2 text-left font-semibold">대상별 기준값 (단위: {unitLabel(i.unit)})</caption>
            <thead><tr className="bg-gray-50 text-left"><th className="border p-2">적용 대상</th><th className="border p-2">권장섭취량</th><th className="border p-2">충분섭취량</th><th className="border p-2">상한섭취량</th><th className="border p-2">기준 버전</th><th className="border p-2">출처·확인일</th></tr></thead>
            <tbody>{i.references.map((r) => (
              <tr key={r.population}><td className="border p-2">{r.population}</td><td className="border p-2">{r.rda ?? '-'}</td><td className="border p-2">{r.ai ?? '-'}</td><td className="border p-2">{r.ul ?? '-'}</td><td className="border p-2">{r.basisVersion}</td>
                <td className="border p-2"><a href={r.sourceUrl} rel="noopener noreferrer" target="_blank" className="text-brand-700 underline">출처</a> · {r.checkedAt}</td></tr>))}</tbody>
          </table>
        </div>
      )}
      {i.conversions.length > 0 && <section><h2 className="text-xl font-semibold">단위 변환계수 (출처 확인됨)</h2><ul className="mt-2 list-disc pl-5 text-sm">{i.conversions.map((c) => <li key={c.from + c.to}>1 {c.from} = {c.factor} {c.to} <a className="text-brand-700 underline" href={c.sourceUrl} target="_blank" rel="noopener noreferrer">출처</a></li>)}</ul></section>}
      <p className="text-sm text-gray-600">상태: {i.status}{i.checkedAt ? ` · 확인일 ${i.checkedAt}` : ''}{i.sourceUrl ? <> · <a href={i.sourceUrl} className="text-brand-700 underline" target="_blank" rel="noopener noreferrer">출처</a></> : ''}</p>
      {combos.length > 0 && <section><h2 className="text-xl font-semibold">관련 주의 조합</h2><ul className="mt-2 list-disc pl-5">{combos.map((c) => <li key={c.id}>{c.title}</li>)}</ul></section>}
      <p><Link href="/intake-checker/" className="text-brand-700 underline">이 성분을 포함해 섭취량 합산하기</Link> · <Link href="/ingredients/" className="text-brand-700 underline">성분 목록</Link></p>
      <ConsultNotice /><Faq /><SourcesNote />
    </div>
  );
}
