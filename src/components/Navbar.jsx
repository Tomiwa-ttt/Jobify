import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { path: '/', label: 'Dashboard' },
  { path: '/applications', label: 'Applications' },
  { path: '/emails', label: 'Cold Emails' },
  { path: '/followups', label: 'Follow-Ups' },
]

export default function Navbar() {
  const location = useLocation()
  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-[#0f1724] flex flex-col py-10 px-6 z-50">
      <div className="mb-12">
        <h1 className="text-white text-2xl font-bold tracking-tight">Jobify</h1>
        <p className="text-gray-400 text-xs mt-1">Your job search portal</p>
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              location.pathname === link.path
                ? 'bg-[#e8572a] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-gray-600 text-xs">
        AASD 4013 · GBC
      </div>
    </aside>
  )
}