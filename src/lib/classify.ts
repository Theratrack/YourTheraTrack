import type { NewFeedback, Urgency } from './types';

export type Classification = {
  urgency: Urgency;
  aiLabel: string;
  aiSuggestion: string;
  aiSummary: string;
};

const NEGATIVE_HINTS: { kw: string[]; label: string; suggestion: string }[] = [
  {
    kw: ['dirty', 'clean', 'towel', 'stain', 'smell', 'dust'],
    label: 'Cleanliness Issue',
    suggestion: 'Escalate to housekeeping supervisor and GM immediately',
  },
  {
    kw: ['cold', 'breakfast', 'coffee', 'food', 'egg', 'restaurant', 'menu'],
    label: 'Breakfast / F&B Complaint',
    suggestion: 'Inform F&B manager immediately and offer a voucher',
  },
  {
    kw: ['noise', 'noisy', 'loud', 'street'],
    label: 'Noise Issue',
    suggestion: 'Offer a quieter room and note preference for future bookings',
  },
  {
    kw: ['late', 'wait', 'slow', 'delay', 'queue'],
    label: 'Service Delay',
    suggestion: 'Apologise in person and offer a goodwill discount',
  },
  {
    kw: ['broken', 'maintenance', 'leak', 'ac', 'heating', 'tv', 'shower'],
    label: 'Room Maintenance',
    suggestion: 'Dispatch maintenance and offer a room check',
  },
  {
    kw: ['rude', 'staff', 'reception', 'unhelpful'],
    label: 'Staff Conduct',
    suggestion: 'Escalate to department head and follow up with the guest',
  },
];

const POSITIVE_HINTS: { kw: string[]; label: string; suggestion: string }[] = [
  {
    kw: ['amazing', 'great', 'lovely', 'wonderful', 'perfect', 'above and beyond'],
    label: 'Staff Praise',
    suggestion: 'Add to staff recognition log and request a Google review',
  },
];

function urgencyForRating(rating: number): Urgency {
  if (rating <= 2) return 'high';
  if (rating === 3) return 'medium';
  return 'low';
}

/** Deterministic, no-network fallback classifier used when no AI key is set. */
export function heuristicClassify(fb: NewFeedback): Classification {
  const text = `${fb.comment} ${fb.department}`.toLowerCase();
  const urgency = urgencyForRating(fb.rating);

  if (fb.rating >= 4) {
    const match = POSITIVE_HINTS.find((h) => h.kw.some((k) => text.includes(k)));
    return {
      urgency,
      aiLabel: match?.label ?? 'Positive Experience',
      aiSuggestion: match?.suggestion ?? 'Send loyalty offer and request a Google review',
      aiSummary: `Guest left a ${fb.rating}-star rating${
        fb.department ? ` for ${fb.department}` : ''
      }. Tone is positive — a good candidate for a public review nudge.`,
    };
  }

  const match = NEGATIVE_HINTS.find((h) => h.kw.some((k) => text.includes(k)));
  const label =
    match?.label ?? (fb.department ? `${fb.department} Concern` : 'General Concern');
  const suggestion =
    match?.suggestion ?? 'Reach out to the guest personally before checkout';

  return {
    urgency,
    aiLabel: label,
    aiSuggestion: suggestion,
    aiSummary: `Guest reports a ${label.toLowerCase()}${
      fb.department ? ` in ${fb.department}` : ''
    } (${fb.rating}/5). Recommend a response within 15 minutes while the guest is still on-site.`,
  };
}
