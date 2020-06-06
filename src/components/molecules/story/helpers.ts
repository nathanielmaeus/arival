const DEFAULT_INTERVAL = 1000;

export function throttle(func: () => void, ms?: number) {
  let isThrottled = false;

  function wrapper() {
    if (isThrottled) {
      return;
    }

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      func();
    }, ms || DEFAULT_INTERVAL);
  }

  return wrapper;
}
