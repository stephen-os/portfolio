'use client';

import { useMemo, useState } from 'react';
import { filterBySearch } from '@/lib/search';

// Holds a search query and returns `items` filtered against it. `toText` builds
// each item's searchable string (e.g. title + tags + description) and should be
// a stable reference (module scope) so the memo only recomputes on query change.
export function useSearch<T>(
  items: T[],
  toText: (item: T) => string,
): {
  query: string;
  setQuery: (value: string) => void;
  results: T[];
} {
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => filterBySearch(items, query, toText),
    [items, query, toText],
  );
  return { query, setQuery, results };
}
