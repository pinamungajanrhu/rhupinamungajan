import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  Pill, 
  ArrowLeft,
  Download,
  Shield,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react'
import axios from 'axios'
import { exportSinglePatientToXML, downloadXML } from '../utils/xmlExport'
import { useAuth } from '../contexts/AuthContext'

const PatientProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [patient, setPatient] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [yakapId, setYakapId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')

  const tabs = [
    { id: 'info', label: 'Information', icon: User },
    { id: 'assessment', label: 'Assessment', icon: FileText },
    { id: 'consultations', label: 'Consultations', icon: Heart },
    { id: 'prescriptions', label: 'Prescriptions', icon: Activity }
  ]

  useEffect(() => {
    fetchPatientData()
  }, [id])

  const fetchPatientData = async () => {
    try {
      const [patientRes, assessmentRes, consultationRes, yakapRes] = await Promise.all([
        axios.get(`/api/residents/${id}`),
        axios.get(`/api/assessments/resident/${id}`).catch(() => null),
        axios.get(`/api/consultations/resident/${id}`),
        axios.get(`/api/consultations/yakap/${id}`).catch(() => null)
      ])

      setPatient(patientRes.data)
      if (assessmentRes?.data) setAssessment(assessmentRes.data)
      setConsultations(consultationRes.data)
      if (yakapRes?.data) setYakapId(yakapRes.data)
    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportXML = async () => {
    try {
      const xml = await exportSinglePatientToXML(id, axios)
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `patient_${patient?.first_name}_${patient?.last_name}_${timestamp}.xml`
      downloadXML(xml, filename)
    } catch (error) {
      console.error('Error exporting patient:', error)
      alert('Failed to export patient data')
    }
  }

  const getPhilHealthStatus = (number) => {
    if (!number || number === '') {
      return { text: 'No PhilHealth', color: 'text-gray-500' }
    }
    return { text: 'For Verification', color: 'text-blue-600' }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending RHU Validation':
        return 'bg-yellow-100 text-yellow-800'
      case 'Ready for Doctor Consultation':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthConditionColor = (condition) => {
    switch (condition) {
      case 'Healthy':
        return 'bg-green-100 text-green-800'
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'Sick':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient not found</p>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab patient={patient} user={user} />
      case 'assessment':
        return <AssessmentTab assessment={assessment} />
      case 'consultations':
        return <ConsultationsTab consultations={consultations} user={user} />
      case 'prescriptions':
        return <PrescriptionsTab consultations={consultations} user={user} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/patients')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patient?.first_name} {patient?.last_name}
            </h1>
            <p className="text-gray-600">Patient Profile</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportXML}
          className="btn-secondary flex items-center gap-2"
          title="Export patient data to XML"
        >
          <Download size={20} />
          Export XML
        </motion.button>
      </div>

      {/* Patient Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="font-semibold text-gray-900">
                {patient.first_name} {patient.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Barangay</p>
              <p className="font-semibold text-gray-900">{patient.barangay}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                {patient.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-semibold text-gray-900">
                {new Date().getFullYear() - new Date(patient.birthdate).getFullYear()} years
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="card p-2">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Info Tab Component
const InfoTab = ({ patient, user }) => {
  const getPhilHealthStatus = (number) => {
    if (!number || number === '') {
      return { text: 'No PhilHealth', color: 'text-gray-500' }
    }
    return { text: 'For Verification', color: 'text-blue-600' }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-primary-600" />
          Personal Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Full Name</span>
            <span className="text-sm font-medium text-gray-900">
              {patient.first_name} {patient.middle_name} {patient.last_name} {patient.suffix}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Birthdate</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(patient.birthdate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Sex</span>
            <span className="text-sm font-medium text-gray-900">{patient.sex}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Civil Status</span>
            <span className="text-sm font-medium text-gray-900">{patient.civil_status || 'Not specified'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Blood Type</span>
            <span className="text-sm font-medium text-gray-900">{patient.blood_type || 'Not specified'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Occupation</span>
            <span className="text-sm font-medium text-gray-900">{patient.occupation || 'Not specified'}</span>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone size={20} className="text-primary-600" />
          Contact Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Mobile Number</span>
            <span className="text-sm font-medium text-gray-900">{patient.mobile}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium text-gray-900">{patient.email || 'Not specified'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Address</span>
            <span className="text-sm font-medium text-gray-900 text-right">
              {patient.number_street && `${patient.number_street}, `}<br />
              {patient.barangay}, {patient.city_municipality}<br />
              {patient.province}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Health Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart size={20} className="text-primary-600" />
          Health Information
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">PhilHealth Status</span>
            <span className={`text-sm font-medium ${getPhilHealthStatus(patient.philhealth_number).color}`}>
              {getPhilHealthStatus(patient.philhealth_number).text}
            </span>
          </div>
          
          {patient.philhealth_number && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">PhilHealth Number</span>
              <span className="text-sm font-medium text-gray-900">{patient.philhealth_number}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Current Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              patient.status === 'Pending RHU Validation' ? 'bg-yellow-100 text-yellow-800' :
              patient.status === 'Ready for Doctor Consultation' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {patient.status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Registration Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-primary-600" />
          Registration Details
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Registration Date</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(patient.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Last Updated</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(patient.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Assessment Tab Component
const AssessmentTab = ({ assessment }) => {
  if (!assessment) {
    return (
      <div className="card text-center py-8">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No assessment data available</p>
      </div>
    )
  }

  return (
    <div className="card space-y-6">
      <div className="flex items-center gap-3">
        <FileText size={20} className="text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Health Risk Assessment Results</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600">Consultation Date</p>
          <p className="font-medium text-gray-900">
            {new Date(assessment.consultation_date).toLocaleDateString()}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Assessed By</p>
          <p className="font-medium text-gray-900">{assessment.assessed_by}</p>
        </div>

        {assessment.type_of_exposure && (
          <div>
            <p className="text-sm text-gray-600">Type of Exposure</p>
            <p className="font-medium text-gray-900">{assessment.type_of_exposure}</p>
          </div>
        )}

        {assessment.comorbidities && (
          <div>
            <p className="text-sm text-gray-600">Comorbidities</p>
            <p className="font-medium text-gray-900">{assessment.comorbidities}</p>
          </div>
        )}
      </div>

      {assessment.diagnosis && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Diagnosis</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900">{assessment.diagnosis}</p>
          </div>
        </div>
      )}

      {assessment.treatment_plan && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Treatment Plan</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900">{assessment.treatment_plan}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Consultations Tab Component
const ConsultationsTab = ({ consultations, user }) => {
  if (consultations.length === 0) {
    return (
      <div className="card text-center py-8">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No consultations available</p>
      </div>
    )
  }

  const getHealthConditionColor = (condition) => {
    switch (condition) {
      case 'Healthy':
        return 'bg-green-100 text-green-800'
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'Sick':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation, index) => (
        <motion.div
          key={consultation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Heart size={20} className="text-primary-600" />
                <h4 className="font-semibold text-gray-900">Consultation #{index + 1}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getHealthConditionColor(consultation.health_condition)}`}>
                  {consultation.health_condition}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="text-sm font-medium text-gray-900">{consultation.doctor_name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Illness Type</p>
                  <p className="text-sm font-medium text-gray-900">{consultation.illness_type}</p>
                </div>

                {consultation.follow_up_date && (
                  <div>
                    <p className="text-sm text-gray-600">Follow-up Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(consultation.follow_up_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {user?.role !== 'barangay' && (
                <>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Diagnosis</p>
                    <p className="text-gray-900">{consultation.diagnosis}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Findings</p>
                    <p className="text-gray-900">{consultation.findings}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Prescriptions Tab Component
const PrescriptionsTab = ({ consultations, user }) => {
  const prescriptions = consultations.filter(c => c.prescription && user?.role !== 'barangay')

  if (prescriptions.length === 0) {
    return (
      <div className="card text-center py-8">
        <Activity size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No prescriptions available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((consultation, index) => (
        <motion.div
          key={consultation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-3">
            <Activity size={20} className="text-primary-600" />
            <h4 className="font-semibold text-gray-900">Prescription from {new Date(consultation.created_at).toLocaleDateString()}</h4>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{consultation.prescription}</p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">Prescribed by: {consultation.doctor_name}</p>
            {consultation.follow_up_date && (
              <p className="text-sm text-gray-600">
                Follow-up: {new Date(consultation.follow_up_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PatientProfile
