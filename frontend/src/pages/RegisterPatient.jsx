import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  User, 
  MapPin, 
  Phone, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const RegisterPatient = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditing = !!editId
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    birthdate: '',
    birthplace: '',
    sex: '',
    civil_status: '',
    educational_attainment: '',
    employment_status: '',
    monthly_income: '',
    occupation: '',
    religion: '',
    indigenous: '',
    blood_type: '',
    mother_first_name: '',
    mother_last_name: '',
    mother_middle_name: '',
    mother_birthdate: '',
    
    // Address Information
    country: '',
    number_street: '',
    region: '',
    province: '',
    city_municipality: '',
    barangay: '',
    zip_code: '',
    email: '',
    mobile: '',
    landline: '',
    
    // Other Information
    family_member: '',
    dswd_nhts_member: false,
    facility_household_number: '',
    family_serial_number: '',
    philhealth_member: '',
    philhealth_number: '',
    philhealth_category: '',
    pcb_eligible: ''
  })

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Contact & Other', icon: Phone },
    { id: 4, title: 'Review', icon: Check }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Load patient data if editing
  useEffect(() => {
    if (isEditing) {
      fetchPatientData()
    }
  }, [isEditing, editId])

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`/api/residents/${editId}`)
      setFormData(response.data)
    } catch (error) {
      toast.error('Failed to load patient data')
      navigate('/patients')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (isEditing) {
        await axios.put(`/api/residents/${editId}`, formData)
        toast.success('Patient updated successfully!')
      } else {
        await axios.post('/api/residents', formData)
        toast.success('Patient registered successfully!')
      }
      navigate('/patients')
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'register'} patient`)
    } finally {
      setLoading(false)
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.birthdate && formData.sex
      case 2:
        return formData.barangay && formData.city_municipality && formData.province
      case 3:
        return formData.mobile
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} onChange={handleInputChange} />
      case 2:
        return <AddressStep formData={formData} onChange={handleInputChange} />
      case 3:
        return <ContactStep formData={formData} onChange={handleInputChange} />
      case 4:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Patient' : 'Register New Patient'}
        </h1>
        <p className="text-gray-600">
          {isEditing ? 'Update the patient\'s information' : 'Fill in the patient\'s information'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    isActive 
                      ? 'border-primary-600 bg-primary-600 text-white' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-full h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`btn-secondary flex items-center gap-2 ${
            currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </motion.button>

        {currentStep === steps.length ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Registering...'}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Check size={20} className="mr-2" />
                {isEditing ? 'Update Patient' : 'Register Patient'}
              </span>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!validateStep()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            Next
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>
    </div>
  )
}

// Personal Info Step Component
const PersonalInfoStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="label text-gray-700">First Name *</label>
        <input
          type="text"
          value={formData.first_name}
          onChange={(e) => onChange('first_name', e.target.value)}
          className="input"
          placeholder="Enter first name"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Middle Name</label>
        <input
          type="text"
          value={formData.middle_name}
          onChange={(e) => onChange('middle_name', e.target.value)}
          className="input"
          placeholder="Enter middle name"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Last Name *</label>
        <input
          type="text"
          value={formData.last_name}
          onChange={(e) => onChange('last_name', e.target.value)}
          className="input"
          placeholder="Enter last name"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Suffix</label>
        <input
          type="text"
          value={formData.suffix}
          onChange={(e) => onChange('suffix', e.target.value)}
          className="input"
          placeholder="e.g., Jr., Sr., III"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Birthdate *</label>
        <input
          type="date"
          value={formData.birthdate}
          onChange={(e) => onChange('birthdate', e.target.value)}
          className="input"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Sex *</label>
        <select
          value={formData.sex}
          onChange={(e) => onChange('sex', e.target.value)}
          className="input"
          required
        >
          <option value="">Select sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      
      <div>
        <label className="label text-gray-700">Civil Status</label>
        <select
          value={formData.civil_status}
          onChange={(e) => onChange('civil_status', e.target.value)}
          className="input"
        >
          <option value="">Select civil status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widowed">Widowed</option>
          <option value="Separated">Separated</option>
        </select>
      </div>
      
      <div>
        <label className="label text-gray-700">Blood Type</label>
        <select
          value={formData.blood_type}
          onChange={(e) => onChange('blood_type', e.target.value)}
          className="input"
        >
          <option value="">Select blood type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>
    </div>
  </div>
)

