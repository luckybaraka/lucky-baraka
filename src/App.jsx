import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { person, hero, about, facts, quotes, stack, projects, achievements, blogCategories } from './data.js'
import { useFeed, postsIn, formatDate } from './feed.js'
import Contact from './Contact.jsx'

/* ---------- tiny hash router: #/ for home, #/blog or #/blog/<category> ---------- */
function useRoute() {
  const read = () => {
    const parts = window.location.hash.replace(/^#\/?/, '').split('/')
    return parts[0] === 'blog' ? { page: 'blog', cat: parts[1] || 'all' } : { page: 'home' }
  }
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })

/* ---------- nav ---------- */
function Nav({ route, weather }) {
  const [pending, setPending] = useState(null)
  useEffect(() => {
    if (pending && route.page === 'home') { requestAnimationFrame(() => scrollToId(pending)); setPending(null) }
  }, [pending, route.page])

  const go = (id) => (e) => {
    e.preventDefault()
    if (route.page !== 'home') { window.location.hash = '#/'; setPending(id) } else scrollToId(id)
  }
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href="#/" onClick={(e) => { if (route.page === 'home') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}>
          <img src={person.photo} alt="" width="28" height="28" />
          <span>Lucky Baraka</span>
        </a>
        <WeatherReadout weather={weather} />
        <nav aria-label="Main">
          <a href="#/" onClick={go('about')} className="hide-sm">About</a>
          <a href="#/" onClick={go('projects')} className="hide-sm">Projects</a>
          <a href="#/blog" aria-current={route.page === 'blog' ? 'page' : undefined}>Writing</a>
          <a href="#/" onClick={go('contact')} className="nav-cta">Contact</a>
        </nav>
      </div>
    </header>
  )
}

/* ---------- failover drawing: one server goes down, traffic keeps flowing ---------- */
function Failover() {
  const server = (cx, extra = {}) => (
    <g>
      <rect x={cx - 30} y="92" width="60" height="34" rx="7" className="fo-server" {...extra} />
      <line x1={cx - 20} y1="104" x2={cx + 6} y2="104" className="fo-rack" />
      <line x1={cx - 20} y1="114" x2={cx + 6} y2="114" className="fo-rack" />
    </g>
  )
  return (
    <figure className="failover">
      <svg viewBox="0 0 300 150" role="img" aria-labelledby="fo-t">
        <title id="fo-t">A load balancer sends traffic to three servers. The middle server goes down, traffic keeps flowing to the other two, and the failed server comes back up.</title>
        <line x1="150" y1="38" x2="60" y2="92" className="fo-link" />
        <line x1="150" y1="38" x2="150" y2="92" className="fo-link fo-link-mid" />
        <line x1="150" y1="38" x2="240" y2="92" className="fo-link" />
        <circle cx="150" cy="38" r="4" className="fo-packet fo-l" />
        <circle cx="150" cy="38" r="4" className="fo-packet fo-r" />
        <g className="fo-mid-traffic"><circle cx="150" cy="38" r="4" className="fo-packet fo-m" /></g>
        <rect x="105" y="8" width="90" height="30" rx="8" className="fo-lb" />
        <text x="150" y="27" textAnchor="middle" className="fo-lb-text">load balancer</text>
        {server(60)}
        {server(150, { className: 'fo-server fo-server-mid' })}
        {server(240)}
        <circle cx="80" cy="109" r="4" className="fo-dot" />
        <circle cx="170" cy="109" r="4" className="fo-dot fo-dot-mid" />
        <circle cx="260" cy="109" r="4" className="fo-dot" />
        <text x="60" y="144" textAnchor="middle" className="fo-label">up</text>
        <text x="150" y="144" textAnchor="middle" className="fo-label fo-up">up</text>
        <text x="150" y="144" textAnchor="middle" className="fo-label fo-down">down, traffic rerouted</text>
        <text x="240" y="144" textAnchor="middle" className="fo-label">up</text>
      </svg>
      <figcaption>
        <span className="quote-text">“{quotes.about.text}”</span>
        <span className="quote-by">{quotes.about.by}</span>
      </figcaption>
    </figure>
  )
}

/* ---------- scroll progress: a sideways bar that fills and shows how far down the page you are ---------- */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="scroll-progress-track">
        <span className="scroll-progress-bar" style={{ transform: `scaleX(${pct / 100})` }} />
      </span>
      <span className="scroll-progress-pct">{pct}%</span>
    </div>
  )
}

/* ---------- weather: drives the site's mood and a live date/time/weather readout ---------- */
// WMO weather codes (open-meteo) mapped to a plain-English label.
const WX_LABEL = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Violent showers',
  85: 'Snow showers', 86: 'Snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
}
const MOOD_ICON = { sunny: '☀️', rain: '🌧️', cold: '❄️', calm: '☁️' }

// Reduce a weather code + temperature to one of four site moods.
function moodFromWeather(code, temp, isDay) {
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'cold'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return 'rain'
  if (typeof temp === 'number' && temp <= 8) return 'cold'
  if ((code === 0 || code === 1) && isDay) return 'sunny'
  return 'calm'
}

