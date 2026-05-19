import React, { useEffect, useRef, useState } from 'react'
import { LogOut, UserCircle, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  if (!user) return null

  const initials = (user.fullName || user.email)
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative ml-2" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all max-w-[220px] sm:max-w-[280px]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold shadow-md shadow-cyan-500/20">
          {initials || <UserCircle className="w-5 h-5" />}
        </span>
        <span className="hidden sm:block text-sm text-gray-200 truncate text-left min-w-0">
          {user.email}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 py-2 rounded-xl bg-[#12182e] border border-white/10 shadow-xl z-50"
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-white font-medium truncate">{user.fullName}</p>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
            {user.role === 'admin' ? (
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                Administrateur
              </span>
            ) : null}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      ) : null}
    </div>
  )
}
