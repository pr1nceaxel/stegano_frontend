import React, { useMemo, useState } from 'react'
import {
  BarChart3,
  Image,
  Shield,
  ScanEye,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Eye,
  ShieldCheck,
} from 'lucide-react'
import { useAnalyses, type Analysis } from '../hooks/useAnalyses'
import AnalysisDetailModal from './AnalysisDetailModal'

const RESULT_LABELS: Record<string, string> = {
  authentic: 'Authentique',
  'ai-generated': 'IA détectée',
  signed: 'Signée',
  unsigned: 'Non signée',
  tampered: 'Modifiée',
}

const TYPE_LABELS: Record<string, string> = {
  signature: 'Signature',
  verification: 'Vérification',
  'ai-detection': 'Détection IA',
}

export default function Dashboard() {
  const { analyses, stats, loading } = useAnalyses()
  const [selected, setSelected] = useState<Analysis | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<string>('all')

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return analyses.filter((a) => {
      if (typeFilter !== 'all' && a.analysisType !== typeFilter) return false
      if (resultFilter !== 'all' && a.result !== resultFilter) return false
      if (q && !a.imageName.toLowerCase().includes(q)) return false
      return true
    })
  }, [analyses, search, typeFilter, resultFilter])

  const getResultBadgeClass = (result: string) => {
    if (result === 'authentic' || result === 'signed') {
      return 'bg-green-500/20 text-green-400'
    }
    if (result === 'tampered' || result === 'unsigned') {
      return 'bg-red-500/20 text-red-400'
    }
    return 'bg-amber-500/20 text-amber-400'
  }

  const getTypeIcon = (type: string) => {
    if (type === 'signature') return <Shield className="w-5 h-5 text-cyan-400" />
    if (type === 'verification') return <ShieldCheck className="w-5 h-5 text-blue-400" />
    return <ScanEye className="w-5 h-5 text-amber-400" />
  }

  const getTypeIconBg = (type: string) => {
    if (type === 'signature') return 'bg-cyan-500/20'
    if (type === 'verification') return 'bg-blue-500/20'
    return 'bg-amber-500/20'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Tableau de bord</h1>
        <p className="text-gray-300">Historique de vos analyses et statistiques</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={Image}
          color="cyan"
          value={stats.totalImages}
          label="Analyses enregistrées"
        />
        <StatCard icon={Shield} color="green" value={stats.signedImages} label="Signatures" />
        <StatCard icon={ScanEye} color="amber" value={stats.aiDetected} label="IA détectées" />
        <StatCard icon={BarChart3} color="purple" value={stats.authenticated} label="Vérifications OK" />
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Historique des analyses
          </h2>
          <p className="text-sm text-gray-400">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {filtered.length !== analyses.length ? ` sur ${analyses.length}` : ''}
          </p>
        </div>

        <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom de fichier..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 hidden sm:block" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500"
                >
                  <option className="text-black" value="all">Tous les types</option>
                  <option className="text-black" value="signature">Signature</option>
                  <option className="text-black" value="verification">Vérification</option>
                  <option className="text-black" value="ai-detection">Détection IA</option>
                </select>
              </div>
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500"
              >
                <option className="text-black" value="all">Tous les résultats</option>
                <option className="text-black" value="signed">Signée</option>
                <option className="text-black" value="authentic">Authentique</option>
                <option className="text-black" value="unsigned">Non signée</option>
                <option className="text-black" value="tampered">Modifiée</option>
                <option className="text-black" value="ai-generated">IA détectée</option>
              </select>
              {(search || typeFilter !== 'all' || resultFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setTypeFilter('all')
                    setResultFilter('all')
                  }}
                  className="px-3 py-2.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Chargement des analyses...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">
                {analyses.length === 0
                  ? 'Aucune analyse pour le moment. Signez, vérifiez ou analysez une image pour commencer.'
                  : 'Aucune analyse ne correspond à vos filtres.'}
              </p>
            </div>
          ) : (
            filtered.map((analysis) => (
              <div key={analysis.id} className="px-6 py-4 hover:bg-white/5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeIconBg(analysis.analysisType)}`}
                    >
                      {getTypeIcon(analysis.analysisType)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{analysis.imageName}</div>
                      <div className="text-sm text-gray-400">
                        {TYPE_LABELS[analysis.analysisType] || analysis.analysisType} •{' '}
                        {formatDate(analysis.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 sm:ml-auto">
                    <span className="text-xs text-gray-400">{analysis.confidence.toFixed(0)} %</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getResultBadgeClass(analysis.result)}`}
                    >
                      {RESULT_LABELS[analysis.result] || analysis.result}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected(analysis)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Détail
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnalysisDetailModal analysis={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  color: 'cyan' | 'green' | 'amber' | 'purple'
  value: number
  label: string
}) {
  const styles = {
    cyan: {
      box: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30',
      icon: 'bg-cyan-500/20 text-cyan-400',
      trend: 'text-cyan-400',
    },
    green: {
      box: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
      icon: 'bg-green-500/20 text-green-400',
      trend: 'text-green-400',
    },
    amber: {
      box: 'from-amber-500/10 to-orange-500/10 border-amber-500/30',
      icon: 'bg-amber-500/20 text-amber-400',
      trend: 'text-amber-400',
    },
    purple: {
      box: 'from-purple-500/10 to-pink-500/10 border-purple-500/30',
      icon: 'bg-purple-500/20 text-purple-400',
      trend: 'text-purple-400',
    },
  }[color]

  return (
    <div className={`bg-gradient-to-br ${styles.box} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${styles.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className={`w-5 h-5 ${styles.trend}`} />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}
