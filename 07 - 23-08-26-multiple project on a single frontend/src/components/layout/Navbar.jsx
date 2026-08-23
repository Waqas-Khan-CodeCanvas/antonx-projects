import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const NAV_ITEMS = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Contact', hash: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur dark:border-line-dark dark:bg-ink/85">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-mono text-sm text-paper dark:bg-indigo dark:text-ink">WK</span>
          Waqas Khan
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.hash}
              to={onHome ? item.hash : `/${item.hash}`}
              className="text-sm font-medium text-ink-soft transition hover:text-indigo dark:text-paper/70 dark:hover:text-indigo"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-soft transition hover:border-indigo hover:text-indigo dark:border-line-dark dark:text-paper/70"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-soft md:hidden dark:border-line-dark dark:text-paper/70"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line px-6 py-4 md:hidden dark:border-line-dark">
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.hash}>
                <Link
                  to={onHome ? item.hash : `/${item.hash}`}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-ink-soft dark:text-paper/70"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}