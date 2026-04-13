import React, { useState } from 'react'
import { Upload, FileImage, ShieldCheck, ShieldAlert, CircleHelp } from 'lucide-react'
import { postImageForm } from '../lib/api'

type VerifyResult = {
  result: 'authentic' | 'unsigned' | 'tampered'
  confidence: number
  message: string
  payload?: {
    author?: string
    message?: string
    issuedAt?: string
    version?: string
  } | null
}

export default function VerifyImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<VerifyResult | null>(null)

  const onFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
  }

  const handleVerify = async () => {
    if (!selectedFile) return
    setVerifying(true)
    try {
      const verifyResult = await postImageForm<VerifyResult>('/api/verify', selectedFile)
      setResult(verifyResult)
    } catch (error) {
      alert(`Erreur pendant la vérification: ${String(error)}`)
    } finally {
      setVerifying(false)
    }
  }

  const resultStyle =
    result?.result === 'authentic'
      ? 'border-green-500/30'
      : result?.result === 'tampered'
        ? 'border-red-500/30'
        : 'border-yellow-500/30'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Vérifier une Signature</h1>
        <p className="text-gray-300">
          Chargez une image signée par la plateforme pour valider son authenticité.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              onFile(e.dataTransfer.files?.[0])
            }}
            className="border-2 border-dashed border-blue-500/30 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all bg-white/5"
          >
            {!previewUrl ? (
              <>
                <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Glissez-déposez votre image</h3>
                <p className="text-gray-400 mb-4">ou</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg cursor-pointer transition-all">
                  <FileImage className="w-5 h-5" />
                  Choisir un fichier
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFile(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="space-y-4">
                <img src={previewUrl} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
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
            onClick={handleVerify}
            disabled={!selectedFile || verifying}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
          >
            {verifying ? 'Vérification en cours...' : 'Vérifier la signature'}
          </button>
        </div>

        <div>
          {result ? (
            <div className={`bg-white/5 border ${resultStyle} rounded-xl p-8`}>
              <div className="text-center space-y-5">
                {result.result === 'authentic' ? (
                  <ShieldCheck className="w-20 h-20 text-green-400 mx-auto" />
                ) : result.result === 'tampered' ? (
                  <ShieldAlert className="w-20 h-20 text-red-400 mx-auto" />
                ) : (
                  <CircleHelp className="w-20 h-20 text-yellow-400 mx-auto" />
                )}
                <h3 className="text-2xl font-bold text-white">{result.message}</h3>
                <p className="text-gray-300">Confiance: {result.confidence}%</p>

                {result.payload && (
                  <div className="bg-white/5 rounded-lg p-4 text-left text-sm text-gray-300 space-y-1">
                    <p>Auteur: {result.payload.author || 'N/A'}</p>
                    <p>Message: {result.payload.message || 'N/A'}</p>
                    <p>Date: {result.payload.issuedAt || 'N/A'}</p>
                    <p>Version: {result.payload.version || 'N/A'}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
              En attente de vérification.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
