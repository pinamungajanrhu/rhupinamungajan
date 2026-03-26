import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronUp, 
  Save, 
  User, 
  Calendar,
  FileText,
  Heart,
  Activity
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Assessment = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [existingAssessment, setExistingAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})
  
  const [formData, setFormData] = useState({
    consultation_date: new Date().toISOString().split('T')[0],
    assessed_by: '',
    
    // Type of Exposure
    type_of_exposure: '',
    bite_event_description: '',
    date_of_exposure: '',
    
    // Risk Assessment
    comorbidities: '',
    
    // Personal History
    personal_history: '',
    
    // For Women
    menstrual_history: '',
    pregnancy_history: '',
    
    // Family History
    family_history: '',
    
    // Social History
    smoking_history: '',
    social_history: '',
    alcohol_intake: '',
    
    // Lifestyle
    dietary_fiber: '',
    high_fat_salt_food: '',
    physical_activity: '',
    
    // Medical Questions
    angina_questionnaire: '',
    symptom_checklist: '',
    
    // Diabetes Assessment
    diabetes_presence: '',
    diabetes_symptoms: '',
    blood_glucose: '',
    blood_lipids: '',
    urine_protein: '',
    urine_ketones: '',
    
    // Management
    management: '',
    lifestyle_modification: '',
    medications: '',
    follow_up_date: '',
    
    // Laboratory & Imaging
    laboratory_request: '',
    imaging: '',
    
    // Final Assessment
    diagnosis: '',
    treatment_plan: '',
    prescription: '',
    remarks: ''
  })

  useEffect(() => {
    fetchPatientData()
    fetchExistingAssessment()
  }, [id])

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`/api/residents/${id}`)
      setPatient(response.data)
      setFormData(prev => ({ 
        ...prev, 
        assessed_by: response.data.assessed_by || 'RHU Staff' 
      }))
    } catch (error) {
      console.error('Error fetching patient:', error)
      toast.error('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  const fetchExistingAssessment = async () => {
    try {
      const response = await axios.get(`/api/assessments/resident/${id}`)
      if (response.data) {
        setExistingAssessment(response.data)
        setFormData(response.data)
      }
    } catch (error) {
      // No existing assessment is fine
      console.log('No existing assessment found')
    }
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.post('/api/assessments', {
        ...formData,
        resident_id: parseInt(id)
      })
      toast.success('Assessment saved successfully!')
      navigate('/patients')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save assessment')
    } finally {
      setSaving(false)
    }
  }

  const assessmentSections = [
    {
      id: 'exposure',
      title: 'Type of Exposure',
      icon: Activity,
      fields: [
        { name: 'type_of_exposure', label: 'Type of Exposure', type: 'select', options: ['Rat', 'Cat', 'Snake', 'Transdermal Bite', 'Punctured Wounds', 'Lacerations', 'Avulsions', 'Scratches/Abrasions'] },
        { name: 'bite_event_description', label: 'Description of Bite Event', type: 'textarea' },
        { name: 'date_of_exposure', label: 'Date of Exposure', type: 'date' }
      ]
    },
    {
      id: 'risk',
      title: 'Risk Assessment',
      icon: Heart,
      fields: [
        { name: 'comorbidities', label: 'Comorbidities', type: 'checkbox', options: ['Asthma', 'COPD', 'Hypertension', 'Stroke', 'Cancer', 'Diabetes', 'Kidney Disease', 'Tuberculosis', 'Heart Attack', 'Peripheral Vascular Diseases', 'Mental Disorders'] }
      ]
    },
    {
      id: 'personal',
      title: 'Personal History',
      icon: User,
      fields: [
        { name: 'personal_history', label: 'Personal History', type: 'textarea' },
        { name: 'menstrual_history', label: 'Menstrual History (For Women)', type: 'textarea' },
        { name: 'pregnancy_history', label: 'Pregnancy History (For Women)', type: 'textarea' }
      ]
    },
    {
      id: 'family',
      title: 'Family History',
      icon: User,
      fields: [
        { name: 'family_history', label: 'Family History', type: 'checkbox', options: ['Asthma', 'COPD', 'Hypertension', 'Stroke', 'Cancer', 'Diabetes', 'Kidney Disease', 'Tuberculosis', 'Heart Attack', 'Peripheral Vascular Diseases', 'Mental Disorders'] }
      ]
    },
    {
      id: 'social',
      title: 'Social History',
      icon: Activity,
      fields: [
        { name: 'smoking_history', label: 'Smoking History', type: 'select', options: ['Never Smoked', 'Less than/Equal to 1 pack per day', 'More than 1 pack per day', 'Stopped less than a year', 'Stopped more than a year', 'Use of Vape'] },
        { name: 'social_history', label: 'Social History', type: 'textarea' },
        { name: 'alcohol_intake', label: 'Excessive Alcohol Intake (5+ drinks on one occasion in past month)', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Assessment',
      icon: Heart,
      fields: [
        { name: 'dietary_fiber', label: 'Daily servings of vegetables and fruits', type: 'text' },
        { name: 'high_fat_salt_food', label: 'Consumption of processed/fast foods', type: 'select', options: ['Rarely', 'Occasionally', 'Frequently', 'Daily'] },
        { name: 'physical_activity', label: 'Moderate intensity physical activity (at least 2.5 hours/week)', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    {
      id: 'medical',
      title: 'Medical Assessment',
      icon: FileText,
      fields: [
        { name: 'angina_questionnaire', label: 'Angina Questionnaire', type: 'textarea' },
        { name: 'symptom_checklist', label: 'Symptom Checklist (Questions 3-8)', type: 'textarea' },
        { name: 'diabetes_presence', label: 'Presence of Diabetes', type: 'select', options: ['Yes', 'No'] },
        { name: 'diabetes_symptoms', label: 'Diabetes Symptoms (Polyphagia, Polydipsia, Polyuria)', type: 'textarea' }
      ]
    },
    {
      id: 'laboratory',
      title: 'Laboratory & Imaging',
      icon: FileText,
      fields: [
        { name: 'blood_glucose', label: 'Blood Glucose (FBS/RBS)', type: 'text' },
        { name: 'blood_lipids', label: 'Blood Lipids (Total Cholesterol)', type: 'text' },
        { name: 'urine_protein', label: 'Urine Protein', type: 'text' },
        { name: 'urine_ketones', label: 'Urine Ketones', type: 'text' },
        { name: 'laboratory_request', label: 'Laboratory Request', type: 'checkbox', options: ['Blood Chemistry', 'Fecalysis', 'MTB GeneXpert', 'Urinalysis', 'Clinical Chemistry', 'Hematology', 'Serology', 'Complete Blood Count', 'Immunology', 'Sputum Microscopy'] },
        { name: 'imaging', label: 'Imaging', type: 'checkbox', options: ['ECG', 'X-ray', 'With Contrast', 'MRI', 'CT Scan', 'Ultrasound', '2D Echo', 'VIA', 'Pap Smear', 'Mammogram'] }
      ]
    },
    {
      id: 'management',
      title: 'Management Plan',
      icon: FileText,
      fields: [
        { name: 'management', label: 'Management', type: 'textarea' },
        { name: 'lifestyle_modification', label: 'Lifestyle Modification', type: 'textarea' },
        { name: 'medications', label: 'Medications', type: 'textarea' },
        { name: 'follow_up_date', label: 'Follow-up Date', type: 'date' }
      ]
    },
    {
      id: 'final',
      title: 'Final Assessment',
      icon: FileText,
      fields: [
        { name: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
        { name: 'treatment_plan', label: 'Treatment Plan', type: 'textarea' },
        { name: 'prescription', label: 'Prescription', type: 'textarea' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    }
  ]

  const renderField = (field) => {
    const value = formData[field.name] || (field.type === 'checkbox' ? [] : '')

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="input"
          >
            <option value="">Select option</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleInputChange(field.name, [...currentValues, option])
                    } else {
                      handleInputChange(field.name, currentValues.filter(v => v !== option))
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      default:
        return (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="input"
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Risk Assessment</h1>
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
              Save Assessment
            </>
          )}
        </motion.button>
      </div>

      {/* Patient Info Card */}
      {patient && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-blue-50 border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-sm text-gray-600">
                {patient.barangay} • {patient.mobile}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">PhilHealth Status</p>
              <p className="font-medium text-blue-600">
                {patient.philhealth_number ? 'For Verification' : 'No PhilHealth'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assessment Form */}
      <div className="space-y-4">
        {/* Consultation Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label text-gray-700">Consultation Date</label>
              <input
                type="date"
                value={formData.consultation_date}
                onChange={(e) => handleInputChange('consultation_date', e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label text-gray-700">Assessed By</label>
              <input
                type="text"
                value={formData.assessed_by}
                onChange={(e) => handleInputChange('assessed_by', e.target.value)}
                className="input"
                placeholder="RHU Staff name"
              />
            </div>
          </div>
        </motion.div>

        {/* Collapsible Sections */}
        {assessmentSections.map((section, index) => {
          const Icon = section.icon
          const isExpanded = expandedSections[section.id] !== false
          
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 space-y-4"
                  >
                    {section.fields.map((field) => (
                      <div key={field.name}>
                        <label className="label text-gray-700">{field.label}</label>
                        {renderField(field)}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Assessment
