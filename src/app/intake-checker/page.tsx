import type { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import IntakeChecker from '@/components/IntakeChecker';
import JsonLd from '@/components/JsonLd';
import { ConsultNotice, Faq, SourcesNote } from '@/components/Ui';
import { INGREDIENTS } from '@/lib/data';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: '영양제 섭취량 합산·상한 비교',
  description: '여러 영양제의 같은 성분 함량을 mg·µg·g 단위로 정규화해 합산하고, 확인된 상한섭취량 또는 직접 입력한 기준과 비교합니다.',
  alternates: { canonical: '/intake-checker/' },
  openGraph: { url: '/intake-checker/', title: `영양제 섭취량 합산·상한 비교 | ${SITE_NAME}` },
};

const FAQ = [
  { q: '단위가 다른 제품은 어떻게 합산하나요?', a: 'g·mg·µg는 확정된 변환계수(1g=1,000mg, 1mg=1,000µg)로 성분 기준 단위에 맞춰 합산합니다. IU는 공식 출처로 확인된 변환계수가 있는 성분만 변환하며 없으면 제외하고 이유를 표시합니다.' },
  { q: '기준값이 없으면 어떻게 되나요?', a: '"검증된 기준 데이터가 없어 경고를 표시할 수 없습니다"가 표시됩니다. 합산은 그대로 동작하며, 직접 입력한 기준(사용자 입력 기준)과 비교할 수 있습니다.' },
  { q: '결과로 복용 여부를 알 수 있나요?', a: '아닙니다. 입력값 기준의 참고 계산이며 복용 권고·진단이 아닙니다. 전문가와 상담하세요.' },
];

export default function IntakePage() {
  return (
    <div className="space-y-6">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebApplication', name: '영양제 섭취량 합산·상한 비교', url: absoluteUrl('/intake-checker/'), applicationCategory: 'HealthApplication', inLanguage: 'ko', offers: { '@type': 'Offer', price: 0, priceCurrency: 'KRW' } }} />
      <h1 className="text-3xl font-bold text-gray-900">영양제 섭취량 합산·상한 비교</h1>
      <p className="text-gray-700">제품별 성분 함량을 입력하면 단위를 정규화해 성분별로 합산합니다. 예: 비타민 C 500mg 1정을 하루 2번(합계 1,000mg) + 다른 제품 0.25g 1정(250mg) = 1,250mg.</p>
      <ConsultNotice />
      <IntakeChecker ingredients={INGREDIENTS} />
      <AdSlot placement="tool" />
      <Faq items={FAQ} /><SourcesNote />
    </div>
  );
}
