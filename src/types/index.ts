export interface Destination {
  id: string;
  name: string;
  flag: string;
  code: string;
  tagline: string;
  overview: string;
  topUniversities: string[];
  keyStrengths: string[];
  avgTuitionINR: string;
  avgLivingINR: string;
  workRights: string;
  intakes: string[];
  visaProcessing: string;
  specialHighlight: string;
}

export interface University {
  id: string;
  name: string;
  destination: string;
  city: string;
  ranking: string;
  alliance: 'Russell Group' | 'Group of Eight (Go8)' | 'U15' | 'Global Top 100' | 'Branch Campus' | 'Leading Public';
  tuitionRange: string;
  popularCourses: string[];
  minGpaPercentage: string;
  englishReq: string;
  scholarshipAvailable: boolean;
  scholarshipDetails: string;
  campusImage: string;
}

export interface ServiceItem {
  id: string;
  stepNumber: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  highlight: string;
}

export interface Counselor {
  id: string;
  name: string;
  role: string;
  credentials: string;
  specialties: string[];
  availableDays: string[];
  slots: string[];
  avatar: string;
  rating: number;
  reviewsCount: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'Admissions' | 'Visas' | 'Scholarships' | 'Destinations' | 'IB Pathways';
}
