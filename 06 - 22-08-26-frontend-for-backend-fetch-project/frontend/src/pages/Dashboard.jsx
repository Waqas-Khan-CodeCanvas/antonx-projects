import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth } from "../api/protected";
import { getProducts } from "../api/products";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [health, setHealth] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getHealth(), getProducts()])
      .then(([h, products]) => {
        if (!active) return;
        setHealth(h);
        setProductCount(products.length);
      })
      .catch(() => active && setHealth(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {isAuthenticated ? `Welcome back, ${user.username}` : "Welcome"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A production-style React client for the Fetch & Axios Student Lab API.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="API status" value={loading ? "Checking..." : health ? "Online" : "Offline"} tone={health ? "emerald" : "red"} />
        <StatCard label="Products" value={loading ? "—" : productCount} tone="indigo" />
        <StatCard label="Session" value={isAuthenticated ? "Authenticated" : "Guest"} tone={isAuthenticated ? "emerald" : "amber"} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/products" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <h3 className="font-semibold text-slate-900">Browse products</h3>
          <p className="mt-1 text-sm text-slate-500">Full CRUD: GET, POST, PUT, PATCH, DELETE.</p>
        </Link>
        <Link to="/orders" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <h3 className="font-semibold text-slate-900">Place an order</h3>
          <p className="mt-1 text-sm text-slate-500">Protected route using a Bearer token.</p>
        </Link>
        <Link to="/playground" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
          <h3 className="font-semibold text-slate-900">API playground</h3>
          <p className="mt-1 text-sm text-slate-500">Build and send raw requests to any endpoint.</p>
        </Link>
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
          <Spinner size="sm" /> Loading live status...
        </div>
      )}
    </div>
  );
}