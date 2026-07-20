// Supabase Edge Function: send-alert
// Emails the manager when negative feedback arrives, using Resend.
//
// Deploy:  supabase functions deploy send-alert
// Secrets: supabase secrets set RESEND_API_KEY=re_... ALERT_EMAIL_TO=... ALERT_EMAIL_FROM=...
//
// Request body: { id: string }  (feedback row id)
// If RESEND_API_KEY is unset, returns 200 { skipped: true } so nothing breaks.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ALERT_EMAIL_TO = Deno.env.get('ALERT_EMAIL_TO');
const ALERT_EMAIL_FROM = Deno.env.get('ALERT_EMAIL_FROM') ?? 'GuestPulse <alerts@guestpulse.app>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const URGENCY_COLOR: Record<string, string> = {
  high: '#DC2626',
  medium: '#D97706',
  low: '#16A34A',
};

type Row = {
  rating: number;
  department: string;
  comment: string;
  guest_name: string;
  room: string;
  urgency: string | null;
  ai_label: string | null;
  ai_suggestion: string | null;
  ai_summary: string | null;
};

function buildHtml(hotelName: string, fb: Row): string {
  const color = URGENCY_COLOR[fb.urgency ?? 'medium'] ?? '#D97706';
  const stars = '★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating);
  return `
  <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
    <div style="background:${color};color:#fff;padding:16px 20px">
      <div style="font-weight:700">GuestPulse Alert · ${hotelName}</div>
      <div style="font-size:13px;letter-spacing:.04em">⚠ ${(fb.urgency ?? 'medium').toUpperCase()} URGENCY</div>
    </div>
    <div style="padding:20px 24px;color:#0f172a">
      <div style="font-size:20px;color:#f59e0b">${stars} <span style="color:#475569;font-size:14px">· ${fb.department}</span></div>
      <blockquote style="border-left:3px solid ${color};margin:14px 0;padding:4px 12px;font-style:italic">${escapeHtml(fb.comment || 'No comment left.')}</blockquote>
      <div style="font-size:13px;color:#475569">— ${escapeHtml(fb.guest_name)}${fb.room ? ` · Room ${escapeHtml(fb.room)}` : ''}</div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-top:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px">AI Summary</div>
        <div style="font-size:14px">${escapeHtml(fb.ai_summary || '')}</div>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-top:10px">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px">Suggested action</div>
        <div style="font-size:14px">${escapeHtml(fb.ai_suggestion || 'Follow up with the guest')}</div>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin-top:18px">Respond within 15 minutes while the guest is still on-site.</p>
    </div>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { id } = await req.json();
    if (!id) return json({ error: 'missing id' }, 400);

    if (!RESEND_API_KEY || !ALERT_EMAIL_TO) {
      return json({ skipped: true, reason: 'RESEND_API_KEY or ALERT_EMAIL_TO unset' });
    }

    const db = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: row, error } = await db
      .from('feedback')
      .select('rating,department,comment,guest_name,room,urgency,ai_label,ai_suggestion,ai_summary,hotel_id')
      .eq('id', id)
      .single();
    if (error || !row) return json({ error: 'feedback not found' }, 404);

    // Only alert on negative feedback.
    if (row.rating > 3) return json({ skipped: true, reason: 'rating > 3' });

    let hotelName = 'Your hotel';
    if (row.hotel_id) {
      const { data: hotel } = await db.from('hotels').select('name').eq('id', row.hotel_id).maybeSingle();
      if (hotel?.name) hotelName = hotel.name;
    }

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: ALERT_EMAIL_FROM,
        to: [ALERT_EMAIL_TO],
        subject: `⚠ ${(row.urgency ?? 'medium').toUpperCase()} · ${row.ai_label ?? 'Guest complaint'} — ${hotelName}`,
        html: buildHtml(hotelName, row as Row),
      }),
    });

    if (!resp.ok) return json({ error: `Resend ${resp.status}: ${await resp.text()}` }, 502);

    await db.from('feedback').update({ alert_sent_at: new Date().toISOString() }).eq('id', id);
    return json({ ok: true });
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
