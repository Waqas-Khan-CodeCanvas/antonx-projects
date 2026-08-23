import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PageChrome({ eyebrow, title, description, meta }) {
  return (
    <div className="border-b border-line bg-surface dark:border-line-dark dark:bg-ink-2">
      <div className="container-page py-8">
        <Link to="/#projects" className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-soft transition hover:text-indigo dark:text-paper/50">
          <ArrowLeft size={14} /> back to portfolio
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 max-w-xl text-sm text-ink-soft dark:text-paper/60">{description}</p>}
          </div>
          {meta && <div className="font-mono text-xs text-ink-soft dark:text-paper/50">{meta}</div>}
        </div>
      </div>
    </div>
  )
}