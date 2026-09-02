// Client-side search for the projects and posts lists. Case-insensitive and
// token-based: an item matches when every whitespace-separated token in the
// query appears somewhere in its searchable text (title, tags, description).

// Does `searchText` satisfy every token in `query`? An empty query matches all.
export function matchesQuery(searchText: string, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = searchText.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

// Filter `items` by `query`, deriving each item's searchable text via `toText`.
// A blank query returns the list untouched (same reference).
export function filterBySearch<T>(
  items: T[],
  query: string,
  toText: (item: T) => string,
): T[] {
  if (!query.trim()) return items;
  return items.filter((item) => matchesQuery(toText(item), query));
}
