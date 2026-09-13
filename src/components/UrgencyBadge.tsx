import type { Urgency } from '../lib/types';

const STYLES: Record<Urgency, { bg: string; color: string; label: string }> = {
  high: { bg: '#FEE2E2', color: '#DC2626', label: 'HIGH' },
  medium: { bg: '#FEF3C7', color: '#D97706', label: 'MEDIUM' },
  low: { bg: '#DCFCE7', color: '#16A34A', label: 'LOW' },
};

export function urgencyColor(urgency: Urgency): string {
  return STYLES[urgency].color;
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const s = STYLES[urgency];
  return (
    <span
      className="badge"
      style={{ background: s.bg, color: s.color, borderColor: s.color }}
    >
      {s.label}
    </span>
  );
}
