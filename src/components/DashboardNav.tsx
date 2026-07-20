import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

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
  const nav = useNavigate();
  const { configured, user, signOut } = useAuth();

  const logout = async () => {
    await signOut();
    nav('/login', { replace: true });
  };

  return (
    <header className="dash-nav">
      <div className="dash-logo">
        <span className="logo-mark">◆</span> GuestPulse
        {!configured && <span className="demo-badge">DEMO MODE</span>}
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
        {configured && user && (
          <>
            <span className="dash-user" title={user.email ?? ''}>
              {user.email}
            </span>
            <button className="dash-link logout" onClick={logout}>
              Sign out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
