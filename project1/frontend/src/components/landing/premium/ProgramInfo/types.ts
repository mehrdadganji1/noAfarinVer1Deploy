import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface EventDate {
  week: number;
  weekTitle: string;
  dates: string;
  persianDates: string;
  days: string;
  topics: string[];
}

export interface Specialty {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ProgramData {
  tabs: TabItem[];
  events: EventDate[];
  specialties: Specialty[];
  benefits: Benefit[];
}
