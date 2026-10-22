'use client';
import { useMemo, useState } from 'react';
import { DATA_STATUS_MESSAGE, evaluateTotal, normalizeUnit, sumIntake, unitLabel, type Ingredient, type IntakeEntry } from '@/lib/intake';

interface Row { id: string; productName: string; ingredientId: string; amount: string; unit: string; servings: string }
const UNITS = ['mg', 'ug', 'g', 'IU'];
let seq = 0;
const newRow = (): Row => ({ id: `r${++seq}`, productName: '', ingredientId: '', amount: '', unit: 'mg', servings: '1' });

export default function IntakeChecker({ ingredients }: { ingredients: Ingredient[] }) {
  const [rows, setRows] = useState<Row[]>(() => [newRow()]);
  const [pop, setPop] = useState('');
  const [user, setUser] = useState<Record<string, { ul: string; unit: string }>>({});
  const populations = useMemo(() => [...new Set(ingredients.filter((i) => i.status === '확인됨').flatMap((i) => i.references.map((r) => r.population)))], [ingredients]);

  const upd = (id: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const filled = rows.filter((r) => r.ingredientId || r.amount !== '');
  const entries: IntakeEntry[] = filled.map((r) => ({ id: r.id, productName: r.productName.trim() || '(이름 없음)', ingredientId: r.ingredientId, amount: r.amount === '' ? NaN : Number(r.amount), unit: r.unit, servingsPerDay: r.servings === '' ? NaN : Number(r.servings) }));
  const { totals, issues } = useMemo(() => sumIntake(entries, ingredients), [rows]); // eslint-disable-line react-hooks/exhaustive-deps
  const byId = new Map(ingredients.map((i) => [i.id, i]));

  return (
    <div className="space-y-6">
      <section aria-labelledby="in-h">
        <h2 id="in-h" className="text-xl font-semibold text-gray-900">1. 제품별 성분 함량 입력</h2>
        <p className="mt-1 text-sm text-gray-600">라벨의 &quot;1회(1정) 함량&quot;과 &quot;하루 섭취 개수&quot;를 입력하세요. 같은 성분이 여러 제품에 있으면 자동으로 합산합니다. 입력은 이 브라우저에서만 처리됩니다.</p>
        <div className="mt-3 space-y-3">
          {rows.map((r, idx) => {
            const msg = issues.find((x) => x.entryId === r.id);
            return (
              <fieldset key={r.id} className="rounded-lg border border-gray-200 p-3">
                <legend className="px-1 text-sm font-medium text-gray-700">항목 {idx + 1}</legend>
                <div className="grid gap-2 sm:grid-cols-6">
                  <div className="sm:col-span-2"><label className="block text-xs text-gray-600" htmlFor={`p-${r.id}`}>제품명(선택)</label>
                    <input id={`p-${r.id}`} value={r.productName} onChange={(e) => upd(r.id, { productName: e.target.value })} className="w-full rounded-md border border-gray-300 px-2 py-1.5" /></div>
                  <div className="sm:col-span-2"><label className="block text-xs text-gray-600" htmlFor={`i-${r.id}`}>성분</label>
                    <select id={`i-${r.id}`} value={r.ingredientId} onChange={(e) => upd(r.id, { ingredientId: e.target.value, unit: UNITS.includes(r.unit) ? r.unit : 'mg' })} className="w-full rounded-md border border-gray-300 px-2 py-1.5">
                      <option value="">선택</option>{ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}</select></div>
                  <div><label className="block text-xs text-gray-600" htmlFor={`a-${r.id}`}>1회 함량</label>
                    <input id={`a-${r.id}`} inputMode="decimal" type="number" min="0" step="any" value={r.amount} onChange={(e) => upd(r.id, { amount: e.target.value })} className="w-full rounded-md border border-gray-300 px-2 py-1.5" /></div>
                  <div><label className="block text-xs text-gray-600" htmlFor={`u-${r.id}`}>단위</label>
                    <select id={`u-${r.id}`} value={r.unit} onChange={(e) => upd(r.id, { unit: e.target.value })} className="w-full rounded-md border border-gray-300 px-2 py-1.5">{UNITS.map((u) => <option key={u} value={u}>{unitLabel(u)}</option>)}</select></div>
                  <div><label className="block text-xs text-gray-600" htmlFor={`s-${r.id}`}>1일 개수</label>
                    <input id={`s-${r.id}`} inputMode="decimal" type="number" min="0" step="any" value={r.servings} onChange={(e) => upd(r.id, { servings: e.target.value })} className="w-full rounded-md border border-gray-300 px-2 py-1.5" /></div>
                </div>
                {msg && <p role="alert" className="mt-2 text-sm text-red-700">{msg.reason}</p>}
                {rows.length > 1 && <button type="button" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))} className="mt-2 text-sm text-gray-600 underline">항목 삭제</button>}
              </fieldset>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => setRows((rs) => [...rs, newRow()])} className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">항목 추가</button>
          <button type="button" onClick={() => { setRows([newRow()]); setUser({}); }} className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">초기화</button>
        </div>
      </section>

      {populations.length > 0 && (
        <div><label htmlFor="pop" className="block text-sm font-medium text-gray-700">적용 대상 (공식 기준 비교용)</label>
          <select id="pop" value={pop} onChange={(e) => setPop(e.target.value)} className="mt-1 rounded-md border border-gray-300 px-3 py-2"><option value="">선택 안 함</option>{populations.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
      )}

      <section aria-labelledby="out-h" aria-live="polite">
        <h2 id="out-h" className="text-xl font-semibold text-gray-900">2. 합산 결과와 상한 비교</h2>
        {totals.length === 0 ? <p className="mt-2 text-gray-600">성분과 함량을 입력하면 합산 결과가 표시됩니다.</p> : (
          <ul className="mt-3 space-y-3">
            {totals.map((t) => {
              const ing = byId.get(t.ingredientId)!;
              const u = user[ing.id];
              const ev = evaluateTotal(t, ing, pop || null, u && u.ul !== '' ? { ul: Number(u.ul), unit: u.unit } : null);
              return (
                <li key={ing.id} className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold">{ing.name}: 합계 {t.total} {unitLabel(t.unit)}/일</p>
                  <p className="text-xs text-gray-600">{t.contributions.map((c) => `${c.productName} ${c.amount}${unitLabel(t.unit)}`).join(' + ')}</p>
                  {ev.verdict === 'no-reference' && <p role="status" className="mt-2 rounded bg-amber-50 p-2 text-sm text-amber-900">{DATA_STATUS_MESSAGE}. 아래에 기준값을 직접 입력하면 비교할 수 있습니다.</p>}
                  {ev.verdict === 'over' && <p role="alert" className="mt-2 rounded bg-red-50 p-2 text-sm font-medium text-red-800">입력한 합계가 {ev.origin === 'user' ? '사용자 입력 기준' : `공식 상한섭취량(${ev.population})`} {ev.ul}{unitLabel(ev.unit)}을 초과합니다 ({Math.round((ev.ratio ?? 0) * 100)}%). 전문가와 상담하세요.</p>}
                  {ev.verdict === 'within' && <p className="mt-2 rounded bg-green-50 p-2 text-sm text-green-800">{ev.origin === 'user' ? '사용자 입력 기준' : `공식 상한섭취량(${ev.population})`} {ev.ul}{unitLabel(ev.unit)} 이내입니다 ({Math.round((ev.ratio ?? 0) * 100)}%). 안전을 보장하는 표시는 아닙니다.</p>}
                  <div className="mt-2 flex flex-wrap items-end gap-2">
                    <div><label className="block text-xs text-gray-600" htmlFor={`ul-${ing.id}`}>사용자 입력 기준 상한</label>
                      <input id={`ul-${ing.id}`} type="number" min="0" step="any" value={u?.ul ?? ''} onChange={(e) => setUser((s) => ({ ...s, [ing.id]: { ul: e.target.value, unit: s[ing.id]?.unit ?? ing.unit } }))} className="w-32 rounded-md border border-gray-300 px-2 py-1.5" /></div>
                    <div><label className="block text-xs text-gray-600" htmlFor={`uu-${ing.id}`}>단위</label>
                      <select id={`uu-${ing.id}`} value={u?.unit ?? ing.unit} onChange={(e) => setUser((s) => ({ ...s, [ing.id]: { ul: s[ing.id]?.ul ?? '', unit: e.target.value } }))} className="rounded-md border border-gray-300 px-2 py-1.5">{UNITS.filter((x) => normalizeUnit(x)).map((x) => <option key={x} value={x}>{unitLabel(x)}</option>)}</select></div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
