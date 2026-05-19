import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, ScanEye, BarChart3, PenTool, ShieldCheck, UserCog } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import UserMenu from './UserMenu'

export default function Navbar() {
  const location = useLocation()
  const { isAuthenticated, isAdmin } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const linkClass = (path: string, activeClass: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      isActive(path) ? activeClass : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`

  return (
    <nav className="bg-[#0A0E27]/80 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavInner>
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <Shield className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-xl font-bold text-white hidden sm:inline">SteganographIA</span>
          </Link>

          <div className="flex items-center gap-1 flex-wrap justify-end">
            {isAuthenticated ? (
              <>
                <Link to="/sign" className={linkClass('/sign', 'bg-cyan-500/20 text-cyan-400')}>
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Signer</span>
                </Link>
                <Link to="/verify" className={linkClass('/verify', 'bg-blue-500/20 text-blue-400')}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Vérifier</span>
                </Link>
                <Link to="/detect" className={linkClass('/detect', 'bg-amber-500/20 text-amber-400')}>
                  <ScanEye className="w-4 h-4" />
                  <span className="hidden sm:inline">Détecter IA</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={linkClass('/dashboard', 'bg-cyan-500/20 text-cyan-400')}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                {isAdmin ? (
                  <Link to="/admin" className={linkClass('/admin', 'bg-purple-500/20 text-purple-400')}>
                    <UserCog className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                ) : null}
                <UserMenu />
              </>
            ) : (
              <Link
                to="/login"
                className={`${linkClass('/login', 'bg-cyan-500/20 text-cyan-400')} px-5`}
              >
                Connexion
              </Link>
            )}
          </div>
        </NavInner>
      </div>
    </nav>
  )
}

function NavInner({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between h-16 gap-4">{children}</div>
}
