import raw from '@/data/ingredients.json';
import guides from '@/data/guides.json';
import type { Combination, Ingredient, SourceDoc } from '@/lib/intake';

export const INGREDIENTS = raw.ingredients as Ingredient[];
export const COMBINATIONS = raw.combinations as Combination[];
export const SOURCES = raw.sources as SourceDoc[];
export const CATEGORIES = [...new Set(INGREDIENTS.map((i) => i.category))];
export const VERIFIED_COUNT = INGREDIENTS.filter((i) => i.status === '확인됨').length;
export const GUIDES = guides as { slug: string; title: string; date: string; summary: string; sections: { h: string; p: string[] }[] }[];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
