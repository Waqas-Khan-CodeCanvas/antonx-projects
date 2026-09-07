// Renders and updates just the stats/progress-bar portion of the panel.
// Kept separate from panel.js so layout and state-rendering stay decoupled.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.ProgressBar = class ProgressBar {
  constructor(root) {
    this.root = root;
  }

  render() {
    return `
      <div class="ig-unsave-stats">
        <div class="ig-unsave-stat"><span class="label">Found</span><span class="value" data-field="totalFound">0</span></div>
        <div class="ig-unsave-stat"><span class="label">Done</span><span class="value" data-field="processed">0</span></div>
        <div class="ig-unsave-stat"><span class="label">Failed</span><span class="value" data-field="failed">0</span></div>
      </div>
      <div class="ig-unsave-progress-track">
        <div class="ig-unsave-progress-fill" data-field="progressFill"></div>
      </div>
      <div class="ig-unsave-status" data-field="status">Idle</div>
    `;
  }

  update(state) {
    const { totalFound = 0, processed = 0, failed = 0, status = 'idle' } = state;

    this.root.querySelector('[data-field="totalFound"]').textContent = totalFound;
    this.root.querySelector('[data-field="processed"]').textContent = processed;
    this.root.querySelector('[data-field="failed"]').textContent = failed;
    this.root.querySelector('[data-field="status"]').textContent =
      status.charAt(0).toUpperCase() + status.slice(1);

    const pct = totalFound > 0 ? Math.min(100, Math.round((processed / totalFound) * 100)) : 0;
    this.root.querySelector('[data-field="progressFill"]').style.width = `${pct}%`;
  }
};