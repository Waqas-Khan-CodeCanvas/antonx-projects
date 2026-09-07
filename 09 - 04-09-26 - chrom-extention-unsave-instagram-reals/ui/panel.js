// Builds and injects the floating control panel; wires button clicks to
// callbacks supplied by the controller in index.js.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.Panel = class Panel {
  constructor({ onStart, onPause, onResume, onStop, onReset } = {}) {
    this.callbacks = { onStart, onPause, onResume, onStop, onReset };
    this.root = null;
    this.progressBar = null;
  }

  mount() {
    if (document.getElementById('ig-unsave-panel')) return;

    const root = document.createElement('div');
    root.id = 'ig-unsave-panel';
    document.body.appendChild(root);
    this.root = root;
    this.progressBar = new IGUnsave.ProgressBar(root);

    root.innerHTML = `
      <div class="ig-unsave-header">
        <span class="ig-unsave-title">Unsave Saved Posts</span>
        <button class="ig-unsave-close" title="Close panel">&times;</button>
      </div>
      <div class="ig-unsave-body">
        ${this.progressBar.render()}
        <div class="ig-unsave-actions">
          <button class="ig-unsave-btn primary" data-action="start">Start</button>
          <button class="ig-unsave-btn" data-action="pause" disabled>Pause</button>
          <button class="ig-unsave-btn danger" data-action="stop" disabled>Stop</button>
          <button class="ig-unsave-btn ghost" data-action="reset">Reset</button>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    this.root.querySelector('.ig-unsave-close').addEventListener('click', () => this.hide());

    this.root.querySelector('[data-action="start"]').addEventListener('click', () => {
      this.setRunningState(true);
      this.callbacks.onStart?.();
    });

    this.root.querySelector('[data-action="pause"]').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (btn.textContent === 'Pause') {
        btn.textContent = 'Resume';
        this.callbacks.onPause?.();
      } else {
        btn.textContent = 'Pause';
        this.callbacks.onResume?.();
      }
    });

    this.root.querySelector('[data-action="stop"]').addEventListener('click', () => {
      this.setRunningState(false);
      this.callbacks.onStop?.();
    });

    this.root.querySelector('[data-action="reset"]').addEventListener('click', () => {
      this.callbacks.onReset?.();
    });
  }

  setRunningState(isRunning) {
    const startBtn = this.root.querySelector('[data-action="start"]');
    const pauseBtn = this.root.querySelector('[data-action="pause"]');
    const stopBtn = this.root.querySelector('[data-action="stop"]');
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    stopBtn.disabled = !isRunning;
    if (!isRunning) pauseBtn.textContent = 'Pause';
  }

  updateStats(state) {
    if (!this.progressBar) return;
    this.progressBar.update(state);
    if (['completed', 'stopped', 'idle'].includes(state.status)) {
      this.setRunningState(false);
    }
  }

  show() {
    if (this.root) this.root.style.display = 'block';
  }

  hide() {
    if (this.root) this.root.style.display = 'none';
  }

  destroy() {
    if (this.root) {
      this.root.remove();
      this.root = null;
      this.progressBar = null;
    }
  }
};