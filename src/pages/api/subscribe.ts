export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const sparrowUrl = import.meta.env.SPARROW_URL;
  const sparrowKey = import.meta.env.SPARROW_API_KEY;
  if (!sparrowUrl || !sparrowKey) {
    return new Response(
      JSON.stringify({ error: 'Email service not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = body.email?.trim().toLowerCase();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: 'Please enter a valid email address' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const res = await fetch(`${sparrowUrl}/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sparrowKey,
      },
      body: JSON.stringify({ email, list: 'calcfalc-newsletter' }),
    });

    if (!res.ok) {
      // Read the body as text first — Sparrow may return non-JSON on some errors.
      const rawBody = await res.text();
      let parsedError: string | undefined;
      try {
        parsedError = JSON.parse(rawBody)?.error;
      } catch {
        parsedError = rawBody.slice(0, 300);
      }
      console.error('[subscribe] Sparrow /v1/subscribers failed', {
        status: res.status,
        statusText: res.statusText,
        body: rawBody.slice(0, 500),
      });
      return new Response(
        JSON.stringify({
          error: parsedError || 'Subscription failed',
          upstreamStatus: res.status,
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fire welcome email — non-blocking, don't fail the subscribe if this errors
    fetch(`${sparrowUrl}/v1/send/transactional`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sparrowKey,
      },
      body: JSON.stringify({ to: email, template_id: 2 }),
    }).catch((err) => {
      console.error('[subscribe] welcome email failed (non-blocking)', err);
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[subscribe] unexpected error', err);
    return new Response(
      JSON.stringify({
        error: 'Something went wrong. Please try again.',
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
