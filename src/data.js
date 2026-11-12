// Everything people read on the site lives here, so you can edit copy without touching components.

export const person = {
  name: 'Lucky Baraka',
  role: 'Software engineer and open source engineer',
  email: 'luckybaraka21@gmail.com',
  phone: '+254790761708',
  phoneDisplay: '+254 790 761 708',
  linkedin: 'https://www.linkedin.com/in/lucky-baraka/',
  github: 'https://github.com/luckybaraka',
  blog: 'https://luckybaraka.github.io/',
  feed: 'https://luckybaraka.github.io/feed.xml',
  photo: 'lucky.jpg',
}

export const hero = {
  greeting: 'Hi, I’m Lucky.',
  lead: 'I build software end to end, from the database up to the screen. Mostly in Go and Python, with React on the front.',
  aside: 'When I’m not building, I’m reading about distributed systems, database internals, Linux, and how software breaks at scale.',
}

export const about = [
  'I’m a software engineer who likes knowing how things work underneath. Go and Python are where I’ve spent the most years, and React is what I reach for when something needs a face.',
  'I care most about software that keeps running when things go wrong: networks drop, disks fill up, machines restart in the middle of a write. That curiosity is what pulled me into distributed systems, DevOps and security, and it’s why most of my evenings end in a Linux terminal.',
  'I also like teaching. Explaining something to another person is still the fastest way I know to find out whether I actually understand it, so a lot of what I learn ends up on my blog.',
]

export const facts = [
  { label: 'Writes mostly', value: 'Go and Python' },
  { label: 'Also writes', value: 'C#, JavaScript and React' },
  { label: 'Lives in', value: 'Linux and a terminal' },
  { label: 'Co-founded', value: 'digibiashara.com', href: 'https://digibiashara.com' },
]

export const quotes = {
  about: { text: 'Everything fails, all the time.', by: 'Werner Vogels, CTO of Amazon' },
  projects: { text: 'Talk is cheap. Show me the code.', by: 'Linus Torvalds, creator of Linux' },
  build: { text: 'You build it, you run it.', by: 'Werner Vogels, CTO of Amazon' },
  achievements: { text: 'Success is the sum of small efforts, repeated day in and day out.', by: 'Robert Collier' },
}

export const stack = [
  { group: 'Every day', note: 'Years of it. The ones I reach for first.', items: ['Go', 'Python'], primary: true },
  { group: 'Also comfortable with', note: 'C# when the job calls for .NET, React for frontends.', items: ['C#', 'JavaScript', 'React'] },
  { group: 'DevOps and infrastructure', note: 'Getting things built, shipped and kept running.', items: ['Linux', 'Docker', 'Kubernetes', 'Jenkins', 'Argo CD', 'GitLab CI'] },
  { group: 'What I read about for fun', note: 'The stuff that ends up on the blog.', items: ['Distributed systems', 'Database internals', 'DevOps', 'Cybersecurity', 'Linux'] },
]

// TODO: fill in the frontend and full stack projects, and point each `link` at its repo.
// `wide: true` makes a card take half a row instead of a third.
export const projects = [
  { kind: 'Frontend', title: '[Frontend project name]', summary: '[One sentence on what it does and who it is for.]', tags: ['React', 'JavaScript'], link: 'https://github.com/luckybaraka' },
  { kind: 'Backend', title: 'Go API with worker pools', summary: 'An API that stays fast under load: goroutine worker pools, Redis caching, token management, and a gateway that handles retries and rate limits.', tags: ['Go', 'Redis', 'PostgreSQL'], link: 'https://github.com/luckybaraka' },
  { kind: 'Database', title: 'HazinaDB', summary: 'A database engine I’m building from scratch to learn storage internals end to end: a log-structured store, a write-ahead log for durability, and a small query layer on top.', tags: ['Go', 'Storage engine', 'Database internals'], link: 'https://github.com/luckybaraka' },
  { kind: 'Full stack', title: '[Full stack project name]', summary: '[One sentence on what it does and who it is for.]', tags: ['React', 'Python'], link: 'https://github.com/luckybaraka' },
  {
    kind: 'DevOps', title: 'Pull request to production pipeline',
    summary: 'A multi-service app that ships itself. Jenkins builds and checks every change, Docker packages it, and Argo CD keeps Kubernetes in sync with what is in Git.',
    tags: ['Jenkins', 'Docker', 'Kubernetes', 'Argo CD'], link: 'https://github.com/luckybaraka',
  },
  { kind: 'Open source', title: 'Open Concept Lab contributor', summary: 'Contributions to OCL, open source terminology tooling that helps health systems agree on what their data means.', tags: ['Open source', 'Python', 'Interoperability'], link: 'https://github.com/luckybaraka' },
]

