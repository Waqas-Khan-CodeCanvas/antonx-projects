// Performs the actual unsave action on a single grid tile: reveals the
// hover-only save button, clicks it, and verifies it actually disappeared.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.Actions = class Actions {
  constructor({ stateTracker } = {}) {
    this.stateTracker = stateTracker;
  }

  _fireMouseEvent(el, type) {
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
  }

  _findSaveButton(tile) {
    const { SAVE_BUTTON_SVG_SELECTOR, SAVE_BUTTON_ARIA_LABELS } = IGUnsave.CONFIG.SELECTORS;
    const svgs = Array.from(tile.querySelectorAll(SAVE_BUTTON_SVG_SELECTOR));
    const match = svgs.find((svg) =>
      SAVE_BUTTON_ARIA_LABELS.includes(svg.getAttribute('aria-label'))
    );
    if (!match) return null;
    return match.closest('button') || match.closest('div[role="button"]') || match;
  }

  _waitForRemoval(tile, timeoutMs) {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (!document.body.contains(tile) || !this._findSaveButton(tile)) {
          resolve(true);
          return;
        }
        if (Date.now() - start > timeoutMs) {
          resolve(false);
          return;
        }
        requestAnimationFrame(check);
      };
      check();
    });
  }

  async unsaveTile(tile) {
    // The save/remove icon only renders once the tile is "hovered".
    this._fireMouseEvent(tile, 'mouseover');
    this._fireMouseEvent(tile, 'mouseenter');
    await new Promise((r) => setTimeout(r, 150));

    const button = this._findSaveButton(tile);
    if (!button) throw new Error('Save button not found for tile');

    button.click();

    const removed = await this._waitForRemoval(tile, IGUnsave.CONFIG.TIMING.ACTION_TIMEOUT_MS);
    if (!removed) throw new Error('Timed out waiting for unsave confirmation');

    return true;
  }

  async processTile(tile, { retries = IGUnsave.CONFIG.LIMITS.MAX_RETRIES } = {}) {
    let attempt = 0;
    let lastError = null;

    while (attempt <= retries) {
      try {
        await this.unsaveTile(tile);
        this.stateTracker?.increment('succeeded');
        this.stateTracker?.increment('processed');
        return { ok: true };
      } catch (err) {
        lastError = err;
        attempt++;
        if (attempt <= retries) {
          await new Promise((r) => setTimeout(r, IGUnsave.CONFIG.TIMING.RETRY_DELAY_MS));
        }
      }
    }

    this.stateTracker?.increment('failed');
    this.stateTracker?.increment('processed');
    return { ok: false, error: lastError?.message };
  }
};