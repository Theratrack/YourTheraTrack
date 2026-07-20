// Supabase Edge Function: analyze-feedback
// Classifies a feedback row with Anthropic and writes the AI fields back.
//
// Deploy:  supabase functions deploy analyze-feedback
// Secrets: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Request body: { id: string }  (the feedback row id to analyze)
// If ANTHROPIC_API_KEY is unset, returns 200 with { skipped: true } so the
// client's heuristic classification stands and nothing breaks.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-4-6';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type AiResult = {
  urgency: 'high' | 'medium' | 'low';
  ai_label: string;
  ai_suggestion: string;
  ai_summary: string;
};

async function classify(fb: {
  rating: number;
  department: string;
  comment: string;
}): Promise<AiResult> {
  const prompt = `You are the triage assistant for a hotel guest-feedback tool.
Classify this feedback and respond with ONLY a JSON object, no prose.

Rating (1-5): ${fb.rating}
Department: ${fb.department || 'unspecified'}
Comment: ${fb.comment || '(none)'}

JSON schema:
{
  "urgency": "high" | "medium" | "low",
  "ai_label": "short 2-4 word category, e.g. 'Cleanliness Issue', 'Staff Praise'",
  "ai_suggestion": "one concrete action for hotel staff",
  "ai_summary": "1-2 sentence summary for a manager"
}

Rules: ratings <=2 are usually "high" urgency, 3 is "medium", >=4 is "low".`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!resp.ok) throw new Error(`Anthropic ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const text: string = data.content?.[0]?.text ?? '{}';
  const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  return {
    urgency: ['high', 'medium', 'low'].includes(json.urgency) ? json.urgency : 'medium',
    ai_label: String(json.ai_label ?? 'Guest Feedback'),
    ai_suggestion: String(json.ai_suggestion ?? 'Follow up with the guest'),
    ai_summary: String(json.ai_summary ?? ''),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { id } = await req.json();
    if (!id) return json({ error: 'missing id' }, 400);

    if (!ANTHROPIC_API_KEY) return json({ skipped: true, reason: 'no ANTHROPIC_API_KEY' });

    const db = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: row, error } = await db
      .from('feedback')
      .select('rating,department,comment')
      .eq('id', id)
      .single();
    if (error || !row) return json({ error: 'feedback not found' }, 404);

    const ai = await classify(row);
    const { error: upErr } = await db.from('feedback').update(ai).eq('id', id);
    if (upErr) return json({ error: upErr.message }, 500);

    return json({ ok: true, ...ai });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'content-type': 'application/json' },
  });
}
