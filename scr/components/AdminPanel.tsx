import React, { useEffect, useState } from 'react'
import { fetchJson } from '../lib/api'

type AdminUser = {
  id: number
  email: string
  fullName: string
  role: 'user' | 'admin'
  createdAt: string
}

type AdminAnalysis = {
  id: number
  analysisType: string
  imageName: string
  result: string
  confidence: number
  createdAt: string
}

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [analyses, setAnalyses] = useState<AdminAnalysis[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const usersResponse = await fetchJson<{ users: AdminUser[] }>('/api/admin/users')
      const analysesResponse = await fetchJson<{ analyses: AdminAnalysis[] }>('/api/admin/analyses?limit=200')
      setUsers(usersResponse.users)
      setAnalyses(analysesResponse.analyses)
    } catch (error) {
      alert(String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const toggleRole = async (user: AdminUser) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      await fetchJson<{ ok: boolean }>(`/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: nextRole }),
      })
      await loadData()
    } catch (error) {
      alert(String(error))
    }
  }

  const deleteAnalysis = async (id: number) => {
    if (!window.confirm('Supprimer cette analyse ?')) return
    try {
      await fetchJson<{ ok: boolean }>(`/api/admin/analyses/${id}`, { method: 'DELETE' })
      setAnalyses((prev) => prev.filter((a) => a.id !== id))
    } catch (error) {
      alert(String(error))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl text-white font-bold">Administration</h1>
      {loading && <p className="text-gray-300">Chargement...</p>}

      <section className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl text-white font-semibold mb-4">Utilisateurs</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <div>
                <p className="text-white">{user.fullName} - {user.email}</p>
                <p className="text-sm text-gray-400">Role: {user.role}</p>
              </div>
              <button
                onClick={() => toggleRole(user)}
                className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Basculer role
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl text-white font-semibold mb-4">Analyses</h2>
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
              <div>
                <p className="text-white">
                  #{analysis.id} - {analysis.imageName} ({analysis.analysisType})
                </p>
                <p className="text-sm text-gray-400">
                  Resultat: {analysis.result} | Confiance: {analysis.confidence}%
                </p>
              </div>
              <button
                onClick={() => deleteAnalysis(analysis.id)}
                className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
