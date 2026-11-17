import { useState } from 'react'
import { SITE } from './data.js'

const KEY = 'anvi_enquiries'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('anvi_admin') === '1')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState(load())
  const [query, setQuery] = useState('')

  const login = (e) => {
    e.preventDefault()
    if (pw === SITE.adminPassword) {
      sessionStorage.setItem('anvi_admin', '1')
      setAuthed(true)
    } else setError('Wrong password')
  }
  const logout = () => { sessionStorage.removeItem('anvi_admin'); setAuthed(false) }
  const remove = (id) => {
    const next = items.filter((i) => i.id !== id)
    localStorage.setItem(KEY, JSON.stringify(next))
    setItems(next)
  }
  const exportCsv = () => {
    const rows = [['Date', 'Name', 'Email', 'Phone', 'Service', 'Message'],
      ...items.map((i) => [i.date, i.name, i.email, i.phone, i.service, i.message])]
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'enquiries.csv'
    a.click()
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <form onSubmit={login} className="card">
          <h2>Admin Login</h2>
          <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
          {error && <p className="err">{error}</p>}
          <button className="btn primary" type="submit">Login</button>
          <a href="#/" className="back">← Back to website</a>
        </form>
      </div>
    )
  }

  const shown = items.filter((i) => JSON.stringify(i).toLowerCase().includes(query.toLowerCase()))
  const today = new Date().toLocaleDateString()
  const todayCount = items.filter((i) => i.date.startsWith(today)).length

  return (
    <div className="admin">
      <header className="admin-top">
        <h2>{SITE.name} · Dashboard</h2>
        <div>
          <a href="#/" className="btn ghost">View site</a>
          <button className="btn primary" onClick={logout}>Logout</button>
        </div>
      </header>
      <div className="stats">
        <div className="card"><b>{items.length}</b><span>Total enquiries</span></div>
        <div className="card"><b>{todayCount}</b><span>Today</span></div>
        <div className="card"><b>{new Set(items.map((i) => i.service)).size}</b><span>Services requested</span></div>
      </div>
      <div className="admin-tools">
        <input placeholder="Search enquiries..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn ghost" onClick={exportCsv} disabled={!items.length}>Export CSV</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Service</th><th>Message</th><th></th></tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan="6" className="empty">No enquiries yet.</td></tr>}
            {shown.map((i) => (
              <tr key={i.id}>
                <td>{i.date}</td><td>{i.name}</td>
                <td>{i.email}<br />{i.phone}</td>
                <td>{i.service}</td><td>{i.message}</td>
                <td><button className="del" onClick={() => remove(i.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Enquiries are stored in this browser. For a live site, connect the form to a backend or email service.</p>
    </div>
  )
}
