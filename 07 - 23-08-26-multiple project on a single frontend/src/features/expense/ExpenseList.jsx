import { Receipt } from 'lucide-react'
import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ entries, onDelete }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line py-16 text-center dark:border-line-dark">
        <Receipt className="mx-auto text-ink-soft dark:text-paper/30" size={28} />
        <p className="mt-3 text-sm text-ink-soft dark:text-paper/50">No entries yet — add your first one.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <ExpenseItem key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </ul>
  )
}