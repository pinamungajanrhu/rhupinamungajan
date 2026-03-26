import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  User, 
  Calendar, 
  FileText, 
  Heart, 
  Activity,
  Save,
  QrCode
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'

const Consultation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [yakapId, setYakapId] = useState(null)
  
  const [formData, setFormData] = useState({
    diagnosis: '',
    findings: '',
    health_condition: '',
    illness_type: '',
    prescription: '',
    follow_up_date: ''
  })

  useEffect(() => {
    fetchPatientData()
    fetchAssessmentData()
  }, [id])

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`/api/residents/${id}`)
      setPatient(response.data)
    } catch (error) {
      console.error('Error fetching patient:', error)
      toast.error('Failed to load patient data')
    }
  }

  const fetchAssessmentData = async () => {
    try {
      const response = await axios.get(`/api/assessments/resident/${id}`)
      if (response.data) {
        setAssessment(response.data)
      }
    } catch (error) {
      console.error('Error fetching assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.diagnosis || !formData.findings || !formData.health_condition || !formData.illness_type) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const response = await axios.post('/api/consultations', {
        ...formData,
        resident_id: parseInt(id)
      })
      
      setYakapId(response.data.yakapId)
      setShowQRModal(true)
      toast.success('Consultation completed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save consultation')
    } finally {
      setSaving(false)
    }
  }

  const handleCloseQRModal = () => {
    setShowQRModal(false)
    navigate('/patients')
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Consultation</h1>
          <p className="text-gray-600">
            Patient: {patient?.first_name} {patient?.last_name}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              <Save size={20} />
              Complete Consultation
            </>
          )}
        </motion.button>
      </div>

      {/* Patient Info Card */}
      {patient && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-green-50 border-green-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-sm text-gray-600">
                {patient.barangay} • Born: {new Date(patient.birthdate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600">Ready for Consultation</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assessment Summary */}
      {assessment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assessment Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {assessment.diagnosis && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Preliminary Diagnosis</p>
                <p className="font-medium text-gray-900">{assessment.diagnosis}</p>
              </div>
            )}
            {assessment.vital_signs && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Vital Signs</p>
                <p className="font-medium text-gray-900">{assessment.vital_signs}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Consultation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card space-y-6"
      >
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Medical Consultation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diagnosis */}
          <div className="md:col-span-2">
            <label className="label text-gray-700">Diagnosis *</label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Enter diagnosis"
              required
            />
          </div>

          {/* Findings */}
          <div className="md:col-span-2">
            <label className="label text-gray-700">Clinical Findings *</label>
            <textarea
              value={formData.findings}
              onChange={(e) => handleInputChange('findings', e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Enter clinical findings"
              required
            />
          </div>

          {/* Health Condition */}
          <div>
            <label className="label text-gray-700">Health Condition *</label>
            <select
              value={formData.health_condition}
              onChange={(e) => handleInputChange('health_condition', e.target.value)}
              className="input"
              required
            >
              <option value="">Select condition</option>
              <option value="Healthy">Healthy</option>
              <option value="At Risk">At Risk</option>
              <option value="Sick">Sick</option>
            </select>
          </div>

          {/* Illness Type */}
          <div>
            <label className="label text-gray-700">Illness Type *</label>
            <select
              value={formData.illness_type}
              onChange={(e) => handleInputChange('illness_type', e.target.value)}
              className="input"
              required
            >
              <option value="">Select type</option>
              <option value="Viral">Viral</option>
              <option value="Bacterial">Bacterial</option>
              <option value="Chronic">Chronic</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Prescription */}
          <div className="md:col-span-2">
            <label className="label text-gray-700">Prescription</label>
            <textarea
              value={formData.prescription}
              onChange={(e) => handleInputChange('prescription', e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Enter prescription details"
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="label text-gray-700">Follow-up Date</label>
            <input
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Health Condition Indicator */}
        {formData.health_condition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg border ${
              formData.health_condition === 'Healthy' 
                ? 'bg-green-50 border-green-200' 
                : formData.health_condition === 'At Risk'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity size={20} className={
                formData.health_condition === 'Healthy' 
                  ? 'text-green-600' 
                  : formData.health_condition === 'At Risk'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              } />
              <div>
                <p className="font-semibold text-gray-900">Health Status: {formData.health_condition}</p>
                <p className="text-sm text-gray-600">
                  {formData.health_condition === 'Healthy' && 'Patient is in good health condition'}
                  {formData.health_condition === 'At Risk' && 'Patient has risk factors that require monitoring'}
                  {formData.health_condition === 'Sick' && 'Patient requires medical treatment and care'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* QR Code Modal */}
      {showQRModal && yakapId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseQRModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <QrCode size={32} className="text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">YAKAP ID Generated!</h3>
                <p className="text-gray-600 mb-4">
                  Patient consultation completed successfully
                </p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="font-mono text-lg font-semibold text-primary-600">{yakapId}</p>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
                <QRCode
                  value={JSON.stringify({
                    yakapId,
                    name: `${patient?.first_name} ${patient?.last_name}`,
                    barangay: patient?.barangay
                  })}
                  size={200}
                  level="H"
                />
              </div>

              <div className="text-sm text-gray-500 space-y-1">
                <p>QR Code contains:</p>
                <p>• YAKAP ID</p>
                <p>• Patient Name</p>
                <p>• Barangay</p>
                <p className="text-xs text-green-600 font-medium">No medical information included</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseQRModal}
                className="btn-primary w-full"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Consultation
