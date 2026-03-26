import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Heart, 
  Shield, 
  TrendingUp,
  Activity,
  Calendar,
  Filter
} from 'lucide-react'
import axios from 'axios'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { useAuth } from '../contexts/AuthContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [illnessTypes, setIllnessTypes] = useState([])
  const [barangayDistribution, setBarangayDistribution] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBarangay, setSelectedBarangay] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedBarangay])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, illnessRes, barangayRes, activityRes] = await Promise.all([
        axios.get('/api/dashboard/stats', { params: { barangay: selectedBarangay } }),
        axios.get('/api/dashboard/illness-types', { params: { barangay: selectedBarangay } }),
        axios.get('/api/dashboard/barangay-distribution', { params: { barangay: selectedBarangay } }),
        axios.get('/api/dashboard/recent-activity', { params: { barangay: selectedBarangay } })
      ])

      setStats(statsRes.data)
      setIllnessTypes(illnessRes.data)
      setBarangayDistribution(barangayRes.data)
      setRecentActivity(activityRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const illnessTypeChartData = {
    labels: illnessTypes.map(item => item.illness_type || 'Unknown'),
    datasets: [
      {
        data: illnessTypes.map(item => item.count),
        backgroundColor: [
          '#22c55e',
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#8b5cf6',
          '#ec4899'
        ],
        borderWidth: 0
      }
    ]
  }

  const healthConditionChartData = {
    labels: ['Healthy', 'At Risk', 'Sick', 'Unknown'],
    datasets: [
      {
        label: 'Patients',
        data: stats ? [
          stats.byHealthCondition['Healthy'],
          stats.byHealthCondition['At Risk'],
          stats.byHealthCondition['Sick'],
          stats.byHealthCondition['Unknown']
        ] : [],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#6b7280'],
        borderWidth: 0
      }
    ]
  }

  const barangayChartData = {
    labels: barangayDistribution.slice(0, 5).map(item => item.barangay),
    datasets: [
      {
        label: 'Patients',
        data: barangayDistribution.slice(0, 5).map(item => item.count),
        backgroundColor: '#22c55e',
        borderRadius: 6
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    }
  }

  const StatCard = ({ icon: Icon, title, value, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <motion.p 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
            className="text-2xl font-bold text-gray-900"
          >
            {value}
          </motion.p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of health system statistics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="input w-48"
          >
            <option value="">All Barangays</option>
            {barangayDistribution.map(item => (
              <option key={item.barangay} value={item.barangay}>
                {item.barangay}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Patients" 
          value={stats?.totalPatients || 0} 
          color="bg-blue-500"
          delay={0.1}
        />
        <StatCard 
          icon={Heart} 
          title="Healthy" 
          value={stats?.byHealthCondition['Healthy'] || 0} 
          color="bg-green-500"
          delay={0.2}
        />
        <StatCard 
          icon={Shield} 
          title="At Risk" 
          value={stats?.byHealthCondition['At Risk'] || 0} 
          color="bg-yellow-500"
          delay={0.3}
        />
        <StatCard 
          icon={Activity} 
          title="Sick" 
          value={stats?.byHealthCondition['Sick'] || 0} 
          color="bg-red-500"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Condition Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Condition</h3>
          <div className="h-64">
            <Pie data={healthConditionChartData} options={pieChartOptions} />
          </div>
        </motion.div>

        {/* Illness Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Illness Types</h3>
          <div className="h-64">
            <Pie data={illnessTypeChartData} options={pieChartOptions} />
          </div>
        </motion.div>

        {/* Barangay Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Barangays</h3>
          <div className="h-64">
            <Bar data={barangayChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Status and PhilHealth Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Status</h3>
          <div className="space-y-3">
            {[
              { status: 'Pending RHU Validation', count: stats?.byStatus['Pending RHU Validation'] || 0, color: 'yellow' },
              { status: 'Ready for Doctor Consultation', count: stats?.byStatus['Ready for Doctor Consultation'] || 0, color: 'blue' },
              { status: 'Completed', count: stats?.byStatus['Completed'] || 0, color: 'green' }
            ].map((item, index) => (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${item.color}-100 text-${item.color}-800`}>
                  {item.count}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PhilHealth Coverage */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">PhilHealth Coverage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">With PhilHealth</span>
              <span className="font-semibold text-gray-900">
                {stats?.philhealthCoverage?.withPhilhealth || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Without PhilHealth</span>
              <span className="font-semibold text-gray-900">
                {(stats?.philhealthCoverage?.total || 0) - (stats?.philhealthCoverage?.withPhilhealth || 0)}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Coverage Rate</span>
                <span className="text-lg font-bold text-primary-600">
                  {stats?.philhealthCoverage?.percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.philhealthCoverage?.percentage || 0}%` }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="bg-primary-600 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Activity size={20} className="text-gray-500" />
        </div>
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {activity.first_name} {activity.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.barangay} • {activity.activity_type.replace(/_/g, ' ')}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
