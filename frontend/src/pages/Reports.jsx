import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Download, 
  Calendar,
  Filter,
  Users,
  FileText,
  Activity
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { exportToExcel, exportToPDF } from '../utils/exportUtils'

const Reports = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  })
  const [selectedBarangay, setSelectedBarangay] = useState('')
  const [barangays, setBarangays] = useState([])

  useEffect(() => {
    fetchBarangays()
  }, [])

  const fetchBarangays = async () => {
    try {
      const response = await axios.get('/api/residents/barangays/list')
      setBarangays(response.data)
    } catch (error) {
      console.error('Error fetching barangays:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReportData = async () => {
    try {
      const params = new URLSearchParams()
      if (dateRange.from) params.append('dateFrom', dateRange.from)
      if (dateRange.to) params.append('dateTo', dateRange.to)
      if (selectedBarangay) params.append('barangay', selectedBarangay)

      const response = await axios.get(`/api/consultations?${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching report data:', error)
      toast.error('Failed to fetch report data')
      return []
    }
  }

  const handleExportExcel = async () => {
    const data = await fetchReportData()
    if (!data.length) return toast('No data found for these filters', { icon: 'ℹ️' });
    
    const formattedData = data.map(c => ({
      "Date": new Date(c.created_at).toLocaleDateString(),
      "Patient Name": `${c.first_name} ${c.last_name}`,
      "Barangay": c.barangay,
      "Doctor": c.doctor_name,
      "Diagnosis": c.diagnosis || 'N/A',
      "Prescription": c.prescription || 'N/A'
    }));

    exportToExcel(formattedData, `consultations_report_${new Date().getTime()}`);
    toast.success('Excel exported successfully');
  }

  const handleExportPDF = async () => {
    const data = await fetchReportData()
    if (!data.length) return toast('No data found for these filters', { icon: 'ℹ️' });

    const headers = ["Date", "Patient Name", "Barangay", "Doctor", "Diagnosis", "Prescription"];
    const rows = data.map(c => [
      new Date(c.created_at).toLocaleDateString(),
      `${c.first_name} ${c.last_name}`,
      c.barangay,
      c.doctor_name,
      c.diagnosis || 'N/A',
      c.prescription || 'N/A'
    ]);

    exportToPDF(headers, rows, `consultations_report_${new Date().getTime()}`, "Consultations Report");
    toast.success('PDF exported successfully');
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and export system reports</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={20} />
            Export Excel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="btn-primary flex items-center gap-2"
          >
            <FileText size={20} />
            Export PDF
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <Filter size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label text-gray-700">From Date</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="input"
            />
          </div>
          
          <div>
            <label className="label text-gray-700">To Date</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="input"
            />
          </div>
          
          <div>
            <label className="label text-gray-700">Barangay</label>
            <select
              value={selectedBarangay}
              onChange={(e) => setSelectedBarangay(e.target.value)}
              className="input"
            >
              <option value="">All Barangays</option>
              {barangays.map(barangay => (
                <option key={barangay} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Patient Registry</h4>
              <p className="text-sm text-gray-600">Complete list of all patients</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity size={24} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Health Assessments</h4>
              <p className="text-sm text-gray-600">PCHRAT assessment reports</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Consultations</h4>
              <p className="text-sm text-gray-600">Doctor consultation summaries</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-4">
          <FileText size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">
            Select filters and click generate to preview report
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            Generate Report
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
          </div>
        </div>
        
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No reports generated yet</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Reports
