import React from 'react'
import { Link } from 'react-router-dom'
import {Shield, ScanEye, Lock, Sparkles, ArrowRight} from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-20 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Authentification par Stéganographie</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Protégez et Authentifiez
          <br />
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Vos Créations Visuelles
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          SteganographIA combine la stéganographie avancée et l'intelligence artificielle 
          pour authentifier le contenu créé par des artistes et détecter les images générées par IA.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/sign"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            <Lock className="w-5 h-5" />
            Signer une Image
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 transition-all"
          >
            <ScanEye className="w-5 h-5" />
            Détecter Image IA
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-8 hover:bg-white/10 transition-all">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Signature Invisible</h3>
          <p className="text-gray-300">
            Ajoutez une signature cryptographique invisible à vos images grâce à la stéganographie, 
            protégeant ainsi votre propriété intellectuelle.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-xl p-8 hover:bg-white/10 transition-all">
          <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
            <ScanEye className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Détection IA</h3>
          <p className="text-gray-300">
            Analysez les images pour identifier celles générées par des intelligences artificielles 
            grâce à des algorithmes de computer vision avancés.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 hover:bg-white/10 transition-all">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Vérification Authentique</h3>
          <p className="text-gray-300">
            Vérifiez l'authenticité des images signées et identifiez instantanément 
            les contenus protégés par stéganographie.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">256-bit</div>
            <div className="text-gray-300">Cryptographie</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">95%+</div>
            <div className="text-gray-300">Précision Détection</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">Résistant</div>
            <div className="text-gray-300">Aux Compressions</div>
          </div>
        </div>
      </div>
    </div>
  )
}
