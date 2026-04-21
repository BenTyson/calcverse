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
      const data = await res.json();
      throw new Error(data.error || 'Subscription failed');
    }

    // Fire welcome email — non-blocking, don't fail the subscribe if this errors
    fetch(`${sparrowUrl}/v1/send/transactional`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sparrowKey,
      },
      body: JSON.stringify({ to: email, template_id: 2 }),
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
