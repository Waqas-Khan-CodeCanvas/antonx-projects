export default function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-line/60 text-ink-soft dark:bg-line-dark/60 dark:text-paper/60',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo/15 dark:text-indigo',
    positive: 'bg-positive-100 text-positive-700 dark:bg-positive/15 dark:text-positive',
    negative: 'bg-negative-100 text-negative-700 dark:bg-negative/15 dark:text-negative',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber/15 dark:text-amber',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}