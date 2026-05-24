import { supabase, isSupabaseConfigured, HOTEL_SLUG } from './supabase';
import { heuristicClassify } from './classify';
import type { Feedback, NewFeedback, Urgency } from './types';

type Row = {
  id: string;
  rating: number;
  department: string;
  comment: string;
  guest_name: string;
  room: string;
  resolved: boolean;
  urgency: string | null;
  ai_label: string | null;
  ai_suggestion: string | null;
  ai_summary: string | null;
  created_at: string;
};

function rowToFeedback(r: Row): Feedback {
  return {
    id: r.id,
    rating: r.rating,
    department: r.department,
    comment: r.comment,
    name: r.guest_name,
    room: r.room,
    resolved: r.resolved,
    urgency: (r.urgency as Urgency) ?? 'low',
    aiLabel: r.ai_label ?? 'Pending analysis',
    aiSuggestion: r.ai_suggestion ?? 'Awaiting AI review',
    aiSummary: r.ai_summary ?? '',
    createdAt: r.created_at,
    time: new Date(r.created_at).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  };
}

async function hotelId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('hotels')
    .select('id')
    .eq('slug', HOTEL_SLUG)
    .maybeSingle();
  return data?.id ?? null;
}

export { isSupabaseConfigured };

export async function listFeedback(): Promise<Feedback[]> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('feedback')
    .select(
      'id,rating,department,comment,guest_name,room,resolved,urgency,ai_label,ai_suggestion,ai_summary,created_at'
    )
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data as Row[]).map(rowToFeedback);
}

export async function insertFeedback(fb: NewFeedback): Promise<Feedback> {
  if (!supabase) throw new Error('Supabase not configured');
  // Enrich client-side with the heuristic classifier so rows are never blank.
  // Phase 3's analyze-feedback Edge Function upgrades this with a real AI pass.
  const ai = heuristicClassify(fb);
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      hotel_id: await hotelId(),
      rating: fb.rating,
      department: fb.department || 'General',
      comment: fb.comment,
      guest_name: fb.name || 'Anonymous guest',
      room: fb.room,
      urgency: ai.urgency,
      ai_label: ai.aiLabel,
      ai_suggestion: ai.aiSuggestion,
      ai_summary: ai.aiSummary,
    })
    .select(
      'id,rating,department,comment,guest_name,room,resolved,urgency,ai_label,ai_suggestion,ai_summary,created_at'
    )
    .single();
  if (error) throw error;
  return rowToFeedback(data as Row);
}

export async function resolveFeedback(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('feedback').update({ resolved: true }).eq('id', id);
  if (error) throw error;
}
