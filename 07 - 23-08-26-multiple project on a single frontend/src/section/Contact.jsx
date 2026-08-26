import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { validateContactForm } from '../utils/validators'

const initialForm = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sent

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateContactForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setStatus('sent')
      setForm(initialForm)
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="contact" className="border-t border-line bg-surface py-20 dark:border-line-dark dark:bg-ink-2">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">contact</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Let's build something.</h2>
          <p className="mt-4 max-w-sm text-ink-soft dark:text-paper/60">
            Open to internships, freelance front-end work, and collaboration on real products.
            The form validates on submit — no back end wired up yet, so nothing is sent.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded-md border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-indigo ${errors.name ? 'border-negative' : 'border-line dark:border-line-dark'}`}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-negative">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full rounded-md border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-indigo ${errors.email ? 'border-negative' : 'border-line dark:border-line-dark'}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-negative">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-paper/50">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className={`w-full resize-none rounded-md border bg-transparent px-4 py-2.5 text-sm outline-none transition focus:border-indigo ${errors.message ? 'border-negative' : 'border-line dark:border-line-dark'}`}
              placeholder="What are you looking to build?"
            />
            {errors.message && <p className="mt-1 text-xs text-negative">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-indigo dark:bg-indigo dark:text-ink"
          >
            {status === 'sent' ? <><CheckCircle2 size={16}/> Message ready</> : <><Send size={16} /> Send message</>}
          </button>
          {status === 'sent' && (
            <p className="text-sm text-positive">Validated and ready to send — connect a back end to deliver it.</p>
          )}
        </form>
      </div>
    </section>
  )
}