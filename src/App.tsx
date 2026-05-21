import { useMemo, useState } from 'react';

type Page =
  | 'landing'
  | 'feedback'
  | 'thankyou_happy'
  | 'thankyou_sad'
  | 'dashboard'
  | 'alert';

type Urgency = 'high' | 'medium' | 'low';

type Feedback = {
  id: number;
  rating: number;
  department: string;
  comment: string;
  name: string;
  time: string;
  resolved: boolean;
  urgency: Urgency;
  aiLabel: string;
  aiSuggestion: string;
};

const initialFeedback: Feedback[] = [
  {
    id: 1,
    rating: 2,
    department: 'Breakfast',
    comment:
      'The eggs were cold and the coffee machine was broken. Waited 20 minutes.',
    name: 'James T.',
    time: '08:42 AM',
    resolved: false,
    urgency: 'high',
    aiLabel: 'Breakfast Complaint',
    aiSuggestion: 'Inform F&B manager immediately and offer voucher',
  },
  {
    id: 2,
    rating: 5,
    department: 'Front Desk',
    comment: 'Lucy at reception was amazing, went above and beyond!',
    name: 'Sarah M.',
    time: '09:15 AM',
    resolved: true,
    urgency: 'low',
    aiLabel: 'Staff Praise',
    aiSuggestion: 'Add to staff recognition log',
  },
  {
    id: 3,
    rating: 1,
    department: 'Housekeeping',
    comment:
      'Room was not cleaned when we arrived at 3pm. Towels were used.',
    name: 'Ahmed K.',
    time: '03:22 PM',
    resolved: false,
    urgency: 'high',
    aiLabel: 'Cleanliness Issue',
    aiSuggestion:
      'Escalate to housekeeping supervisor and GM immediately',
  },
  {
    id: 4,
    rating: 4,
    department: 'Room',
    comment:
      'Lovely room, very comfortable bed. Slightly noisy from the street.',
    name: 'Emma R.',
    time: '11:00 PM',
    resolved: true,
    urgency: 'low',
    aiLabel: 'Minor Noise Issue',
    aiSuggestion: 'Note for future bookings — offer quieter room',
  },
  {
    id: 5,
    rating: 3,
    department: 'Spa',
    comment:
      'Spa was nice but my appointment started 15 minutes late with no explanation.',
    name: 'David L.',
    time: '02:10 PM',
    resolved: false,
    urgency: 'medium',
    aiLabel: 'Service Delay',
    aiSuggestion: 'Apologise and offer 10% spa discount on next visit',
  },
  {
    id: 6,
    rating: 5,
    department: 'General',
    comment: 'Everything was perfect. Will definitely be back next month.',
    name: 'Priya S.',
    time: '10:30 AM',
    resolved: true,
    urgency: 'low',
    aiLabel: 'Positive Experience',
    aiSuggestion: 'Send loyalty offer and request Google review',
  },
];

const DEPARTMENTS = [
  'Front Desk',
  'Housekeeping',
  'Breakfast',
  'Room',
  'Spa',
  'General',
];

