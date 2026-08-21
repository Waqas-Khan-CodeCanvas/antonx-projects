/**
 * Shared config for all lesson pages.
 *
 * Prefer npm start → http://localhost:3000 (same origin, API_BASE stays "").
 * If you open HTML via Live Server (e.g. port 5500), API points at Express on 3000.
 */
const API_BASE =
  location.port === "3000" || location.port === ""
    ? ""
    : "http://localhost:3000";

/** Pretty-print JSON into a <pre> element */
function showJson(el, value) {
  el.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

/** Update status banner: loading | ok | err */
function setStatus(el, type, message) {
  el.className = "status show " + type;
  el.textContent = message;
}

function clearStatus(el) {
  el.className = "status";
  el.textContent = "";
}