// STAR: the problem (situation and task), what I did (action), and the result.
export const achievements = [
  { metric: '100+', unit: 'integrators on the HIE network, and 20k+ claims routed daily', title: 'National Health Information Exchange (HIE)', situation: 'Hospitals, insurers, labs and the national insurer each held their data in their own systems, so claims, lab reports and patient records had to be retyped or faxed between them.', action: 'Built Go and Python microservices for the national HIE, the backbone that routes HL7 FHIR claims and preauthorizations, lab reports, shared health records, consent and registry lookups between every connected system, not just claims.', result: 'More than 100 integrators now exchange data across the network, with roughly 20,000 claims flowing through it every day.', link: 'https://hie-docs.dha.go.ke', linkLabel: 'Read the HIE documentation' },
  { metric: '251k', unit: 'minors enrolled with fingerprints', title: 'Biometric enrollment for children', situation: 'Children under 18 had no way to enroll or be verified with fingerprints, so their visits could not be confirmed the same way as adults’.', action: 'After working through the enrollment documentation for both minors and adults, built the minor enrollment and verification workflow, the first of its kind on the platform, in C#, Python and Kotlin for mobile.', result: '251,377 minors enrolled, 91% of them fully. When they come back for care, the system recognises them 96.5% of the time.' },
  { metric: '228k', unit: 'biometric visits in one week', title: 'Fingerprint check-in for adults', situation: 'Most visits were confirmed with SMS codes, which prove someone has the phone, not that the patient is in the room.', action: 'Built the verification orchestrator on NATS JetStream and connected it to the national ID system, in C#, Python and Kotlin for mobile.', result: '228,766 visits started by fingerprint in a single week of November 2026, across 2,412 providers. That is 9 in 10 providers on the network.' },
  { metric: '300+', unit: 'pharmacies, plus about 30 a month', title: 'Offline-first workflows', situation: 'Pharmacies lose connection all the time, and an app that needs the network stops serving patients the moment it drops.', action: 'Designed how offline-first apps queue work locally and resolve conflicts when they reconnect, then built that offline-first sync workflow in Python so dispensing, records and visits keep working through outages and reconcile cleanly once the network returns.', result: 'More than 300 pharmacies enrolled so far, with roughly 30 more joining every month, none of them blocked by a dropped connection.' },
  { metric: '300k+', unit: 'error contracts created', title: 'One error contract for every service', situation: '.NET, Django and Go teams all reported errors differently, so a failure in one service was hard to trace through the next.', action: 'Wrote an error contract based on RFC 9457, then packaged it as an SDK so every team imports the same error shapes instead of hand-rolling their own.', result: 'Internal teams across three stacks now pull the error contract straight from the SDK, and it has shaped more than 300,000 error responses so far, so errors look the same everywhere they travel.', link: person.github, linkLabel: 'Read the error contract' },
  { metric: '90%', unit: 'graduation rate', title: 'Top Tutor, 2024', situation: 'ALX Africa’s program was intense and first-principles driven, so learners were burning out and giving up before they reached their final projects.', action: 'Stayed with my cohorts the whole way, right through the final-project crunch, and taught them the engineering concepts they were stuck on until each one clicked.', result: 'Named Top Tutor for a 90% graduation rate across my cohorts.' },
]

// A side venture: the digital agency I co-founded.
export const business = {
  name: 'Digibiashara',
  role: 'Co-founder',
  domain: 'digibiashara.com',
  url: 'https://digibiashara.com',
  blurb: 'Alongside engineering, I co-founded Digibiashara, a small digital agency based in Nairobi. We help small businesses and startups get online and actually get found: a website that works, search visibility, and marketing that reaches real customers.',
  services: ['Web development', 'SEO', 'Email marketing', 'Social media', 'UI/UX design', 'eCommerce'],
}

// Writing page chips. `match` lists feed categories or tags that belong to each one.
export const blogCategories = [
  { slug: 'all', label: 'All' },
  { slug: 'distributed-systems', label: 'Distributed systems', match: ['distributed systems', 'distributed-systems', 'system-design', 'consistency'] },
  { slug: 'databases', label: 'Databases', match: ['databases', 'database', 'replication'] },
  { slug: 'backend', label: 'Backend', match: ['backend engineering', 'backend-engineering', 'backend', 'nats', 'message-queues'] },
  { slug: 'devops', label: 'DevOps', match: ['devops', 'docker', 'kubernetes', 'ci-cd', 'jenkins', 'argo-cd'] },
  { slug: 'cybersecurity', label: 'Cybersecurity', match: ['cybersecurity', 'security'] },
]

// Shown if the live feed can't be reached. The live feed replaces this automatically.
export const savedPosts = [
  { title: 'Offline-first systems', url: 'https://luckybaraka.github.io/posts/offline-first-architecture/', date: '2026-10-03', summary: 'How to build an app that keeps working when the network doesn’t, and how it catches up once it does.', terms: ['Distributed Systems', 'Backend Engineering', 'consistency'] },
  { title: 'Messaging architecture with NATS', url: 'https://luckybaraka.github.io/posts/messaging-architecture/', date: '2026-09-28', summary: 'An image pipeline that resizes, filters and moderates uploads, and why a message queue keeps it standing.', terms: ['Distributed Systems', 'Backend Engineering', 'nats', 'jetstream'] },
  { title: 'Replication: making data survive everything', url: 'https://luckybaraka.github.io/posts/replication/', date: '2026-05-28', summary: 'From 1970s tape backups to globally distributed databases, a long look at why copying data is so hard.', terms: ['Distributed Systems', 'Backend Engineering', 'databases', 'replication'] },
]
