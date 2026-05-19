import React, { useEffect, useState } from 'react'
import { X, Calendar, FileImage, Gauge, Tag, Info, ImageOff } from 'lucide-react'
import type { Analysis } from '../hooks/useAnalyses'
import { fetchBlob } from '../lib/api'

const TYPE_LABELS: Record<Analysis['analysisType'], string> = {
  signature: 'Signature d’image',
  verification: 'Vérification de signature',
  'ai-detection': 'Détection IA',
}

const RESULT_LABELS: Record<Analysis['result'], string> = {
  authentic: 'Authentique',
  'ai-generated': 'Probablement générée par IA',
  signed: 'Signée',
  unsigned: 'Non signée',
  tampered: 'Modifiée ou invalide',
}

const METADATA_LABELS: Record<string, string> = {
  author: 'Auteur',
  message: 'Message',
  userEmail: 'Compte',
  userId: 'Référence compte',
  algorithm: 'Méthode utilisée',
  processingTimeMs: 'Durée (millisecondes)',
  inputFormat: 'Format du fichier',
  hasToken: 'Données lues dans l’image',
  signatureScheme: 'Type de preuve',
  embeddedBits: 'Données intégrées (bits)',
  dimensions: 'Dimensions',
  guidance: 'Explication',
  formatWarnings: 'Avertissements',
  signals: 'Signaux analysés',
  details: 'Détails',
  modelVersion: 'Version du modèle',
  deepClassifierStatus: 'Statut analyse avancée',
  stegoCapacity: 'Capacité de l’image',
}

function formatMetadataValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (typeof value === 'object') {
    if (key === 'signals' && value && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ')
    }
    if (Array.isArray(value)) return value.join(' ; ')
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

type Props = {
  analysis: Analysis | null
  onClose: () => void
}

export default function AnalysisDetailModal({ analysis, onClose }: Props) {
  if (!analysis) return null

  const metaEntries = Object.entries(analysis.metadata || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== '',
  )

  return (
    <ModalBackdrop onClose={onClose}>
      <AnalysisDetailDialog analysis={analysis} metaEntries={metaEntries} onClose={onClose} />
    </ModalBackdrop>
  )
}

function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      {children}
    </div>
  )
}

function AnalysisDetailDialog({
  analysis,
  metaEntries,
  onClose,
}: {
  analysis: Analysis
  metaEntries: [string, unknown][]
  onClose: () => void
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewMissing, setPreviewMissing] = useState(false)

  useEffect(() => {
    let objectUrl: string | null = null
    setPreviewUrl(null)
    setPreviewMissing(false)

    if (!analysis.hasPreview) {
      setPreviewMissing(true)
      return
    }

    setPreviewLoading(true)
    void fetchBlob(`/api/analyses/${analysis.id}/preview`).then((blob) => {
      if (blob) {
        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
        setPreviewMissing(false)
      } else {
        setPreviewMissing(true)
      }
      setPreviewLoading(false)
    })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [analysis.id, analysis.hasPreview])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analysis-detail-title"
      className="w-full max-w-2xl bg-[#12182e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-xs text-cyan-400 font-medium uppercase tracking-wide mb-1">
            Détail de l’analyse
          </p>
          <h2 id="analysis-detail-title" className="text-xl font-bold text-white break-words">
            {analysis.imageName}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
        <section>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Image analysée</h3>
          <PreviewBox
            previewLoading={previewLoading}
            previewUrl={previewUrl}
            previewMissing={previewMissing}
            imageName={analysis.imageName}
          />
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          <InfoRow icon={FileImage} label="Fichier" value={analysis.imageName} />
          <InfoRow icon={Tag} label="Type d’analyse" value={TYPE_LABELS[analysis.analysisType]} />
          <InfoRow icon={Gauge} label="Résultat" value={RESULT_LABELS[analysis.result] || analysis.result} />
          <InfoRow icon={Gauge} label="Indice de confiance" value={`${analysis.confidence.toFixed(1)} %`} />
          <InfoRow
            icon={Calendar}
            label="Date"
            value={new Date(analysis.createdAt).toLocaleString('fr-FR')}
          />
        </section>

        {metaEntries.length > 0 ? (
          <section>
            <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Informations complémentaires
            </h3>
            <dl className="space-y-3">
              {metaEntries.map(([key, value]) => (
                <MetaRow
                  key={key}
                  label={METADATA_LABELS[key] || key}
                  value={formatMetadataValue(key, value)}
                  multiline={
                    typeof value === 'object' && !Array.isArray(value) && key !== 'signals'
                  }
                />
              ))}
            </dl>
          </section>
        ) : (
          <p className="text-gray-400 text-sm">Aucune information supplémentaire enregistrée.</p>
        )}
      </div>

      <div className="px-6 py-4 border-t border-white/10 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}

function PreviewBox({
  previewLoading,
  previewUrl,
  previewMissing,
  imageName,
}: {
  previewLoading: boolean
  previewUrl: string | null
  previewMissing: boolean
  imageName: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden flex items-center justify-center min-h-[160px]">
      {previewLoading ? (
        <div className="py-12 text-gray-400 text-sm flex flex-col items-center gap-2">
          <span className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          Chargement de l&apos;aperçu…
        </div>
      ) : previewUrl ? (
        <img src={previewUrl} alt={`Aperçu de ${imageName}`} className="max-h-72 w-full object-contain" />
      ) : (
        <PreviewPlaceholder missing={previewMissing} />
      )}
    </div>
  )
}

function PreviewPlaceholder({ missing }: { missing: boolean }) {
  return (
    <div className="py-10 px-6 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
      <ImageOff className="w-10 h-10 text-gray-600" />
      {missing
        ? 'Aperçu non disponible (analyse effectuée avant l’enregistrement des images, ou fichier supprimé).'
        : 'Impossible d’afficher l’aperçu.'}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
      <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
      <div>
        <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
        <dd className="text-white text-sm mt-0.5 break-words">{value}</dd>
      </div>
    </div>
  )
}

function MetaRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string
  multiline?: boolean
}) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
      <dt className="text-xs text-gray-500 mb-1">{label}</dt>
      <dd
        className={`text-sm text-gray-200 ${multiline ? 'whitespace-pre-wrap font-mono text-xs' : 'break-words'}`}
      >
        {value}
      </dd>
    </div>
  )
}
