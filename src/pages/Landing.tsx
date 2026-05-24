import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

function Icon({ path, size = 22 }: { path: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

const iconScan = (
  <>
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
  </>
);
const iconRoute = (
  <>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.5 6H14a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8" opacity=".5" />
    <path d="M8.5 6H14a4 4 0 0 1 0 8h-4" />
  </>
);
const iconBell = (
  <>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </>
);
const iconShield = <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />;
const iconClock = (
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
);
const iconSpark = (
  <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
);

export function Landing() {
  const nav = useNavigate();
  return (
    <div className="landing">
      <header className="nav">
        <div className="logo">
          <span className="logo-mark">◆</span> GuestPulse
        </div>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/dashboard')}>
            Staff Login
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-tagline">
              <span className="dot" /> Guest experience, recovered in real time
            </div>
            <h1 className="hero-title">
              Catch complaints privately. Guide happy guests to{' '}
              <span className="accent">5-star reviews.</span>
            </h1>
            <p className="hero-sub">
              GuestPulse routes unhappy guests straight to your manager before checkout, and
              invites delighted ones to post public reviews. Not a review filter — smarter
              service recovery, powered by AI.
            </p>
            <div className="cta-row">
              <button className="btn btn-primary btn-lg" onClick={() => nav('/feedback')}>
                Try the guest experience →
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => nav('/dashboard')}>
                View staff dashboard
              </button>
            </div>
            <div className="hero-reassure">
              <span>
                <Icon path={iconShield} size={16} /> Private by default
              </span>
              <span>
                <Icon path={iconClock} size={16} /> 2-min response time
              </span>
              <span>
                <Icon path={iconSpark} size={16} /> AI summaries
              </span>
            </div>
          </div>

          <div className="hero-preview" aria-hidden="true">
            <div className="preview-bar">
              <i /> <i /> <i /> <b>GuestPulse · The Grand Hotel</b>
            </div>
            <div className="preview-kpis">
              <div className="preview-kpi">
                <small>Feedback</small>
                <b>24</b>
              </div>
              <div className="preview-kpi up">
                <small>Avg rating</small>
                <b>4.2</b>
              </div>
              <div className="preview-kpi alert">
                <small>Alerts</small>
                <b>5</b>
              </div>
            </div>
            <div className="preview-row">
              <span className="pr-dot" style={{ background: '#DC2626' }} />
              <div className="pr-main">
                <b>Housekeeping · Room 318</b>
                <span>“Room wasn’t cleaned on arrival…”</span>
              </div>
              <span className="pr-stars">★☆☆☆☆</span>
            </div>
            <div className="preview-row">
              <span className="pr-dot" style={{ background: '#16A34A' }} />
              <div className="pr-main">
                <b>Front Desk · Lucy</b>
                <span>“Amazing, went above and beyond!”</span>
              </div>
              <span className="pr-stars">★★★★★</span>
            </div>
            <div className="preview-row">
              <span className="pr-dot" style={{ background: '#D97706' }} />
              <div className="pr-main">
                <b>Spa · 15-min delay</b>
                <span>“Started late with no explanation.”</span>
              </div>
              <span className="pr-stars">★★★☆☆</span>
            </div>

            <div className="floating-alert">
              <span className="fa-ic">
                <Icon path={iconBell} size={16} />
              </span>
              <div>
                <b>New high-urgency alert</b>
                <span>Sent to GM · 42 seconds ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust">
        <div className="trust-label">Built for independent &amp; boutique hotels</div>
        <div className="trust-row">
          <span className="brand-word">
            The <span>Grand</span>
          </span>
          <span className="brand-word">RIVERSIDE</span>
          <span className="brand-word">
            Maison <span>Vivienne</span>
          </span>
          <span className="brand-word">HARBOUR&amp;CO</span>
          <span className="brand-word">
            The <span>Wren</span>
          </span>
        </div>
      </div>

      <section id="how" className="section">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three steps from feedback to reputation</h2>
          <p>No apps to download, no friction for guests, no missed complaints for your team.</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <Icon path={iconScan} />
            </div>
            <div className="step-num">Step 01</div>
            <h3>Guest scans a QR</h3>
            <p>
              QR codes in rooms, lobbies and on bills open a friendly, one-tap feedback page
              branded for your hotel.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Icon path={iconRoute} />
            </div>
            <div className="step-num">Step 02</div>
            <h3>AI routes intelligently</h3>
            <p>
              Happy guests are guided to Google &amp; TripAdvisor. Unhappy guests reach you
              privately — every single time.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">
              <Icon path={iconBell} />
            </div>
            <div className="step-num">Step 03</div>
            <h3>Manager gets an instant alert</h3>
            <p>
              Push &amp; email alerts with an AI summary, urgency level and recommended next
              steps. Resolve it before checkout.
            </p>
          </div>
        </div>
      </section>

      <div className="stats-band">
        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">
              87<em>%</em>
            </div>
            <div className="stat-label">complaints resolved before checkout</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              3<em>×</em>
            </div>
            <div className="stat-label">more positive public reviews</div>
          </div>
          <div className="stat">
            <div className="stat-num">
              2<em> min</em>
            </div>
            <div className="stat-label">average alert response time</div>
          </div>
        </div>
      </div>

      <section className="quote-section">
        <div className="quote-stars">★★★★★</div>
        <p className="quote-text">
          “We used to find out about problems in a one-star review days later. Now we fix them
          while the guest is still smiling at reception. Our Google rating went from 4.1 to 4.7
          in a season.”
        </p>
        <div className="quote-author">
          <span className="quote-avatar">SM</span>
          <div className="quote-meta">
            <b>Sophie Martin</b>
            <span>General Manager · The Grand Hotel</span>
          </div>
        </div>
      </section>

      <section id="pricing" className="section pricing">
        <div className="section-head">
          <span className="eyebrow">Pricing</span>
          <h2>Simple plans that pay for themselves</h2>
          <p>One recovered guest a month covers the subscription. Cancel anytime.</p>
        </div>
        <div className="plans">
          <div className="plan">
            <h3>Starter</h3>
            <div className="plan-tag">For a single property finding its feet</div>
            <div className="price">
              £99<span>/mo</span>
            </div>
            <div className="price-note">billed monthly</div>
            <ul>
              <li>1 property</li>
              <li>Unlimited feedback</li>
              <li>Email alerts</li>
              <li>Google &amp; TripAdvisor routing</li>
            </ul>
            <button className="btn btn-outline" onClick={() => nav('/feedback')}>
              Try the demo
            </button>
          </div>
          <div className="plan featured">
            <div className="ribbon">Most popular</div>
            <h3>Pro</h3>
            <div className="plan-tag">For hotels serious about reputation</div>
            <div className="price">
              £179<span>/mo</span>
            </div>
            <div className="price-note">billed monthly · everything in Starter, plus</div>
            <ul>
              <li>AI summaries &amp; suggested actions</li>
              <li>SMS + push alerts</li>
              <li>Weekly AI reports</li>
              <li>Department analytics</li>
            </ul>
            <button className="btn btn-primary" onClick={() => nav('/dashboard')}>
              Explore the dashboard
            </button>
          </div>
          <div className="plan">
            <h3>Multi-property</h3>
            <div className="plan-tag">For groups &amp; collections</div>
            <div className="price">
              <span>from </span>£299<span>/mo</span>
            </div>
            <div className="price-note">billed annually</div>
            <ul>
              <li>Unlimited properties</li>
              <li>Group-level analytics</li>
              <li>Custom integrations</li>
              <li>Dedicated success manager</li>
            </ul>
            <button className="btn btn-outline" onClick={() => nav('/alert')}>
              See an alert demo
            </button>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-inner">
          <h2>See it the way your guests will</h2>
          <p>
            Walk the full experience — guest feedback, the live dashboard and a simulated
            manager alert. No signup required.
          </p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg" onClick={() => nav('/feedback')}>
              Try the guest experience →
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => nav('/dashboard')}>
              Open the dashboard
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-grid">
          <div className="foot-brand">
            <div className="logo">
              <span className="logo-mark">◆</span> GuestPulse
            </div>
            <p>
              AI-powered guest feedback &amp; service recovery for hotels who care about every
              stay.
            </p>
          </div>
          <div className="foot-col">
            <h4>Product</h4>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#" onClick={(e) => { e.preventDefault(); nav('/dashboard'); }}>
              Dashboard
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); nav('/feedback'); }}>
              Guest demo
            </a>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} GuestPulse · Built for hotels who care.</span>
          <span>Catch complaints privately. Guide happy guests to public reviews.</span>
        </div>
      </footer>
    </div>
  );
}
