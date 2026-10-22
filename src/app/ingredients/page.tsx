import type { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import IngredientBrowser from '@/components/IngredientBrowser';
import { ConsultNotice, EmptyData, Faq, SourcesNote } from '@/components/Ui';
import { CATEGORIES, INGREDIENTS, VERIFIED_COUNT } from '@/lib/data';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '영양 성분별 섭취량 조회',
  description: '영양제 성분별 표시 단위, 연령대별 기준, 권장·상한섭취량과 근거 문서·확인일을 조회합니다. 확인되지 않은 값은 미확인으로 표시합니다.',
  alternates: { canonical: '/ingredients/' },
  openGraph: { url: '/ingredients/', title: `영양 성분별 섭취량 조회 | ${SITE_NAME}` },
};

export default function IngredientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">영양 성분별 섭취량 조회</h1>
      <p className="text-gray-700">성분을 선택하면 표시 단위, 대상별 기준값, 근거 문서와 확인일을 볼 수 있습니다. 사용 방법: 검색창에 성분명을 입력하거나 카테고리를 고르고, 성분 상세에서 기준값과 출처를 확인하세요.</p>
      {VERIFIED_COUNT === 0 && <EmptyData />}
      <IngredientBrowser items={INGREDIENTS} categories={CATEGORIES} />
      <ConsultNotice />
      <AdSlot placement="content" />
      <Faq /><SourcesNote />
    </div>
  );
}
