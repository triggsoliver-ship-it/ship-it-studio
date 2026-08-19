// CallCatcher — post-call email delivery.
// Retell fires this webhook when a call is analyzed; we forward the details
// by email via FormSubmit (no credentials needed — info@ is already activated).
// Add one entry per client number in ROUTES. While a client is in demo,
// point their email at info@shipitstudio.co.uk; switch to their real inbox on go-live.

const VERSION = '3-2026-08-19'; // shown on GET so a deploy can be verified from a browser

const ROUTES = {
  '+442045380108': {
    name: '2nd2None Driving School',
    email: 'info@shipitstudio.co.uk' // DEMO phase — switch to admin@drivingschool.email when Holly buys
  }
};

async function sendViaFormSubmit(email, fields) {
  const resp = await fetch('https://formsubmit.co/ajax/' + email, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(fields)
  });
  const text = await resp.text();
  return { status: resp.status, ok: resp.ok, body: text.slice(0, 400) };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    // Self-test: GET /api/callcatcher-webhook?selftest=1 sends a test email
    // via FormSubmit and returns FormSubmit's verbatim response, so the
    // email leg can be checked from a browser without a phone call.
    const url = new URL(req.url, 'https://www.shipitstudio.co.uk');
    if (url.searchParams.get('selftest') === '1') {
      try {
        const delivery = await sendViaFormSubmit('info@shipitstudio.co.uk', {
          _subject: 'CallCatcher webhook SELF-TEST — ' + new Date().toISOString(),
          _template: 'box',
          Business: 'SELF-TEST (no real call)',
          Note: 'If you are reading this in the inbox, the FormSubmit leg works.'
        });
        console.log('selftest delivery:', JSON.stringify(delivery));
        return res.status(200).json({ ok: true, selftest: true, formsubmit: delivery, v: VERSION });
      } catch (err) {
        console.log('selftest error:', String(err));
        return res.status(200).json({ ok: false, selftest: true, error: String(err).slice(0, 300), v: VERSION });
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
    _subject: 'New call for ' + route.name + ' — ' + (call.from_number || 'unknown caller'),
    _template: 'box',
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

  try {
    const delivery = await sendViaFormSubmit(route.email, fields);
    console.log('call_analyzed for', call.to_number, '-> formsubmit:', JSON.stringify(delivery));
    return res.status(200).json({ ok: delivery.ok, delivery: delivery.body.slice(0, 200) });
  } catch (err) {
    console.log('delivery error:', String(err));
    return res.status(200).json({ ok: false, error: String(err).slice(0, 200) });
  }
};
