import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

export default function Products() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setFormOpen(true);
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateProduct(editing.id, values);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(`"${updated.name}" updated`);
      } else {
        const created = await createProduct(values);
        setProducts((prev) => [...prev, created]);
        toast.success(`"${created.name}" created`);
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">GET, POST, PUT, PATCH and DELETE against /api/products.</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          + New product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to get started."
          action={
            <button onClick={openCreate} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              + New product
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-sm text-slate-500">#{product.id}</td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right text-sm">
                    <button onClick={() => openEdit(product)} className="mr-3 font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                    <button onClick={() => setDeleteTarget(product)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initialProduct={editing} submitting={submitting} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}