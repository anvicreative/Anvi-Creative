import { useEffect, useState } from 'react'
import { SITE, SERVICES, PORTFOLIO, REVIEWS } from './data.js'
import Reveal from './Reveal.jsx'
import Admin from './Admin.jsx'

const KEY = 'anvi_enquiries'
const LINKS = ['about', 'services', 'portfolio', 'reviews', 'contact']

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" className="logo">ANVI<span> CREATIVE</span></a>
      <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      <ul className={open ? 'open' : ''}>
        {LINKS.map((l) => (
          <li key={l}><a href={`#${l}`} onClick={() => setOpen(false)}>{l[0].toUpperCase() + l.slice(1)}</a></li>
        ))}
        <li><a href="#contact" className="btn primary sm" onClick={() => setOpen(false)}>Get a Quote</a></li>
      </ul>
    </nav>
  )
}

function Hero() {
  return (
    <header id="top" className="hero">
      <div className="hero-inner">
        <p className="eyebrow">Creative Agency · Chennai</p>
        <h1>We build brands that <em>stand out</em> and grow.</h1>
        <p className="lead">Anvi Creative delivers branding, websites and digital marketing with a premium, results-driven approach.</p>
        <div className="cta">
          <a href="#contact" className="btn white">Start a Project</a>
          <a href="#portfolio" className="btn outline">View Our Work</a>
        </div>
        <div className="hero-stats">
          <div><b>150+</b><span>Projects</span></div>
          <div><b>80+</b><span>Happy Clients</span></div>
          <div><b>5+</b><span>Years</span></div>
        </div>
      </div>
    </header>
  )
}

function About() {
  return (
    <section id="about" className="section">
      <Reveal className="two-col">
        <div>
          <p className="eyebrow dark">About Us</p>
          <h2>Creative thinking. Measurable results.</h2>
          <p>Anvi Creative is a full-service creative studio helping businesses build strong brands and a powerful online presence. Our team blends design, technology and strategy to deliver work that looks premium and performs.</p>
          <ul className="ticks">
            <li>Dedicated project manager for every client</li>
            <li>Transparent pricing and on-time delivery</li>
            <li>Ongoing support after launch</li>
          </ul>
        </div>
        <div className="about-art"><span>ANVI</span></div>
      </Reveal>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="section alt">
      <Reveal><p className="eyebrow dark center">Services</p><h2 className="center">What we do</h2></Reveal>
      <div className="grid">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 80}>
            <div className="card service">
              <div className="icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Portfolio() {
  const tags = ['All', ...new Set(PORTFOLIO.map((p) => p.tag))]
  const [tag, setTag] = useState('All')
  const items = tag === 'All' ? PORTFOLIO : PORTFOLIO.filter((p) => p.tag === tag)
  return (
    <section id="portfolio" className="section">
      <Reveal><p className="eyebrow dark center">Portfolio</p><h2 className="center">Our recent work</h2></Reveal>
      <div className="filters">
        {tags.map((t) => (
          <button key={t} className={t === tag ? 'active' : ''} onClick={() => setTag(t)}>{t}</button>
        ))}
      </div>
      <div className="grid">
        {items.map((p) => (
          <div key={p.title} className="tile" style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}>
            <div className="tile-info"><small>{p.tag}</small><h3>{p.title}</h3></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="section alt">
      <Reveal><p className="eyebrow dark center">Testimonials</p><h2 className="center">What our clients say</h2></Reveal>
      <div className="grid">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.name} delay={i * 100}>
            <div className="card review">
              <div className="stars">{'★'.repeat(r.stars)}</div>
              <p>“{r.text}”</p>
              <b>{r.name}</b><small>{r.role}</small>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const empty = { name: '', email: '', phone: '', service: SERVICES[0].title, message: '' }
  const [f, setF] = useState(empty)
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    let list = []
    try { list = JSON.parse(localStorage.getItem(KEY)) || [] } catch { /* ignore */ }
    list.unshift({ ...f, id: Date.now(), date: new Date().toLocaleString() })
    localStorage.setItem(KEY, JSON.stringify(list))
    setSent(true)
    setF(empty)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section id="contact" className="section">
      <Reveal className="two-col">
        <div>
          <p className="eyebrow dark">Contact</p>
          <h2>Let’s talk about your project</h2>
          <p>Share your requirements and we ’ll get back to you within 24 hours.</p>
          <ul className="info">
            <li>📍 {SITE.address}</li>
            <li>📞 {SITE.phone}</li>
            <li>✉️ {SITE.email}</li>
          </ul>
          <a className="btn wa" target="_blank" rel="noreferrer"
             href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Anvi Creative, I would like to know more about your services.')}`}>
            Chat on WhatsApp
          </a>
        </div>
        <form className="card form" onSubmit={submit}>
          <input required placeholder="Your name" value={f.name} onChange={set('name')} />
          <input required type="email" placeholder="Email" value={f.email} onChange={set('email')} />
          <input required type="tel" placeholder="Phone" value={f.phone} onChange={set('phone')} />
          <select value={f.service} onChange={set('service')}>
            {SERVICES.map((s) => <option key={s.title}>{s.title}</option>)}
          </select>
          <textarea required rows="4" placeholder="Tell us about your project" value={f.message} onChange={set('message')} />
          <button className="btn primary" type="submit">Send Enquiry</button>
          {sent && <p className="ok">✓ Thank you! We’ll contact you soon.</p>}
        </form>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
      <a href="#/admin">Admin</a>
    </footer>
  )
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash)
  useEffect(() => {
    const f = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  if (route.startsWith('#/admin')) return <Admin />

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Reviews />
      <Contact />
      <Footer />
      <a className="wa-float" target="_blank" rel="noreferrer" aria-label="WhatsApp"
         href={`https://wa.me/${SITE.whatsapp}`}>💬</a>
    </>
  )
}
