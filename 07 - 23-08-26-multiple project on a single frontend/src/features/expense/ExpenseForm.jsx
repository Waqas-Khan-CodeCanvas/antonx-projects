import { useState } from 'react'
import { Plus } from 'lucide-react'

const initial = { description: '', amount: '', type: 'expense' }

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.description.trim()) nextErrors.description = 'Add a description.'
    const amount = Number(form.amount)
    if (!form.amount || Number.isNaN(amount) || amount <= 0) nextErrors.amount = 'Enter an amount greater than 0.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    onAdd({ description: form.description.trim(), amount, type: form.type })
    setForm(initial)
  }

  return (
    <form onSubmit={handleSubmit} className="h-fit rounded-xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-ink-2">
      <h2 className="font-display text-lg font-semibold">New entry</h2>

      <div className="mt-4 flex gap-1 rounded-md border border-line p-1 dark:border-line-dark">
        {['expense', 'income'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setForm((f) => ({ ...f, type }))}
            className={`flex-1 rounded px-3 py-1.5 text-xs font-medium capitalize transition ${
              form.type === type
                ? type === 'income' ? 'bg-positive text-white' : 'bg-negative text-white'
                : 'text-ink-soft hover:text-ink dark:text-paper/50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">Description</label>
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="e.g. Freelance payment"
          className={`w-full rounded-md border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-indigo ${errors.description ? 'border-negative' : 'border-line dark:border-line-dark'}`}
        />
        {errors.description && <p className="mt-1 text-xs text-negative">{errors.description}</p>}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">Amount</label>
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          inputMode="decimal"
          placeholder="0.00"
          className={`w-full rounded-md border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-indigo ${errors.amount ? 'border-negative' : 'border-line dark:border-line-dark'}`}
        />
        {errors.amount && <p className="mt-1 text-xs text-negative">{errors.amount}</p>}
      </div>

      <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-indigo dark:bg-indigo dark:text-ink">
        <Plus size={16} /> Add entry
      </button>
    </form>
  )
}