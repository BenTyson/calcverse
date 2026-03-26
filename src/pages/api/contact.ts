export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const sparrowUrl = import.meta.env.SPARROW_URL;
  const sparrowKey = import.meta.env.SPARROW_API_KEY;
  if (!sparrowUrl || !sparrowKey) {
    return new Response(
      JSON.stringify({ error: 'Contact form not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let name: string;
  let email: string;
  let subject: string;
  let message: string;

  try {
    const body = await request.json();
    name = body.name?.trim();
    email = body.email?.trim().toLowerCase();
    subject = body.subject?.trim();
    message = body.message?.trim();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: 'All fields are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: 'Please enter a valid email address' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const res = await fetch(`${sparrowUrl}/v1/send/raw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sparrowKey,
      },
      body: JSON.stringify({
        from: 'CalcFalcon Contact <no-reply@calcfalcon.com>',
        to: 'ideaswithben@gmail.com',
        subject: `[CalcFalcon] ${subject}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p>${message}</p>`,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Send failed');
    }

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
