import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stars } from '../components/Stars';
import { urgencyColor } from '../components/UrgencyBadge';
import { useStore } from '../lib/store';
import { HOTEL_NAME } from '../lib/types';

export function Alert() {
  const nav = useNavigate();
  const { id } = useParams();
  const { feedback, markResolved } = useStore();

  const item = useMemo(() => {
    if (id) return feedback.find((f) => f.id === id);
    return (
      feedback.find((f) => !f.resolved && f.urgency === 'high') ??
      feedback.find((f) => !f.resolved) ??
      feedback[0]
    );
  }, [feedback, id]);

  if (!item) {
    return (
      <div className="alert-shell">
        <div className="alert-card">
          <div className="alert-body">
            <p>No feedback found.</p>
            <button className="btn btn-primary" onClick={() => nav('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const label = urgencyColor(item.urgency);
  const urgencyLabel = item.urgency.toUpperCase();

  return (
    <div className="alert-shell">
      <div className="alert-card">
        <div className="alert-header" style={{ background: label }}>
          <div className="alert-source">
            <strong>GuestPulse Alert</strong> · push + email
          </div>
          <div className="alert-urgency">⚠ {urgencyLabel} URGENCY</div>
        </div>

        <div className="alert-body">
          <div className="alert-hotel">{HOTEL_NAME}</div>
          <div className="alert-meta">
            <Stars value={item.rating} /> · {item.department} · <span>{item.time}</span>
          </div>

          <div className="alert-quote">&ldquo;{item.comment || 'No comment left.'}&rdquo;</div>
          <div className="alert-guest">
            — {item.name}
            {item.room && (
              <>
                {' · '}
                <span className="alert-room">Room {item.room}</span>
              </>
            )}
          </div>

          <div className="alert-section">
            <div className="alert-section-title">
              <span className="ai-tag">AI</span> Summary
            </div>
            <p>{item.aiSummary}</p>
          </div>

          <div className="alert-section">
            <div className="alert-section-title">Suggested actions</div>
            <ul className="alert-actions">
              <li>{item.aiSuggestion}.</li>
              <li>Reach out to the guest in person or by phone within 15 minutes.</li>
              <li>Log the resolution in GuestPulse to track follow-up.</li>
            </ul>
          </div>

          <div className="alert-buttons">
            {item.resolved ? (
              <span className="resolved-pill big">✓ Resolved</span>
            ) : (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await markResolved(item.id);
                  nav('/dashboard');
                }}
              >
                Mark Resolved
              </button>
            )}
            <button className="btn btn-outline" onClick={() => nav('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
