import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Users, Stethoscope, Building, ArrowLeft } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(formData.username, formData.password)
    
    if (!result.success) {
      setLoading(false)
    }
  }

  const mockAccounts = [
    { role: 'barangay', username: 'barangay01', password: 'password123', icon: Building, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    { role: 'rhu', username: 'rhu01', password: 'password123', icon: Users, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
    { role: 'doctor', username: 'doctor01', password: 'password123', icon: Stethoscope, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' }
  ]

  const fillCredentials = (username, password) => {
    setFormData({ username, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-white dark:border-slate-800">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </motion.button>

          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              Pinamungajan Health Care System
            </h1>
            <p className="text-gray-600 dark:text-slate-400 font-medium">
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
              <label className="label text-gray-700 dark:text-slate-300 font-bold">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Enter your username"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="label text-gray-700 dark:text-slate-300 font-bold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
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
              className="btn-primary w-full py-3 text-base font-bold disabled:opacity-50 shadow-lg shadow-primary-500/30"
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
            className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800"
          >
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 text-center font-bold">
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
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={`w-8 h-8 ${account.bgColor} dark:bg-opacity-20 rounded-lg flex items-center justify-center`}>
                      <Icon size={16} className={account.iconColor} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-gray-900 dark:text-white capitalize leading-none">
                        {account.role === 'barangay' ? 'Barangay Encoder' : 
                         account.role === 'rhu' ? 'RHU Staff' : 'Doctor'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
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
