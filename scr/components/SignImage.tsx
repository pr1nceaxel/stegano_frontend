import React, { useEffect, useState } from 'react'
import { Upload, FileImage, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { postImageAndDownload } from '../lib/api'
import { useAuth } from '../hooks/useAuth'

export default function SignImage() {
  const { user } = useAuth()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [author, setAuthor] = useState<string>(user?.fullName || '')
  const [message, setMessage] = useState<string>('')
  const [algorithm, setAlgorithm] = useState<'dct' | 'lsb'>('dct')
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png')
  const [processing, setProcessing] = useState(false)
  const [successInfo, setSuccessInfo] = useState<{
    filename: string
    algorithm: string
  } | null>(null)

  useEffect(() => {
    if (user?.fullName) {
      setAuthor(user.fullName)
    }
  }, [user?.fullName])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
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
    }
  }

  const handleSign = async () => {
    if (!selectedFile || !author.trim()) return

    setProcessing(true)
    setSuccessInfo(null)
    
    try {
      const { blob, headers } = await postImageAndDownload('/api/sign', selectedFile, {
        author: author.trim(),
        message: message.trim(),
        algorithm,
        output_format: outputFormat,
      })
      const ext = outputFormat === 'jpeg' ? 'jpg' : 'png'
      const signedName = selectedFile.name.replace(/\.[a-zA-Z0-9]+$/, '') + '-signed.' + ext
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = signedName
      anchor.click()
      window.URL.revokeObjectURL(url)

      setSuccessInfo({
        filename: signedName,
        algorithm: headers.get('X-Stego-Algorithm') || 'DCT-DM',
      })
    } catch (error) {
      console.error('Error signing image:', error)
      alert(`Erreur lors de la signature: ${String(error)}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">Signer une Image</h1>
        <p className="text-gray-300">
          Ajoutez une signature cryptographique invisible à votre image pour prouver son authenticité
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-all bg-white/5 backdrop-blur-sm"
          >
            {!previewUrl ? (
              <>
                <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Glissez-déposez votre image
                </h3>
                <p className="text-gray-400 mb-4">ou</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg cursor-pointer transition-all">
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
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Changer l'image
                </button>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-cyan-400 font-semibold mb-1">Comment ça marche&nbsp;?</h4>
                <p className="text-sm text-gray-300">
                  Votre nom et votre message sont transformés en une preuve numérique sécurisée, puis discrètement
                  mélangés aux données de l&apos;image. Choisissez le mode <strong className="text-cyan-200">résistant</strong> pour
                  les photos souvent partagées en JPEG, ou le mode <strong className="text-cyan-200">sensible</strong> uniquement pour des tests
                  (très fragile si l&apos;image est recompressée).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-3">
              Auteur
            </label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nom de l'auteur"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-3">Mode de signature</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as 'dct' | 'lsb')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="dct">Résistant — conseillé pour la plupart des images (photos, JPEG)</option>
                <option value="lsb">Sensible — uniquement pour essais (perdu si forte compression)</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">Format du fichier téléchargé</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpeg')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="png">PNG — qualité maximale (recommandé avec le mode sensible)</option>
                <option value="jpeg">JPEG — comme une photo classique (léger flou possible)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-3">
              Message de signature (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Entrez votre signature ou message à intégrer..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <p className="text-sm text-gray-400 mt-2">
              Maximum 500 caractères
            </p>
          </div>

          <button
            onClick={handleSign}
            disabled={!selectedFile || !author.trim() || processing}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/30"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Signer l'Image
              </>
            )}
          </button>

          {processing && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-white font-medium">Intégration de la signature...</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {successInfo && !processing && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm text-gray-200">
              <div className="flex items-center gap-2 text-green-400 font-semibold mb-1">
                <CheckCircle className="w-4 h-4" />
                Signature terminée
              </div>
              <p>Fichier enregistré sur votre ordinateur : {successInfo.filename}</p>
              <p className="text-gray-400">
                Détail technique (méthode d’insertion) : {successInfo.algorithm}
              </p>
              <p className="text-gray-400">Si le téléchargement ne démarre pas, vérifiez les bloqueurs de fenêtres du navigateur.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
