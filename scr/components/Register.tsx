import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(fullName, email, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de créer le compte. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <RegisterGrid>
        <RegisterAside />
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-cyan-500/5">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-gray-400 mb-8">Rejoignez SteganographIA en quelques secondes</p>

          {error ? (
            <div
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {success ? (
            <div
              className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-200 text-sm flex items-start gap-3"
              role="status"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Compte créé avec succès. Redirection vers la connexion…</span>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-5">
            <AuthField label="Nom complet" htmlFor="register-name">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                required
              />
            </AuthField>

            <AuthField label="Adresse e-mail" htmlFor="register-email">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                required
              />
            </AuthField>

            <AuthField label="Mot de passe" htmlFor="register-password">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                minLength={6}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                required
              />
            </AuthField>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-8 text-sm">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </RegisterGrid>
    </div>
  )
}

function RegisterAside() {
  return (
    <div className="hidden lg:block space-y-6">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
        <Sparkles className="w-4 h-4" />
        Gratuit pour commencer
      </div>
      <div className="flex items-center gap-4">
        <IconBox />
        <div>
          <h2 className="text-3xl font-bold text-white">Bienvenue</h2>
          <p className="text-gray-400 mt-1">Un compte pour signer, vérifier et suivre vos images</p>
        </div>
      </div>
      <ul className="space-y-4 text-gray-300 text-sm">
        <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          Historique personnel de toutes vos analyses
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          Signature liée à votre identité
        </li>
        <li className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          Détection d’images générées par IA
        </li>
      </ul>
    </div>
  )
}

function IconBox() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
      <Shield className="w-9 h-9 text-white" />
    </div>
  )
}

function AuthField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  )
}

function RegisterGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">{children}</div>
  )
}
