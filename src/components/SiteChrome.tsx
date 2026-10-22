import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

const NAV = [
  ['/ingredients/', '성분 조회'],
  ['/intake-checker/', '섭취량 합산'],
  ['/combinations/', '주의할 조합'],
  ['/guides/', '안내'],
  ['/sources/', '근거 출처'],
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-700">{SITE_NAME}</Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {NAV.map(([href, label]) => (
              <li key={href}><Link href={href} className="text-gray-700 hover:text-brand-700">{label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <nav aria-label="사이트 정보">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li><Link href="/about/" className="hover:text-brand-700">서비스 소개</Link></li>
            <li><Link href="/guides/" className="hover:text-brand-700">안내 글</Link></li>
            <li><Link href="/privacy/" className="hover:text-brand-700">개인정보처리방침</Link></li>
            <li><Link href="/terms/" className="hover:text-brand-700">이용약관</Link></li>
            <li><Link href="/contact/" className="hover:text-brand-700">문의</Link></li>
          </ul>
        </nav>
        <p className="mt-4 text-xs text-gray-500">
          © {SITE_NAME}. 이 사이트는 의료 서비스가 아니며 진단·처방·복용 권고를 제공하지 않습니다. 임신·수유 중이거나 복용 중인 약물, 기저질환이 있다면 반드시 의사·약사 등 전문가와 상담하세요. 공식 문서에서 직접 확인한 기준값만 출처·확인일과 함께 수록합니다.
        </p>
      </div>
    </footer>
  );
}
