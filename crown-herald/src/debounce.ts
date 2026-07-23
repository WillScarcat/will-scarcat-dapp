/**
 * Classic trailing debounce: each call resets the timer. `handler` only
 * fires `waitMs` after the *last* call in a burst, with that last call's
 * argument — used so a rapid flurry of CrownClaimed events (several buys
 * fighting over the crown in quick succession) produces exactly one
 * Telegram announcement, for the eventual winner, instead of one per event.
 */
export function createDebouncer<T>(
  waitMs: number,
  handler: (value: T) => void | Promise<void>,
): (value: T) => void {
  let timer: NodeJS.Timeout | null = null;
  let latest: T | undefined;

  return (value: T): void => {
    latest = value;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const toHandle = latest as T;
      latest = undefined;
      void handler(toHandle);
    }, waitMs);
  };
}
