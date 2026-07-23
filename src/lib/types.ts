export const SERVICES = [
  "Personal Care",
  "Social and Community Support",
  "Help in the Home or Garden",
] as const;
export type Service = (typeof SERVICES)[number];

export const FUNDING_OPTIONS = [
  "I will be funding my care and support with my own money",
  "The council are paying for my care and support (Direct Payments)",
  "The NHS are paying for my care and support (Personal Health Budget)",
] as const;

export const COMPLETED_BY_OPTIONS = [
  "I am looking for support myself",
  "I am looking on behalf of a family member/ friend",
  "I work in Social Care / NHS",
  "I work in the voluntary, community or charity sector (VCSE)",
] as const;

export const HEARD_ABOUT_OPTIONS = [
  "WCN Website",
  "Google search",
  "WCN Advert",
  "WCN Helpline",
  "Social media",
  "Friend or family member",
  "Health or social care professional",
  "Another organisation",
  "Somerset Council brokerage tool",
  "Events",
] as const;

export const LOCALITIES = [
  "Wells",
  "Shepton Mallet",
  "Croscombe",
  "Wookey",
  "Wookey Hole",
  "Westbury-sub-Mendip",
  "Dinder",
  "North Wootton",
  "Pilton",
  "Coxley",
  "Priddy",
  "Easton",
  "Dulcote",
] as const;

export interface TrainingRecord {
  name: string;
  completed: string; // ISO date
  expiry: string; // ISO date
}

// Paddock's attendance allowance statuses (shared/const.ts).
export const ATTENDANCE_ALLOWANCE_STATUSES = [
  "None",
  "Unsent",
  "Pending",
  "Low",
  "High",
] as const;
export type AttendanceAllowanceStatus =
  (typeof ATTENDANCE_ALLOWANCE_STATUSES)[number];

export interface MicroProvider {
  id: string;
  name: string;
  locality: string;
  outwardPostcode: string; // e.g. "BA5" — used on public pages
  postCode: string; // fictional full postcode (unused ZZ inward codes)
  dateOfBirth?: string; // ISO date; absent renders "Unknown"
  services: Service[];
  bio: string;
  availability: string;
  email: string;
  phone: string;
  startDate: string; // accredited since, ISO date
  dbsNumber: string;
  dbsExpiry: string; // ISO date
  publicLiabilityNumber: string;
  publicLiabilityExpiry: string; // public liability insurance, ISO date
  feePaymentDate: string; // ISO date, or "unpaid"
  training: TrainingRecord[];
}

export interface Client {
  id: string;
  customId?: string; // WCN's own reference; absent for self-onboarded clients
  name: string;
  dateOfBirth?: string; // ISO date
  locality: string;
  postCode?: string;
  services: Service[];
  onboarded: string; // agreement date, ISO date
  status: "Active" | "Matched" | "New request";
  attendanceAllowance?: AttendanceAllowanceStatus;
  deprivation?: { income: boolean; health: boolean };
  headline: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  dateOfBirth?: string; // ISO date; absent renders "Unknown"
  locality: string;
  postCode: string;
  email: string;
  phone: string;
  since: string; // ISO date
  dbsNumber: string;
  dbsExpiry: string; // ISO date
  publicLiabilityNumber?: string;
  publicLiabilityExpiry?: string; // most volunteers carry no PL insurance
  training: TrainingRecord[];
}

/** One submission of the "Support Near You" form. */
export interface SupportRequest {
  id: string;
  createdAt: string; // ISO datetime
  clientId: string;
  // Section 1 — screening
  completedBy: string;
  // Section 2 — support needs
  services: Service[];
  funding: string[];
  // Section 3 — about you
  name: string;
  email: string;
  phone: string;
  headline: string;
  locality: string;
  personSought: string;
  circumstances: string;
  hasPets: boolean;
  petDetails: string;
  schedule: string;
  // Section 4 — consent
  consentWcnNetwork: boolean;
  consentOtherNetworks: boolean;
  // Section 5 — staying in touch
  heardAbout: string;
  newsletter: boolean;
}
