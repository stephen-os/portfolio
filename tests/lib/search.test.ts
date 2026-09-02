import { describe, it, expect } from 'vitest';
import { matchesQuery, filterBySearch } from '@/lib/search';

describe('matchesQuery', () => {
  it('matches an empty or whitespace query against anything', () => {
    expect(matchesQuery('anything', '')).toBe(true);
    expect(matchesQuery('anything', '   ')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(matchesQuery('Orbital Engine', 'orbital')).toBe(true);
    expect(matchesQuery('orbital engine', 'ORBITAL')).toBe(true);
  });

  it('requires every token to appear (AND across tokens)', () => {
    expect(matchesQuery('C++ OpenGL graphics', 'opengl graphics')).toBe(true);
    expect(matchesQuery('C++ OpenGL graphics', 'opengl python')).toBe(false);
  });

  it('matches on substrings', () => {
    expect(matchesQuery('TypeScript', 'script')).toBe(true);
  });
});

describe('filterBySearch', () => {
  const items = [
    { title: 'Kioku', tags: ['React', 'Tauri'], description: 'flashcards' },
    { title: 'ByteDojo', tags: ['Python', 'CLI'], description: 'leetcode practice' },
    { title: 'Groove', tags: ['React Native', 'Expo'], description: 'habit tracker' },
  ];
  const toText = (item: (typeof items)[number]) =>
    `${item.title} ${item.tags.join(' ')} ${item.description}`;

  it('returns the same list reference for a blank query', () => {
    expect(filterBySearch(items, '', toText)).toBe(items);
    expect(filterBySearch(items, '   ', toText)).toBe(items);
  });

  it('matches by name', () => {
    expect(filterBySearch(items, 'kioku', toText).map((i) => i.title)).toEqual(['Kioku']);
  });

  it('matches by tag, including partial tag text', () => {
    expect(filterBySearch(items, 'react', toText).map((i) => i.title)).toEqual([
      'Kioku',
      'Groove',
    ]);
  });

  it('matches by description', () => {
    expect(filterBySearch(items, 'leetcode', toText).map((i) => i.title)).toEqual(['ByteDojo']);
  });

  it('returns nothing when no item matches', () => {
    expect(filterBySearch(items, 'zzz nope', toText)).toEqual([]);
  });
});
