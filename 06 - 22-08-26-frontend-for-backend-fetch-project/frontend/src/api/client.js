/**
 * Central fetch wrapper.
 * - Prefixes requests with API_BASE (same-origin on :3000, otherwise localhost:3000)
 * - Unwraps the API's { data } / { error } envelope
 * - Throws ApiError with a readable message on non-2xx responses
 */
const API_BASE =
  window.location.port === "3000" || window.location.port === ""
    ? ""
    : "http://localhost:3000";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, { method = "GET", body, token, headers = {} } = {}) {
  const opts = {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, opts);
  } catch {
    throw new ApiError("Network error — is the backend running on port 3000?", 0, null);
  }

  const text = await res.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message = payload?.error || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, payload);
  }

  return payload?.data;
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};