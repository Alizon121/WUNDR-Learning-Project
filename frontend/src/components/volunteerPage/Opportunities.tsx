'use client';

import Link from 'next/link';

// Small enum-like union for where a role happens
type Env = 'Outdoor' | 'Indoor' | 'Indoor/Outdoor' | 'Online' | 'Indoor/Online';

// Shape of a single volunteer role card
type Role = {
  id: string;
  title: string;
  env: Env;                 // environment label
  duties: string[];         // what volunteers do
  skills: string[];         // who is a good fit
  time: string;             // time commitment text
  reqs: string[];           // requirements bullets
  tags?: string[];          // short badges
  showOutdoorGuide?: boolean; // toggles the hiking guide block
};

const ROLES: Role[] = [
  {
    id: 'outdoors',
    title: 'Nature & Outdoors Helper / Hike Co-Leader',
    env: 'Outdoor',
    duties: [
      'Walk with the group and keep a safe pace',
      'Help with navigation and breaks',
      '“Sweep” from the back to make sure no one is left behind',
      'You may suggest a simple route you know and share local nature stories',
    ],
    skills: [
      'Basic hiking experience, calm and attentive',
      'First Aid/CPR is a plus (preferred but not required)',
    ],
    time: '2-4 hours, weekdays and/or weekends (tell us your availability in the application)',
    reqs: [
      '18+ with background check',
      'Outdoor waiver',
      'Charged phone/radio',
      'We follow the “two adults per group” safety rule',
    ],
    tags: ['Hikes', 'Safety', 'Families'],
    showOutdoorGuide: true,
  },
  {
    id: 'museums',
    title: 'Museum & Parks Docent Helper',
    env: 'Indoor/Outdoor',
    duties: [
      'Assist children during visits (not all will be with parents)',
      'Split into small groups and accompany through galleries/routes',
      'Keep an eye on the schedule and site rules',
    ],
    skills: ['Friendly, curious', 'Comfortable guiding a small group'],
    time: '2–3 hours on visit days (weekdays/weekends — flexible)',
    reqs: [
      '18+ with background check',
      'Short site orientation (badge/rules) may apply',
    ],
    tags: ['Museums', 'Parks', 'Field Trips'],
  },
  {
    id: 'stem',
    title: 'STEM Club Assistant / Instructor',
    env: 'Indoor/Online',
    duties: [
      'Support simple hands-on projects: LEGO®, circuits, science experiments',
      'Beginner coding/robotics, keep tools safe and materials organized',
      'As an Instructor, lead a short demo or mini-lesson',
    ],
    skills: ['Interest in STEM/science', 'Explain ideas step by step'],
    time: '1-2 hours weekly or bi-weekly, in 3-6 week series',
    reqs: ['18+ with background check', 'Materials provided or pre-approved'],
    tags: ['STEM', 'Science', 'Coding'],
  },
  {
    id: 'photo',
    title: 'Photo / Video Storyteller',
    env: 'Indoor/Outdoor',
    duties: [
      'Capture moments at programs',
      'Deliver a small set of photos/videos; light editing is a plus',
    ],
    skills: ['Basic photo/video skills', 'Your phone/camera is fine'],
    time: '2-4 hours per event + 1-2 hours to select files',
    reqs: [
      '18+ with background check',
      'Follow our Photo Policy (only participants with consent)',
    ],
    tags: ['Media', 'Story'],
  },
  {
    id: 'tutor',
    title: 'Mentor / Tutor (Reading · Math · Writing · Programming · Science)',
    env: 'Indoor/Online',
    duties: [
      'Short 1:1 or small-group sessions',
      'Reinforce key skills (including science and basic coding — Scratch/Python)',
    ],
    skills: ['Patience, clear explanations', 'Basic knowledge in your subject'],
    time: '45-60 minutes weekly or every other week',
    reqs: ['18+ with background check', 'Quick onboarding and starter materials provided'],
    tags: ['Tutoring', 'Reading', 'Math', 'Coding'],
  },
  {
    id: 'comms',
    title: 'Communications / Social Media',
    env: 'Online',
    duties: ['Short posts about events, stories, simple flyers', 'Help with email reminders'],
    skills: ['Clear writing, positive tone', 'Basic Canva is a plus'],
    time: '1-3 hours per week, flexible',
    reqs: ['18+ with background check', 'Follow brand guide and Photo Policy'],
    tags: ['Social', 'Email', 'Canva'],
  },
  {
    id: 'safety',
    title: 'Safety Lead (CPR/First Aid)',
    env: 'Indoor/Outdoor',
    duties: ['Be an extra set of eyes for safety', 'Know our emergency steps'],
    skills: ['Current CPR/First Aid — preferred'],
    time: 'Matches the program (usually 2-4 hours)',
    reqs: ['18+ with background check', 'Outdoor waiver for hikes'],
    tags: ['Safety', 'CPR'],
  },
];

