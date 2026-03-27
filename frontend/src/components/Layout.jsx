import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  UserPlus, 
  FileText, 
  LogOut,
  Menu,
  X,
  ArrowLeft,
  BarChart3
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024) // Start open on desktop, closed on mobile

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true) // Always open on desktop
      } else {
        setSidebarOpen(false) // Always closed on mobile
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleBack = () => {
    // Smart back navigation
    if (location.pathname.startsWith('/patient/')) {
      navigate('/patients')
    } else if (location.pathname.startsWith('/assessment/')) {
      navigate('/patients')
    } else if (location.pathname.startsWith('/consultation/')) {
      navigate('/patients')
    } else if (location.pathname === '/register') {
      navigate('/patients')
    } else if (location.pathname === '/reports') {
      navigate('/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    ...(user?.role === 'barangay' ? [
      { path: '/register', icon: UserPlus, label: 'Register Patient' },
      { path: '/barangay-assessment', icon: FileText, label: 'PCHRAT Assessment' }
    ] : []),
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      barangay: 'Barangay Encoder',
      rhu: 'RHU Staff',
      doctor: 'Doctor'
    }
    return roleNames[role] || role
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-40 lg:translate-x-0 lg:static lg:z-0 lg:block transition-transform duration-300`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Pinamungahan</h1>
              <p className="text-xs text-gray-500">Health System</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false)
                    }
                  }}
                  className={`sidebar-item w-full ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</p>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              {/* Back button for non-dashboard pages */}
              {location.pathname !== '/dashboard' && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  title="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {location.pathname === '/dashboard' && 'Dashboard'}
                  {location.pathname === '/patients' && 'Patients'}
                  {location.pathname === '/register' && 'Register Patient'}
                  {location.pathname === '/reports' && 'Reports'}
                  {location.pathname.startsWith('/patient/') && 'Patient Profile'}
                  {location.pathname.startsWith('/assessment/') && 'Health Assessment'}
                  {location.pathname.startsWith('/consultation/') && 'Doctor Consultation'}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</p>
              </div>
              
              {/* Logout button for mobile */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 lg:hidden"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout
