import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { ConsultNotice, Faq } from '@/components/Ui';
import { NOTICES } from '@/data/content';
import { INGREDIENTS, CATEGORIES, GUIDES, VERIFIED_COUNT } from '@/lib/data';
import { DATA_STATUS_MESSAGE } from '@/lib/intake';
import { SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/site';

const TOOLS = [
  ['/intake-checker/', '섭취량 합산 · 상한 비교', '제품별 성분 함량을 단위 정규화 후 합산'],
  ['/ingredients/', '성분별 조회', '단위·기준·출처·확인일 보기'],
  ['/combinations/', '주의할 조합', '단정하지 않는 조합 주의 정보'],
  ['/sources/', '근거 출처', '기준값에 사용한 공식 문서 목록'],
] as const;

export default function HomePage() {
  return (
    <div className="space-y-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/'), inLanguage: 'ko' }} />
      <section>
        <h1 className="text-3xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-2 text-gray-700">{SITE_TAGLINE}.</p>
        <p className="mt-2 rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900" role="note">
          공식 문서에서 직접 확인한 기준값만 수록합니다. 검증된 성분: {VERIFIED_COUNT}/{INGREDIENTS.length}개{VERIFIED_COUNT === 0 ? ` (${DATA_STATUS_MESSAGE})` : ''}.
        </p>
      </section>

      <section aria-labelledby="search-h">
        <h2 id="search-h" className="mb-3 text-xl font-semibold">검색 · 카테고리 탐색</h2>
        <form action="/ingredients/" className="flex gap-2" role="search">
          <label className="sr-only" htmlFor="q">성분 검색</label>
          <input id="q" name="q" type="search" placeholder="성분 이름 (예: 비타민 D)" className="w-full rounded-md border border-gray-300 px-3 py-2" />
          <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">검색</button>
        </form>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {CATEGORIES.map((c) => <li key={c}><Link href={`/ingredients/?category=${encodeURIComponent(c)}`} className="rounded-full border border-gray-300 px-3 py-1 hover:border-brand-600 hover:text-brand-700">{c}</Link></li>)}
        </ul>
      </section>

      <AdSlot placement="home" />

      <section aria-labelledby="pop-h">
        <h2 id="pop-h" className="mb-3 text-xl font-semibold">인기 도구</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {TOOLS.map(([href, name, desc]) => (
            <li key={href}><Link href={href} className="block rounded-lg border border-gray-200 p-4 hover:border-brand-600 hover:bg-brand-50">
              <span className="text-lg font-semibold text-brand-700">{name}</span><span className="mt-1 block text-sm text-gray-600">{desc}</span></Link></li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="guides-h">
        <h2 id="guides-h" className="mb-3 text-xl font-semibold">최신 안내 콘텐츠</h2>
        <ul className="space-y-3">
          {GUIDES.map((g) => (
            <li key={g.slug} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{g.date}</p>
              <h3 className="font-semibold"><Link href={`/guides/${g.slug}/`} className="text-brand-700 hover:underline">{g.title}</Link></h3>
              <p className="mt-1 text-sm text-gray-700">{g.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="news-h">
        <h2 id="news-h" className="mb-3 text-xl font-semibold">운영 공지</h2>
        <ul className="space-y-3">
          {NOTICES.map((n) => (
            <li key={n.title} className="rounded-lg border border-gray-200 p-4"><p className="text-xs text-gray-500">{n.date}</p>
              <h3 className="font-semibold text-gray-900">{n.title}</h3><p className="mt-1 text-sm text-gray-700">{n.body}</p></li>
          ))}
        </ul>
      </section>
      <ConsultNotice />
      <Faq />
    </div>
  );
}
