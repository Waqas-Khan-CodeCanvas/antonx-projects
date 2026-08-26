import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import Badge from '../components/ui/Badge'

const ACCENT_BORDER = {
  indigo: 'before:bg-indigo',
  amber: 'before:bg-amber',
  positive: 'before:bg-positive',
  negative: 'before:bg-negative',
}

export default function Projects() {
  return (
    <section id="projects" className="container-page py-20">
      <p className="eyebrow">projects</p>
      <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Four modules, one workbench.</h2>
      <p className="mt-3 max-w-xl text-ink-soft dark:text-paper/60">
        Each card below opens a fully working front-end — not a mockup.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={project.route}
            className={`group relative overflow-hidden rounded-xl border border-line bg-surface p-6 pl-7 shadow-sm transition hover:-translate-y-1 hover:shadow-panel before:absolute before:inset-y-0 before:left-0 before:w-1.5 dark:border-line-dark dark:bg-ink-2 ${ACCENT_BORDER[project.accent]}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold">{project.name}</h3>
                <p className="mt-2 text-sm text-ink-soft dark:text-paper/60">{project.tagline}</p>
              </div>
              <ArrowUpRight size={18} className="mt-1 shrink-0 text-ink-soft transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-indigo dark:text-paper/40" />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge tone="indigo">{project.status}</Badge>
              {project.stack.map((tech) => (
                <span key={tech} className="font-mono text-[11px] text-ink-soft dark:text-paper/40">
                  #{tech.toLowerCase().replace(/\s+/g, '-')}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}