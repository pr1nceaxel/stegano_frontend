import React from 'react'
import {BarChart3, Image, Shield, ScanEye, TrendingUp, Clock} from 'lucide-react'
import { useAnalyses } from '../hooks/useAnalyses'

export default function Dashboard() {
  const { analyses, stats, loading } = useAnalyses()

  // Format date for display
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('fr-FR')
  }

  // Map result to French label
  const getResultLabel = (result: string) => {
    const labels: Record<string, string> = {
      'authentic': 'Authentique',
      'ai-generated': 'Générée par IA',
      'signed': 'Signée',
      'unsigned': 'Non signée',
      'tampered': 'Modifiée'
    }
    return labels[result] || result
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Tableau de Bord</h1>
        <p className="text-gray-300">Vue d'ensemble de vos analyses et statistiques</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-cyan-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalImages}</div>
          <div className="text-gray-400 text-sm">Images Analysées</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.signedImages}</div>
          <div className="text-gray-400 text-sm">Images Signées</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <ScanEye className="w-6 h-6 text-amber-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.aiDetected}</div>
          <div className="text-gray-400 text-sm">IA Détectées</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.authenticated}</div>
          <div className="text-gray-400 text-sm">Authentifications</div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Analyses Récentes
          </h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Chargement des analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400">Aucune analyse disponible</p>
            </div>
          ) : (
            analyses.slice(0, 10).map((analysis) => (
              <div key={analysis.id} className="px-6 py-4 hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      analysis.analysisType === 'signature' 
                        ? 'bg-cyan-500/20' 
                        : 'bg-amber-500/20'
                    }`}>
                      {analysis.analysisType === 'signature' ? (
                        <Shield className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ScanEye className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{analysis.imageName}</div>
                      <div className="text-sm text-gray-400">
                        {analysis.analysisType === 'signature'
                          ? 'Signature'
                          : analysis.analysisType === 'verification'
                            ? 'Vérification'
                            : 'Détection IA'}{' '}
                        • {formatDate(analysis.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{analysis.confidence.toFixed(1)}%</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.result === 'authentic' || analysis.result === 'signed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {getResultLabel(analysis.result)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm text-gray-300">
        Backend actif: historique chargé depuis l'API (`/api/analyses`) et stocké en SQLite.
      </div>
    </div>
  )
}
