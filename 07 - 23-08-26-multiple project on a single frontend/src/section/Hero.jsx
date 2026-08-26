export default function Hero() {
  return (
    <section id="home" className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="animate-rise">
        <p className="eyebrow">full-stack developer · UET Peshawar</p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
          I build small tools that
          <span className="text-indigo"> work properly</span>, not just look finished.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft dark:text-paper/60">
          Computer Science student and full-stack developer. This page is also a workbench —
          the four modules below are complete, working front-ends, not screenshots.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-indigo dark:bg-indigo dark:text-ink">
            View the modules
          </a>
          <a href="#contact" className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:border-indigo hover:text-indigo dark:border-line-dark dark:text-paper">
            Get in touch
          </a>
        </div>
      </div>

      <div className="animate-rise [animation-delay:120ms]">
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel dark:border-line-dark dark:bg-ink-2">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-3 dark:border-line-dark">
            <span className="h-2.5 w-2.5 rounded-full bg-negative/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-positive/70" />
            <span className="ml-3 font-mono text-xs text-ink-soft dark:text-paper/40">status.json</span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-ink-soft dark:text-paper/70">
{`{
  "role": "Full Stack Developer",
  "based_in": "Pakistan",
  "currently": "BS Computer Science, class of 2028",
  "stack": ["React", "Node.js", "Tailwind"],
  "modules_shipped": 4,
  "status": "available for opportunities"
}`}
          </pre>
        </div>
      </div>
    </section>
  )
}