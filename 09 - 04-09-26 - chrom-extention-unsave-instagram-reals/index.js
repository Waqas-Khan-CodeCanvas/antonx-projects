// Entry point: wires scanner, actions, rate limiter, state tracker, and
// panel together into a single controllable run loop.

window.IGUnsave = window.IGUnsave || {};

(function () {
  const { CONFIG, RateLimiter, StateTracker, Scanner, Actions, Panel } = IGUnsave;

  class Controller {
    constructor() {
      this.stateTracker = new StateTracker(CONFIG.STORAGE_KEYS.STATE);
      this.rateLimiter = new RateLimiter();
      this.actions = new Actions({ stateTracker: this.stateTracker });
      this.scanner = new Scanner();
      this.panel = new Panel({
        onStart: () => this.start(),
        onPause: () => this.pause(),
        onResume: () => this.resume(),
        onStop: () => this.stop(),
        onReset: () => this.resetAll(),
      });

      this.queue = [];
      this.processedTiles = new WeakSet();
      this._isRunning = false;
      this._isPaused = false;
      this._onStateChange = null;
    }

    async init() {
      await this.stateTracker.load();
      this.panel.mount();
      this.panel.updateStats(this.stateTracker.state);

      this._onStateChange = (e) => this.panel.updateStats(e.detail);
      this.stateTracker.addEventListener('change', this._onStateChange);

      this.panel.show();
    }

    _tileFromAnchor(anchor) {
      let el = anchor;
      for (let i = 0; i < CONFIG.SELECTORS.TILE_ANCESTOR_LEVELS; i++) {
        if (el.parentElement) el = el.parentElement;
      }
      return el;
    }

    _enqueueFromAnchors(anchors) {
      let added = 0;
      anchors.forEach((a) => {
        const tile = this._tileFromAnchor(a);
        if (!this.processedTiles.has(tile)) {
          this.queue.push(tile);
          added++;
        }
      });
      if (added) {
        this.stateTracker.update({
          totalFound: this.stateTracker.state.totalFound + added,
        });
      }
    }

    async start() {
      if (this._isRunning) return;
      this._isRunning = true;
      this._isPaused = false;
      this.rateLimiter.reset();

      this.stateTracker.update({ status: 'scanning', startedAt: Date.now() });

      this.scanner.onItemsFound = (anchors) => this._enqueueFromAnchors(anchors);
      this.scanner.startObserving();
      this.scanner.collectNewItems();

      this.stateTracker.update({ status: 'running' });
      await this._runLoop();
    }

    async _runLoop() {
      let stagnantScrolls = 0;

      while (this._isRunning) {
        if (this._isPaused) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }

        const tile = this.queue.shift();

        if (!tile) {
          const grew = await this.scanner.scrollToLoadMore();
          this.scanner.collectNewItems();

          if (this.queue.length === 0) {
            stagnantScrolls = grew ? 0 : stagnantScrolls + 1;
            if (stagnantScrolls >= 3) {
              this._complete();
              return;
            }
          }
          continue;
        }

        if (this.processedTiles.has(tile) || !document.body.contains(tile)) continue;
        this.processedTiles.add(tile);

        const result = await this.actions.processTile(tile);
        if (!result.ok) {
          console.warn('[IG Unsave] Failed to unsave tile:', result.error);
        }

        try {
          await this.rateLimiter.wait();
        } catch {
          break; // aborted via stop()
        }
      }
    }

    _complete() {
      this._isRunning = false;
      this.scanner.stopObserving();
      this.stateTracker.update({ status: 'completed' });
    }

    pause() {
      this._isPaused = true;
      this.stateTracker.update({ status: 'paused' });
    }

    resume() {
      this._isPaused = false;
      this.stateTracker.update({ status: 'running' });
    }

    stop() {
      this._isRunning = false;
      this._isPaused = false;
      this.rateLimiter.abort();
      this.scanner.stopObserving();
      this.stateTracker.update({ status: 'stopped' });
    }

    async resetAll() {
      this.stop();
      this.queue = [];
      this.processedTiles = new WeakSet();
      this.scanner.reset();
      await this.stateTracker.reset();
    }

    destroy() {
      this.stop();
      if (this._onStateChange) {
        this.stateTracker.removeEventListener('change', this._onStateChange);
      }
      this.panel.destroy();
    }
  }

  IGUnsave.controller = new Controller();

  function boot() {
    if (window.location.pathname.includes('/saved')) {
      IGUnsave.controller.init();
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

  window.addEventListener('beforeunload', () => IGUnsave.controller.destroy());
})();