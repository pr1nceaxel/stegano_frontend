import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import SignImage from './components/SignImage'
import DetectAI from './components/DetectAI'
import Dashboard from './components/Dashboard'
import VerifyImage from './components/VerifyImage'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPanel from './components/AdminPanel'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1E293B] to-[#18181B]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/sign"
            element={
              <ProtectedRoute>
                <SignImage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <VerifyImage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detect"
            element={
              <ProtectedRoute>
                <DetectAI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
