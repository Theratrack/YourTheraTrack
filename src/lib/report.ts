import type { Feedback } from './types';

export type WeeklyReport = {
  total: number;
  avg: number;
  resolved: number;
  unresolved: number;
  topDepartment: { dept: string; avg: number } | null;
  weakDepartment: { dept: string; avg: number } | null;
  themes: { label: string; count: number }[];
  narrative: string;
};

export function buildWeeklyReport(feedback: Feedback[], hotelName: string): WeeklyReport {
  const total = feedback.length;
  const avg = total ? feedback.reduce((s, f) => s + f.rating, 0) / total : 0;
  const resolved = feedback.filter((f) => f.resolved).length;
  const unresolved = feedback.filter((f) => !f.resolved && f.rating <= 3).length;

  const byDept = new Map<string, { sum: number; n: number }>();
  for (const f of feedback) {
    const d = byDept.get(f.department) ?? { sum: 0, n: 0 };
    d.sum += f.rating;
    d.n += 1;
    byDept.set(f.department, d);
  }
  const deptAverages = [...byDept.entries()].map(([dept, { sum, n }]) => ({
    dept,
    avg: sum / n,
  }));
  const sorted = [...deptAverages].sort((a, b) => b.avg - a.avg);
  const topDepartment = sorted[0] ?? null;
  const weakDepartment = sorted.length > 1 ? sorted[sorted.length - 1] : null;

  const labelCounts = new Map<string, number>();
  for (const f of feedback) {
    if (f.rating <= 3) labelCounts.set(f.aiLabel, (labelCounts.get(f.aiLabel) ?? 0) + 1);
  }
  const themes = [...labelCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const themeText = themes.length
    ? themes.map((t) => `${t.label.toLowerCase()} (${t.count})`).join(', ')
    : 'no recurring complaints';

  const narrative =
    `This week ${hotelName} received ${total} guest responses with an average rating of ` +
    `${avg.toFixed(1)} ⭐. ${resolved} item${resolved === 1 ? '' : 's'} resolved` +
    `${unresolved ? `, ${unresolved} still open` : ''}. ` +
    (topDepartment
      ? `${topDepartment.dept} is your strongest area (${topDepartment.avg.toFixed(1)} avg). `
      : '') +
    (weakDepartment && weakDepartment.avg < 4
      ? `${weakDepartment.dept} needs attention (${weakDepartment.avg.toFixed(1)} avg). `
      : '') +
    `Recurring themes: ${themeText}.`;

  return {
    total,
    avg,
    resolved,
    unresolved,
    topDepartment,
    weakDepartment,
    themes,
    narrative,
  };
}
