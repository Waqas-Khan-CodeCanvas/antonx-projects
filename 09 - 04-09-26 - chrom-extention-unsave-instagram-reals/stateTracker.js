// Tracks run progress and persists it via chrome.storage.local, so the
// panel can reflect state accurately even after a page reload.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.StateTracker = class StateTracker extends EventTarget {
  constructor(storageKey) {
    super();
    this.storageKey = storageKey ?? IGUnsave.CONFIG.STORAGE_KEYS.STATE;
    this.state = this._defaultState();
  }

  _defaultState() {
    return {
      status: 'idle', // idle | scanning | running | paused | completed | stopped
      totalFound: 0,
      processed: 0,
      succeeded: 0,
      failed: 0,
      startedAt: null,
      updatedAt: null,
    };
  }

  async load() {
    const data = await chrome.storage.local.get(this.storageKey);
    if (data && data[this.storageKey]) {
      this.state = { ...this.state, ...data[this.storageKey] };
    }
    return this.state;
  }

  async persist() {
    this.state.updatedAt = Date.now();
    await chrome.storage.local.set({ [this.storageKey]: this.state });
  }

  async reset() {
    this.state = this._defaultState();
    await this.persist();
    this._emit();
  }

  update(partial) {
    this.state = { ...this.state, ...partial };
    this.persist();
    this._emit();
  }

  increment(field, by = 1) {
    this.state[field] = (this.state[field] || 0) + by;
    this.persist();
    this._emit();
  }

  _emit() {
    this.dispatchEvent(new CustomEvent('change', { detail: { ...this.state } }));
  }
};