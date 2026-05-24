import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Feedback, NewFeedback } from './types';
import { demoFeedback } from '../data/demo';
import { heuristicClassify } from './classify';

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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback[]>(demoFeedback);
  const [loading] = useState(false);

  const addFeedback = useCallback(async (fb: NewFeedback): Promise<Feedback> => {
    const ai = heuristicClassify(fb);
    const entry: Feedback = {
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
    setFeedback((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const markResolved = useCallback(async (id: string) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, resolved: true } : f))
    );
  }, []);

  const refresh = useCallback(async () => {}, []);

  return (
    <StoreContext.Provider
      value={{
        feedback,
        loading,
        usingDemoData: true,
        addFeedback,
        markResolved,
        refresh,
      }}
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

// re-export so phase 2 can compute derived stats consistently
export function deriveStats(feedback: Feedback[]) {
  const total = feedback.length;
  const avg = total ? feedback.reduce((s, f) => s + f.rating, 0) / total : 0;
  const negatives = feedback.filter((f) => f.rating <= 3).length;
  const resolved = feedback.filter((f) => f.resolved).length;
  return { total, avg, negatives, resolved };
}