// Find the visitor's location by IP (falls back to Nairobi), then fetch current weather.
function useWeather() {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let lat = -1.2921, lon = 36.8219, city = 'Nairobi'
      try {
        const g = await fetch('https://ipapi.co/json/').then((r) => (r.ok ? r.json() : null))
        if (g && typeof g.latitude === 'number' && typeof g.longitude === 'number') {
          lat = g.latitude; lon = g.longitude; city = g.city || city
        }
      } catch { /* keep the Nairobi fallback */ }
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`
        const w = await fetch(url).then((r) => (r.ok ? r.json() : null))
        if (!cancelled && w?.current) {
          setWeather({
            city,
            temp: Math.round(w.current.temperature_2m),
            code: w.current.weather_code,
            isDay: w.current.is_day === 1,
          })
        }
      } catch { /* leave weather null: readout still shows date and time, no mood applied */ }
    })()
    return () => { cancelled = true }
  }, [])
  return weather
}

// A clock that ticks every second.
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

// Full-screen mood overlay: rain streaks, drifting snow, or a warm sun glow.
function WeatherLayer({ mood }) {
  const [rain] = useState(() => Array.from({ length: 50 }, () => ({
    left: Math.random() * 100, delay: Math.random() * 2, dur: 0.5 + Math.random() * 0.6, h: 10 + Math.random() * 10,
  })))
  const [snow] = useState(() => Array.from({ length: 28 }, () => ({
    left: Math.random() * 100, delay: Math.random() * 6, dur: 6 + Math.random() * 6, size: 3 + Math.random() * 5, drift: Math.random() * 40 - 20,
  })))
  if (!mood) return null
  return (
    <div className={`wx-layer wx-${mood}`} aria-hidden="true">
      {mood === 'rain' && rain.map((d, i) => (
        <span key={i} className="wx-rain-drop" style={{ left: `${d.left}%`, height: `${d.h}%`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
      ))}
      {mood === 'cold' && snow.map((d, i) => (
        <span key={i} className="wx-snow-flake" style={{ left: `${d.left}%`, width: `${d.size}px`, height: `${d.size}px`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, '--drift': `${d.drift}px` }} />
      ))}
      {mood === 'sunny' && <span className="wx-sun" />}
    </div>
  )
}

// The date / time / weather line shown in the navbar.
function WeatherReadout({ weather }) {
  const now = useClock()
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
  const mood = weather && moodFromWeather(weather.code, weather.temp, weather.isDay)
  return (
    <div className="nav-meta" aria-label="Local date, time and weather">
      <span className="wx-time">{time}</span>
      <span className="wx-date">{date}</span>
      {weather && (
        <span className="wx-cond">
          <span className="wx-icon" aria-hidden="true">{MOOD_ICON[mood]}</span>
          <span className="wx-temp">{weather.temp}°C</span>
          <span className="wx-desc">{WX_LABEL[weather.code] || 'Weather'} in {weather.city}</span>
        </span>
      )}
    </div>
  )
}

function Hero({ onContact }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-role">{person.role}</p>
        <h1 id="hero-title">{hero.greeting}</h1>
        <p className="hero-lead">{hero.lead}</p>
        <p className="hero-aside">{hero.aside}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onContact}>Email me</button>
          <a className="btn btn-secondary" href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="btn btn-secondary" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="hero-side">
        <div className="portrait">
          <img src={person.photo} alt="Lucky Baraka, smiling, in a red polo shirt" width="400" height="400" />
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <h2 id="about-title">About</h2>
      <div className="about-grid">
        <div className="prose">{about.map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="about-side">
          <dl className="facts">
            {facts.map((f) => (
              <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
            ))}
          </dl>
          <Failover />
        </div>
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <h2 id="stack-title">What I work with</h2>
      <div className="stack">
        {stack.map((g) => (
          <div key={g.group} className={`stack-row ${g.primary ? 'is-primary' : ''}`}>
            <div>
              <h3>{g.group}</h3>
              <p className="muted">{g.note}</p>
            </div>
            <ul className="pills">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="section-head">
        <div>
          <h2 id="projects-title">Projects</h2>
          <p className="section-quote">“{quotes.projects.text}” <span>{quotes.projects.by}</span></p>
        </div>
        <a href={person.github} target="_blank" rel="noreferrer">All projects on GitHub</a>
      </div>
      <ul className="projects">
        {projects.map((p) => (
          <li key={p.kind} className={`project ${p.wide ? 'is-wide' : ''}`}>
            <a href={p.link} target="_blank" rel="noreferrer" className="card">
              <span className="kind">{p.kind}</span>
              <h3>{p.title}</h3>
              <p className="muted">{p.summary}</p>
              {p.quote && <p className="card-quote">“{p.quote.text}” <span>{p.quote.by}</span></p>}
              <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              <span className="card-link">View on GitHub</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="ach-title">
      <h2 id="ach-title" className="tight">Achievements</h2>
      <p className="section-quote">“{quotes.achievements.text}” <span>{quotes.achievements.by}</span></p>
      <p className="muted section-sub">The problem, what I did about it, and what changed.</p>
      <ul className="stars">
        {achievements.map((a) => (
          <li key={a.title} className="star card">
            <div>
              <p className="star-metric">{a.metric}</p>
              <p className="star-unit">{a.unit}</p>
            </div>
            <h3>{a.title}</h3>
            <div className="star-body">
              <div><p className="star-label">The problem</p><p>{a.situation}</p></div>
              <div><p className="star-label">What I did</p><p>{a.action}</p></div>
              <div><p className="star-label is-result">Result</p><p>{a.result}</p></div>
            </div>
            {a.link && (
              <a className="star-link" href={a.link} target="_blank" rel="noreferrer">{a.linkLabel || 'Learn more'} →</a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

// Feeds list categories and tags together ("Distributed Systems" and "distributed-systems"). Show each once.
function uniqueTerms(terms) {
  const seen = new Set()
  return terms.filter((t) => {
    const k = t.toLowerCase().replace(/\s+/g, '-')
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

function PostCard({ p }) {
  return (
    <li className="post">
      <a href={p.url} target="_blank" rel="noreferrer" className="card">
        <span className="post-date">{formatDate(p.date)}{p.minutes ? `, ${p.minutes} min read` : ''}</span>
        <h3>{p.title}</h3>
        <p className="muted">{p.summary}</p>
        {p.terms?.length > 0 && (
          <ul className="tags">{uniqueTerms(p.terms).slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul>
        )}
      </a>
    </li>
  )
}

function LatestWriting({ feed }) {
  return (
    <section id="writing" className="section" aria-labelledby="writing-title">
      <div className="section-head">
        <h2 id="writing-title">Latest writing</h2>
        <a href="#/blog">See all posts</a>
      </div>
      <ul className="posts">{feed.posts.slice(0, 3).map((p) => <PostCard key={p.url} p={p} />)}</ul>
    </section>
  )
}

/* ---------- blog page with sliding category chips ---------- */
function Chips({ active }) {
  const refs = useRef({})
  const wrap = useRef(null)
  const [box, setBox] = useState(null)
  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[active]
      if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])
  useEffect(() => {
    refs.current[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  return (
    <div className="chips" ref={wrap} role="tablist" aria-label="Filter posts by topic">
      {box && <span className="chip-indicator" style={{ transform: `translateX(${box.x}px)`, width: box.w }} aria-hidden="true" />}
      {blogCategories.map((c) => (
        <a
          key={c.slug}
          ref={(el) => (refs.current[c.slug] = el)}
          href={c.slug === 'all' ? '#/blog' : `#/blog/${c.slug}`}
          role="tab"
          aria-selected={active === c.slug}
          className={`chip ${active === c.slug ? 'is-active' : ''}`}
        >
          {c.label}
        </a>
      ))}
    </div>
  )
}