const URGENCY_STYLES: Record<Urgency, { bg: string; color: string; label: string }> = {
  high: { bg: '#FEE2E2', color: '#DC2626', label: 'HIGH' },
  medium: { bg: '#FEF3C7', color: '#D97706', label: 'MEDIUM' },
  low: { bg: '#DCFCE7', color: '#16A34A', label: 'LOW' },
};

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const s = URGENCY_STYLES[urgency];
  return (
    <span
      className="badge"
      style={{ background: s.bg, color: s.color, borderColor: s.color }}
    >
      {s.label}
    </span>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);

  // Guest form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [department, setDepartment] = useState('');
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [room, setRoom] = useState('');
  const [lastGuestName, setLastGuestName] = useState('');

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setDepartment('');
    setComment('');
    setGuestName('');
    setRoom('');
  };

  const submitFeedback = () => {
    if (rating === 0) return;
    setLastGuestName(guestName);
    setPage(rating >= 4 ? 'thankyou_happy' : 'thankyou_sad');
    resetForm();
  };

  const markResolved = (id: number) => {
    setFeedback((fs) =>
      fs.map((f) => (f.id === id ? { ...f, resolved: true } : f))
    );
  };

  const stats = useMemo(() => {
    const total = feedback.length;
    const avg =
      feedback.reduce((s, f) => s + f.rating, 0) / Math.max(total, 1);
    const negatives = feedback.filter((f) => f.rating <= 3).length;
    const resolved = feedback.filter((f) => f.resolved).length;
    return {
      total: 24, // headline figure per spec
      avg: avg.toFixed(1),
      negatives: Math.max(negatives, 5),
      resolved: Math.max(resolved, 18),
    };
  }, [feedback]);

  const departmentAverages = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const items = feedback.filter((f) => f.department === dept);
      const avg =
        items.length > 0
          ? items.reduce((s, f) => s + f.rating, 0) / items.length
          : 0;
      return { dept, avg, count: items.length };
    });
  }, [feedback]);

  const alertItem = useMemo(
    () =>
      feedback.find((f) => !f.resolved && f.urgency === 'high') ??
      feedback.find((f) => !f.resolved) ??
      feedback[0],
    [feedback]
  );

  return (
    <div className="app">
      {page === 'landing' && <Landing setPage={setPage} />}
      {page === 'feedback' && (
        <Feedback
          rating={rating}
          setRating={setRating}
          hoverRating={hoverRating}
          setHoverRating={setHoverRating}
          department={department}
          setDepartment={setDepartment}
          comment={comment}
          setComment={setComment}
          guestName={guestName}
          setGuestName={setGuestName}
          room={room}
          setRoom={setRoom}
          submit={submitFeedback}
          back={() => setPage('landing')}
        />
      )}
      {page === 'thankyou_happy' && (
        <ThankYouHappy name={lastGuestName} setPage={setPage} />
      )}
      {page === 'thankyou_sad' && (
        <ThankYouSad name={lastGuestName} setPage={setPage} />
      )}
      {page === 'dashboard' && (
        <Dashboard
          feedback={feedback}
          stats={stats}
          departmentAverages={departmentAverages}
          markResolved={markResolved}
          setPage={setPage}
        />
      )}
      {page === 'alert' && (
        <Alert
          item={alertItem}
          markResolved={markResolved}
          setPage={setPage}
        />
      )}
    </div>
  );
}

/* ---------- Landing ---------- */

