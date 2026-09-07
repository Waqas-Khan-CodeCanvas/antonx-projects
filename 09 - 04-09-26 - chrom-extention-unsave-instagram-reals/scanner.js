// Finds saved-post tiles on the page and drives infinite scroll to
// surface more of them. Deduplicates by href so repeated scans are cheap.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.Scanner = class Scanner {
  constructor() {
    this.seen = new Set();
    this.onItemsFound = () => {};
    this._observer = null;
  }

  queryVisibleAnchors() {
    const anchors = Array.from(
      document.querySelectorAll(IGUnsave.CONFIG.SELECTORS.POST_LINK)
    );
    return anchors.filter((a) => a.href && !this.seen.has(a.href));
  }

  collectNewItems() {
    const fresh = this.queryVisibleAnchors();
    fresh.forEach((a) => this.seen.add(a.href));
    if (fresh.length) this.onItemsFound(fresh);
    return fresh;
  }

  async scrollToLoadMore() {
    const before = document.body.scrollHeight;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, IGUnsave.CONFIG.TIMING.SCROLL_DELAY_MS));
    return document.body.scrollHeight > before;
  }

  startObserving(root = document.body) {
    this._observer = new MutationObserver(() => this.collectNewItems());
    this._observer.observe(root, { childList: true, subtree: true });
  }

  stopObserving() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }

  reset() {
    this.seen.clear();
  }
};