/**
 * Mock backend. Replace with real endpoints:
 *  POST /applications/drafts        (save-and-resume, sends the magic link)
 *  POST /applications/drafts/share  (send quote to the majority owner)
 *
 * Demo network conditions with a query param: ?net=slow | ?net=fail | ?net=flaky (fails once).
 */
type NetMode = 'normal' | 'slow' | 'fail' | 'flaky';

function netMode(): NetMode {
  if (typeof window === 'undefined') return 'normal';
  const v = new URLSearchParams(window.location.search).get('net');
  return v === 'slow' || v === 'fail' || v === 'flaky' ? v : 'normal';
}

let flakyFailed = false;

export class NetworkError extends Error {}

function request<T>(result: T): Promise<T> {
  const mode = netMode();
  const delay = mode === 'slow' ? 7000 : 450;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'fail' || (mode === 'flaky' && !flakyFailed)) {
        flakyFailed = true;
        reject(new NetworkError('Network unavailable'));
        return;
      }
      resolve(result);
    }, delay);
  });
}

export const api = {
  saveDraft: (_payload: unknown) => request({ ok: true as const }),
  shareQuote: (_ownerEmail: string) => request({ ok: true as const }),
  notifyMe: (_email: string, _reason: string) => request({ ok: true as const }),
};
