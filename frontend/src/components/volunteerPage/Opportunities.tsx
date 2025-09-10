'use client';

import Link from 'next/link';
import { useState } from 'react';

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
    <section className="max-w-6xl mx-auto px-4 py-2">
      {/* Intro */}
      <header className="text-center mb-8">
        <p className="mt-3 text-lg text-gray-700">
          We're building a small team of caring helpers. Pick a role or tell us your skills —
          we'll find a good fit (one-time or ongoing).
        </p>
        <p className="mt-2 text-sm text-gray-600">
          In the application, please include your cities and availability (weekdays/weekends, morning/afternoon/evening).
        </p>
      </header>

      {/* Role cards — masonry via CSS columns */}
      <div className="columns-1 md:columns-2 gap-x-6 md:gap-x-8">
        {ROLES.map((r) => (
          <article
            key={r.id}
            className="flex flex-col h-full rounded-2xl bg-white border border-wonderleaf/20 p-5 shadow-sm hover:shadow transition break-inside-avoid mb-6 md:mb-8"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-wondergreen">{r.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-wondersun text-gray-700 shrink-0">
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
                <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                  {r.duties.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Good fit</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                  {r.skills.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-wondersun/10 border border-wondersun/30 p-3 text-sm text-gray-800">
              <p>
                <span className="font-semibold text-wondergreen">Time:</span> {r.time}
              </p>
              <p className="mt-1">
                <span className="font-semibold text-wondergreen">Requirements:</span> {r.reqs.join(' · ')}
              </p>
            </div>

            {/* Native details — looks nice; columns layout prevents neighbor jumping */}
            {r.showOutdoorGuide && (
              <details className="mt-5 group">
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
                    <b>Before you go:</b> check weather, trail conditions, daylight; inform the lead
                    about route and an emergency contact.
                  </div>
                </div>
              </details>
            )}

            <div className="mt-auto pt-4 flex items-center gap-3 border-t border-wonderleaf/20">
              <button
                onClick={() => handleApply(r.title)}
                className="px-5 py-2.5 rounded-lg bg-wondergreen text-white
                            transition-colors motion-safe:hover:bg-wonderleaf
                            focus-visible:outline-none focus-visible:ring-2
                            focus-visible:ring-wonderleaf focus-visible:ring-offset-2
                            focus-visible:ring-offset-white"
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
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-wondergreen text-white font-semibold hover:bg-wonderleaf transition"
          >
            Apply to Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
}