function BlogPage({ feed, cat }) {
  useEffect(() => window.scrollTo(0, 0), [])
  const valid = blogCategories.some((c) => c.slug === cat) ? cat : 'all'
  const posts = postsIn(feed.posts, valid)
  const label = blogCategories.find((c) => c.slug === valid)?.label
  return (
    <main className="blog-page" id="main" tabIndex={-1}>
      <h1>Writing</h1>
      <p className="muted blog-intro">Notes on distributed systems, databases, DevOps and security. Each post opens on <a href={person.blog} target="_blank" rel="noreferrer">my blog</a>.</p>
      <Chips active={valid} />
      {feed.status === 'saved' && <p className="feed-note">Showing saved posts. The blog couldn’t be reached just now.</p>}
      {feed.status === 'loading' && <p className="feed-note">Checking for new posts…</p>}
      {posts.length > 0 ? (
        <ul className="posts posts-page">{posts.map((p) => <PostCard key={p.url} p={p} />)}</ul>
      ) : (
        <div className="empty">
          <h3>No {label} posts yet</h3>
          <p className="muted">The first one is on its way. Until then, the distributed systems posts are a good place to start.</p>
          <a className="btn btn-secondary" href="#/blog/distributed-systems">Read distributed systems posts</a>
        </div>
      )}
    </main>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Lucky Baraka</p>
      <p>
        <a href={`mailto:${person.email}`}>Email</a>
        <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={person.blog} target="_blank" rel="noreferrer">Blog</a>
      </p>
    </footer>
  )
}

export default function App() {
  const route = useRoute()
  const feed = useFeed()
  const weather = useWeather()
  const mood = weather ? moodFromWeather(weather.code, weather.temp, weather.isDay) : null
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <WeatherLayer mood={mood} />
      <Nav route={route} weather={weather} />
      {route.page === 'blog' ? (
        <BlogPage feed={feed} cat={route.cat} />
      ) : (
        <main id="main" tabIndex={-1}>
          <Hero onContact={() => scrollToId('contact')} />
          <About />
          <Stack />
          <Projects />
          <Achievements />
          <LatestWriting feed={feed} />
          <Contact />
          <ScrollProgress />
        </main>
      )}
      <Footer />
    </>
  )
}
