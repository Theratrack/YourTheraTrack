import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Feedback, NewFeedback } from './types';
import { demoFeedback } from '../data/demo';
import { heuristicClassify } from './classify';
import {
  isSupabaseConfigured,
  listFeedback,
  insertFeedback,
  resolveFeedback,
  analyzeFeedback,
} from './feedbackApi';

type Store = {
  feedback: Feedback[];
  loading: boolean;
  usingDemoData: boolean;
  addFeedback: (fb: NewFeedback) => Promise<Feedback>;
  markResolved: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const StoreContext = createContext<Store | null>(null);

function nowTime(): string {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function localFeedback(fb: NewFeedback): Feedback {
  const ai = heuristicClassify(fb);
  return {
    id: `local-${Date.now()}`,
    rating: fb.rating,
    department: fb.department || 'General',
    comment: fb.comment,
    name: fb.name || 'Anonymous guest',
    room: fb.room,
    time: nowTime(),
    createdAt: new Date().toISOString(),
    resolved: false,
    ...ai,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback[]>(demoFeedback);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  // True until we successfully load live data from Supabase.
  const [usingDemoData, setUsingDemoData] = useState(true);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const rows = await listFeedback();
      setFeedback(rows.length ? rows : demoFeedback);
      setUsingDemoData(rows.length === 0);
    } catch (err) {
      // Network/DNS/policy failure → stay in demo mode so the app still works.
      console.warn('GuestPulse: falling back to demo data —', err);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addFeedback = useCallback(
    async (fb: NewFeedback): Promise<Feedback> => {
      if (isSupabaseConfigured && !usingDemoData) {
        try {
          const saved = await insertFeedback(fb);
          setFeedback((prev) => [saved, ...prev]);
          // Upgrade heuristic AI fields with a real Anthropic pass in the
          // background; merge in when it returns.
          void analyzeFeedback(saved.id).then((ai) => {
            if (ai) {
              setFeedback((prev) =>
                prev.map((f) => (f.id === saved.id ? { ...f, ...ai } : f))
              );
            }
          });
          return saved;
        } catch (err) {
          console.warn('GuestPulse: insert failed, storing locally —', err);
        }
      }
      const entry = localFeedback(fb);
      setFeedback((prev) => [entry, ...prev]);
      return entry;
    },
    [usingDemoData]
  );

  const markResolved = useCallback(
    async (id: string) => {
      setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, resolved: true } : f)));
      if (isSupabaseConfigured && !usingDemoData && !id.startsWith('local-')) {
        try {
          await resolveFeedback(id);
        } catch (err) {
          console.warn('GuestPulse: resolve failed —', err);
        }
      }
    },
    [usingDemoData]
  );

  return (
    <StoreContext.Provider
      value={{ feedback, loading, usingDemoData, addFeedback, markResolved, refresh }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function deriveStats(feedback: Feedback[]) {
  const total = feedback.length;
  const avg = total ? feedback.reduce((s, f) => s + f.rating, 0) / total : 0;
  const negatives = feedback.filter((f) => f.rating <= 3).length;
  const resolved = feedback.filter((f) => f.resolved).length;
  return { total, avg, negatives, resolved };
}
