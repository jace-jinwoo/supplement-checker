'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { filterIngredients, unitLabel, type Ingredient } from '@/lib/intake';

export default function IngredientBrowser({ items, categories }: { items: Ingredient[]; categories: string[] }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ(p.get('q') ?? ''); const c = p.get('category') ?? ''; setCat(categories.includes(c) ? c : '');
  }, [categories]);
  const list = filterIngredients(items, q, cat);
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[12rem] flex-1">
          <label htmlFor="iq" className="block text-sm font-medium text-gray-700">성분 검색</label>
          <input id="iq" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" placeholder="예: 비타민" />
        </div>
        <div>
          <label htmlFor="ic" className="block text-sm font-medium text-gray-700">카테고리</label>
          <select id="ic" value={cat} onChange={(e) => setCat(e.target.value)} className="mt-1 rounded-md border border-gray-300 px-3 py-2">
            <option value="">전체</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600" aria-live="polite">{list.length}개 성분</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {list.map((i) => (
          <li key={i.id} className="rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold"><Link href={`/ingredients/${i.slug}/`} className="text-brand-700 hover:underline">{i.name}</Link></h2>
            <p className="mt-1 text-sm text-gray-600">{i.category} · 기준 단위 {unitLabel(i.unit)}</p>
            <p className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${i.status === '확인됨' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>{i.status === '확인됨' ? `확인됨 (${i.checkedAt})` : '미확인'}</p>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-4 text-gray-600">조건에 맞는 성분이 없습니다.</p>}
    </div>
  );
}
