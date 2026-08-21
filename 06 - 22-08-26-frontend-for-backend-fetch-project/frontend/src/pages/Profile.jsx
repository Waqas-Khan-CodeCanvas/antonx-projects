import { useEffect, useState } from "react";
import { getMe } from "../api/protected";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Badge from "../components/Badge";

export default function Profile() {
  const { token } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMe(token)
      .then((data) => setMe(data.user))
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">GET /api/me — proves your Bearer token round-trips correctly.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <dl className="divide-y divide-slate-100">
            <div className="flex justify-between py-3">
              <dt className="text-sm text-slate-500">User ID</dt>
              <dd className="text-sm font-medium text-slate-900">{me.id}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-slate-500">Username</dt>
              <dd className="text-sm font-medium text-slate-900">{me.username}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-slate-500">Role</dt>
              <dd><Badge tone={me.role === "admin" ? "amber" : "indigo"}>{me.role}</Badge></dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-sm text-slate-500">Token</dt>
              <dd className="font-mono text-xs text-slate-500">{`token-${me.id}-${me.role}`}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}