// Address Step Component
const AddressStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="label text-gray-700">Barangay *</label>
        <input
          type="text"
          value={formData.barangay}
          onChange={(e) => onChange('barangay', e.target.value)}
          className="input"
          placeholder="Enter barangay"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">City/Municipality *</label>
        <input
          type="text"
          value={formData.city_municipality}
          onChange={(e) => onChange('city_municipality', e.target.value)}
          className="input"
          placeholder="Enter city/municipality"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Province *</label>
        <input
          type="text"
          value={formData.province}
          onChange={(e) => onChange('province', e.target.value)}
          className="input"
          placeholder="Enter province"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Region</label>
        <input
          type="text"
          value={formData.region}
          onChange={(e) => onChange('region', e.target.value)}
          className="input"
          placeholder="Enter region"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Number/Street</label>
        <input
          type="text"
          value={formData.number_street}
          onChange={(e) => onChange('number_street', e.target.value)}
          className="input"
          placeholder="Enter house number/street"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Zip Code</label>
        <input
          type="text"
          value={formData.zip_code}
          onChange={(e) => onChange('zip_code', e.target.value)}
          className="input"
          placeholder="Enter zip code"
        />
      </div>
    </div>
  </div>
)

// Contact Step Component
const ContactStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Contact & Other Information</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="label text-gray-700">Mobile Number *</label>
        <input
          type="tel"
          value={formData.mobile}
          onChange={(e) => onChange('mobile', e.target.value)}
          className="input"
          placeholder="Enter mobile number"
          required
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="input"
          placeholder="Enter email address"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">PhilHealth Member</label>
        <select
          value={formData.philhealth_member}
          onChange={(e) => onChange('philhealth_member', e.target.value)}
          className="input"
        >
          <option value="">Select PhilHealth status</option>
          <option value="Member">Member</option>
          <option value="Dependent">Dependent</option>
        </select>
      </div>
      
      <div>
        <label className="label text-gray-700">PhilHealth Number</label>
        <input
          type="text"
          value={formData.philhealth_number}
          onChange={(e) => onChange('philhealth_number', e.target.value)}
          className="input"
          placeholder="Enter PhilHealth number"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Occupation</label>
        <input
          type="text"
          value={formData.occupation}
          onChange={(e) => onChange('occupation', e.target.value)}
          className="input"
          placeholder="Enter occupation"
        />
      </div>
      
      <div>
        <label className="label text-gray-700">Monthly Income</label>
        <input
          type="text"
          value={formData.monthly_income}
          onChange={(e) => onChange('monthly_income', e.target.value)}
          className="input"
          placeholder="Enter monthly income"
        />
      </div>
    </div>
  </div>
)

// Review Step Component
const ReviewStep = ({ formData }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Review Information</h3>
    
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Full Name</p>
          <p className="font-medium text-gray-900">
            {formData.first_name} {formData.middle_name} {formData.last_name} {formData.suffix}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Birthdate</p>
          <p className="font-medium text-gray-900">
            {formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : 'Not specified'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Sex</p>
          <p className="font-medium text-gray-900">{formData.sex || 'Not specified'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Blood Type</p>
          <p className="font-medium text-gray-900">{formData.blood_type || 'Not specified'}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <p className="font-medium text-gray-900">
            {formData.number_street && `${formData.number_street}, `}
            {formData.barangay}, {formData.city_municipality}, {formData.province}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Mobile Number</p>
          <p className="font-medium text-gray-900">{formData.mobile}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">PhilHealth Status</p>
          <p className="font-medium text-gray-900">
            {formData.philhealth_number ? 'For Verification' : 'No PhilHealth'}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Occupation</p>
          <p className="font-medium text-gray-900">{formData.occupation || 'Not specified'}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-blue-800">
        Please review all information before submitting. Click "Register Patient" to complete the registration.
      </p>
    </div>
  </div>
)

export default RegisterPatient
