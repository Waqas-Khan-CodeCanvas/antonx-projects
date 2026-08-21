import { useEffect, useState } from "react";
import { getAdminStats } from "../api/protected";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";

export default function AdminStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [viewedBy, setViewedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats(token)
      .then((data) => {
        setStats(data.stats);
        setViewedBy(data.viewedBy);
      })
      .catch(() => setError("Failed to load stats (admin role required)"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin stats</h1>
      <p className="mt-1 text-sm text-slate-500">GET /api/admin/stats — requires Bearer token + admin role.</p>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Products" value={stats.productCount} tone="indigo" />
              <StatCard label="Orders" value={stats.orderCount} tone="emerald" />
              <StatCard label="Users" value={stats.userCount} tone="amber" />
            </div>
            <p className="mt-4 text-xs text-slate-400">Viewed by {viewedBy}</p>
          </>
        )}
      </div>
    </div>
  );
}