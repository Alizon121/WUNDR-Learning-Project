'use client';

import { useMemo, useState } from 'react';

type Location =
  | 'Westcliffe'
  | 'Custer County'
  | 'Colorado Springs'
  | 'Denver'
  | 'Pueblo'
  | 'Salida'
  | 'Castle Rock'
  | 'Online';

type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';
type Duration = 'One-time' | 'Weekly';
type Category =
  | 'Nature & Outdoors'
  | 'Arts & Crafts'
  | 'Mentoring'
  | 'Event Logistics'
  | 'Photo/Video'
  | 'Museums & Parks'
  | 'Online';
  

type Opportunity = {
  id: string;
  title: string;
  blurb: string;
  location: Location;
  time: TimeOfDay;
  duration: Duration;
  minAge: 16 | 18;              // возраст волонтёра
  categories: Category[];
  badges?: string[];            // напр. "Background check", "Family-friendly", "Works with ages 10–18"
};

const ALL: Opportunity[] = [
  {
    id: '1',
    title: 'Art Workshop Assistant',
    blurb: 'Help set up supplies and assist kids at tables (no teaching experience required).',
    location: 'Westcliffe',
    time: 'Morning',
    duration: 'One-time',
    minAge: 18,
    categories: ['Arts & Crafts', 'Event Logistics'],
    badges: ['Background check', 'Works with ages 10–18'],
  },
  {
    id: '2',
    title: 'Trail Clean-Up Helper',
    blurb: 'Outdoor clean-up day with families on local trails.',
    location: 'Custer County',
    time: 'Morning',
    duration: 'One-time',
    minAge: 16,
    categories: ['Nature & Outdoors'],
    badges: ['Family-friendly', 'Works with ages 10–18'],
  },
  {
    id: '3',
    title: 'Event Greeter',
    blurb: 'Welcome families, check them in, and guide to activity areas.',
    location: 'Colorado Springs',
    time: 'Afternoon',
    duration: 'Weekly',
    minAge: 18,
    categories: ['Event Logistics', 'Mentoring'],
    badges: ['Background check', 'Works with ages 10–18'],
  },
  {
    id: '4',
    title: 'Museum Docent Helper',
    blurb: 'Support kids’ learning at partner museums and parks (no prior experience required).',
    location: 'Denver',
    time: 'Afternoon',
    duration: 'One-time',
    minAge: 18,
    categories: ['Museums & Parks', 'Mentoring'],
    badges: ['Background check', 'Works with ages 10–18'],
  },
  {
    id: '5',
    title: 'Photo/Video Helper',
    blurb: 'Capture moments at events (basic camera/phone skills are enough).',
    location: 'Online',
    time: 'Evening',
    duration: 'One-time',
    minAge: 18,
    categories: ['Photo/Video'],
    badges: ['Background check'],
  },
];

const CATS: Category[] = [
  'Nature & Outdoors',
  'Arts & Crafts',
  'Mentoring',
  'Event Logistics',
  'Photo/Video',
  'Museums & Parks',
  'Online'
];

export default function Opportunities({
  onApply,
}: {
  onApply?: (roleTitle: string) => void;
}) {
  // --- фильтры ---
  const [location, setLocation] = useState<'All' | Location>('All');
  const [time, setTime] = useState<'Any' | TimeOfDay>('Any');
  const [duration, setDuration] = useState<'Any' | Duration>('Any');
  const [age, setAge] = useState<'Any' | 16 | 18>('Any');
  const [cats, setCats] = useState<Category[]>([]);

  const toggleCat = (c: Category) =>
    setCats(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));

  const clearFilters = () => {
    setLocation('All'); setTime('Any'); setDuration('Any'); setAge('Any'); setCats([]);
  };

  // --- фильтрация ---
  const list = useMemo(() => {
    return ALL.filter(o => {
      if (location !== 'All' && o.location !== location) return false;
      if (time !== 'Any' && o.time !== time) return false;
      if (duration !== 'Any' && o.duration !== duration) return false;
      if (age !== 'Any' && o.minAge !== age) return false;
      if (cats.length && !cats.every(c => o.categories.includes(c))) return false;
      return true;
    });
  }, [location, time, duration, age, cats]);

  return (
    <section className="space-y-6">
      {/* Панель фильтров */}
      <div className="rounded-2xl bg-white p-6 shadow border border-wonderleaf/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-wondergreen">Find Your Perfect Role</h3>
          <div className="text-sm text-gray-600">
            {list.length} result{list.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Location</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value as any)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="All">All locations</option>
              <option>Westcliffe</option>
              <option>Custer County</option>
              <option>Colorado Springs</option>
              <option>Denver</option>
              <option>Pueblo</option>
              <option>Salida</option>
              <option>Castle Rock</option>
              <option>Online</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Time of day</label>
            <select value={time} onChange={e => setTime(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
              <option value="Any">Any time</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Duration</label>
            <select value={duration} onChange={e => setDuration(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
              <option value="Any">Any duration</option>
              <option>One-time</option>
              <option>Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Age requirement</label>
            <select
              value={age}
              onChange={e => setAge((e.target.value === 'Any' ? 'Any' : Number(e.target.value)) as any)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="Any">Any age</option>
              <option value={16}>16+ (with guardian)</option>
              <option value={18}>18+</option>
            </select>
          </div>
        </div>

        {/* Категории */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {CATS.map(c => (
            <label key={c} className="inline-flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                className="rounded"
                checked={cats.includes(c)}
                onChange={() => toggleCat(c)}
              />
              {c}
            </label>
          ))}
        </div>

        {(location !== 'All' || time !== 'Any' || duration !== 'Any' || age !== 'Any' || cats.length) && (
          <div className="mt-3">
            <button type="button" onClick={clearFilters} className="text-sm text-wondergreen hover:text-wonderleaf underline">
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Карточки */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-gray-600">
            No roles match your filters. Try adjusting them or check back soon.
          </div>
        ) : (
          list.map(o => (
            <article key={o.id} className="rounded-xl border p-5 bg-white flex flex-col gap-3 hover:shadow transition">
              <h4 className="text-lg font-semibold text-wondergreen">{o.title}</h4>
              <p className="text-gray-700">{o.blurb}</p>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{o.location}</span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{o.time}</span>
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{o.duration}</span>
                <span className="px-2 py-1 rounded-full bg-wondergreen/10 text-wondergreen">{o.minAge}+</span>
                {o.badges?.map(b => (
                  <span key={b} className="px-2 py-1 rounded-full bg-wonderleaf/10 text-wonderleaf">{b}</span>
                ))}
              </div>

              <div className="mt-2 flex gap-2">
                <button className="px-3 py-2 border rounded-lg text-wondergreen">Details</button>
                <button
                  className="px-3 py-2 rounded-lg bg-wondergreen text-white"
                  onClick={() => onApply?.(o.title)}
                >
                  Apply
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
