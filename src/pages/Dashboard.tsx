import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { Stars } from '../components/Stars';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { useStore, deriveStats } from '../lib/store';
import { DEPARTMENTS, HOTEL_NAME } from '../lib/types';

function KpiIcon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const ICON_INBOX = 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3 7v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-6l3.5-7z';
const ICON_STAR = 'M12 3l2.7 5.5 6 .9-4.3 4.2 1 6L12 17.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3z';
const ICON_ALERT = 'M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z';
const ICON_CHECK = 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z';

export function Dashboard() {
  const nav = useNavigate();
  const { feedback, usingDemoData } = useStore();
  const stats = useMemo(() => deriveStats(feedback), [feedback]);

  const departmentAverages = useMemo(
    () =>
      DEPARTMENTS.map((dept) => {
        const items = feedback.filter((f) => f.department === dept);
        const avg = items.length
          ? items.reduce((s, f) => s + f.rating, 0) / items.length
          : 0;
        return { dept, avg, count: items.length };
      }),
    [feedback]
  );

  return (
    <div className="dashboard">
      <DashboardNav />
      <div className="dash-body">
        <h1 className="dash-title">
          {HOTEL_NAME} <span className="dash-sub">— last 24 hours</span>
          <span className={`data-pill ${usingDemoData ? '' : 'live'}`}>
            {usingDemoData ? 'demo data' : 'live data'}
          </span>
        </h1>

        <div className="kpi-row">
          <div className="kpi">
            <div className="kpi-ic"><KpiIcon d={ICON_INBOX} /></div>
            <div className="kpi-label">Total Feedback</div>
            <div className="kpi-value">{stats.total}</div>
          </div>
          <div className="kpi">
            <div className="kpi-ic"><KpiIcon d={ICON_STAR} /></div>
            <div className="kpi-label">Average Rating</div>
            <div className="kpi-value">
              {stats.avg.toFixed(1)} <span className="kpi-star">⭐</span>
            </div>
          </div>
          <div className="kpi alert-kpi">
            <div className="kpi-ic"><KpiIcon d={ICON_ALERT} /></div>
            <div className="kpi-label">Negative Alerts</div>
            <div className="kpi-value">{stats.negatives}</div>
          </div>
          <div className="kpi positive-kpi">
            <div className="kpi-ic"><KpiIcon d={ICON_CHECK} /></div>
            <div className="kpi-label">Resolved</div>
            <div className="kpi-value">{stats.resolved}</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Department breakdown</h2>
            <span className="panel-sub">Average rating by area</span>
          </div>
          <div className="bars">
            {departmentAverages.map((d) => {
              const pct = (d.avg / 5) * 100;
              const color = d.avg >= 4 ? '#16A34A' : d.avg >= 3 ? '#D97706' : '#DC2626';
              return (
                <div key={d.dept} className="bar-row">
                  <div className="bar-label">{d.dept}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <div className="bar-value">
                    {d.avg ? d.avg.toFixed(1) : '–'} <span className="bar-count">({d.count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Recent feedback</h2>
            <span className="panel-sub">AI-classified · open an alert for the full action plan</span>
          </div>

          <div className="feedback-grid">
            {feedback.map((f) => (
              <div key={f.id} className={`fb-card u-${f.urgency} ${f.resolved ? 'resolved' : ''}`}>
                <div className="fb-top">
                  <div className="fb-time">{f.time}</div>
                  <UrgencyBadge urgency={f.urgency} />
                </div>
                <div className="fb-rating-row">
                  <Stars value={f.rating} />
                  <span className="fb-dept">{f.department}</span>
                </div>
                <div className="fb-comment">&ldquo;{f.comment || 'No comment left.'}&rdquo;</div>
                <div className="fb-guest">— {f.name}</div>

                <div className="ai-block">
                  <div className="ai-label">
                    <span className="ai-tag">AI</span> {f.aiLabel}
                  </div>
                  <div className="ai-suggestion">
                    <strong>Suggested action:</strong> {f.aiSuggestion}
                  </div>
                </div>

                <div className="fb-actions">
                  {f.resolved ? (
                    <span className="resolved-pill">✓ Resolved</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => nav(`/alert/${f.id}`)}>
                      Review &amp; resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
