// 영양제 성분 단위 정규화·합산·상한 비교 (순수 함수, 부수효과 없음)
// 질량 단위(g, mg, µg)의 변환계수는 SI 정의에 따른 확정값입니다.
// IU 등 성분별 변환은 ingredients.json 의 conversions 에 출처와 함께 기록된 경우에만 사용합니다.

export type Status = '확인됨' | '미확인';
export type MassUnit = 'g' | 'mg' | 'ug';

export interface Conversion { from: string; to: string; factor: number; sourceUrl: string; note?: string }
export interface ReferenceValue {
  population: string; // 적용 대상 (예: 성인 19-50세)
  rda?: number; ai?: number; ul?: number; // 단위는 unit
  unit: string;
  note?: string;
  sourceUrl: string; checkedAt: string; basisVersion: string;
}
export interface Ingredient {
  id: string; slug: string; name: string; category: string;
  unit: string; // 표시·합산 기준 단위
  summary: string;
  conversions: Conversion[];
  references: ReferenceValue[];
  status: Status;
  sourceUrl: string | null; checkedAt: string | null;
}
export interface SourceDoc { id: string; title: string; publisher: string; url: string; checkedAt: string; status: Status; note?: string }
export interface Combination {
  id: string; title: string; ingredientIds: string[]; description: string; consult: string;
  sourceUrl: string; checkedAt: string; status: Status;
}

const MASS_TO_MG: Record<MassUnit, number> = { g: 1000, mg: 1, ug: 0.001 };

/** 사용자 표기를 정규 단위 키로. 알 수 없으면 null. */
export function normalizeUnit(raw: string): string | null {
  const s = raw.trim().replace(/\s+/g, '').toLowerCase();
  if (s === 'g') return 'g';
  if (s === 'mg') return 'mg';
  if (['µg', 'μg', 'ug', 'mcg', '마이크로그램'].includes(s)) return 'ug';
  if (s === 'iu') return 'IU';
  return null;
}
export function unitLabel(u: string): string { return u === 'ug' ? 'µg' : u; }
const isMass = (u: string): u is MassUnit => u === 'g' || u === 'mg' || u === 'ug';

function round(n: number): number { return Number(n.toPrecision(12)); }

/** 단위 변환. 확정된 계수가 없으면 null (추정하지 않음). */
export function convertAmount(value: number, fromRaw: string, toRaw: string, conversions: Conversion[] = []): number | null {
  const from = normalizeUnit(fromRaw), to = normalizeUnit(toRaw);
  if (!from || !to || !Number.isFinite(value)) return null;
  if (from === to) return value;
  if (isMass(from) && isMass(to)) return round((value * MASS_TO_MG[from]) / MASS_TO_MG[to]);
  const direct = conversions.find((c) => normalizeUnit(c.from) === from && normalizeUnit(c.to) === to);
  if (direct) return round(value * direct.factor);
  const inverse = conversions.find((c) => normalizeUnit(c.from) === to && normalizeUnit(c.to) === from);
  if (inverse && inverse.factor !== 0) return round(value / inverse.factor);
  // 간접: IU -> µg -> mg 등 (한 단계 경유)
  for (const c of conversions) {
    const mid = normalizeUnit(c.to);
    if (normalizeUnit(c.from) === from && mid && isMass(mid) && isMass(to)) {
      return round(((value * c.factor) * MASS_TO_MG[mid]) / MASS_TO_MG[to]);
    }
  }
  return null;
}

export interface IntakeEntry {
  id: string; productName: string; ingredientId: string;
  amount: number; unit: string; servingsPerDay: number; // 1일 섭취 횟수(개수)
}
export interface EntryIssue { entryId: string; reason: string }
export interface IngredientTotal {
  ingredientId: string; unit: string; total: number; contributions: { entryId: string; productName: string; amount: number }[];
}
export interface SumResult { totals: IngredientTotal[]; issues: EntryIssue[] }

/** 제품별 입력을 성분 기준 단위로 정규화해 합산. 변환 불가 항목은 합산에서 제외하고 issues 로 반환. */
export function sumIntake(entries: IntakeEntry[], ingredients: Ingredient[]): SumResult {
  const byId = new Map(ingredients.map((i) => [i.id, i]));
  const map = new Map<string, IngredientTotal>();
  const issues: EntryIssue[] = [];
  for (const e of entries) {
    const ing = byId.get(e.ingredientId);
    if (!ing) { issues.push({ entryId: e.id, reason: '성분을 선택하세요.' }); continue; }
    if (!Number.isFinite(e.amount) || e.amount < 0) { issues.push({ entryId: e.id, reason: '함량은 0 이상의 숫자여야 합니다.' }); continue; }
    if (!Number.isFinite(e.servingsPerDay) || e.servingsPerDay < 0) { issues.push({ entryId: e.id, reason: '1일 섭취 개수는 0 이상의 숫자여야 합니다.' }); continue; }
    const conv = convertAmount(e.amount * e.servingsPerDay, e.unit, ing.unit, ing.conversions);
    if (conv === null) { issues.push({ entryId: e.id, reason: `${unitLabel(normalizeUnit(e.unit) ?? e.unit)} → ${unitLabel(ing.unit)} 변환계수가 확인되지 않아 합산에서 제외했습니다.` }); continue; }
    const t = map.get(ing.id) ?? { ingredientId: ing.id, unit: ing.unit, total: 0, contributions: [] };
    t.total = round(t.total + conv);
    t.contributions.push({ entryId: e.id, productName: e.productName, amount: conv });
    map.set(ing.id, t);
  }
  return { totals: [...map.values()], issues };
}

export type Verdict = 'over' | 'within' | 'no-reference';
export interface UserReference { ul: number; unit: string }
export interface Evaluation {
  verdict: Verdict; ul: number | null; unit: string; ratio: number | null;
  origin: 'data' | 'user' | 'none'; population?: string; sourceUrl?: string;
}

/** 합계를 상한섭취량과 비교. 검증된 기준이 없으면 no-reference (경고 불가). 사용자 입력 기준은 origin:'user'. */
export function evaluateTotal(total: IngredientTotal, ing: Ingredient, population: string | null, user?: UserReference | null): Evaluation {
  if (user && Number.isFinite(user.ul) && user.ul > 0) {
    const ul = convertAmount(user.ul, user.unit, ing.unit, ing.conversions);
    if (ul !== null && ul > 0) return mk(total.total, ul, ing.unit, 'user');
  }
  if (ing.status === '확인됨' && population) {
    const ref = ing.references.find((r) => r.population === population && typeof r.ul === 'number');
    if (ref && ref.ul !== undefined) {
      const ul = convertAmount(ref.ul, ref.unit, ing.unit, ing.conversions);
      if (ul !== null) return { ...mk(total.total, ul, ing.unit, 'data'), population: ref.population, sourceUrl: ref.sourceUrl };
    }
  }
  return { verdict: 'no-reference', ul: null, unit: ing.unit, ratio: null, origin: 'none' };
}
function mk(total: number, ul: number, unit: string, origin: 'data' | 'user'): Evaluation {
  return { verdict: total > ul ? 'over' : 'within', ul, unit, ratio: round(total / ul), origin };
}

/** 검색용: 이름·카테고리 부분 일치 */
export function filterIngredients(list: Ingredient[], q: string, category: string): Ingredient[] {
  const s = q.trim().toLowerCase();
  return list.filter((i) => (!category || i.category === category) && (!s || i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s)));
}

export const DATA_STATUS_MESSAGE = '검증된 기준 데이터가 없어 경고를 표시할 수 없습니다';
export function isValidDate(s: string | null): boolean { return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s); }
