import { describe, expect, it } from 'vitest';
import { convertAmount, evaluateTotal, filterIngredients, normalizeUnit, sumIntake, type Ingredient } from '@/lib/intake';

const base = { slug: 'x', category: '비타민', summary: '', conversions: [], references: [], status: '미확인' as const, sourceUrl: null, checkedAt: null };
const A: Ingredient = { ...base, id: 'a', name: '가', unit: 'mg' };
const verified: Ingredient = { ...A, status: '확인됨', references: [{ population: '테스트 대상', ul: 100, unit: 'mg', sourceUrl: 'https://example.com', checkedAt: '2026-10-22', basisVersion: 't' }] };
const conv = { from: 'IU', to: 'ug', factor: 0.5, sourceUrl: 'https://example.com' };

describe('단위', () => {
  it('표기 정규화', () => { expect(normalizeUnit(' mcg ')).toBe('ug'); expect(normalizeUnit('µg')).toBe('ug'); expect(normalizeUnit('xx')).toBeNull(); });
  it('질량 변환', () => { expect(convertAmount(1, 'g', 'mg')).toBe(1000); expect(convertAmount(500, 'ug', 'mg')).toBe(0.5); expect(convertAmount(2, 'mg', 'mg')).toBe(2); });
  it('IU 는 계수 없으면 null, 있으면 변환', () => {
    expect(convertAmount(10, 'IU', 'ug')).toBeNull();
    expect(convertAmount(10, 'IU', 'ug', [conv])).toBe(5);
    expect(convertAmount(5, 'ug', 'IU', [conv])).toBe(10);
    expect(convertAmount(10, 'IU', 'mg', [conv])).toBe(0.005);
  });
  it('유효하지 않은 값', () => { expect(convertAmount(NaN, 'mg', 'g')).toBeNull(); expect(convertAmount(1, 'kg', 'g')).toBeNull(); });
});

describe('합산', () => {
  it('단위 정규화 후 합산, 1일 개수 반영', () => {
    const r = sumIntake([
      { id: '1', productName: 'P1', ingredientId: 'a', amount: 500, unit: 'mg', servingsPerDay: 2 },
      { id: '2', productName: 'P2', ingredientId: 'a', amount: 0.25, unit: 'g', servingsPerDay: 1 },
    ], [A]);
    expect(r.totals[0].total).toBe(1250); expect(r.issues).toEqual([]);
  });
  it('변환 불가·잘못된 입력은 제외하고 사유 반환', () => {
    const r = sumIntake([
      { id: '1', productName: 'P', ingredientId: 'a', amount: 10, unit: 'IU', servingsPerDay: 1 },
      { id: '2', productName: 'P', ingredientId: 'a', amount: -1, unit: 'mg', servingsPerDay: 1 },
      { id: '3', productName: 'P', ingredientId: '', amount: 1, unit: 'mg', servingsPerDay: 1 },
      { id: '4', productName: 'P', ingredientId: 'a', amount: NaN, unit: 'mg', servingsPerDay: 1 },
    ], [A]);
    expect(r.totals).toEqual([]); expect(r.issues.map((i) => i.entryId)).toEqual(['1', '2', '3', '4']);
  });
  it('부동소수점 오차 방지', () => {
    const r = sumIntake([{ id: '1', productName: 'P', ingredientId: 'a', amount: 0.1, unit: 'mg', servingsPerDay: 1 }, { id: '2', productName: 'P', ingredientId: 'a', amount: 0.2, unit: 'mg', servingsPerDay: 1 }], [A]);
    expect(r.totals[0].total).toBe(0.3);
  });
});

describe('상한 비교', () => {
  const t = (total: number) => ({ ingredientId: 'a', unit: 'mg', total, contributions: [] });
  it('미확인 성분은 기준 없음', () => { expect(evaluateTotal(t(5000), A, '테스트 대상').verdict).toBe('no-reference'); });
  it('확인된 기준과 비교', () => {
    expect(evaluateTotal(t(101), verified, '테스트 대상').verdict).toBe('over');
    expect(evaluateTotal(t(100), verified, '테스트 대상').verdict).toBe('within');
    expect(evaluateTotal(t(100), verified, null).verdict).toBe('no-reference');
  });
  it('사용자 입력 기준(단위 변환 포함)', () => {
    const e = evaluateTotal(t(300), A, null, { ul: 0.2, unit: 'g' });
    expect(e.verdict).toBe('over'); expect(e.origin).toBe('user'); expect(e.ul).toBe(200);
  });
  it('잘못된 사용자 기준은 무시', () => { expect(evaluateTotal(t(1), A, null, { ul: -1, unit: 'mg' }).verdict).toBe('no-reference'); });
});

describe('검색', () => {
  it('이름·카테고리 필터', () => {
    const list = [{ ...A, name: '비타민 C' }, { ...A, id: 'b', name: '칼슘', category: '미네랄' }];
    expect(filterIngredients(list, '비타민', '').length).toBe(1);
    expect(filterIngredients(list, '', '미네랄')[0].name).toBe('칼슘');
  });
});
