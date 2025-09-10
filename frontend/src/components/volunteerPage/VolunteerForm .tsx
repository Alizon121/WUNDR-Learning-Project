'use client';

import { useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import type { VolunteerCreate, AvailabilityDay } from '@/types/volunteer';
import { isLoggedIn } from '../../../utils/auth';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useModal } from '@/app/context/modal';
import LoginModal from '@/components/login/LoginModal';
import SignupModal from '@/components/signup/SignupModal';
 

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  citiesLine: string;   // "Westcliffe, Pueblo"
  timesLine: string;    // "mornings, evenings"
  skillsLine: string;   // "hiking, photography"
  daysAvail: AvailabilityDay[]; // ['Weekdays','Weekends']
  bio: string;
  photoConsent: boolean;
  backgroundCheckConsent: boolean;
};

const initial: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  citiesLine: '',
  timesLine: '',
  skillsLine: '',
  daysAvail: [],
  bio: '',
  photoConsent: false,
  backgroundCheckConsent: false,
};

export default function VolunteerForm() {
    const { setModalContent } = useModal()
  const [f, setF] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const next = encodeURIComponent(
    search?.toString() ? `${pathname}?${search.toString()}` : pathname
  )

  const logged = isLoggedIn();
  const disabled = !logged || submitting;

  const goLogin = () => setModalContent(<LoginModal />);
  const goSignup = () => setModalContent(<SignupModal />);

  const toggleDay = (d: AvailabilityDay) =>
    setF(v => ({
      ...v,
      daysAvail: v.daysAvail.includes(d)
        ? v.daysAvail.filter(x => x !== d)
        : [...v.daysAvail, d],
    }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(false);

    if (!f.firstName.trim() || !f.lastName.trim()) {
      setError('Please provide first and last name.');
      return;
    }
    if (!f.photoConsent || !f.backgroundCheckConsent) {
      setError('Photo and background check consents are required.');
      return;
    }

    const toList = (s: string) =>
      s.split(',').map(x => x.trim()).filter(Boolean);

    const payload: VolunteerCreate = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      email: f.email.trim() || undefined,
      phoneNumber: f.phoneNumber.trim() || undefined,
      cities: toList(f.citiesLine),
      daysAvail: f.daysAvail,                // 'Weekdays' | 'Weekends'
      timesAvail: toList(f.timesLine),
      skills: toList(f.skillsLine),
      bio: f.bio.trim() || undefined,
      photoConsent: f.photoConsent,
      backgroundCheckConsent: f.backgroundCheckConsent,
    };

    setSubmitting(true);
    try {
      await makeApiRequest<{ volunteer: any }>(`${API}/volunteers`, {
        method: 'POST',
        body: payload,
      });
      setOk(true);
      setF(initial);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <div className="mx-auto max-w-3xl">
        {!logged && (
  <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
    <p className="font-medium">Please log in to apply as a volunteer.</p>
    <div className="mt-2 flex gap-3">
      <button
        type="button"
        onClick={goLogin}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
      >
        Log in
      </button>

      <button
        type="button"
        onClick={goSignup}  // либо setModalContent(SignupModal), либо router.push(`/signup?next=${next}`)
        className="rounded-lg border border-emerald-600 px-4 py-2 text-emerald-700 hover:bg-emerald-50"
      >
        Sign up
      </button>
    </div>
  </div>
)}


      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        {/* Одним флажком блокируем всё для гостя и во время отправки */}
        <fieldset disabled={disabled} aria-disabled={disabled} className={disabled ? 'opacity-60' : ''}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">First name *</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={f.firstName}
                onChange={e => setF({ ...f, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last name *</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={f.lastName}
                onChange={e => setF({ ...f, lastName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border px-3 py-2"
                value={f.email}
                onChange={e => setF({ ...f, email: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={f.phoneNumber}
                onChange={e => setF({ ...f, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Cities</label>
              <input
                placeholder="Westcliffe, Pueblo"
                className="w-full rounded-lg border px-3 py-2"
                value={f.citiesLine}
                onChange={e => setF({ ...f, citiesLine: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Times</label>
              <input
                placeholder="mornings, evenings"
                className="w-full rounded-lg border px-3 py-2"
                value={f.timesLine}
                onChange={e => setF({ ...f, timesLine: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Skills</label>
              <input
                placeholder="hiking, photography"
                className="w-full rounded-lg border px-3 py-2"
                value={f.skillsLine}
                onChange={e => setF({ ...f, skillsLine: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Availability (days)</label>
            <div className="flex gap-6">
              {(['Weekdays', 'Weekends'] as AvailabilityDay[]).map(d => (
                <label key={d} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={f.daysAvail.includes(d)}
                    onChange={() => toggleDay(d)}
                  />
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Short bio (optional)</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
              value={f.bio}
              onChange={e => setF({ ...f, bio: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Consents *</label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={f.photoConsent}
                onChange={e => setF({ ...f, photoConsent: e.target.checked })}
              />
              <span className="text-sm">I consent to photos/videos (Photo Policy).</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={f.backgroundCheckConsent}
                onChange={e => setF({ ...f, backgroundCheckConsent: e.target.checked })}
              />
              <span className="text-sm">I consent to a background check (18+).</span>
            </label>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
              {error}
            </div>
          )}
          {ok && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
              Thank you! Your application has been submitted.
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={disabled}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
