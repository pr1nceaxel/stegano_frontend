import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
}) {
  const { loading, isAuthenticated, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-300">
        Vérification de la session...
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
