import React, { useState } from 'react'
import { Upload, FileImage, ScanEye, AlertTriangle, CheckCircle } from 'lucide-react'
import { postImageForm } from '../lib/api'

export default function DetectAI() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<{
    isAI: boolean
    confidence: number
    details: string
    signals?: Record<string, number>
  } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setAnalyzing(true)
    try {
      const apiResult = await postImageForm<{
        isAI: boolean
        confidence: number
        details: string
        signals: Record<string, number>
      }>('/api/detect-ai', selectedFile)
      setResult(apiResult)
    } catch (error) {
      alert(`Erreur pendant l'analyse: ${String(error)}`)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Détection Image IA</h1>
        <p className="text-gray-300">
          Analysez une image pour déterminer si elle a été générée par une intelligence artificielle
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-amber-500/30 rounded-xl p-8 text-center hover:border-amber-500/50 transition-all bg-white/5 backdrop-blur-sm"
          >
            {!previewUrl ? (
              <>
                <Upload className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Glissez-déposez votre image
                </h3>
                <p className="text-gray-400 mb-4">ou</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg cursor-pointer transition-all">
                  <FileImage className="w-5 h-5" />
                  Choisir un fichier
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-400 mt-4">PNG, JPG, WEBP jusqu'à 10MB</p>
              </>
            ) : (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl('')
                    setResult(null)
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Changer l'image
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || analyzing}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/30"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <ScanEye className="w-5 h-5" />
                Analyser l'Image
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div>
          {analyzing && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Analyse en cours</h3>
                  <p className="text-gray-400">Extraction des caractéristiques visuelles...</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Analyse spectrale</span>
                    <span className="text-amber-400">En cours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Détection d'artefacts</span>
                    <span className="text-amber-400">En cours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Patterns de génération</span>
                    <span className="text-gray-500">En attente</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && !analyzing && (
            <div className={`bg-white/5 backdrop-blur-sm border rounded-xl p-8 ${
              result.isAI ? 'border-amber-500/30' : 'border-green-500/30'
            }`}>
              <div className="text-center space-y-6">
                {result.isAI ? (
                  <AlertTriangle className="w-20 h-20 text-amber-400 mx-auto" />
                ) : (
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                )}
                
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    result.isAI ? 'text-amber-400' : 'text-green-400'
                  }`}>
                    {result.isAI ? 'Image Générée par IA' : 'Image Authentique'}
                  </h3>
                  <p className="text-gray-300">{result.details}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Niveau de confiance</span>
                    <span className={`text-2xl font-bold ${
                      result.isAI ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {result.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.isAI ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      result.isAI ? 'bg-amber-400' : 'bg-green-400'
                    }`} />
                    <span className="text-sm text-gray-300">
                      Signature spectrale: {result.isAI ? 'Anormale' : 'Normale'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      result.isAI ? 'bg-amber-400' : 'bg-green-400'
                    }`} />
                    <span className="text-sm text-gray-300">
                      Artefacts de compression: {result.isAI ? 'Détectés' : 'Absents'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      result.isAI ? 'bg-amber-400' : 'bg-green-400'
                    }`} />
                    <span className="text-sm text-gray-300">
                      Patterns GAN: {result.isAI ? 'Identifiés' : 'Non détectés'}
                    </span>
                  </div>
                </div>

                {result.signals && (
                  <div className="bg-white/5 rounded-lg p-4 text-left">
                    <h4 className="text-white font-semibold mb-2">Signaux techniques</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Laplacian variance: {result.signals.laplacianVariance}</p>
                      <p>High frequency energy: {result.signals.highFrequencyEnergy}</p>
                      <p>Blockiness: {result.signals.blockiness}</p>
                      <p>Channel correlation: {result.signals.channelCorrelation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!result && !analyzing && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
              <ScanEye className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">En attente d'analyse</h3>
              <p className="text-gray-400">
                Uploadez une image et lancez l'analyse pour détecter si elle a été générée par une IA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
