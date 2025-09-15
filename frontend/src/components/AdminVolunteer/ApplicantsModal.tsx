'use client';

import { useEffect, useMemo, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { useModal } from '@/app/context/modal';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type AppStatus = 'New' | 'In_review' | 'Approved' | 'Rejected';

type VolunteerApp = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;

  // NEW: extra fields we want to see
  bio?: string;                       // Short bio (optional)
  photoConsent?: boolean;             // Photo consent flag
  backgroundCheckConsent?: boolean;   // BG check consent flag

  cities?: string[];
  daysAvail?: string[];
  timesAvail?: string[];
  skills?: string[];
  status?: AppStatus;
  volunteerOpportunityIDs?: string[];
};

type Props =
  | { mode: 'all'; title?: string }
  | { mode: 'opp'; opportunityId: string; title?: string };

export default function ApplicantsModal(props: Props) {
  const { closeModal } = useModal();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<VolunteerApp[]>([]);
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'all' | 'general'>('all'); // only used in "all" mode

  // Fetch applications
  useEffect(() => {
    let url = '';
    if (props.mode === 'opp') {
      url = `${API}/opportunities/${props.opportunityId}/applications`;
    } else {
      url = `${API}/volunteer/applications?kind=${kind}`;
    }

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await makeApiRequest<{ volunteers: VolunteerApp[] }>(url, { method: 'GET' });
        setItems(res.volunteers ?? []);
      } catch (e: any) {
        setErr(e?.detail || e?.message || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    })();
  }, [props, kind]);

  // Client-side search
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((v) =>
      [
        v.firstName,
        v.lastName,
        v.email,
        v.phoneNumber,
        v.bio,
        ...(v.cities ?? []),
        ...(v.skills ?? []),
        ...(v.timesAvail ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(s)
    );
  }, [items, q]);

  const header =
    props.mode === 'opp'
      ? `Applications — ${props.title ?? 'Opportunity'}`
      : kind === 'general'
      ? 'General applications (no specific opportunity)'
      : 'All applications';

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{header}</h2>
        <button
          type="button"
          onClick={closeModal}
          className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <input
          placeholder="Search…"
          className="rounded-lg border px-3 py-2 w-64"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {props.mode === 'all' && (
          <select
            className="rounded-lg border px-3 py-2"
            value={kind}
            onChange={(e) => setKind(e.target.value as 'all' | 'general')}
          >
            <option value="all">All</option>
            <option value="general">General only</option>
          </select>
        )}
        <span className="text-sm text-gray-500">{filtered.length} total</span>
      </div>

      {/* Body */}
      <div className="rounded-2xl border bg-white p-4">
        {loading ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : err ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-gray-500">No applications.</div>
        ) : (
          <ul className="divide-y">
            {filtered.map((v) => (
              <li key={v.id} className="py-3 flex items-start justify-between gap-3">
                {/* Left: main info */}
                <div className="min-w-0">
                  <div className="font-medium">
                    {v.firstName} {v.lastName}{' '}
                    {v.status ? (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {v.status}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-sm text-gray-700">
                    {v.email ? <span>{v.email}</span> : null}
                    {v.phoneNumber ? <span className="ml-2">· {v.phoneNumber}</span> : null}
                  </div>

                  {/* NEW: consent badges */}
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className={`text-[11px] px-2 py-1 rounded-full ${v.photoConsent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                      Photo consent: {v.photoConsent ? 'Yes' : 'No'}
                    </span>
                    {typeof v.backgroundCheckConsent === 'boolean' && (
                      <span className={`text-[11px] px-2 py-1 rounded-full ${v.backgroundCheckConsent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        BG check consent: {v.backgroundCheckConsent ? 'Yes' : 'No'}
                      </span>
                    )}
                  </div>

                  {/* NEW: short bio */}
                  {v.bio ? (
                    <div className="mt-2 text-sm text-gray-800">
                      <details className="group">
                        <summary className="cursor-pointer text-wondergreen hover:text-wonderleaf underline decoration-dotted">
                          Short bio
                        </summary>
                        <div className="mt-1 whitespace-pre-wrap">
                          {v.bio}
                        </div>
                      </details>
                    </div>
                  ) : null}

                  {/* Meta rows */}
                  <div className="mt-2 text-xs text-gray-600 space-x-3 space-y-1">
                    {v.cities?.length ? <span>Cities: {v.cities.join(', ')}</span> : null}
                    {v.skills?.length ? <span>Skills: {v.skills.join(', ')}</span> : null}
                    {v.timesAvail?.length ? <span>Times: {v.timesAvail.join(', ')}</span> : null}
                  </div>
                </div>

                {/* Right: room for future actions (approve/reject) */}
                <div className="shrink-0 flex items-center gap-2">
                  {/* add actions later if needed */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
