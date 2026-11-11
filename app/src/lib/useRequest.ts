import { useCallback, useEffect, useRef, useState } from 'react';

export type RequestStatus = 'idle' | 'pending' | 'error' | 'done';

/**
 * Wraps a save call with the three states the UI shows:
 * pending ("Saving…"), slow (after 5 s: reassure, don't close) and error (retry, answers kept).
 */
export function useRequest<T>(fn: () => Promise<T>, onDone?: (r: T) => void) {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [slow, setSlow] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const mounted = useRef(true);

  // Set on every mount: StrictMode mounts, unmounts and remounts effects in development.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(timer.current);
    };
  }, []);

  const run = useCallback(async () => {
    setStatus('pending');
    setSlow(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => mounted.current && setSlow(true), 5000);
    try {
      const r = await fn();
      if (!mounted.current) return;
      setStatus('done');
      onDone?.(r);
    } catch {
      if (mounted.current) setStatus('error');
    } finally {
      window.clearTimeout(timer.current);
      if (mounted.current) setSlow(false);
    }
  }, [fn, onDone]);

  return { status, slow, run, pending: status === 'pending', failed: status === 'error' };
}
