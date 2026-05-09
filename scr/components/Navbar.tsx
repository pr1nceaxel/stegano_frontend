import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, ScanEye, BarChart3, PenTool, ShieldCheck, UserCog } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-[#0A0E27]/80 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-xl font-bold text-white">SteganographIA</span>
          </Link>
          
          <div className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/sign"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/sign')
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Signer</span>
                </Link>
                <Link
                  to="/verify"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/verify')
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Vérifier</span>
                </Link>
                <Link
                  to="/detect"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/detect')
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <ScanEye className="w-4 h-4" />
                  <span className="hidden sm:inline">Détecter IA</span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive('/dashboard')
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive('/admin')
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <UserCog className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  Déconnexion
                </button>
                <span className="hidden md:inline text-xs text-gray-400 ml-2">{user?.email}</span>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isActive('/login')
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg transition-all ${
                    isActive('/register')
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
