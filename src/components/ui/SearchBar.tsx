'use client';

import { SearchIcon, CloseIcon } from '@/components/ui/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // Visually-hidden accessible name for the input.
  label: string;
}

// A slim, inconspicuous search field: a muted bordered input with a leading
// search icon, sitting quietly until focused, when it lifts to the accent ring.
// A clear button appears once there's text.
export function SearchBar({ value, onChange, placeholder = 'Search...', label }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <SearchIcon className="w-4 h-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-bg-alt py-2 pl-10 pr-10 text-sm text-fg placeholder:text-muted transition-colors focus:border-accent focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted transition-colors hover:text-accent focus:text-accent focus:outline-none"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
