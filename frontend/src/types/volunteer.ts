export type AvailabilityDay = 'Weekdays' | 'Weekends';

export type VolunteerCreate = {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  cities: string[];
  daysAvail: AvailabilityDay[];
  timesAvail: string[];
  skills: string[];
  bio?: string;
  photoConsent: boolean;
  backgroundCheckConsent: boolean;
};