const GEN_KEY = 'wh_v_general';
const OPP_KEY = 'wh_v_opps'; 

export const markGeneralSubmitted = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GEN_KEY, '1');
};
export const isGeneralSubmitted = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(GEN_KEY) === '1';
};

export const markOppSubmitted = (id: string) => {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(OPP_KEY);
  const set = new Set<string>(raw ? JSON.parse(raw) : []);
  set.add(id);
  localStorage.setItem(OPP_KEY, JSON.stringify([...set]));
};
export const isOppSubmitted = (id: string) => {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(OPP_KEY);
  const arr = raw ? (JSON.parse(raw) as string[]) : [];
  return Array.isArray(arr) && arr.includes(id);
};
