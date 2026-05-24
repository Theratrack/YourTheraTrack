import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { Stars } from '../components/Stars';
import { UrgencyBadge } from '../components/UrgencyBadge';
import { useStore, deriveStats } from '../lib/store';
import { DEPARTMENTS, HOTEL_NAME } from '../lib/types';

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
            <div className="kpi-label">Total Feedback</div>
            <div className="kpi-value">{stats.total}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Average Rating</div>
            <div className="kpi-value">
              {stats.avg.toFixed(1)} <span className="kpi-star">⭐</span>
            </div>
          </div>
          <div className="kpi alert-kpi">
            <div className="kpi-label">Negative Alerts</div>
            <div className="kpi-value">{stats.negatives}</div>
          </div>
          <div className="kpi positive-kpi">
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
              <div key={f.id} className={`fb-card ${f.resolved ? 'resolved' : ''}`}>
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
