// Central config — the single place to tune selectors, timing, and limits
// when Instagram changes its markup.

window.IGUnsave = window.IGUnsave || {};

IGUnsave.CONFIG = {
  SELECTORS: {
    // Anchors linking to individual posts/reels inside the saved grid.
    POST_LINK: 'a[href*="/p/"], a[href*="/reel/"]',

    // How many parentElement hops from the anchor to reach the full grid
    // cell (the element that reveals the hover overlay with the save icon).
    // Inspect the saved grid in DevTools and adjust if this stops matching.
    TILE_ANCESTOR_LEVELS: 3,

    // svg[aria-label] values Instagram uses for the "already saved" icon
    // (clicking it un-saves the post). Update if IG changes the label text.
    SAVE_BUTTON_SVG_SELECTOR: 'svg[aria-label]',
    SAVE_BUTTON_ARIA_LABELS: ['Remove', 'Unsave'],
  },

  TIMING: {
    MIN_DELAY_MS: 1500,
    MAX_DELAY_MS: 3500,
    SCROLL_DELAY_MS: 1200,
    ACTION_TIMEOUT_MS: 8000,
    RETRY_DELAY_MS: 4000,
    PAUSE_EVERY_N_ACTIONS: 25,
    PAUSE_DURATION_MS: 30000,
  },

  LIMITS: {
    MAX_RETRIES: 2,
  },

  STORAGE_KEYS: {
    STATE: 'igUnsaveState',
  },
};