// import {   Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper dark:border-line-dark dark:bg-ink">
      <div className="container-page flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold">Waqas Khan</p>
          <p className="mt-1 font-mono text-xs text-ink-soft dark:text-paper/50">Built with React · Tailwind CSS · Vite</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/Waqas-Khan-CodeCanvas" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-ink-soft transition hover:text-indigo dark:text-paper/60">
            {/* <Github size={18} /> */}
          </a>
          <a href="https://waqaskhan.netlify.app" target="_blank" rel="noreferrer" aria-label="Portfolio" className="text-ink-soft transition hover:text-indigo dark:text-paper/60">
            {/* <Linkedin size={18} /> */}
          </a>
          <a href="mailto:hello@example.com" aria-label="Email" className="text-ink-soft transition hover:text-indigo dark:text-paper/60">
            {/* <Mail size={18} /> */}
          </a>
        </div>
        <p className="font-mono text-xs text-ink-soft dark:text-paper/40">© {new Date().getFullYear()} — all rights reserved</p>
      </div>
    </footer>
  )
}