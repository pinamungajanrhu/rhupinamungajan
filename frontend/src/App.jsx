import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import RegisterPatient from './pages/RegisterPatient'
import PatientProfile from './pages/PatientProfile'
import Assessment from './pages/Assessment'
import Consultation from './pages/Consultation'
import Reports from './pages/Reports'
import Landing from './pages/Landing'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />

        {/* Protected Routes */}
        {user ? (
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="register" element={<RegisterPatient />} />
            <Route path="patient/:id" element={<PatientProfile />} />
            <Route path="assessment/:id" element={<Assessment />} />
            <Route path="consultation/:id" element={<Consultation />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </AnimatePresence>
  )
}

export default App
