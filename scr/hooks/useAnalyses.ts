import { useState, useEffect } from 'react'
import { fetchJson } from '../lib/api'

export interface Analysis {
  id: string
  imageName: string
  analysisType: 'signature' | 'ai-detection' | 'verification'
  result: 'authentic' | 'ai-generated' | 'signed' | 'unsigned' | 'tampered'
  confidence: number
  metadata: Record<string, unknown>
  createdAt: string
}

export interface AnalysisStats {
  totalImages: number
  signedImages: number
  aiDetected: number
  authenticated: number
}

export function useAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [stats, setStats] = useState<AnalysisStats>({
    totalImages: 0,
    signedImages: 0,
    aiDetected: 0,
    authenticated: 0
  })
  const [loading, setLoading] = useState(false)

  const fetchAnalyses = async (options?: {
    limit?: number
  }) => {
    setLoading(true)
    try {
      const limit = options?.limit ?? 50
      const payload = await fetchJson<Array<{
        id: number
        imageName: string
        analysisType: Analysis['analysisType']
        result: Analysis['result']
        confidence: number
        metadata: Record<string, unknown>
        createdAt: string
      }>>(`/api/analyses?limit=${limit}`)
      const list: Analysis[] = payload.map((item) => ({
        ...item,
        id: String(item.id),
      }))

      setAnalyses(list)
      const totalImages = list?.length ?? 0
      const signedImages = list.filter((a: Analysis) => 
        a.result === 'signed' || a.analysisType === 'signature'
      ).length
      const aiDetected = list.filter((a: Analysis) => 
        a.result === 'ai-generated'
      ).length
      const authenticated = list.filter((a: Analysis) => 
        a.result === 'authentic' || a.result === 'signed'
      ).length

      setStats({
        totalImages,
        signedImages,
        aiDetected,
        authenticated
      })
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  return {
    analyses,
    stats,
    loading,
    fetchAnalyses
  }
}
