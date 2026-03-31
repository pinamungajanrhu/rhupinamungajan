import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Calendar,
  MapPin,
  Shield,
  MoreVertical,
  Download,
  FileText,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { exportToExcel, exportToPDF } from '../utils/exportUtils'
import { PINAMUNGAHAN_BARANGAYS } from '../constants'

const Patients = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [barangayFilter, setBarangayFilter] = useState('')

  useEffect(() => {
    // For barangay users, barangayFilter should be their assigned barangay by default
    if (user?.role === 'barangay') {
      setBarangayFilter(user.barangay);
    }
    fetchPatients();
  }, [searchTerm, statusFilter, barangayFilter]);

  const fetchPatients = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      if (barangayFilter) params.append('barangay', barangayFilter)

      const response = await axios.get(`/api/residents?${params}`)
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending RHU Validation':
        return 'bg-yellow-100 text-yellow-800'
      case 'Awaiting Assessment':
        return 'bg-orange-100 text-orange-800'
      case 'Ready for Doctor Consultation':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPhilHealthStatus = (number) => {
    if (!number || number === '') {
      return { text: 'No PhilHealth', color: 'text-gray-500' }
    }
    return { text: 'For Verification', color: 'text-blue-600' }
  }

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}`)
  }

  const handleAssessment = (patientId) => {
    navigate(`/assessment/${patientId}`)
  }

  const handleEditPatient = (patientId) => {
    navigate(`/register?edit=${patientId}`)
  }

  const handleConsultation = (patientId) => {
    navigate(`/consultation/${patientId}`)
  }

  const formatPatientForExport = (patient) => ({
    "First Name": patient.first_name,
    "Last Name": patient.last_name,
    "Birthdate": new Date(patient.birthdate).toLocaleDateString(),
    "Mobile": patient.mobile || 'N/A',
    "Barangay": patient.barangay,
    "PhilHealth": patient.philhealth_number || 'N/A',
    "Status": patient.status
  });

  const handleExportExcel = () => {
    const data = patients.map(formatPatientForExport);
    const timestamp = new Date().toISOString().split('T')[0];
    exportToExcel(data, `patients_masterlist_${timestamp}`);
    toast.success('Excel exported successfully');
  };

  const handleExportPDFList = () => {
    const headers = ["Name", "Birthdate", "Mobile", "Barangay", "PhilHealth", "Status"];
    const data = patients.map(p => [
      `${p.first_name} ${p.last_name}`,
      new Date(p.birthdate).toLocaleDateString(),
      p.mobile || 'N/A',
      p.barangay,
      p.philhealth_number || 'N/A',
      p.status
    ]);
    const timestamp = new Date().toISOString().split('T')[0];
    exportToPDF(headers, data, `patients_masterlist_${timestamp}`, "Patients Masterlist Report");
    toast.success('PDF exported successfully');
  };

  const handleConfirmPatient = async (patientId) => {
    if (window.confirm('Confirm this patient for the masterlist? This marks them as Awaiting Assessment.')) {
      try {
        await axios.put(`/api/residents/${patientId}`, { status: 'Awaiting Assessment' });
        toast.success('Patient confirmed successfully');
        fetchPatients();
      } catch (error) {
        console.error('Error confirming patient:', error);
        toast.error('Failed to confirm patient');
      }
    }
  };

  const handleNewConsultation = async (patientId) => {
    if (window.confirm('Start a new encounter? This resets the patient status for a new assessment.')) {
      try {
        await axios.put(`/api/residents/${patientId}`, { status: 'Awaiting Assessment' });
        toast.success('Patient queued for new consultation');
        fetchPatients();
      } catch (error) {
        console.error('Error starting new consultation:', error);
        toast.error('Failed to queue patient');
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            className="btn-secondary flex items-center gap-2"
            title="Export patients to Excel"
          >
            <Download size={20} />
            Export Excel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDFList}
            className="btn-secondary text-primary-600 border-primary-200 hover:bg-primary-50 flex items-center gap-2"
            title="Export patients to PDF"
          >
            <FileText size={20} />
            Export PDF
          </motion.button>
          
          {(user?.role === 'barangay' || user?.role === 'rhu') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/barangay-assessment')}
              className="btn-primary"
            >
              <Plus size={20} className="mr-2" />
              Patient Registration
            </motion.button>
          )}
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="Pending RHU Validation">Pending RHU Validation (Review Queue)</option>
              <option value="Awaiting Assessment">Awaiting Assessment</option>
              <option value="Ready for Doctor Consultation">Ready for Doctor Consultation</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Barangay Filter (not for barangay users) */}
          {user?.role !== 'barangay' && (
            <div className="lg:w-64">
              <select
                value={barangayFilter}
                onChange={(e) => setBarangayFilter(e.target.value)}
                className="input"
              >
                <option value="">All Barangays</option>
                {PINAMUNGAHAN_BARANGAYS.map(barangay => (
                  <option key={barangay} value={barangay}>
                    {barangay}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Patients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Barangay</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">PhilHealth</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No patients found
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Born: {new Date(patient.birthdate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {patient.mobile && (
                          <p className="text-sm text-gray-600">{patient.mobile}</p>
                        )}
                        {patient.email && (
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{patient.barangay}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <p className={`text-sm font-medium ${getPhilHealthStatus(patient.philhealth_number).color}`}>
                          {getPhilHealthStatus(patient.philhealth_number).text}
                        </p>
                        {patient.philhealth_number && (
                          <p className="text-xs text-gray-500">{patient.philhealth_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePatientClick(patient.id)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </motion.button>
                        
                        {(user?.role === 'barangay' || user?.role === 'rhu') && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditPatient(patient.id)}
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                            title="Edit Patient"
                          >
                            <Edit size={16} />
                          </motion.button>
                        )}

                        {user?.role === 'rhu' && patient.status === 'Pending RHU Validation' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleConfirmPatient(patient.id)}
                            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Confirm Patient"
                          >
                            <CheckCircle2 size={16} />
                          </motion.button>
                        )}
                        
                        {user?.role === 'rhu' && patient.status === 'Awaiting Assessment' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAssessment(patient.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Fill Assessment"
                          >
                            <Edit size={16} />
                          </motion.button>
                        )}

                        {user?.role === 'rhu' && patient.status === 'Completed' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNewConsultation(patient.id)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="New Consultation"
                          >
                            <RefreshCw size={16} />
                          </motion.button>
                        )}
                        
                        {user?.role === 'doctor' && patient.status === 'Ready for Doctor Consultation' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleConsultation(patient.id)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Start Consultation"
                          >
                            <Calendar size={16} />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="card text-center">
          <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
          <p className="text-sm text-gray-600">Total Patients</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {patients.filter(p => p.status === 'Pending RHU Validation').length}
          </p>
          <p className="text-sm text-gray-600">Pending Validation</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">
            {patients.filter(p => p.status === 'Ready for Doctor Consultation').length}
          </p>
          <p className="text-sm text-gray-600">Ready for Consultation</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">
            {patients.filter(p => p.status === 'Completed').length}
          </p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Patients
