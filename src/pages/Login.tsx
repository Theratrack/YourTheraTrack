import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

type LocationState = { from?: string };

export function Login() {
  const { configured, session, signIn } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in → skip the form.
  if (session) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    nav(from, { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-mark">●</span> GuestPulse
        </div>
        <h1 className="auth-title">Staff sign in</h1>
        <p className="auth-sub">Access the dashboard, reports and guest alerts.</p>

        {!configured && (
          <div className="auth-note">
            Demo mode — no backend configured. Authentication is disabled; you can
            open the dashboard directly.
            <button className="btn btn-primary btn-block" onClick={() => nav('/dashboard')}>
              Continue to demo dashboard
            </button>
          </div>
        )}

        {configured && (
          <form onSubmit={submit}>
            <label className="field-label">Work email</label>
            <input
              className="input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourhotel.com"
              required
            />
            <label className="field-label">Password</label>
            <input
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <div className="auth-error">{error}</div>}
            <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
            <p className="auth-hint">
              Staff accounts are provisioned by your hotel administrator.
            </p>
          </form>
        )}

        <button className="link-btn" onClick={() => nav('/')}>
          Back to home
        </button>
      </div>
    </div>
  );
}
