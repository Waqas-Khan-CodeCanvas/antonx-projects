const formatAmount = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function SummaryCards({ income, expense, balance }) {
  const cards = [
    { label: 'Balance', value: balance, tone: balance >= 0 ? 'text-ink dark:text-paper' : 'text-negative' },
    { label: 'Income', value: income, tone: 'text-positive' },
    { label: 'Expenses', value: expense, tone: 'text-negative' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-line bg-surface p-4 dark:border-line-dark dark:bg-ink-2">
          <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-paper/40">{card.label}</p>
          <p className={`mt-1.5 font-display text-xl font-semibold sm:text-2xl ${card.tone}`}>{formatAmount(card.value)}</p>
        </div>
      ))}
    </div>
  )
}