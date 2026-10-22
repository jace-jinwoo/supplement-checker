import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: `${SITE_NAME}는 영양제 성분 조회와 섭취량 합산·상한섭취량 비교를 제공하는 무료 웹 서비스입니다. 운영 원칙과 데이터 정확성 정책을 안내합니다.`,
  alternates: { canonical: '/about/' },
  openGraph: { url: '/about/', title: `서비스 소개 | ${SITE_NAME}` },
};

export default function AboutPage() {
  return (
    <article className="space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">서비스 소개</h1>
      <p>{SITE_NAME}는 영양제 성분별 정보를 조회하고 여러 제품의 중복 성분을 단위 정규화 후 합산해 상한섭취량과 비교하는 무료 서비스입니다. 회원가입이 없고 모든 계산은 브라우저 안에서 이루어집니다.</p>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">제공 기능</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><Link href="/ingredients/" className="text-brand-700 underline">성분별 조회</Link>, <Link href="/intake-checker/" className="text-brand-700 underline">섭취량 합산·상한 비교</Link></li>
          <li><Link href="/combinations/" className="text-brand-700 underline">주의할 조합</Link>, <Link href="/sources/" className="text-brand-700 underline">근거 출처</Link></li>
          <li><Link href="/guides/" className="text-brand-700 underline">안내 글</Link></li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">데이터 정확성 정책</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>식약처·질병관리청·NIH ODS 등 공식 문서를 직접 열어 확인한 값만 출처 URL·확인일과 함께 수록합니다. 확인하지 못하면 만들어 넣지 않고 "미확인"으로 표시하며 경고를 표시하지 않습니다.</li>
          <li>성분 궁합을 좋음/나쁨으로 단정하지 않고, 진단·처방·복용 권고를 하지 않습니다.</li>
          <li>임신·수유, 복용 약물, 기저질환이 있다면 전문가 상담이 필요합니다.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">광고에 대해</h2>
        <p className="mt-2">운영을 위해 Google AdSense 광고를 게재할 수 있으며, 게재 시 "광고" 라벨로 구분합니다.</p>
      </section>
      <p>오류 제보와 제안은 <Link href="/contact/" className="text-brand-700 underline">문의 페이지</Link>를 이용해 주세요.</p>
    </article>
  );
}
