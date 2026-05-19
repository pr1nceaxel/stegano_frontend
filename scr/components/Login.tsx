import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Root>
      <Grid>
        <Aside />
        <FormCard
          error={error}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={onSubmit}
        />
      </Grid>
    </Root>
  )
}

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">{children}</div>
  )
}

function Aside() {
  return (
    <div className="hidden lg:block space-y-6">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
        <Sparkles className="w-4 h-4" />
        Plateforme de confiance visuelle
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Shield className="w-9 h-9 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">SteganographIA</h2>
          <p className="text-gray-400 mt-1">Signez et vérifiez vos images en toute simplicité</p>
        </div>
      </div>
      <ul className="space-y-4 text-gray-300">
        <li className="flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
          Signature invisible intégrée à vos photos
        </li>
        <li className="flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
          Vérification de l&apos;authenticité en un clic
        </li>
        <li className="flex items-start gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
          Historique de toutes vos analyses
        </li>
      </ul>
    </div>
  )
}

function FormCard({
  error,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}: {
  error: string | null
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-cyan-500/5">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Connexion</h1>
      <p className="text-gray-400 mb-8">Accédez à votre espace SteganographIA</p>

      {error ? (
        <ErrorAlert message={error} />
      ) : null}

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Adresse e-mail" htmlFor="login-email">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            required
          />
        </Field>

        <Field label="Mot de passe" htmlFor="login-password">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            required
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <p className="text-gray-400 text-center mt-8 text-sm">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
          Créer un compte gratuitement
        </Link>
      </p>
    </div>
  )
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div
      className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm"
      role="alert"
    >
      {message}
    </div>
  )
}

function Field({
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
