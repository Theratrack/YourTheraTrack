import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

afterEach(cleanup);

// Simulate NO Supabase backend: open demo mode, nothing to protect.
vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: false,
  HOTEL_SLUG: 'grand-hotel',
  supabase: null,
}));

vi.mock('../lib/feedbackApi', () => ({
  isSupabaseConfigured: false,
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

describe('demo mode (no Supabase configured)', () => {
  it('opens the dashboard without login so the keyless demo still works', async () => {
    renderAt('/dashboard');
    expect(await screen.findByText(/department breakdown/i)).toBeTruthy();
    expect(screen.queryByText(/staff sign in/i)).toBeNull();
  });

  it('serves the guest feedback page', async () => {
    renderAt('/feedback');
    expect(await screen.findByText(/how was your stay/i)).toBeTruthy();
  });
});
