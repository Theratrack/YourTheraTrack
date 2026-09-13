export type Urgency = 'high' | 'medium' | 'low';

export const DEPARTMENTS = [
  'Front Desk',
  'Housekeeping',
  'Breakfast',
  'Room',
  'Spa',
  'General',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export type Feedback = {
  id: string;
  rating: number;
  department: string;
  comment: string;
  name: string;
  room: string;
  time: string;
  createdAt: string;
  resolved: boolean;
  urgency: Urgency;
  aiLabel: string;
  aiSuggestion: string;
  aiSummary: string;
};

export type NewFeedback = {
  rating: number;
  department: string;
  comment: string;
  name: string;
  room: string;
};

export const HOTEL_NAME = 'The Grand Hotel';
