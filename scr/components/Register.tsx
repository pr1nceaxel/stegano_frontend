import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(fullName, email, password)
      alert('Compte créé. Vous pouvez vous connecter.')
      navigate('/login')
    } catch (error) {
      alert(String(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl text-white font-bold mb-6">Inscription</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nom complet"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe (min 6)"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          minLength={6}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold"
        >
          {loading ? 'Création...' : 'Créer le compte'}
        </button>
      </form>
      <p className="text-gray-300 mt-4">
        Déjà inscrit ? <Link className="text-cyan-400" to="/login">Se connecter</Link>
      </p>
    </div>
  )
}
