import { useCallback, useEffect, useRef, useState } from 'react'
import { person } from './data.js'

const KEY = import.meta.env.VITE_WEB3FORMS_KEY

function ContactForm({ onDone }) {
  const [values, setValues] = useState({ name: '', email: '', message: '', botcheck: false })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!values.name.trim()) er.name = 'Add your name so I know who to reply to.'
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) er.email = 'Enter an email address I can reply to.'
    if (values.message.trim().length < 2) er.message = 'Write a message first.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending' || !validate()) return
    if (!KEY) {
      // No key configured yet: fall back to the visitor's mail app.
      const body = encodeURIComponent(`${values.message}\n\n${values.name} (${values.email})`)
      window.location.href = `mailto:${person.email}?subject=${encodeURIComponent('Hello from your website')}&body=${body}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          subject: `New message from ${values.name} via your website`,
          from_name: 'Portfolio contact form',
          name: values.name,
          email: values.email,
          message: values.message,
          botcheck: values.botcheck,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStatus('sent')
      setValues({ name: '', email: '', message: '', botcheck: false })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-done" role="status">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <p className="form-done-title">Message sent</p>
        <p className="muted">Thanks for writing. I’ll reply within a couple of days.</p>
        <button type="button" className="btn btn-secondary" onClick={() => { setStatus('idle'); onDone?.() }}>Send another</button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" autoComplete="name" placeholder="Lucky Baraka" value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'cf-name-err' : undefined} />
        {errors.name && <p className="field-error" id="cf-name-err">{errors.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="cf-email">Your email</label>
        <input id="cf-email" type="email" autoComplete="email" inputMode="email" placeholder="luckybaraka21@gmail.com" value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'cf-email-err' : undefined} />
        {errors.email && <p className="field-error" id="cf-email-err">{errors.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" rows="5" placeholder="What’s on your mind?" value={values.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'cf-message-err' : undefined} />
        {errors.message && <p className="field-error" id="cf-message-err">{errors.message}</p>}
      </div>
      {/* Honeypot: people never see it, bots fill it in. */}
      <input type="checkbox" name="botcheck" className="honeypot" tabIndex={-1} autoComplete="off" checked={values.botcheck} onChange={set('botcheck')} aria-hidden="true" />
      {status === 'error' && (
        <p className="form-error" role="alert">
          Your message didn’t go through. Try again, or email me at <a href={`mailto:${person.email}`}>{person.email}</a>.
        </p>
      )}
      <button className="btn btn-primary" type="submit" aria-busy={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

// Bottom sheet for phones. Drag the handle down to close; a quick flick also closes it.
function Sheet({ open, onClose, children }) {
  const [y, setY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    if (!open) return
    setY(0)
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector('input')?.focus({ preventScroll: true })
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { start: e.clientY - y, lastY: e.clientY, lastT: e.timeStamp, v: 0 }
    setDragging(true)
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    const dt = e.timeStamp - d.lastT || 1
    d.v = (e.clientY - d.lastY) / dt
    d.lastY = e.clientY
    d.lastT = e.timeStamp
    const raw = e.clientY - d.start
    // Rubber band when pulled up past the top.
    setY(raw < 0 ? raw / 4 : raw)
  }
  const up = () => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (!d) return
    // Project where the flick would land, the way iOS sheets decide.
    const projected = y + d.v * 200
    if (projected > (panel.current?.offsetHeight ?? 500) * 0.4) onClose()
    else setY(0)
  }

  if (!open) return null
  return (
    <div className="sheet-root">
      <div className="sheet-scrim" onClick={onClose} />
      <div
        ref={panel}
        className={`sheet ${dragging ? 'is-dragging' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Send me a message"
        style={{ transform: `translateY(${Math.round(y)}px)` }}
      >
        <div className="sheet-handle" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <span />
        </div>
        <div className="sheet-head">
          <h3>Send me a message</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Contact() {
  const [sheet, setSheet] = useState(false)
  const close = useCallback(() => setSheet(false), [])
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact-copy">
        <h2 id="contact-title">Say hello</h2>
        <p className="muted">A question about a project, an idea you want to build, or something you read on the blog. All welcome. I usually reply within a couple of days.</p>
        <ul className="contact-list">
          <li><span className="muted">Email</span><a href={`mailto:${person.email}`}>{person.email}</a></li>
          <li><span className="muted">Phone</span><a href={`tel:${person.phone}`}>{person.phoneDisplay}</a></li>
          <li><span className="muted">LinkedIn</span><a href={person.linkedin} target="_blank" rel="noreferrer">lucky-baraka</a></li>
          <li><span className="muted">GitHub</span><a href={person.github} target="_blank" rel="noreferrer">luckybaraka</a></li>
          <li><span className="muted">Blog</span><a href={person.blog} target="_blank" rel="noreferrer">luckybaraka.github.io</a></li>
        </ul>
        <button className="btn btn-primary only-mobile" onClick={() => setSheet(true)}>Write a message</button>
      </div>
      <div className="contact-form only-desktop">
        <ContactForm />
      </div>
      <Sheet open={sheet} onClose={close}>
        <ContactForm onDone={close} />
      </Sheet>
    </section>
  )
}
