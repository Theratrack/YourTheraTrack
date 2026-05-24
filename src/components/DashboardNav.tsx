import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/report', label: 'Weekly Report' },
  { to: '/qr', label: 'QR Codes' },
  { to: '/feedback', label: 'Try Guest Flow' },
  { to: '/alert', label: 'View Alert Demo' },
  { to: '/', label: 'Back to Home' },
];

export function DashboardNav() {
  const { pathname } = useLocation();
  return (
    <header className="dash-nav">
      <div className="dash-logo">
        <span className="logo-mark">●</span> GuestPulse
        <span className="demo-badge">DEMO MODE</span>
      </div>
      <nav className="dash-nav-links">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`dash-link ${pathname === l.to ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
