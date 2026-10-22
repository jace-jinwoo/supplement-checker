export const SITE_NAME = '영양제 성분 체크';
export const SITE_TAGLINE = '영양제 성분별 섭취량을 조회하고 여러 제품의 중복 성분을 합산해 상한섭취량과 비교하는 서비스';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.netlify.app').replace(/\/+$/, '');
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';
export const LAST_UPDATED = '2026-10-22';
/** 프로그램 페이지를 제외한 정적 페이지 경로 (sitemap, 검증 스크립트 공통) */
export const STATIC_PATHS = ['/', '/ingredients/', '/combinations/', '/intake-checker/', '/guides/', '/sources/', '/about/', '/privacy/', '/terms/', '/contact/'];

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && ADSENSE_CLIENT !== '';

export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '',
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL || '',
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || '',
} as const;

export type AdPlacement = keyof typeof ADSENSE_SLOTS;

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
