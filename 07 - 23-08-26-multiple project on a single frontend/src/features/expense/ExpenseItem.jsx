import { Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react'

const formatAmount = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function ExpenseItem({ entry, onDelete }) {
  const isIncome = entry.type === 'income'
  return (
    <li className="group flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 dark:border-line-dark dark:bg-ink-2">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isIncome ? 'bg-positive-100 text-positive dark:bg-positive/15' : 'bg-negative-100 text-negative dark:bg-negative/15'}`}>
        {isIncome ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{entry.description}</p>
        <p className="font-mono text-[11px] text-ink-soft dark:text-paper/40">
          {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <span className={`font-mono text-sm font-medium ${isIncome ? 'text-positive' : 'text-negative'}`}>
        {isIncome ? '+' : '-'}{formatAmount(entry.amount)}
      </span>
      <button onClick={() => onDelete(entry.id)} aria-label="Delete entry" className="text-ink-soft opacity-0 transition hover:text-negative group-hover:opacity-100 dark:text-paper/40">
        <Trash2 size={15} />
      </button>
    </li>
  )
}