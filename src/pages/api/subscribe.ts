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

  const subscribersUrl = `${sparrowUrl}/v1/subscribers`;
  try {
    const res = await fetch(subscribersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sparrowKey,
      },
      body: JSON.stringify({ email, list: 'newsletter' }),
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
    // undici wraps the real network error in TypeError.cause
    const cause = err instanceof Error && 'cause' in err ? (err as Error & { cause?: unknown }).cause : undefined;
    const causeMsg = cause instanceof Error ? cause.message : cause ? String(cause) : undefined;
    const causeCode = cause && typeof cause === 'object' && 'code' in cause ? String((cause as { code: unknown }).code) : undefined;

    console.error('[subscribe] fetch threw', {
      url: subscribersUrl,
      sparrowUrlSet: !!sparrowUrl,
      sparrowUrlLength: sparrowUrl?.length,
      sparrowUrlScheme: sparrowUrl?.startsWith('https://') ? 'https' : sparrowUrl?.startsWith('http://') ? 'http' : 'other',
      message: err instanceof Error ? err.message : String(err),
      causeMsg,
      causeCode,
    });

    return new Response(
      JSON.stringify({
        error: 'Something went wrong. Please try again.',
        detail: err instanceof Error ? err.message : String(err),
        cause: causeMsg,
        code: causeCode,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
