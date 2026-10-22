import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { ADS_ENABLED, ADSENSE_CLIENT, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - 성분 섭취량 합산·상한 비교`, template: `%s | ${SITE_NAME}` },
  description: `${SITE_TAGLINE}. 공식 문서에서 확인한 기준값만 출처·확인일과 함께 제공하며 진단·처방·복용 권고는 하지 않습니다.`,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'ko_KR', siteName: SITE_NAME, title: SITE_NAME, description: SITE_TAGLINE, url: '/' },
  twitter: { card: 'summary', title: SITE_NAME, description: SITE_TAGLINE },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#2563eb' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand-600 focus:px-3 focus:py-2 focus:text-white">본문 바로가기</a>
        <SiteHeader />
        <main id="main" className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <SiteFooter />
        {ADS_ENABLED && (
          <Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />
        )}
      </body>
    </html>
  );
}
