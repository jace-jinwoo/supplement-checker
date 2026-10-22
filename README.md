# 영양제 성분 체크 (supplement-checker)

Next.js(App Router) + TypeScript + Tailwind CSS 3 정적 사이트(`output: 'export'`). 서버/DB/로그인 없음, 모든 계산은 브라우저에서 수행됩니다.

## 페이지
`/`, `/ingredients`(+`/ingredients/[slug]`), `/combinations`, `/intake-checker`, `/guides`(+`/guides/[slug]` 4편), `/sources`, `/about`, `/privacy`, `/terms`, `/contact`, `robots.txt`, `sitemap.xml`, `icon.svg`.

## 기능
- 성분별 조회: 단위·대상별 기준·근거 문서·확인일 (`src/data/ingredients.json`)
- 섭취량 합산: 제품별 함량 입력 → 단위 정규화(g/mg/µg) → 성분별 합산 → 상한 비교
- 사용자 입력 기준: 데이터가 없어도 직접 기준값을 입력해 비교 ("사용자 입력 기준"으로 표시)
- 주의할 조합·근거 출처 조회 (데이터가 있을 때만 표시)

## 데이터 상태 (중요)
README 하단 "검증 상태" 참고. 공식 문서를 직접 열어 확인한 값만 `status:'확인됨'` + `sourceUrl` + `checkedAt`과 함께 수록하며, 그 외는 `status:'미확인'`(기준값 없음)입니다. 기준이 없으면 화면에 "검증된 기준 데이터가 없어 경고를 표시할 수 없습니다"가 표시되고 합산·단위 변환은 그대로 동작합니다.
- 질량 단위(g·mg·µg)만 확정 변환계수로 자동 변환합니다. IU 등은 `conversions[]`에 출처가 기록된 성분만 변환하며, 없으면 합산에서 제외하고 사유를 표시합니다.

## 스키마 (`ingredients.json`)
- `ingredients[]`: `id, slug, name, category, unit(합산 기준 단위: g|mg|ug), summary, conversions[{from,to,factor,sourceUrl}], references[{population, rda?, ai?, ul?, unit, note?, sourceUrl, checkedAt, basisVersion}], status(확인됨|미확인), sourceUrl, checkedAt`
- `sources[]`: `id,title,publisher,url,checkedAt,status,note?`
- `combinations[]`: `id,title,ingredientIds[],description,consult,sourceUrl,checkedAt,status`
- 타입·로직: `src/lib/intake.ts` (순수 함수), 테스트: `tests/intake.test.ts`

## 건강 정보 정책
진단·처방·복용 권고를 하지 않으며, 성분 조합을 좋음/나쁨으로 단정하지 않습니다. 임신·수유·복용 약물·기저질환은 전문가 상담을 안내합니다.

## 데이터 갱신 절차
1. 식약처·질병관리청·한국영양학회·NIH ODS 등 공식 문서를 직접 열어 값 확인.
2. `ingredients.json`에 값 + 적용 대상 + `sourceUrl` + `checkedAt` + `basisVersion` 기록, `status:'확인됨'`.
3. `npm test && npm run build && npm run verify` (verify는 데이터에서 동적 경로를 읽어 검사).

## 개발·배포
```
npm install
npm run dev
npm test
npm run typecheck
npm run build      # out/ 생성
npm run verify     # 정적 경로·내부 링크·메타데이터·데이터 검증
```
GitHub 저장소 연결 후 Netlify: Build command `npm run build`, Publish directory `out`. 환경변수는 `.env.example` 참고 (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, AdSense는 승인 전 `NEXT_PUBLIC_ADSENSE_ENABLED=false` 유지).

## 검증 상태
- 실행하지 못함: `npm install`, `npm test`, `npm run build`, `npm run verify` (npm 레지스트리 접근 불가 환경). 코드 재독과 `intake.ts` 핵심 로직의 node 직접 실행 확인만 수행.
- 데이터: 성분 6종(비타민 C·D, 칼슘, 마그네슘, 철, 아연) 모두 `미확인`, 기준값·조합·출처 문서 0건. NIH ODS 공식 페이지 WebFetch가 권한 미응답으로 차단되어 확인하지 못했고 기억 기반 수치는 넣지 않았습니다. 화면에는 "검증된 기준 데이터가 없어 경고를 표시할 수 없습니다"가 표시됩니다.
