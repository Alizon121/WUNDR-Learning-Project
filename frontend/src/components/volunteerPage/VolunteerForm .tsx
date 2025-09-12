'use client';

import { useEffect, useRef, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import type { VolunteerCreate, AvailabilityDay } from '@/types/volunteer';
import { isLoggedIn } from '../../../utils/auth';
import { formatUs, toE164US } from '../../../utils/formatPhoneNumber';
import MultiSelect from '@/components/common/MultiSelect';
import { CITIES_CO } from '@/data/citiesCO';
import { useModal } from '@/app/context/modal';
import LoginModal from '@/components/login/LoginModal';
import SignupModal from '@/components/signup/SignupModal';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const TIME_OPTIONS = ['Mornings', 'Afternoons', 'Evenings'] as const;
type TimeOption = (typeof TIME_OPTIONS)[number];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  selectedCities: string[];
  timesChoices: string[];
  skillsLine: string;
  daysAvail: AvailabilityDay[];
  bio: string;
  photoConsent: boolean;
  backgroundCheckConsent: boolean;
};

const initial: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  selectedCities: [],
  timesChoices: [],
  skillsLine: '',
  daysAvail: [],
  bio: '',
  photoConsent: false,
  backgroundCheckConsent: false,
};

// Helpers
const toList = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
const emailValid = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function VolunteerForm() {
  const [f, setF] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  // Hydration-safe "am I logged in?"
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  const logged = client && isLoggedIn();
  const disabled = !logged || submitting;

  const { setModalContent } = useModal();
  const firstNameRef = useRef<HTMLInputElement | null>(null);

  // Focus the first name once the user is allowed to type
  useEffect(() => {
    if (logged && !disabled) firstNameRef.current?.focus();
  }, [logged, disabled]);

  // Toggle helpers
  const toggleDay = (d: AvailabilityDay) =>
    setF(v => ({
      ...v,
      daysAvail: v.daysAvail.includes(d)
        ? v.daysAvail.filter(x => x !== d)
        : [...v.daysAvail, d],
    }));

  const toggleTime = (t: TimeOption) =>
    setF(v => ({
      ...v,
      timesChoices: v.timesChoices.includes(t)
        ? v.timesChoices.filter(x => x !== t)
        : [...v.timesChoices, t],
    }));

  const selectAllTimes = () =>
    setF(v => ({
      ...v,
      timesChoices:
        v.timesChoices.length === TIME_OPTIONS.length ? [] : [...TIME_OPTIONS],
    }));

  // Submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(false);

    // Required validations
    if (!f.firstName.trim() || !f.lastName.trim()) {
      setError('Please provide first and last name.');
      return;
    }
    if (!f.email.trim() || !emailValid(f.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }
    const e164 = toE164US(f.phoneNumber);
    if (!e164) {
      setError('Please enter a valid 10-digit US phone number.');
      return;
    }
    if (!f.photoConsent || !f.backgroundCheckConsent) {
      setError('Photo and background check consents are required.');
      return;
    }

    const skillsList = toList(f.skillsLine);

    const payload: VolunteerCreate = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      email: f.email.trim() || undefined,
      phoneNumber: f.phoneNumber.trim() || undefined,
      cities: f.selectedCities,
      daysAvail: f.daysAvail,
      timesAvail: f.timesChoices,
      skills: skillsList,
      bio: f.bio.trim() || undefined,
      photoConsent: f.photoConsent,
      backgroundCheckConsent: f.backgroundCheckConsent,
    };

    setSubmitting(true);
    try {
      await makeApiRequest<{ volunteer: any }>(`${API}/volunteer/`, {
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
    <div id="volunteer" className="mx-auto max-w-3xl scroll-mt-24">
      <div className="mb-6 text-center">
        <p className="mt-2 text-slate-600">
          Tell us a bit about yourself and your availability — we'll match you with a good fit.
        </p>
        <div className="mt-4 rounded-xl">
          Wonderhood team reach out within <span className="font-medium">2-3 business days</span>.
        </div>
      </div>

      {/* Show login prompt only on client and only when logged out */}
      {client && !logged && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <p className="font-medium">Please log in to apply as a volunteer.</p>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setModalContent(<LoginModal />)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setModalContent(<SignupModal />)}
              className="rounded-lg border border-emerald-600 px-4 py-2 text-emerald-700 hover:bg-emerald-50"
            >
              Sign up
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <fieldset disabled={disabled} aria-disabled={disabled} className={disabled ? 'opacity-60' : ''}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                First name <span className="text-rose-600">*</span>
              </label>
              <input
                ref={firstNameRef}
                className="w-full rounded-lg border px-3 py-2"
                value={f.firstName}
                onChange={e => setF({ ...f, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Last name <span className="text-rose-600">*</span>
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={f.lastName}
                onChange={e => setF({ ...f, lastName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-lg border px-3 py-2"
                value={f.email}
                onChange={e => setF({ ...f, email: e.target.value })}
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone <span className="text-rose-600">*</span>
              </label>
              <input
                inputMode="tel"
                className="w-full rounded-lg border px-3 py-2"
                value={f.phoneNumber}
                onChange={e => setF({ ...f, phoneNumber: formatUs(e.target.value) })}
                placeholder="123-456-7890"
                required
              />
            </div>
          </div>

          {/* Cities + Times */}
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Cities <span className="ml-1 text-xs text-gray-500">(multi-select)</span>
              </label>
              <MultiSelect
                options={CITIES_CO as unknown as string[]}
                value={f.selectedCities}
                onChange={next => setF({ ...f, selectedCities: next })}
                placeholder="Select cities…"
                className="text-gray-400"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium">Times</label>
                <button
                  type="button"
                  onClick={selectAllTimes}
                  className="text-xs text-emerald-700 hover:underline mr-4"
                >
                  {f.timesChoices.length === TIME_OPTIONS.length ? 'Clear all' : 'Select all'}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {TIME_OPTIONS.map(t => (
                  <label key={t} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={f.timesChoices.includes(t)}
                      onChange={() => toggleTime(t)}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Availability (days) */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium">Availability (days)</label>
            <div className="flex gap-6 text-sm">
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

          {/* Skills (required) */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium">
              Skills <span className="text-rose-600">*</span>
            </label>
            <input
              placeholder="hiking, photography"
              className="w-full rounded-lg border px-3 py-2.5"
              value={f.skillsLine}
              onChange={e => setF({ ...f, skillsLine: e.target.value })}
              required
            />
          </div>

          {/* Short bio */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium">Short bio (optional)</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
              value={f.bio}
              onChange={e => setF({ ...f, bio: e.target.value })}
            />
          </div>

          {/* Consents */}
          <div className="space-y-3 mt-4">
            <label className="block text-sm font-medium">
              Consents <span className="text-rose-600">*</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={f.photoConsent}
                onChange={e => setF({ ...f, photoConsent: e.target.checked })}
                required
              />
              <span className="text-sm">I consent to photos/videos (Photo Policy).</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={f.backgroundCheckConsent}
                onChange={e => setF({ ...f, backgroundCheckConsent: e.target.checked })}
                required
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
              Thank you for applying! We've received your information and will contact you within 2–3 business days.
            </div>
          )}

          <div
            className="mt-6 flex justify-center sm:justify-end"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <button
              type="submit"
              disabled={disabled}
              className="w-full sm:w-auto min-h-11 rounded-xl bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
