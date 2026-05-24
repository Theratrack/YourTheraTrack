import { useNavigate } from 'react-router-dom';

export function Landing() {
  const nav = useNavigate();
  return (
    <div className="landing">
      <header className="nav">
        <div className="logo">
          <span className="logo-mark">●</span> GuestPulse
        </div>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <button className="btn btn-outline" onClick={() => nav('/dashboard')}>
            Staff Login
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-tagline">
          Catch complaints privately. Guide happy guests to public reviews.
        </div>
        <h1 className="hero-title">
          Turn guest feedback into <span className="accent">5-star reviews</span> — before
          checkout.
        </h1>
        <p className="hero-sub">
          GuestPulse routes unhappy guests to your manager instantly, and invites happy ones to
          leave public reviews. No filters. Just smarter service recovery, powered by AI.
        </p>

        <div className="cta-row">
          <button className="btn btn-primary btn-lg" onClick={() => nav('/feedback')}>
            Try the Guest Experience →
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => nav('/dashboard')}>
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
              QR codes in rooms, lobbies and on bills lead to a friendly one-tap feedback page
              branded for your hotel.
            </p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>AI routes intelligently</h3>
            <p>
              Happy guests are guided to Google &amp; TripAdvisor. Unhappy guests reach you
              privately — every single time.
            </p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Manager gets instant alert</h3>
            <p>
              Push + email alerts with AI summary, urgency level and recommended next steps.
              Resolve before checkout.
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
            <button className="btn btn-outline" onClick={() => nav('/feedback')}>
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
            <button className="btn btn-primary" onClick={() => nav('/dashboard')}>
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
            <button className="btn btn-outline" onClick={() => nav('/alert')}>
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
