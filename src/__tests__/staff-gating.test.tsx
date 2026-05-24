import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

afterEach(cleanup);

// Simulate a configured Supabase backend with NO active session.
vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  HOTEL_SLUG: 'grand-hotel',
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  },
}));

vi.mock('../lib/feedbackApi', () => ({
  isSupabaseConfigured: true,
  listFeedback: async () => [],
  insertFeedback: async () => {
    throw new Error('not used');
  },
  resolveFeedback: async () => {},
  analyzeFeedback: async () => null,
  sendAlert: async () => false,
}));

import App from '../App';
import { AuthProvider } from '../lib/auth';
import { StoreProvider } from '../lib/store';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('staff-only gating (Supabase configured, signed out)', () => {
  it('redirects an unauthenticated user from /dashboard to the login page', async () => {
    renderAt('/dashboard');
    await waitFor(() => {
      expect(screen.queryByText(/staff sign in/i)).not.toBeNull();
    });
    // Dashboard content must NOT be exposed.
    expect(screen.queryByText(/department breakdown/i)).toBeNull();
  });

  it('redirects an unauthenticated user away from /report', async () => {
    renderAt('/report');
    await waitFor(() => {
      expect(screen.queryByText(/staff sign in/i)).not.toBeNull();
    });
    expect(screen.queryByText(/executive summary/i)).toBeNull();
  });

  it('keeps the guest feedback page public (no login required)', async () => {
    renderAt('/feedback');
    expect(await screen.findByText(/how was your stay/i)).toBeTruthy();
    expect(screen.queryByText(/staff sign in/i)).toBeNull();
  });
});