// Quick extra roles block (simple list below the cards)
const ALSO_HELPFUL = [
  { title: 'Fundraising / Grants (Online)', blurb: 'Find mini-grants and draft simple applications.' },
  { title: 'Community Outreach (Indoor/Online)', blurb: 'Connect with libraries, museums, parks, schools.' },
  { title: 'Equipment Manager (Indoor)', blurb: 'Track and prep kits/materials for programs.' },
];

export default function Opportunities({
  onApply,
}: {
  // Optional callback: parent can handle switching tab to the form (e.g., setTab('form'))
  onApply?: (roleTitle?: string) => void;
}) {
  // If parent passed a handler, use it; otherwise do a simple link navigation with a role param
  const handleApply = (title?: string) => {
    if (onApply) return onApply(title);
    const href = '/volunteer-page?apply=1' + (title ? `&role=${encodeURIComponent(title)}` : '');
    window.location.href = href;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Intro */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-wondergreen">
          Become a WonderHood Volunteer
        </h1>
        <p className="mt-3 text-lg text-gray-700">
          We're building a small team of caring helpers. Pick a role or tell us your skills —
          we'll find a good fit (one-time or ongoing).
        </p>
        <p className="mt-2 text-sm text-gray-600">
          In the application, please include your cities and availability (weekdays/weekends, morning/afternoon/evening).
        </p>
      </header>

      {/* Role cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {ROLES.map((r) => (
          <article
            key={r.id}
            className="rounded-2xl bg-white border border-wonderleaf/20 p-5 shadow-sm hover:shadow transition"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-wondergreen">{r.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 shrink-0">
                {r.env}
              </span>
            </div>

            {r.tags && r.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-1 rounded-full bg-wondergreen/10 text-wondergreen"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">What you'll do</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {r.duties.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Good fit</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {r.skills.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <p>
                <b>Time:</b> {r.time}
              </p>
              <p className="mt-1">
                <b>Requirements:</b> {r.reqs.join(' · ')}
              </p>
            </div>

            {/* Accessible native toggle for the hiking quick guide */}
            {r.showOutdoorGuide && (
              <details className="mt-3 group">
                <summary className="cursor-pointer text-sm text-wondergreen hover:text-wonderleaf underline decoration-dotted">
                  Quick hiking guide (what to pack / safety)
                </summary>
                <div className="mt-2 text-sm text-gray-700 space-y-2">
                  <div>
                    <b>Backpack essentials:</b> water, snack, warm layer, rain shell, hat/sunscreen,
                    small first-aid kit (incl. blister care), headlamp/flashlight, whistle, map/offline GPS,
                    power bank, spare socks, small trash bag.
                  </div>
                  <div>
                    <b>Life-savers in a pinch:</b> communication & meetup plan, warmth/insulation,
                    navigation, water/food, basic first aid.
                  </div>
                  <div>
                    <b>Before you go:</b> check weather, trail conditions, daylight; inform the lead about route and an emergency contact.
                  </div>
                </div>
              </details>
            )}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => handleApply(r.title)}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-wondergreen text-white font-semibold hover:bg-wonderleaf transition"
              >
                Apply for this role
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Extra roles list */}
      <div className="mt-8 rounded-2xl bg-white border border-wonderleaf/20 p-5">
        <h3 className="text-lg font-semibold text-wondergreen mb-2">Also helpful</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          {ALSO_HELPFUL.map((x) => (
            <li key={x.title}>
              <b>{x.title}:</b> {x.blurb}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Link
            href="/volunteer-page?apply=1"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-wondergreen text-wondergreen font-semibold hover:bg-wondergreen/5 transition"
          >
            Apply to Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
}


// import { useMemo, useState } from 'react';

// type Location =
//   | 'Westcliffe'
//   | 'Custer County'
//   | 'Colorado Springs'
//   | 'Denver'
//   | 'Pueblo'
//   | 'Salida'
//   | 'Castle Rock'
//   | 'Online';

// type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';
// type Duration = 'One-time' | 'Weekly';
// type Category =
//   | 'Nature & Outdoors'
//   | 'Arts & Crafts'
//   | 'Mentoring'
//   | 'Event Logistics'
//   | 'Photo/Video'
//   | 'Museums & Parks'
//   | 'Online';
  

// type Opportunity = {
//   id: string;
//   title: string;
//   blurb: string;
//   location: Location;
//   time: TimeOfDay;
//   duration: Duration;
//   minAge: 16 | 18;              // возраст волонтёра
//   categories: Category[];
//   badges?: string[];            // напр. "Background check", "Family-friendly", "Works with ages 10–18"
// };

// const ALL: Opportunity[] = [
//   {
//     id: '1',
//     title: 'Art Workshop Assistant',
//     blurb: 'Help set up supplies and assist kids at tables (no teaching experience required).',
//     location: 'Westcliffe',
//     time: 'Morning',
//     duration: 'One-time',
//     minAge: 18,
//     categories: ['Arts & Crafts', 'Event Logistics'],
//     badges: ['Background check', 'Works with ages 10–18'],
//   },
//   {
//     id: '2',
//     title: 'Trail Clean-Up Helper',
//     blurb: 'Outdoor clean-up day with families on local trails.',
//     location: 'Custer County',
//     time: 'Morning',
//     duration: 'One-time',
//     minAge: 16,
//     categories: ['Nature & Outdoors'],
//     badges: ['Family-friendly', 'Works with ages 10–18'],
//   },
//   {
//     id: '3',
//     title: 'Event Greeter',
//     blurb: 'Welcome families, check them in, and guide to activity areas.',
//     location: 'Colorado Springs',
//     time: 'Afternoon',
//     duration: 'Weekly',
//     minAge: 18,
//     categories: ['Event Logistics', 'Mentoring'],
//     badges: ['Background check', 'Works with ages 10–18'],
//   },
//   {
//     id: '4',
//     title: 'Museum Docent Helper',
//     blurb: 'Support kids’ learning at partner museums and parks (no prior experience required).',
//     location: 'Denver',
//     time: 'Afternoon',
//     duration: 'One-time',
//     minAge: 18,
//     categories: ['Museums & Parks', 'Mentoring'],
//     badges: ['Background check', 'Works with ages 10–18'],
//   },
//   {
//     id: '5',
//     title: 'Photo/Video Helper',
//     blurb: 'Capture moments at events (basic camera/phone skills are enough).',
//     location: 'Online',
//     time: 'Evening',
//     duration: 'One-time',
//     minAge: 18,
//     categories: ['Photo/Video'],
//     badges: ['Background check'],
//   },
// ];

// const CATS: Category[] = [
//   'Nature & Outdoors',
//   'Arts & Crafts',
//   'Mentoring',
//   'Event Logistics',
//   'Photo/Video',
//   'Museums & Parks',
//   'Online'
// ];

// export default function Opportunities({
//   onApply,
// }: {
//   onApply?: (roleTitle: string) => void;
// }) {
//   // --- фильтры ---
//   const [location, setLocation] = useState<'All' | Location>('All');
//   const [time, setTime] = useState<'Any' | TimeOfDay>('Any');
//   const [duration, setDuration] = useState<'Any' | Duration>('Any');
//   const [age, setAge] = useState<'Any' | 16 | 18>('Any');
//   const [cats, setCats] = useState<Category[]>([]);

//   const toggleCat = (c: Category) =>
//     setCats(prev => (prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]));

//   const clearFilters = () => {
//     setLocation('All'); setTime('Any'); setDuration('Any'); setAge('Any'); setCats([]);
//   };

//   // --- фильтрация ---
//   const list = useMemo(() => {
//     return ALL.filter(o => {
//       if (location !== 'All' && o.location !== location) return false;
//       if (time !== 'Any' && o.time !== time) return false;
//       if (duration !== 'Any' && o.duration !== duration) return false;
//       if (age !== 'Any' && o.minAge !== age) return false;
//       if (cats.length && !cats.every(c => o.categories.includes(c))) return false;
//       return true;
//     });
//   }, [location, time, duration, age, cats]);

//   return (
//     <section className="space-y-6">
//       {/* Панель фильтров */}
//       <div className="rounded-2xl bg-white p-6 shadow border border-wonderleaf/20">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-semibold text-wondergreen">Find Your Perfect Role</h3>
//           <div className="text-sm text-gray-600">
//             {list.length} result{list.length !== 1 ? 's' : ''}
//           </div>
//         </div>

//         <div className="grid md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Location</label>
//             <select
//               value={location}
//               onChange={e => setLocation(e.target.value as any)}
//               className="w-full rounded-md border px-3 py-2"
//             >
//               <option value="All">All locations</option>
//               <option>Westcliffe</option>
//               <option>Custer County</option>
//               <option>Colorado Springs</option>
//               <option>Denver</option>
//               <option>Pueblo</option>
//               <option>Salida</option>
//               <option>Castle Rock</option>
//               <option>Online</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Time of day</label>
//             <select value={time} onChange={e => setTime(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
//               <option value="Any">Any time</option>
//               <option>Morning</option>
//               <option>Afternoon</option>
//               <option>Evening</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Duration</label>
//             <select value={duration} onChange={e => setDuration(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
//               <option value="Any">Any duration</option>
//               <option>One-time</option>
//               <option>Weekly</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Age requirement</label>
//             <select
//               value={age}
//               onChange={e => setAge((e.target.value === 'Any' ? 'Any' : Number(e.target.value)) as any)}
//               className="w-full rounded-md border px-3 py-2"
//             >
//               <option value="Any">Any age</option>
//               <option value={16}>16+ (with guardian)</option>
//               <option value={18}>18+</option>
//             </select>
//           </div>
//         </div>

//         {/* Категории */}
//         <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
//           {CATS.map(c => (
//             <label key={c} className="inline-flex items-center gap-2 text-gray-700">
//               <input
//                 type="checkbox"
//                 className="rounded"
//                 checked={cats.includes(c)}
//                 onChange={() => toggleCat(c)}
//               />
//               {c}
//             </label>
//           ))}
//         </div>

//         {(location !== 'All' || time !== 'Any' || duration !== 'Any' || age !== 'Any' || cats.length) && (
//           <div className="mt-3">
//             <button type="button" onClick={clearFilters} className="text-sm text-wondergreen hover:text-wonderleaf underline">
//               Clear filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Карточки */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {list.length === 0 ? (
//           <div className="col-span-full rounded-xl border border-dashed p-8 text-center text-gray-600">
//             No roles match your filters. Try adjusting them or check back soon.
//           </div>
//         ) : (
//           list.map(o => (
//             <article key={o.id} className="rounded-xl border p-5 bg-white flex flex-col gap-3 hover:shadow transition">
//               <h4 className="text-lg font-semibold text-wondergreen">{o.title}</h4>
//               <p className="text-gray-700">{o.blurb}</p>

//               <div className="flex flex-wrap gap-2 text-xs">
//                 <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{o.location}</span>
//                 <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{o.time}</span>
//                 <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{o.duration}</span>
//                 <span className="px-2 py-1 rounded-full bg-wondergreen/10 text-wondergreen">{o.minAge}+</span>
//                 {o.badges?.map(b => (
//                   <span key={b} className="px-2 py-1 rounded-full bg-wonderleaf/10 text-wonderleaf">{b}</span>
//                 ))}
//               </div>

//               <div className="mt-2 flex gap-2">
//                 <button className="px-3 py-2 border rounded-lg text-wondergreen">Details</button>
//                 <button
//                   className="px-3 py-2 rounded-lg bg-wondergreen text-white"
//                   onClick={() => onApply?.(o.title)}
//                 >
//                   Apply
//                 </button>
//               </div>
//             </article>
//           ))
//         )}
//       </div>
//     </section>
//   );
// }
