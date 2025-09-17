'use client';

import Link from 'next/link';
import { useModal } from '@/app/context/modal';
import { isLoggedIn } from '../../../utils/auth';
import LoginModal from '@/components/login/LoginModal';
import VolunteerForm from './VolunteerForm';
import { useEffect, useRef, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { markOppSubmitted, isOppSubmitted } from './volunteerLocks';
import { Opp, Venue } from "../../types/opportunity"

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const ALSO_HELPFUL = [
  { title: 'Fundraising / Grants (Online)', blurb: 'Find mini-grants and draft simple applications.' },
  { title: 'Community Outreach (Indoor/Online)', blurb: 'Connect with libraries, museums, parks, schools.' },
  { title: 'Equipment Manager (Indoor)', blurb: 'Track and prep kits/materials for programs.' },
];

export default function Opportunities({
  onApply,
}: {
  onApply?: (roleTitle?: string, opportunityId?: string) => void;
}) {
  const { setModalContent, closeModal } = useModal();

  // Client-only flags
  const [hydrated, setHydrated] = useState(false);
  const [logged, setLogged] = useState(false);
  const fetched = useRef(false); // guard against StrictMode double-run
  const [items, setItems] = useState<Opp[]>([]);

  useEffect(() => {
  (async () => {
    try {
      const res = await makeApiRequest<{ opportunities: Opp[] }>(
        `${API}/opportunities/public`,
        { method: 'GET' }
      );
      setItems(res.opportunities ?? []);
    } catch {}
  })();
}, []);


const envLabel = (venue: Venue[]) => {
  const hasIn = venue.includes('Indoors');
  const hasOut = venue.includes('Outdoors');
  const hasOn = venue.includes('Online');
  if (hasIn && hasOut) return 'Indoor/Outdoor';
  if (hasIn && hasOn)  return 'Indoor/Online';
  if (hasIn) return 'Indoor';
  if (hasOut) return 'Outdoor';
  return 'Online';
};

  useEffect(() => {
    setHydrated(true);
    setLogged(isLoggedIn());
  }, []);

  useEffect(() => {
  if (!hydrated || !logged || fetched.current) return;
  fetched.current = true;
  (async () => {
    try {
      const res = await makeApiRequest<{ opportunityIds: string[] }>(
        `${API}/volunteer/my-opportunities`,
        { method: 'GET' }
      );
      (res.opportunityIds || []).forEach(id => markOppSubmitted(id));
    } catch (e: any) {
      if (String(e?.status) === '401' || String(e?.status) === '403') return;
    }
  })();
}, [hydrated, logged]);


  const openApply = (oppId: string, title: string) => {
    if (onApply) return onApply(title, oppId);
    if (!logged) return setModalContent(<LoginModal />);
    setModalContent(
    <div className="max-w-3xl">
      <VolunteerForm key={oppId} opportunityId={oppId} roleTitle={title} onDone={closeModal} />
    </div>
  );

  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-2">
      <header className="text-center mb-8">
        <p className="mt-3 text-lg text-gray-700">
          We're building a small team of caring helpers. Pick a role or tell us your skills —
          we'll find a good fit (one-time or ongoing).
        </p>
        <p className="mt-2 text-sm text-gray-600">
          In the application, please include your cities and availability (weekdays/weekends, morning/afternoon/evening).
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {items.map(r => {
          const applied = logged && hydrated && isOppSubmitted(r.id); 
          return (
            <article
              key={r.id}
              className="h-full flex flex-col rounded-2xl bg-white border border-wonderleaf/20 p-5 shadow-sm hover:shadow transition"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-wondergreen">{r.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-wondersun text-gray-700 shrink-0">
                  {envLabel(r.venue)}
                </span>
              </div>

              {r.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.tags.map(t => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-wondergreen/10 text-wondergreen">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3 grid sm:grid-cols-2 gap-4">
                <div className="min-h-[190px] md:min-h-[210px]">
                  <h4 className="font-medium text-gray-900 mb-1">What you'll do</h4>
                  <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                    {r.duties.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div className="min-h-[190px] md:min-h-[210px]">
                  <h4 className="font-medium text-gray-900 mb-1">Good fit</h4>
                  <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                    {r.skills.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-wondersun/10 border border-wondersun/30 p-3 text-sm text-gray-800">
                <p><span className="font-semibold text-wondergreen">Time:</span> {r.time}</p>
                <p className="mt-1"><span className="font-semibold text-wondergreen">Requirements:</span> {r.requirements.join(' · ')}</p>
              </div>
              {/* Do not delete! */}
              {/* {r.id && (
                <details className="mt-5 group">
                  <summary className="cursor-pointer text-sm text-wondergreen hover:text-wonderleaf underline decoration-dotted">
                    Quick hiking guide (what to pack / safety)
                  </summary>
                  <div className="mt-2 text-sm text-gray-700 space-y-2">
                    <div><b>Backpack essentials:</b> water, snack, warm layer, rain shell, hat/sunscreen, small first-aid kit (incl. blister care), headlamp/flashlight, whistle, map/offline GPS, power bank, spare socks, small trash bag.</div>
                    <div><b>Life-savers in a pinch:</b> communication & meetup plan, warmth/insulation, navigation, water/food, basic first aid.</div>
                    <div><b>Before you go:</b> check weather, trail conditions, daylight; inform the lead about route and an emergency contact.</div>
                  </div>
                </details>
              )} */}

              <div className="mt-auto pt-4 flex items-center gap-3 border-t border-wonderleaf/20">
                <button
                onClick={() => openApply(r.id, r.title)}
                disabled={applied}
                className={`px-5 py-2.5 rounded-lg text-white transition-colors
                  ${applied ? 'bg-gray-300 cursor-not-allowed' : 'bg-wondergreen hover:bg-wonderleaf'}`}
                >
                  {applied ? 'Applied' : 'Apply for this role'}
                </button>

              </div>
            </article>
          );
        })}
      </div>

      {/* <div className="mt-8 rounded-2xl bg-white border border-wonderleaf/20 p-5">
        <h3 className="text-lg font-semibold text-wondergreen mb-2">Also helpful</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          {ALSO_HELPFUL.map(x => (
            <li key={x.title}>
              <b>{x.title}:</b> {x.blurb}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Link
            href="#apply"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-wondergreen text-white font-semibold hover:bg-wonderleaf transition"
          >
            Apply to Volunteer
          </Link>
        </div>
      </div> */}
    </section>
  );
}
