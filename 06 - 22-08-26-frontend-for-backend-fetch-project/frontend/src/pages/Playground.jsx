import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const API_BASE =
  window.location.port === "3000" || window.location.port === "" ? "" : "http://localhost:3000";

export default function Playground() {
  const { token } = useAuth();
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/api/products");
  const [body, setBody] = useState('{\n  "name": "Pen",\n  "price": 2\n}');
  const [useAuthHeader, setUseAuthHeader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function send() {
    setLoading(true);
    setResult(null);
    const start = performance.now();
    try {
      const headers = {};
      let payload;
      if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
        headers["Content-Type"] = "application/json";
        payload = body;
      }
      if (useAuthHeader && token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
      setResult({ status: res.status, ok: res.ok, ms: Math.round(performance.now() - start), body: parsed });
    } catch (err) {
      setResult({ status: 0, ok: false, ms: Math.round(performance.now() - start), body: { error: err.message } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">API playground</h1>
      <p className="mt-1 text-sm text-slate-500">Send a raw request to any endpoint on the Lab API using fetch.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 sm:w-32"
          >
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="/api/products"
          />
          <button
            onClick={send}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading && <Spinner size="sm" className="border-white/40 border-t-white" />}
            Send
          </button>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={useAuthHeader} onChange={(e) => setUseAuthHeader(e.target.checked)} />
          Send Authorization: Bearer {token ? "•••" : "(log in first)"}
        </label>

        {["POST", "PUT", "PATCH"].includes(method) && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">JSON body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-3 text-sm">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${result.ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                {result.status || "ERR"}
              </span>
              <span className="text-slate-400">{result.ms} ms</span>
            </div>
            <pre className="max-h-80 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
{JSON.stringify(result.body, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}