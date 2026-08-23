import { useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageChrome from '../components/layout/PageChrome'
import TodoInput from '../features/todo/TodoInput'
import TodoFilters from '../features/todo/TodoFilters'
import TodoItem from '../features/todo/TodoItem'
import { ListChecks } from 'lucide-react'

const FILTERS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' }

export default function TodoApp() {
  const [tasks, setTasks] = useLocalStorage('todo:tasks', [])
  const [filter, setFilter] = useState(FILTERS.ALL)

  const addTask = (title) => {
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() },
      ...prev,
    ])
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }

  const visibleTasks = useMemo(() => {
    if (filter === FILTERS.ACTIVE) return tasks.filter((t) => !t.completed)
    if (filter === FILTERS.COMPLETED) return tasks.filter((t) => t.completed)
    return tasks
  }, [tasks, filter])

  const activeCount = tasks.filter((t) => !t.completed).length

  return (
    <div>
      <PageChrome
        eyebrow="module 01"
        title="Task Board"
        description="Add, complete, and filter tasks. Everything persists to local storage."
        meta={`${activeCount} item${activeCount === 1 ? '' : 's'} left`}
      />

      <div className="container-page max-w-2xl py-12">
        <TodoInput onAdd={addTask} />

        {tasks.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line py-16 text-center dark:border-line-dark">
            <ListChecks className="mx-auto text-ink-soft dark:text-paper/30" size={28} />
            <p className="mt-3 text-sm text-ink-soft dark:text-paper/50">No tasks yet — add your first one above.</p>
          </div>
        ) : (
          <>
            <TodoFilters filter={filter} onChange={setFilter} onClearCompleted={clearCompleted} hasCompleted={tasks.some((t) => t.completed)} />
            <ul className="mt-4 space-y-2">
              {visibleTasks.map((task) => (
                <TodoItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
              {visibleTasks.length === 0 && (
                <li className="rounded-lg border border-line py-8 text-center text-sm text-ink-soft dark:border-line-dark dark:text-paper/40">
                  Nothing here for this filter.
                </li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}