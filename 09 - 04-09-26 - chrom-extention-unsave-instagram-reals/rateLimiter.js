// Throttles actions with randomized jitter and periodic longer pauses,
// so the automation doesn't fire actions at a robotic, fixed cadence.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.RateLimiter = class RateLimiter {
  constructor({ minDelay, maxDelay, pauseEvery, pauseDuration } = {}) {
    const T = IGUnsave.CONFIG.TIMING;
    this.minDelay = minDelay ?? T.MIN_DELAY_MS;
    this.maxDelay = maxDelay ?? T.MAX_DELAY_MS;
    this.pauseEvery = pauseEvery ?? T.PAUSE_EVERY_N_ACTIONS;
    this.pauseDuration = pauseDuration ?? T.PAUSE_DURATION_MS;

    this._actionCount = 0;
    this._aborted = false;
  }

  reset() {
    this._aborted = false;
    this._actionCount = 0;
  }

  abort() {
    this._aborted = true;
  }

  _sleep(ms) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearInterval(abortCheckId);
        resolve();
      }, ms);

      const abortCheckId = setInterval(() => {
        if (this._aborted) {
          clearTimeout(timeoutId);
          clearInterval(abortCheckId);
          reject(new Error('RateLimiter aborted'));
        }
      }, 200);
    });
  }

  async wait() {
    if (this._aborted) throw new Error('RateLimiter aborted');

    this._actionCount++;

    if (this.pauseEvery > 0 && this._actionCount % this.pauseEvery === 0) {
      await this._sleep(this.pauseDuration);
    }

    const jitter = Math.random() * (this.maxDelay - this.minDelay);
    await this._sleep(this.minDelay + jitter);
  }
};