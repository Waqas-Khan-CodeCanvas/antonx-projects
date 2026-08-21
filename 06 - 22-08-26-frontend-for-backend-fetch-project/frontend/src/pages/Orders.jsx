import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { createOrder } from "../api/protected";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Orders() {
  const { token } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        if (data.length) setProductId(String(data[0].id));
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createOrder({ productId: Number(productId), quantity: Number(quantity) }, token);
      setOrders((prev) => [result, ...prev]);
      toast.success(`Order placed for ${result.product.name}`);
      setQuantity(1);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
      <p className="mt-1 text-sm text-slate-500">POST /api/orders — protected with your Bearer token.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-slate-900">Place an order</h2>
          {loading ? (
            <div className="mt-6 flex justify-center"><Spinner /></div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — ${p.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !products.length}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </div>
          )}
        </form>

        <div className="lg:col-span-3">
          <h2 className="mb-3 font-semibold text-slate-900">This session's orders</h2>
          {orders.length === 0 ? (
            <EmptyState title="No orders yet" description="Orders you place will show up here." />
          ) : (
            <ul className="space-y-3">
              {orders.map(({ order, product, orderedBy }) => (
                <li key={order.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{order.quantity} × {product.name}</p>
                    <span className="text-xs text-slate-400">#{order.id}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Ordered by {orderedBy} · {new Date(order.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}