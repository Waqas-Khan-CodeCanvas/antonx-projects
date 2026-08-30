export default function About() {
  const stats = [
    { label: 'Modules shipped', value: '04' },
    { label: 'Years coding', value: '03+' },
    { label: 'PyPI packages', value: '01' },
  ]

  return (
    <section id="about" className="border-y border-line bg-surface py-20 dark:border-line-dark dark:bg-ink-2">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">about</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Grounded in fundamentals, not frameworks.</h2>
        </div>
        <div className="space-y-6 text-ink-soft dark:text-paper/60">
          <p className="leading-relaxed">
            I'm Waqas, a Computer Science student at UET Peshawar and a full-stack developer.
            I care about the parts of front-end work that don't show up in a screenshot: state
            that doesn't drift, forms that validate honestly, and interfaces that hold up once
            real data and real edge cases show up.
          </p>
          <p className="leading-relaxed">
            This page doubles as a small proving ground — every project below is a working
            front-end built from scratch, wired to local storage or a live API, ready to be
            connected to a real back end.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-2">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-indigo pl-4">
                <p className="font-display text-2xl font-semibold text-ink dark:text-paper">{stat.value}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}