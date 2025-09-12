'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function MultiSelect({

    options,
    value,
    onChange,
    placeholder = 'Select…',
    className = '',
    }: Props) {
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const rootRef = useRef<HTMLDivElement | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);

    const filtered = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
    const has = (o: string) => value.includes(o);
    const toggle = (o: string) =>
        onChange(has(o) ? value.filter(v => v !== o) : [...value, o]);

    const allFilteredSelected = filtered.length > 0 && filtered.every(has);
    const toggleAll = () => {
        if (allFilteredSelected) {
        onChange(value.filter(v => !filtered.includes(v)));
        } else {
        onChange(Array.from(new Set([...value, ...filtered])));
        }
    };

    // close on outside click
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    // autofocus search when opened
    useEffect(() => {
        if (open) searchRef.current?.focus();
    }, [open]);

    const label =
        value.length === 0
        ? placeholder
        : value.length <= 3
        ? value.join(', ')
        : `${value.length} selected`;

        return (
            <div
            ref={rootRef}
            className={`
                relative w-full
                rounded-lg border border-gray-300 bg-white
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
                ${className}
            `}
            >
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex min-h-[40px] w-full items-center gap-2 px-3 py-2 text-left outline-none"
            >
                {label}
            </button>

            {open && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center gap-2 p-2">
                    <input
                    ref={searchRef}
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search…"
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                    type="button"
                    onClick={() => {
                        setQ('');
                        onChange([]);
                    }}
                    className="text-xs text-blue-700 hover:underline"
                    >
                    Clear
                    </button>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                    <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium">
                    <input type="checkbox" checked={allFilteredSelected} onChange={toggleAll} />
                    <span>Select all (filtered)</span>
                    </label>

                    {filtered.map(o => (
                    <label key={o} className="flex items-center gap-2 px-3 py-1.5 text-sm">
                        <input type="checkbox" checked={has(o)} onChange={() => toggle(o)} />
                        <span>{o}</span>
                    </label>
                    ))}

                    {filtered.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                    )}
                </div>
                </div>
            )}
            </div>
        );
    }