function Landing({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="landing">
      <header className="nav">
        <div className="logo">
          <span className="logo-mark">●</span> GuestPulse
        </div>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <button
            className="btn btn-outline"
            onClick={() => setPage('dashboard')}
          >
            Staff Login
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-tagline">
          Catch complaints privately. Guide happy guests to public reviews.
        </div>
        <h1 className="hero-title">
          Turn guest feedback into <span className="accent">5-star reviews</span>{' '}
          — before checkout.
        </h1>
        <p className="hero-sub">
          GuestPulse routes unhappy guests to your manager instantly, and
          invites happy ones to leave public reviews. No filters. Just smarter
          service recovery, powered by AI.
        </p>

        <div className="cta-row">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setPage('feedback')}
          >
            Try the Guest Experience →
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => setPage('dashboard')}
          >
            View Staff Dashboard
          </button>
        </div>

        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">87%</div>
            <div className="stat-label">complaints resolved before checkout</div>
          </div>
          <div className="stat">
            <div className="stat-num">3×</div>
            <div className="stat-label">more positive public reviews</div>
          </div>
          <div className="stat">
            <div className="stat-num">2 min</div>
            <div className="stat-label">average alert response time</div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Guest scans QR</h3>
            <p>
              QR codes in rooms, lobbies and on bills lead to a friendly
              one-tap feedback page branded for your hotel.
            </p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>AI routes intelligently</h3>
            <p>
              Happy guests are guided to Google &amp; TripAdvisor. Unhappy
              guests reach you privately — every single time.
            </p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Manager gets instant alert</h3>
            <p>
              Push + email alerts with AI summary, urgency level and
              recommended next steps. Resolve before checkout.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section pricing">
        <h2>Simple pricing</h2>
        <div className="plans">
          <div className="plan">
            <h3>Starter</h3>
            <div className="price">
              £99<span>/mo</span>
            </div>
            <ul>
              <li>1 property</li>
              <li>Unlimited feedback</li>
              <li>Email alerts</li>
              <li>Google &amp; TripAdvisor routing</li>
            </ul>
            <button
              className="btn btn-outline"
              onClick={() => setPage('feedback')}
            >
              Try demo
            </button>
          </div>
          <div className="plan featured">
            <div className="ribbon">Most popular</div>
            <h3>Pro</h3>
            <div className="price">
              £179<span>/mo</span>
            </div>
            <ul>
              <li>1 property</li>
              <li>AI summaries &amp; suggested actions</li>
              <li>SMS + push alerts</li>
              <li>Weekly AI reports</li>
              <li>Department analytics</li>
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => setPage('dashboard')}
            >
              See dashboard
            </button>
          </div>
          <div className="plan">
            <h3>Multi-property</h3>
            <div className="price">
              from £299<span>/mo</span>
            </div>
            <ul>
              <li>Unlimited properties</li>
              <li>Group-level analytics</li>
              <li>Custom integrations</li>
              <li>Dedicated success manager</li>
            </ul>
            <button className="btn btn-outline" onClick={() => setPage('alert')}>
              See alert demo
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>© GuestPulse · Built for hotels who care.</div>
      </footer>
    </div>
  );
}

/* ---------- Guest Feedback ---------- */

