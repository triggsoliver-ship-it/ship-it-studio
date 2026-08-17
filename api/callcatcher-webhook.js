// CallCatcher — post-call email delivery.
// Retell fires this webhook when a call is analyzed; we forward the details
// by email via FormSubmit (no credentials needed — info@ is already activated).
// Add one entry per client number in ROUTES. While a client is in demo,
// point their email at info@shipitstudio.co.uk; switch to their real inbox on go-live.

const ROUTES = {
  '+442045380108': {
    name: '2nd2None Driving School',
    email: 'info@shipitstudio.co.uk' // DEMO phase — switch to admin@drivingschool.email when Holly buys
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Retell sends call_started / call_ended / call_analyzed. Only the last has the summary.
  if (body.event !== 'call_analyzed') {
    return res.status(200).json({ ok: true, skipped: body.event || 'no event' });
  }

  const call = body.call || {};
  const analysis = call.call_analysis || {};
  const route = ROUTES[call.to_number];
  if (!route) {
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
    Duration: minutes,
    Summary: analysis.call_summary || 'No summary available',
    Successful: String(analysis.call_successful !== undefined ? analysis.call_successful : ''),
    Sentiment: analysis.user_sentiment || '',
    Transcript: (call.transcript || '').slice(0, 3500)
  };

  try {
    const resp = await fetch('https://formsubmit.co/ajax/' + route.email, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(fields)
    });
    const text = await resp.text();
    return res.status(200).json({ ok: resp.ok, delivery: text.slice(0, 200) });
  } catch (err) {
    return res.status(200).json({ ok: false, error: String(err).slice(0, 200) });
  }
};
