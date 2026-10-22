import Link from 'next/link';
import { DATA_STATUS_MESSAGE } from '@/lib/intake';
import { FAQ_COMMON } from '@/data/content';
import JsonLd from '@/components/JsonLd';

export function EmptyData() {
  return (
    <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
      <p className="font-semibold">{DATA_STATUS_MESSAGE}</p>
      <p className="mt-1 text-sm">공식 문서에서 직접 확인한 기준값만 수록합니다. 확인되지 않은 값은 표시하지 않습니다. <Link href="/intake-checker/" className="underline">섭취량 합산</Link>에서는 직접 입력한 기준값(사용자 입력 기준)으로 비교할 수 있습니다.</p>
    </div>
  );
}

export function ConsultNotice() {
  return (
    <div role="note" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <p className="font-semibold">전문가 상담 안내</p>
      <p className="mt-1">임신·수유 중이거나, 복용 중인 약물이 있거나, 기저질환(신장·간·심혈관 질환 등)이 있다면 영양제를 시작·변경하기 전에 의사 또는 약사와 상담하세요. 이 사이트는 진단·처방·복용 권고를 제공하지 않습니다.</p>
    </div>
  );
}

export function Faq({ items = FAQ_COMMON }: { items?: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq-h" className="mt-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }} />
      <h2 id="faq-h" className="text-xl font-semibold text-gray-900">자주 묻는 질문</h2>
      <dl className="mt-3 space-y-3">
        {items.map((i) => (
          <div key={i.q} className="rounded-lg border border-gray-200 p-4">
            <dt className="font-medium text-gray-900">{i.q}</dt>
            <dd className="mt-1 text-sm text-gray-700">{i.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SourcesNote() {
  return (
    <section aria-labelledby="src-h" className="mt-8 text-sm text-gray-600">
      <h2 id="src-h" className="text-lg font-semibold text-gray-900">참고 출처</h2>
      <p className="mt-1">기준값의 출처 URL과 확인일은 <Link href="/sources/" className="text-brand-700 underline">근거 출처</Link> 페이지와 각 성분 상세에 표시됩니다. 최신 기준은 공식 문서에서 확인하세요.</p>
    </section>
  );
}
