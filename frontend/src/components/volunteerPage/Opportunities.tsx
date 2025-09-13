import Link from 'next/link';
import { useModal } from '@/app/context/modal';
import { isLoggedIn } from '../../../utils/auth';
import LoginModal from '@/components/login/LoginModal';
import VolunteerForm from './VolunteerForm';
import { useEffect } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { markOppSubmitted, isOppSubmitted } from './volunteerLocks';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type Env = 'Outdoor' | 'Indoor' | 'Indoor/Outdoor' | 'Online' | 'Indoor/Online';
type Role = {
  id: string;
  opportunityId: string;
  title: string;
  env: Env;
  duties: string[];
  skills: string[];
  time: string;
  reqs: string[];
  tags?: string[];
  showOutdoorGuide?: boolean;
};

const ROLES: Role[] = [
  {
    id: 'outdoors',
    opportunityId: '66e2e3f1d3a3b2c1a0ff1122',
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
    opportunityId: '66e2e3f1d3a3b2c1a0ff1123',
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
    opportunityId: '66e2e3f1d3a3b2c1a0ff1122',
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
    opportunityId: '66e2e3f1d3a3b2c1a0ff1122',
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
    opportunityId: '66e2e3f1d3a3b2c1a0ff1122',
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
    opportunityId: '66e2e3f1d3a3b2c1a0ff1122',
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
    opportunityId: '66e2e3f1d3a3b2c1a0ff1122',
    title: 'Safety Lead (CPR/First Aid)',
    env: 'Indoor/Outdoor',
    duties: ['Be an extra set of eyes for safety', 'Know our emergency steps'],
    skills: ['Current CPR/First Aid — preferred'],
    time: 'Matches the program (usually 2-4 hours)',
    reqs: ['18+ with background check', 'Outdoor waiver for hikes'],
    tags: ['Safety', 'CPR'],
  },
];

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
  const logged = isLoggedIn();

  useEffect(() => {
  if (!logged) return;
  (async () => {
    try {
      // требует backend GET /volunteer/my-opportunities из моего прошлого сообщения
      const res = await makeApiRequest<{ opportunityIds: string[] }>(`${API}/volunteer/my-opportunities`, { method: 'GET' });
      (res.opportunityIds || []).forEach(id => markOppSubmitted(id));
      // теперь isOppSubmitted(id) будет возвращать true и кнопки задизейблятся
    } catch {
      /* ignore */
    }
  })();
}, [logged]);


  const openApply = (oppId: string, title: string) => {
    // Если родитель передал onApply — переключаем вкладку и прокидываем данные
    if (onApply) return onApply(title, oppId);

    // Иначе — фолбэк: если не залогинен — просим войти
    if (!logged) return setModalContent(<LoginModal />);

    // Фолбэк: открываем форму в модалке
    setModalContent(
      <div className="max-w-3xl">
        <VolunteerForm opportunityId={oppId} roleTitle={title} onDone={closeModal} />
      </div>
    );
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

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {ROLES.map((r) => (
          <article
            key={r.id}
            className="h-full flex flex-col rounded-2xl bg-white border border-wonderleaf/20 p-5 shadow-sm hover:shadow transition"
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
              <div className="min-h-[190px] md:min-h-[210px]">
                <h4 className="font-medium text-gray-900 mb-1">What you'll do</h4>
                <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                  {r.duties.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="min-h-[190px] md:min-h-[210px]">
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
              onClick={() => openApply(r.opportunityId, r.title)}
              disabled={isOppSubmitted(r.opportunityId)}
              className={`px-5 py-2.5 rounded-lg text-white transition-colors
                          ${isOppSubmitted(r.opportunityId)
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-wondergreen hover:bg-wonderleaf'}`}
              >
                {isOppSubmitted(r.opportunityId) ? 'Applied' : 'Apply for this role'}
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
            href="#apply"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-wondergreen text-white font-semibold hover:bg-wonderleaf transition"
          >
            Apply to Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
}