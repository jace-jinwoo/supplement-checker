import type { Metadata } from 'next';
import { ConsultNotice } from '@/components/Ui';
import { SOURCES } from '@/lib/data';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '근거 출처',
  description: '기준값 확인에 사용한 공식 문서(식약처·질병관리청·NIH ODS 등)의 목록과 확인일, 확인 상태를 조회합니다.',
  alternates: { canonical: '/sources/' },
  openGraph: { url: '/sources/', title: `근거 출처 | ${SITE_NAME}` },
};

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">근거 출처</h1>
      <p className="text-gray-700">식약처, 질병관리청, 미국 NIH 식이보충제국(ODS) 등 공식 문서 중 직접 열어 확인한 것만 수록합니다. 각 문서의 확인일과 상태를 함께 표시합니다.</p>
      {SOURCES.length === 0 ? (
        <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <p className="font-semibold">검증된 기준 데이터가 없어 경고를 표시할 수 없습니다</p>
          <p className="mt-1 text-sm">현재 직접 확인을 마친 출처 문서가 없습니다. 아래 기관의 공식 사이트에서 최신 기준을 확인하세요: 식품의약품안전처, 질병관리청, 한국영양학회(한국인 영양소 섭취기준), NIH Office of Dietary Supplements.</p>
        </div>
      ) : (
        <ul className="space-y-3">{SOURCES.map((s) => (
          <li key={s.id} className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold"><a href={s.url} className="text-brand-700 underline" target="_blank" rel="noopener noreferrer">{s.title}</a></h2>
            <p className="text-sm text-gray-600">{s.publisher} · 확인일 {s.checkedAt} · {s.status}</p>
            {s.note && <p className="mt-1 text-sm text-gray-700">{s.note}</p>}
          </li>))}</ul>
      )}
      <ConsultNotice />
    </div>
  );
}
