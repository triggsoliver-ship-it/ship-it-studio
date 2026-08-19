// CallCatcher — post-call email delivery.
// Retell fires this webhook when a call is analyzed; we email the details to the
// business via IONOS SMTP (info@shipitstudio.co.uk's own mailbox).
//
// WHY NOT FORMSUBMIT: FormSubmit sits behind Cloudflare, which 403-challenges
// POSTs from datacenter IPs (Vercel). Confirmed 19 Aug 2026 via ?selftest=1 —
// every "delivery" since 17 Aug silently died there.
//
// REQUIRED ENV VAR (Vercel -> Project -> Settings -> Environment Variables):
//   IONOS_SMTP_PASS = mailbox password for info@shipitstudio.co.uk
// Optional: IONOS_SMTP_HOST (default smtp.ionos.co.uk), IONOS_SMTP_USER.
//
// Add one entry per client number in ROUTES. While a client is in demo,
// point their email at info@shipitstudio.co.uk; switch to their real inbox on go-live.

const VERSION = '4-2026-08-19'; // shown on GET so a deploy can be verified from a browser

const ROUTES = {
  '+442045380108': {
    name: '2nd2None Driving School',
    email: 'info@shipitstudio.co.uk' // DEMO phase — switch to admin@drivingschool.email when Holly buys
  }
};

const SMTP_USER = process.env.IONOS_SMTP_USER || 'info@shipitstudio.co.uk';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function sendMail(to, subject, fields) {
  if (!process.env.IONOS_SMTP_PASS) {
    return { ok: false, error: 'IONOS_SMTP_PASS env var not set in Vercel — add it, then redeploy' };
  }
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.IONOS_SMTP_HOST || 'smtp.ionos.co.uk',
    port: 587,
    secure: false, // STARTTLS
    auth: { user: SMTP_USER, pass: process.env.IONOS_SMTP_PASS }
  });

  const rows = Object.entries(fields).map(([k, v]) =>
    '<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;white-space:nowrap"><b>' + escapeHtml(k) + '</b></td>' +
    '<td style="padding:6px 0;color:#111;white-space:pre-wrap">' + escapeHtml(v) + '</td></tr>'
  ).join('');
  const html = '<div style="font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">' +
    '<h2 style="font-size:16px;margin:0 0 12px">' + escapeHtml(subject) + '</h2>' +
    '<table style="border-collapse:collapse">' + rows + '</table>' +
    '<p style="color:#888;font-size:12px;margin-top:16px">CallCatcher — a Ship It Studio company</p></div>';
  const text = Object.entries(fields).map(([k, v]) => k + ': ' + v).join('\n');

  const info = await transporter.sendMail({
    from: '"CallCatcher" <' + SMTP_USER + '>',
    to,
    subject,
    text,
    html
  });
  return { ok: true, id: info.messageId, response: String(info.response || '').slice(0, 200) };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    // Self-test: GET /api/callcatcher-webhook?selftest=1 sends a test email and
    // returns the SMTP response, so the email leg can be checked from a browser.
    const url = new URL(req.url, 'https://www.shipitstudio.co.uk');
    if (url.searchParams.get('selftest') === '1') {
      try {
        const delivery = await sendMail('info@shipitstudio.co.uk',
          'CallCatcher webhook SELF-TEST — ' + new Date().toISOString(), {
            Business: 'SELF-TEST (no real call)',
            Note: 'If you are reading this in the inbox, the SMTP email leg works.'
          });
        console.log('selftest delivery:', JSON.stringify(delivery));
        return res.status(200).json({ selftest: true, delivery, v: VERSION });
      } catch (err) {
        console.log('selftest error:', String(err));
        return res.status(200).json({ selftest: true, ok: false, error: String(err).slice(0, 300), v: VERSION });
      }
    }
    return res.status(405).json({ ok: false, error: 'POST only', v: VERSION });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Retell sends call_started / call_ended / call_analyzed. Only the last has the summary.
  if (body.event !== 'call_analyzed') {
    console.log('skipped event:', body.event || 'no event');
    return res.status(200).json({ ok: true, skipped: body.event || 'no event' });
  }

  const call = body.call || {};
  const analysis = call.call_analysis || {};
  const route = ROUTES[call.to_number];
  if (!route) {
    console.log('unrouted number:', call.to_number || 'unknown');
    return res.status(200).json({ ok: true, skipped: 'unrouted number: ' + (call.to_number || 'unknown') });
  }

  const minutes = call.duration_ms ? (call.duration_ms / 60000).toFixed(1) + ' min' : '';
  const when = call.start_timestamp
    ? new Date(call.start_timestamp).toLocaleString('en-GB', { timeZone: 'Europe/London' })
    : '';

  const fields = {
    Business: route.name,
    Caller: call.from_number || 'unknown',
    When: when,
    Duration: minutes
  };

  // Structured fields the agent extracts (caller_name, callback_number, location,
  // transmission, lesson_type, number_confirmed...). "caller_name" -> "Caller name".
  const custom = analysis.custom_analysis_data || {};
  for (const [key, value] of Object.entries(custom)) {
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (!text) continue;
    const label = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/_/g, ' ');
    if (!(label in fields)) fields[label] = text;
  }

  fields.Summary = analysis.call_summary || 'No summary available';
  fields.Successful = String(analysis.call_successful !== undefined ? analysis.call_successful : '');
  fields.Sentiment = analysis.user_sentiment || '';
  fields.Transcript = (call.transcript || '').slice(0, 3500);

  const subject = 'New call for ' + route.name + ' — ' + (call.from_number || 'unknown caller');

  try {
    const delivery = await sendMail(route.email, subject, fields);
    console.log('call_analyzed for', call.to_number, '-> smtp:', JSON.stringify(delivery));
    return res.status(200).json(delivery);
  } catch (err) {
    console.log('delivery error:', String(err));
    return res.status(200).json({ ok: false, error: String(err).slice(0, 200) });
  }
};
