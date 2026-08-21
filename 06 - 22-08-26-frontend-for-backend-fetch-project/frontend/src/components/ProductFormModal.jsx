import { useEffect, useState } from "react";
import Modal from "./Modal";

const emptyForm = { name: "", price: "" };

export default function ProductFormModal({ open, onClose, onSubmit, initialProduct, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initialProduct ? { name: initialProduct.name, price: String(initialProduct.price) } : emptyForm
      );
      setErrors({});
    }
  }, [open, initialProduct]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    const priceNum = Number(form.price);
    if (form.price === "" || Number.isNaN(priceNum) || priceNum < 0) {
      next.price = "Price must be a number ≥ 0";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: form.name.trim(), price: Number(form.price) });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialProduct ? "Edit product" : "New product"}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Saving..." : initialProduct ? "Save changes" : "Create product"}
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="e.g. Notebook"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            placeholder="0.00"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>
      </form>
    </Modal>
  );
}