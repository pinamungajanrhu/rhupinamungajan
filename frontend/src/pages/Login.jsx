import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Users, Stethoscope, Building } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(formData.username, formData.password)
    
    if (!result.success) {
      setLoading(false)
    }
  }

  const mockAccounts = [
    { role: 'barangay', username: 'barangay01', password: 'password123', icon: Building, color: 'blue' },
    { role: 'rhu', username: 'rhu01', password: 'password123', icon: Users, color: 'green' },
    { role: 'doctor', username: 'doctor01', password: 'password123', icon: Stethoscope, color: 'purple' }
  ]

  const fillCredentials = (username, password) => {
    setFormData({ username, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">RHU</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pinamungahan Health System
            </h1>
            <p className="text-gray-600">
              Sign in to your account
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="label text-gray-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input"
                placeholder="Enter your username"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="label text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Mock Accounts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-4 text-center">
              Test Accounts (Click to fill)
            </p>
            <div className="space-y-2">
              {mockAccounts.map((account, index) => {
                const Icon = account.icon
                return (
                  <motion.button
                    key={account.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    onClick={() => fillCredentials(account.username, account.password)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-8 h-8 bg-${account.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon size={16} className={`text-${account.color}-600`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {account.role === 'barangay' ? 'Barangay Encoder' : 
                         account.role === 'rhu' ? 'RHU Staff' : 'Doctor'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {account.username} / {account.password}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