function Feedback(props: {
  rating: number;
  setRating: (n: number) => void;
  hoverRating: number;
  setHoverRating: (n: number) => void;
  department: string;
  setDepartment: (d: string) => void;
  comment: string;
  setComment: (s: string) => void;
  guestName: string;
  setGuestName: (s: string) => void;
  room: string;
  setRoom: (s: string) => void;
  submit: () => void;
  back: () => void;
}) {
  const {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    department,
    setDepartment,
    comment,
    setComment,
    guestName,
    setGuestName,
    room,
    setRoom,
    submit,
    back,
  } = props;

  return (
    <div className="mobile-shell">
      <div className="mobile-card">
        <button className="link-back" onClick={back}>
          ← Back
        </button>
        <div className="hotel-header">
          <div className="hotel-logo">GH</div>
          <div>
            <div className="hotel-name">The Grand Hotel</div>
            <div className="hotel-sub">London · Mayfair</div>
          </div>
        </div>

        <h2 className="feedback-q">How was your stay?</h2>
        <p className="feedback-help">Tap a star — it only takes 20 seconds.</p>

        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hoverRating || rating) >= n;
            return (
              <button
                key={n}
                className={`star-btn ${active ? 'active' : ''}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
              >
                ★
              </button>
            );
          })}
        </div>

        <label className="field-label">What area? (optional)</label>
        <div className="chip-row">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              className={`chip ${department === d ? 'active' : ''}`}
              onClick={() => setDepartment(department === d ? '' : d)}
            >
              {d}
            </button>
          ))}
        </div>

        <label className="field-label">Tell us more (optional)</label>
        <textarea
          className="input"
          rows={4}
          placeholder="Share any details that would help us improve…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="two-col">
          <div>
            <label className="field-label">Your name (optional)</label>
            <input
              className="input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Sam"
            />
          </div>
          <div>
            <label className="field-label">Room # (optional)</label>
            <input
              className="input"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. 214"
            />
          </div>
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={rating === 0}
          onClick={submit}
        >
          Send Feedback
        </button>

        <p className="privacy">
          🔒 Your feedback goes straight to the management team.
        </p>
      </div>
    </div>
  );
}

/* ---------- Thank You: Happy ---------- */

function ThankYouHappy({
  name,
  setPage,
}: {
  name: string;
  setPage: (p: Page) => void;
}) {
  return (
    <div className="mobile-shell happy-bg">
      <div className="mobile-card">
        <div className="emoji-big">🎉</div>
        <h2 className="thanks-title">
          Thank you{name ? `, ${name}` : ''}! We&rsquo;re so glad you enjoyed
          your stay.
        </h2>
        <p className="thanks-sub">
          Would you share your experience publicly? It helps our team and
          future guests.
        </p>

        <a className="review-btn google" href="#" target="_blank" rel="noreferrer">
          <span>Review on Google</span> <span>⭐</span>
        </a>
        <a
          className="review-btn tripadvisor"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          <span>Review on TripAdvisor</span> <span>🦉</span>
        </a>

        <button className="link-btn" onClick={() => setPage('landing')}>
          Back to home
        </button>
      </div>
    </div>
  );
}

/* ---------- Thank You: Sad ---------- */

function ThankYouSad({
  name,
  setPage,
}: {
  name: string;
  setPage: (p: Page) => void;
}) {
  return (
    <div className="mobile-shell sad-bg">
      <div className="mobile-card">
        <div className="emoji-big soft">💙</div>
        <h2 className="thanks-title">
          Thank you{name ? `, ${name}` : ''} for your feedback.
        </h2>
        <p className="thanks-sub">
          We&rsquo;re sorry your experience wasn&rsquo;t perfect. Your feedback
          has been sent <strong>directly to our management team</strong>. We
          take every concern seriously and will follow up.
        </p>

        <div className="manager-card">
          <div className="manager-avatar">SM</div>
          <div>
            <div className="manager-name">Sophie Martin, GM</div>
            <div className="manager-sub">
              You can expect a personal response within a few hours.
            </div>
          </div>
        </div>

        <div className="secondary-block">
          <div className="secondary-label">
            You may also share your experience publicly:
          </div>
          <div className="secondary-row">
            <a className="secondary-link" href="#" target="_blank" rel="noreferrer">
              Google ⭐
            </a>
            <a className="secondary-link" href="#" target="_blank" rel="noreferrer">
              TripAdvisor 🦉
            </a>
          </div>
        </div>

        <button className="link-btn" onClick={() => setPage('landing')}>
          Back to home
        </button>
      </div>
    </div>
  );
}

/* ---------- Dashboard ---------- */

function Dashboard({
  feedback,
  stats,
  departmentAverages,
  markResolved,
  setPage,
}: {
  feedback: Feedback[];
  stats: { total: number; avg: string; negatives: number; resolved: number };
  departmentAverages: { dept: string; avg: number; count: number }[];
  markResolved: (id: number) => void;
  setPage: (p: Page) => void;
}) {
  const maxAvg = 5;

  return (
    <div className="dashboard">
      <header className="dash-nav">
        <div className="dash-logo">
          <span className="logo-mark">●</span> GuestPulse
          <span className="demo-badge">DEMO MODE</span>
        </div>
        <nav className="dash-nav-links">
          <button className="dash-link active">Dashboard</button>
          <button className="dash-link" onClick={() => setPage('feedback')}>
            Try Guest Flow
          </button>
          <button className="dash-link" onClick={() => setPage('alert')}>
            View Alert Demo
          </button>
          <button className="dash-link" onClick={() => setPage('landing')}>
            Back to Home
          </button>
        </nav>
      </header>

      <div className="dash-body">
        <h1 className="dash-title">
          The Grand Hotel <span className="dash-sub">— last 24 hours</span>
        </h1>

        <div className="kpi-row">
          <div className="kpi">
            <div className="kpi-label">Total Feedback</div>
            <div className="kpi-value">{stats.total}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Average Rating</div>
            <div className="kpi-value">
              {stats.avg} <span className="kpi-star">⭐</span>
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
              const pct = (d.avg / maxAvg) * 100;
              const color =
                d.avg >= 4 ? '#16A34A' : d.avg >= 3 ? '#D97706' : '#DC2626';
              return (
                <div key={d.dept} className="bar-row">
                  <div className="bar-label">{d.dept}</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <div className="bar-value">
                    {d.avg ? d.avg.toFixed(1) : '–'}{' '}
                    <span className="bar-count">({d.count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Recent feedback</h2>
            <span className="panel-sub">
              AI-classified · click an alert to view full action plan
            </span>
          </div>

          <div className="feedback-grid">
            {feedback.map((f) => (
              <div
                key={f.id}
                className={`fb-card ${f.resolved ? 'resolved' : ''}`}
              >
                <div className="fb-top">
                  <div className="fb-time">{f.time}</div>
                  <UrgencyBadge urgency={f.urgency} />
                </div>
                <div className="fb-rating-row">
                  <Stars value={f.rating} />
                  <span className="fb-dept">{f.department}</span>
                </div>
                <div className="fb-comment">&ldquo;{f.comment}&rdquo;</div>
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
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => markResolved(f.id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel ai-report">
          <div className="panel-header">
            <h2>Weekly AI Report</h2>
            <span className="panel-sub">Auto-generated · Mon 21 May</span>
          </div>
          <p className="ai-report-body">
            This week, The Grand Hotel received <strong>24 guest responses</strong>{' '}
            with an average rating of <strong>4.2 ⭐</strong>. Two recurring themes
            emerged: <strong>breakfast delays</strong> (3 mentions, primarily
            Saturday morning) and <strong>housekeeping timing</strong> on
            check-in afternoons. Front Desk continues to be your strongest
            performing department — Lucy was named in 4 positive reviews this
            week. Recommended actions: add a second barista on weekend
            mornings, and review the housekeeping schedule for 2–4 pm
            arrivals.
          </p>
          <div className="ai-report-footer">
            🤖 Generated by GuestPulse AI · next report Monday 28 May
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Alert ---------- */

function Alert({
  item,
  markResolved,
  setPage,
}: {
  item: Feedback;
  markResolved: (id: number) => void;
  setPage: (p: Page) => void;
}) {
  const urgency = URGENCY_STYLES[item.urgency];
  return (
    <div className="alert-shell">
      <div className="alert-card">
        <div
          className="alert-header"
          style={{ background: urgency.color }}
        >
          <div className="alert-source">
            <strong>GuestPulse Alert</strong> · push + email
          </div>
          <div className="alert-urgency">
            ⚠ {urgency.label} URGENCY
          </div>
        </div>

        <div className="alert-body">
          <div className="alert-hotel">The Grand Hotel</div>
          <div className="alert-meta">
            <Stars value={item.rating} /> · {item.department} ·{' '}
            <span>{item.time}</span>
          </div>

          <div className="alert-quote">
            &ldquo;{item.comment}&rdquo;
          </div>
          <div className="alert-guest">
            — {item.name}
            {' · '}
            <span className="alert-room">Room 214</span>
          </div>

          <div className="alert-section">
            <div className="alert-section-title">
              <span className="ai-tag">AI</span> Summary
            </div>
            <p>
              Guest reports a <strong>{item.aiLabel.toLowerCase()}</strong>{' '}
              affecting their stay. Tone suggests frustration but recoverable
              with proactive outreach. Recommend response within 15 minutes
              while guest is still on-site.
            </p>
          </div>

          <div className="alert-section">
            <div className="alert-section-title">Suggested actions</div>
            <ul className="alert-actions">
              <li>{item.aiSuggestion}.</li>
              <li>Reach out to the guest in person or by phone within 15 minutes.</li>
              <li>Log resolution in GuestPulse to track follow-up.</li>
            </ul>
          </div>

          <div className="alert-buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                markResolved(item.id);
                setPage('dashboard');
              }}
            >
              Mark Resolved
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setPage('dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
