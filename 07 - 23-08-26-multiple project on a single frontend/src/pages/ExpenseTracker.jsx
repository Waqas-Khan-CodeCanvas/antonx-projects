import { useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageChrome from '../components/layout/PageChrome'
import ExpenseForm from '../features/expense/ExpenseForm'
import ExpenseList from '../features/expense/ExpenseList'
import SummaryCards from '../features/expense/SummaryCards'

export default function ExpenseTracker() {
  const [entries, setEntries] = useLocalStorage('ledger:entries', [])

  const addEntry = (entry) => {
    setEntries((prev) => [{ id: crypto.randomUUID(), createdAt: Date.now(), ...entry }, ...prev])
  }

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const totals = useMemo(() => {
    const income = entries.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0)
    const expense = entries.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
    return { income, expense, balance: income - expense }
  }, [entries])

  return (
    <div>
      <PageChrome
        eyebrow="module 03"
        title="Ledger"
        description="Track income and expenses. Totals update as you go."
        meta={`${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`}
      />

      <div className="container-page max-w-3xl py-12">
        <SummaryCards {...totals} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ExpenseForm onAdd={addEntry} />
          <ExpenseList entries={entries} onDelete={deleteEntry} />
        </div>
      </div>
    </div>
  )
}