import { useEffect, useState } from 'react'
import { person, savedPosts, blogCategories } from './data.js'

const text = (el, sel) => el.querySelector(sel)?.textContent?.trim() ?? ''

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent.replace(/\s+/g, ' ').trim()
}

function clip(s, n = 180) {
  if (s.length <= n) return s
  return s.slice(0, s.lastIndexOf(' ', n)) + '…'
}

// Reads Atom (Chirpy's default) or RSS.
export function parseFeed(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const nodes = [...doc.querySelectorAll('entry, item')]
  return nodes.map((n) => {
    const linkEl = n.querySelector('link')
    const url = linkEl?.getAttribute('href') || linkEl?.textContent || ''
    const content = stripHtml(text(n, 'content') || text(n, 'description'))
    const summary = stripHtml(text(n, 'summary')) || content
    const terms = [...n.querySelectorAll('category')].map((c) => c.getAttribute('term') || c.textContent)
    const words = content.split(' ').length
    return {
      title: text(n, 'title'),
      url,
      date: text(n, 'published') || text(n, 'updated') || text(n, 'pubDate'),
      summary: clip(summary),
      terms,
      minutes: words > 200 ? Math.max(1, Math.round(words / 220)) : null,
    }
  })
}

export function postsIn(posts, slug) {
  if (slug === 'all') return posts
  const cat = blogCategories.find((c) => c.slug === slug)
  if (!cat) return posts
  const norm = (t) => t.toLowerCase().trim()
  return posts.filter((p) => p.terms.some((t) => cat.match.includes(norm(t))))
}

export function useFeed() {
  const [state, setState] = useState({ status: 'loading', posts: savedPosts })
  useEffect(() => {
    let alive = true
    fetch(person.feed)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((xml) => {
        const posts = parseFeed(xml).filter((p) => p.title && p.url)
        if (alive) setState(posts.length ? { status: 'live', posts } : { status: 'saved', posts: savedPosts })
      })
      .catch(() => alive && setState({ status: 'saved', posts: savedPosts }))
    return () => { alive = false }
  }, [])
  return state
}

export const formatDate = (d) => {
  const date = new Date(d)
  return isNaN(date) ? '' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
