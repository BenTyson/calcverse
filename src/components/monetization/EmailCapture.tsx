import { useState } from 'react';
import { Check } from 'lucide-react';

interface Props {
  variant: 'inline' | 'compact';
  leadMagnet?: boolean;
  dark?: boolean;
}

export function EmailCapture({ variant, leadMagnet = false, dark = false }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  if (variant === 'compact') {
    return (
      <div className={dark ? 'py-8 border-t border-neutral-800' : 'py-8'}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className={`text-sm font-medium ${dark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Get free tax tips and calculator updates
          </p>
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-sm text-emerald-500">
              <Check className="w-4 h-4" />
              <span>Check your inbox!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={`px-3 py-2 rounded-lg text-sm flex-1 sm:w-56 ${
                  dark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500'
                    : 'bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400'
                } border focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
        <div aria-live="polite" className="mt-2">
          {status === 'error' && <p className="text-sm text-red-500">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-6 md:p-8 mb-10">
      <h3 className="font-bold text-lg text-neutral-900 mb-2">Get Free Tax Tips</h3>
      <p className="text-neutral-600 mb-4">
        Join thousands of freelancers getting actionable tax and finance tips delivered to their inbox.
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-emerald-600 font-medium">
          <Check className="w-5 h-5" />
          <span>Check your inbox!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="inline-email" className="sr-only">Email address</label>
          <input
            id="inline-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            aria-describedby={status === 'error' ? 'email-error' : undefined}
            className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Subscribe'}
          </button>
        </form>
      )}

      <div aria-live="polite" className="mt-3">
        {status === 'error' && <p id="email-error" className="text-sm text-red-500">{errorMsg}</p>}
      </div>

      {leadMagnet && status !== 'success' && (
        <p className="mt-4 text-sm text-neutral-500">
          Plus, download our free{' '}
          <a href="/downloads/freelancer-tax-cheatsheet.pdf" className="text-primary-600 hover:underline font-medium">
            Freelancer Tax Cheatsheet (PDF)
          </a>
        </p>
      )}
    </div>
  );
}
