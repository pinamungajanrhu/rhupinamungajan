import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  MapPin, 
  Phone, 
  Heart,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Stethoscope,
  Users,
  Calendar,
  AlertCircle,
  Home,
  Briefcase,
  Shield
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { PINAMUNGAHAN_BARANGAYS } from '../constants'

const BarangayPCHRATForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    // Section 1: Patient Demographics
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
    
    // Mother's Info (for maternal tracking)
    mother_first_name: '',
    mother_last_name: '',
    mother_middle_name: '',
    mother_birthdate: '',
    
    // Address
    country: 'Philippines',
    number_street: '',
    region: '',
    province: '',
    city_municipality: 'Pinamungajan',
    barangay: '',
    zip_code: '6039',
    email: '',
    mobile: '',
    landline: '',
    
    // Other Info
    family_member: '',
    dswd_nhts_member: false,
    facility_household_number: '',
    family_serial_number: '',
    philhealth_member: '',
    philhealth_number: '',
    philhealth_category: '',
    pcb_eligible: '',
    
    // Section 2: Chief Complaint & History
    chief_complaint: '',
    present_illness_history: '',
    
    // Section 3: Family History (Check all that apply)
    family_history_hypertension: false,
    family_history_stroke: false,
    family_history_heart_disease: false,
    family_history_diabetes: false,
    family_history_asthma: false,
    family_history_cancer: false,
    family_history_mental_illness: false,
    family_history_tuberculosis: false,
    family_history_kidney_disease: false,
    family_history_other: '',
    
    // Section 4: Personal/Social History
    // Smoking
    smoking_status: '', // never, former, current
    smoking_packs_per_day: '',
    smoking_years: '',
    
    // Alcohol
    alcohol_status: '', // never, occasional, regular, heavy
    alcohol_frequency: '',
    
    // Physical Activity
    physical_activity_level: '', // sedentary, light, moderate, vigorous
    physical_activity_hours_per_week: '',
    
    // Diet
    diet_fruits_vegetables: '', // servings per day
    diet_salty_foods: '', // rarely, sometimes, often, always
    diet_fatty_foods: '',
    diet_sugary_foods: '',
    
    // Sleep
    sleep_hours_per_night: '',
    sleep_quality: '', // good, fair, poor
    
    // Section 5: Past Medical History
    past_medical_history: [],
    past_medical_history_other: '',
    
    // Section 6: OB/GYN History (for females)
    menstrual_status: '',
    age_menarche: '',
    menstrual_cycle_regular: '',
    menstrual_cycle_length: '',
    last_menstrual_period: '',
    pregnant_now: false,
    pregnancy_count: '',
    live_births: '',
    abortions: '',
    contraceptive_method: '',
    
    // Section 7: Vital Signs & Measurements
    vital_date_taken: new Date().toISOString().split('T')[0],
    vital_weight_kg: '',
    vital_height_cm: '',
    vital_bmi: '',
    vital_blood_pressure_systolic: '',
    vital_blood_pressure_diastolic: '',
    vital_pulse_rate: '',
    vital_respiratory_rate: '',
    vital_temperature: '',
    vital_waist_circumference: '',
    vital_hip_circumference: '',
    vital_waist_hip_ratio: '',
    
    // Section 8: Risk Assessment - Cardiovascular
    cv_angina: false,
    cv_angina_pain_location: '',
    cv_angina_triggered_by_exertion: false,
    cv_angina_relief_with_rest: false,
    cv_heart_attack_history: false,
    cv_stroke_history: false,
    cv_leg_pain_walking: false,
    
    // Section 9: Risk Assessment - Diabetes
    dm_polyuria: false,
    dm_polydipsia: false,
    dm_polyphagia: false,
    dm_weight_loss: false,
    dm_fatigue: false,
    dm_blurred_vision: false,
    dm_poor_wound_healing: false,
    dm_previous_diagnosis: false,
    dm_family_history: false,
    dm_risk_score: '',
    
    // Section 10: Risk Assessment - Cancer
    ca_family_history: false,
    ca_personal_history: false,
    ca_smoking_related: false,
    ca_symptoms: [],
    
    // Section 11: Risk Assessment - Mental Health
    mh_depression_feeling_down: false,
    mh_depression_little_interest: false,
    mh_anxiety_worry: false,
    mh_stress_level: '',
    mh_suicidal_thoughts: false,
    
    // Section 12: Risk Assessment - Tuberculosis
    tb_cough_more_than_2_weeks: false,
    tb_bloody_sputum: false,
    tb_fever_night_sweats: false,
    tb_weight_loss: false,
    tb_chest_pain: false,
    tb_exposure_history: false,
    
    // Section 13: Risk Assessment - Lifestyle
    ls_sedentary_hours_per_day: '',
    ls_screen_time_hours_per_day: '',
    ls_work_stress: '',
    ls_social_support: '',
    
    // Section 14: Laboratory Results (if available)
    lab_fbs: '',
    lab_rbs: '',
    lab_hba1c: '',
    lab_total_cholesterol: '',
    lab_ldl: '',
    lab_hdl: '',
    lab_triglycerides: '',
    lab_creatinine: '',
    lab_bun: '',
    lab_uric_acid: '',
    lab_urinalysis_protein: '',
    lab_urinalysis_glucose: '',
    lab_urinalysis_ketones: '',
    lab_cbc_hemoglobin: '',
    
    // Section 15: Overall Risk Assessment
    overall_cvd_risk: '', // low, moderate, high, very high
    overall_diabetes_risk: '',
    overall_health_status: '',
    
    // Section 16: Management Plan
    management_referral_needed: false,
    management_referral_to: '',
    management_lifestyle_counseling: false,
    management_medications: '',
    management_follow_up_date: '',
    management_health_education: [],
    management_remarks: '',
    
    // Metadata
    assessed_by: '',
    assessment_date: new Date().toISOString().split('T')[0],
    facility_name: 'Pinamungajan RHU'
  })

  const steps = [
    { id: 1, title: 'Patient Info', icon: User },
    { id: 2, title: 'Family History', icon: Users },
    { id: 3, title: 'Social History', icon: Activity },
    { id: 4, title: 'Medical History', icon: FileText },
    { id: 5, title: 'OB/GYN History', icon: Heart },
    { id: 6, title: 'Vital Signs', icon: Stethoscope },
    { id: 7, title: 'Risk Assessment', icon: AlertCircle },
    { id: 8, title: 'Management', icon: Shield },
    { id: 9, title: 'Review', icon: Check }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calculate BMI when weight and height are provided
    if (field === 'vital_weight_kg' || field === 'vital_height_cm') {
      const weight = field === 'vital_weight_kg' ? value : formData.vital_weight_kg
      const height = field === 'vital_height_cm' ? value : formData.vital_height_cm
      if (weight && height) {
        const heightInMeters = parseFloat(height) / 100
        const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1)
        setFormData(prev => ({ ...prev, [field]: value, vital_bmi: bmi }))
      }
    }
    
    // Auto-calculate waist-hip ratio
    if (field === 'vital_waist_circumference' || field === 'vital_hip_circumference') {
      const waist = field === 'vital_waist_circumference' ? value : formData.vital_waist_circumference
      const hip = field === 'vital_hip_circumference' ? value : formData.vital_hip_circumference
      if (waist && hip) {
        const ratio = (parseFloat(waist) / parseFloat(hip)).toFixed(2)
        setFormData(prev => ({ ...prev, [field]: value, vital_waist_hip_ratio: ratio }))
      }
    }
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }

  const handleMultiSelectChange = (field, value, checked) => {
    setFormData(prev => {
      const current = prev[field] || []
      if (checked) {
        return { ...prev, [field]: [...current, value] }
      } else {
        return { ...prev, [field]: current.filter(item => item !== value) }
      }
    })
  }

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1: // Patient Info
        return formData.first_name && formData.last_name && formData.birthdate && formData.sex && formData.barangay && formData.mobile
      case 6: // Vital Signs
        return formData.vital_weight_kg && formData.vital_height_cm && formData.vital_blood_pressure_systolic && formData.vital_blood_pressure_diastolic
      case 9: // Review
        return true
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      // First register the patient
      const patientResponse = await axios.post('/api/residents', {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        suffix: formData.suffix,
        birthdate: formData.birthdate,
        birthplace: formData.birthplace,
        sex: formData.sex,
        civil_status: formData.civil_status,
        educational_attainment: formData.educational_attainment,
        employment_status: formData.employment_status,
        monthly_income: formData.monthly_income,
        occupation: formData.occupation,
        religion: formData.religion,
        indigenous: formData.indigenous,
        blood_type: formData.blood_type,
        mother_first_name: formData.mother_first_name,
        mother_last_name: formData.mother_last_name,
        mother_middle_name: formData.mother_middle_name,
        mother_birthdate: formData.mother_birthdate,
        country: formData.country,
        number_street: formData.number_street,
        region: formData.region,
        province: formData.province,
        city_municipality: formData.city_municipality,
        barangay: formData.barangay,
        zip_code: formData.zip_code,
        email: formData.email,
        mobile: formData.mobile,
        landline: formData.landline,
        family_member: formData.family_member,
        dswd_nhts_member: formData.dswd_nhts_member,
        facility_household_number: formData.facility_household_number,
        family_serial_number: formData.family_serial_number,
        philhealth_member: formData.philhealth_member,
        philhealth_number: formData.philhealth_number,
        philhealth_category: formData.philhealth_category,
        pcb_eligible: formData.pcb_eligible
      })

      const residentId = patientResponse.data.id

      // Then save the PCHRAT assessment
      await axios.post('/api/assessments', {
        resident_id: residentId,
        consultation_date: formData.assessment_date,
        assessed_by: formData.assessed_by,
        
        // Convert PCHRAT data to assessment format
        type_of_exposure: '',
        bite_event_description: formData.present_illness_history,
        date_of_exposure: '',
        
        // Family history as string
        comorbidities: getFamilyHistoryArray().join(', '),
        
        // Personal history summary
        personal_history: getPersonalHistorySummary(),
        menstrual_history: getMenstrualHistory(),
        pregnancy_history: getPregnancyHistory(),
        
        // Social history
        smoking_history: `${formData.smoking_status} ${formData.smoking_packs_per_day ? formData.smoking_packs_per_day + ' packs/day' : ''} ${formData.smoking_years ? 'for ' + formData.smoking_years + ' years' : ''}`,
        social_history: getSocialHistorySummary(),
        alcohol_intake: formData.alcohol_status,
        
        // Lifestyle
        dietary_fiber: formData.diet_fruits_vegetables,
        high_fat_salt_food: `Salty: ${formData.diet_salty_foods}, Fatty: ${formData.diet_fatty_foods}, Sugary: ${formData.diet_sugary_foods}`,
        physical_activity: `${formData.physical_activity_level} - ${formData.physical_activity_hours_per_week} hours/week`,
        
        // Medical assessment
        angina_questionnaire: getCVDRiskSummary(),
        symptom_checklist: getSymptomChecklist(),
        diabetes_presence: formData.dm_previous_diagnosis ? 'Yes' : 'No',
        diabetes_symptoms: getDiabetesSymptoms(),
        
        // Laboratory (vital signs included here)
        blood_glucose: formData.lab_fbs || formData.lab_rbs || '',
        blood_lipids: formData.lab_total_cholesterol || '',
        urine_protein: formData.lab_urinalysis_protein || '',
        urine_ketones: formData.lab_urinalysis_ketones || '',
        laboratory_request: getLabRequests().join(', '),
        imaging: '',
        
        // Management
        management: formData.management_referral_needed ? `Referral to: ${formData.management_referral_to}` : 'Primary care management',
        lifestyle_modification: formData.management_health_education.join(', '),
        medications: formData.management_medications,
        follow_up_date: formData.management_follow_up_date,
        
        // Final assessment
        diagnosis: getOverallRiskSummary(),
        treatment_plan: formData.management_remarks,
        prescription: '',
        remarks: `Vital Signs: BP ${formData.vital_blood_pressure_systolic}/${formData.vital_blood_pressure_diastolic} mmHg, BMI ${formData.vital_bmi}, Waist-Hip Ratio ${formData.vital_waist_hip_ratio}. PCHRAT completed by ${formData.assessed_by}.`
      })

      toast.success('Patient registered and PCHRAT assessment saved successfully!')
      navigate('/patients')
    } catch (error) {
      console.error('Error saving PCHRAT:', error)
      toast.error(error.response?.data?.error || 'Failed to save PCHRAT assessment')
    } finally {
      setSaving(false)
    }
  }

  // Helper functions to format data
  const getFamilyHistoryArray = () => {
    const history = []
    if (formData.family_history_hypertension) history.push('Hypertension')
    if (formData.family_history_stroke) history.push('Stroke')
    if (formData.family_history_heart_disease) history.push('Heart Disease')
    if (formData.family_history_diabetes) history.push('Diabetes')
    if (formData.family_history_asthma) history.push('Asthma')
    if (formData.family_history_cancer) history.push('Cancer')
    if (formData.family_history_mental_illness) history.push('Mental Illness')
    if (formData.family_history_tuberculosis) history.push('Tuberculosis')
    if (formData.family_history_kidney_disease) history.push('Kidney Disease')
    return history
  }

  const getPersonalHistorySummary = () => {
    return `Past Medical: ${formData.past_medical_history?.join(', ') || 'None'}. ${formData.past_medical_history_other || ''}`
  }

  const getMenstrualHistory = () => {
    if (formData.sex !== 'Female') return 'N/A'
    return `${formData.menstrual_status}, Menarche at ${formData.age_menarche}, Cycle: ${formData.menstrual_cycle_regular}, Length: ${formData.menstrual_cycle_length} days, LMP: ${formData.last_menstrual_period}`
  }

  const getPregnancyHistory = () => {
    if (formData.sex !== 'Female') return 'N/A'
    return `Gravida: ${formData.pregnancy_count}, Para: ${formData.live_births}, Abortions: ${formData.abortions}. Currently pregnant: ${formData.pregnant_now ? 'Yes' : 'No'}. Contraceptive: ${formData.contraceptive_method}`
  }

  const getSocialHistorySummary = () => {
    return `Sleep: ${formData.sleep_hours_per_night} hours (${formData.sleep_quality}), Work stress: ${formData.ls_work_stress}, Social support: ${formData.ls_social_support}`
  }

  const getCVDRiskSummary = () => {
    return `Angina: ${formData.cv_angina ? 'Yes' : 'No'}, Heart Attack: ${formData.cv_heart_attack_history ? 'Yes' : 'No'}, Stroke: ${formData.cv_stroke_history ? 'Yes' : 'No'}, Leg pain: ${formData.cv_leg_pain_walking ? 'Yes' : 'No'}`
  }

  const getSymptomChecklist = () => {
    const symptoms = []
    if (formData.tb_cough_more_than_2_weeks) symptoms.push('Cough >2 weeks')
    if (formData.tb_bloody_sputum) symptoms.push('Bloody sputum')
    if (formData.tb_fever_night_sweats) symptoms.push('Fever/night sweats')
    if (formData.tb_weight_loss) symptoms.push('Weight loss')
    if (formData.tb_chest_pain) symptoms.push('Chest pain')
    if (formData.mh_depression_feeling_down) symptoms.push('Depression')
    if (formData.mh_anxiety_worry) symptoms.push('Anxiety')
    return symptoms.join(', ') || 'None'
  }

  const getDiabetesSymptoms = () => {
    const symptoms = []
    if (formData.dm_polyuria) symptoms.push('Polyuria')
    if (formData.dm_polydipsia) symptoms.push('Polydipsia')
    if (formData.dm_polyphagia) symptoms.push('Polyphagia')
    if (formData.dm_weight_loss) symptoms.push('Weight loss')
    if (formData.dm_fatigue) symptoms.push('Fatigue')
    if (formData.dm_blurred_vision) symptoms.push('Blurred vision')
    if (formData.dm_poor_wound_healing) symptoms.push('Poor wound healing')
    return symptoms.join(', ') || 'None'
  }

  const getLabRequests = () => {
    const labs = []
    if (formData.lab_fbs || formData.lab_rbs) labs.push('Blood Glucose')
    if (formData.lab_hba1c) labs.push('HbA1c')
    if (formData.lab_total_cholesterol || formData.lab_ldl || formData.lab_hdl) labs.push('Lipid Profile')
    if (formData.lab_creatinine || formData.lab_bun) labs.push('Renal Function')
    if (formData.lab_urinalysis_protein || formData.lab_urinalysis_glucose) labs.push('Urinalysis')
    if (formData.lab_cbc_hemoglobin) labs.push('CBC')
    return labs
  }

  const getOverallRiskSummary = () => {
    return `CVD Risk: ${formData.overall_cvd_risk}, DM Risk: ${formData.overall_diabetes_risk}, Health Status: ${formData.overall_health_status}`
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PatientInfoStep formData={formData} onChange={handleInputChange} />
      case 2:
        return <FamilyHistoryStep formData={formData} onCheckboxChange={handleCheckboxChange} onChange={handleInputChange} />
      case 3:
        return <SocialHistoryStep formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />
      case 4:
        return <MedicalHistoryStep formData={formData} onMultiSelectChange={handleMultiSelectChange} onChange={handleInputChange} />
      case 5:
        return <OBGYNHistoryStep formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />
      case 6:
        return <VitalSignsStep formData={formData} onChange={handleInputChange} />
      case 7:
        return <RiskAssessmentStep formData={formData} onCheckboxChange={handleCheckboxChange} onChange={handleInputChange} />
      case 8:
        return <ManagementStep formData={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} onMultiSelectChange={handleMultiSelectChange} />
      case 9:
        return <ReviewStep formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Patient Registration & PCHRAT Assessment</h1>
            <p className="text-primary-100 mt-1">Unified Registration and Health Risk Assessment Form</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between min-w-max px-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`flex flex-col items-center gap-2 ${index > 0 ? 'ml-8' : ''}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'border-primary-600 bg-primary-600 text-white' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
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
            disabled={saving}
            className="btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save PCHRAT Assessment
              </>
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

// Step 1: Patient Information
const PatientInfoStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
      <User className="text-primary-600" size={28} />
      Patient Demographics
    </h2>
    
    {/* Personal Information */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">First Name <span className="text-red-500">*</span></label>
          <input type="text" value={formData.first_name} onChange={(e) => onChange('first_name', e.target.value)} className="input" placeholder="Enter first name" />
        </div>
        <div>
          <label className="label">Middle Name</label>
          <input type="text" value={formData.middle_name} onChange={(e) => onChange('middle_name', e.target.value)} className="input" placeholder="Enter middle name" />
        </div>
        <div>
          <label className="label">Last Name <span className="text-red-500">*</span></label>
          <input type="text" value={formData.last_name} onChange={(e) => onChange('last_name', e.target.value)} className="input" placeholder="Enter last name" />
        </div>
        <div>
          <label className="label">Suffix</label>
          <input type="text" value={formData.suffix} onChange={(e) => onChange('suffix', e.target.value)} className="input" placeholder="Jr., Sr., III" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Birthdate <span className="text-red-500">*</span></label>
          <input type="date" value={formData.birthdate} onChange={(e) => onChange('birthdate', e.target.value)} className="input" />
        </div>
        <div>
          <label className="label">Birthplace</label>
          <input type="text" value={formData.birthplace} onChange={(e) => onChange('birthplace', e.target.value)} className="input" placeholder="City/Municipality" />
        </div>
        <div>
          <label className="label">Sex <span className="text-red-500">*</span></label>
          <select value={formData.sex} onChange={(e) => onChange('sex', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Civil Status</label>
          <select value={formData.civil_status} onChange={(e) => onChange('civil_status', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Blood Type</label>
          <select value={formData.blood_type} onChange={(e) => onChange('blood_type', e.target.value)} className="input">
            <option value="">Select</option>
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
        <div>
          <label className="label">Religion</label>
          <input type="text" value={formData.religion} onChange={(e) => onChange('religion', e.target.value)} className="input" placeholder="Enter religion" />
        </div>
        <div>
          <label className="label">Indigenous Group</label>
          <input type="text" value={formData.indigenous} onChange={(e) => onChange('indigenous', e.target.value)} className="input" placeholder="If applicable" />
        </div>
        <div>
          <label className="label">Educational Attainment</label>
          <select value={formData.educational_attainment} onChange={(e) => onChange('educational_attainment', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="No Formal Education">No Formal Education</option>
            <option value="Elementary">Elementary</option>
            <option value="High School">High School</option>
            <option value="College">College</option>
            <option value="Post Graduate">Post Graduate</option>
          </select>
        </div>
      </div>
    </div>
    
    {/* Address */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <MapPin size={20} className="text-primary-600" />
        Address Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Barangay <span className="text-red-500">*</span></label>
          <select 
            value={formData.barangay} 
            onChange={(e) => onChange('barangay', e.target.value)} 
            className="input"
            required
          >
            <option value="">Select Barangay</option>
            {PINAMUNGAHAN_BARANGAYS.map(brgy => (
              <option key={brgy} value={brgy}>{brgy}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">City/Municipality</label>
          <input type="text" value={formData.city_municipality} onChange={(e) => onChange('city_municipality', e.target.value)} className="input" disabled />
        </div>
        <div>
          <label className="label">Province</label>
          <input type="text" value={formData.province} onChange={(e) => onChange('province', e.target.value)} className="input" placeholder="Enter province" />
        </div>
        <div>
          <label className="label">Region</label>
          <input type="text" value={formData.region} onChange={(e) => onChange('region', e.target.value)} className="input" placeholder="e.g., Region VII" />
        </div>
        <div className="md:col-span-2">
          <label className="label">Street/Number</label>
          <input type="text" value={formData.number_street} onChange={(e) => onChange('number_street', e.target.value)} className="input" placeholder="House number, Street name, Purok/Sitio" />
        </div>
      </div>
    </div>
    
    {/* Contact & Employment */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Phone size={20} className="text-primary-600" />
        Contact & Employment
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label">Mobile Number <span className="text-red-500">*</span></label>
          <input type="tel" value={formData.mobile} onChange={(e) => onChange('mobile', e.target.value)} className="input" placeholder="09XX XXX XXXX" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" value={formData.email} onChange={(e) => onChange('email', e.target.value)} className="input" placeholder="email@example.com" />
        </div>
        <div>
          <label className="label">Landline</label>
          <input type="tel" value={formData.landline} onChange={(e) => onChange('landline', e.target.value)} className="input" placeholder="Area code + number" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Employment Status</label>
          <select value={formData.employment_status} onChange={(e) => onChange('employment_status', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Employed">Employed</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Student">Student</option>
            <option value="Retired">Retired</option>
            <option value="Homemaker">Homemaker</option>
          </select>
        </div>
        <div>
          <label className="label">Occupation</label>
          <input type="text" value={formData.occupation} onChange={(e) => onChange('occupation', e.target.value)} className="input" placeholder="Current occupation" />
        </div>
        <div>
          <label className="label">Monthly Income</label>
          <input type="text" value={formData.monthly_income} onChange={(e) => onChange('monthly_income', e.target.value)} className="input" placeholder="e.g., 10,000-20,000" />
        </div>
      </div>
    </div>
    
    {/* PhilHealth & Other Info */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Shield size={20} className="text-primary-600" />
        PhilHealth & Program Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="label">PhilHealth Member</label>
          <select value={formData.philhealth_member} onChange={(e) => onChange('philhealth_member', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Member">Member</option>
            <option value="Dependent">Dependent</option>
          </select>
        </div>
        <div>
          <label className="label">PhilHealth Number</label>
          <input type="text" value={formData.philhealth_number} onChange={(e) => onChange('philhealth_number', e.target.value)} className="input" placeholder="XX-XXXXXXXXX-X" />
        </div>
        <div>
          <label className="label">Category</label>
          <select value={formData.philhealth_category} onChange={(e) => onChange('philhealth_category', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Formal Economy">Formal Economy</option>
            <option value="Informal Economy">Informal Economy</option>
            <option value="Indigent">Indigent</option>
            <option value="Senior Citizen">Senior Citizen</option>
            <option value="Lifetime">Lifetime</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="dswd_nhts" checked={formData.dswd_nhts_member} onChange={(e) => onChange('dswd_nhts_member', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <label htmlFor="dswd_nhts" className="text-sm text-gray-700">DSWD NHTS Member</label>
        </div>
        <div>
          <label className="label">Household Number</label>
          <input type="text" value={formData.facility_household_number} onChange={(e) => onChange('facility_household_number', e.target.value)} className="input" placeholder="If applicable" />
        </div>
        <div>
          <label className="label">Family Serial Number</label>
          <input type="text" value={formData.family_serial_number} onChange={(e) => onChange('family_serial_number', e.target.value)} className="input" placeholder="If applicable" />
        </div>
      </div>
    </div>
  </div>
)

// Step 2: Family History
const FamilyHistoryStep = ({ formData, onCheckboxChange, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
      <Users className="text-primary-600" size={28} />
      Family History
    </h2>
    <p className="text-gray-600">Check all conditions that apply to the patient's blood relatives (parents, siblings, children):</p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { id: 'family_history_hypertension', label: 'Hypertension' },
        { id: 'family_history_stroke', label: 'Stroke' },
        { id: 'family_history_heart_disease', label: 'Heart Disease' },
        { id: 'family_history_diabetes', label: 'Diabetes Mellitus' },
        { id: 'family_history_asthma', label: 'Asthma' },
        { id: 'family_history_cancer', label: 'Cancer' },
        { id: 'family_history_mental_illness', label: 'Mental Illness' },
        { id: 'family_history_tuberculosis', label: 'Tuberculosis' },
        { id: 'family_history_kidney_disease', label: 'Kidney Disease' }
      ].map((item) => (
        <label key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={formData[item.id] || false}
            onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-gray-700 font-medium">{item.label}</span>
        </label>
      ))}
    </div>
    
    <div>
      <label className="label">Other Family History (please specify)</label>
      <textarea
        value={formData.family_history_other}
        onChange={(e) => onChange('family_history_other', e.target.value)}
        className="input min-h-[80px] resize-none"
        placeholder="Enter any other significant family medical history..."
      />
    </div>
  </div>
)

// Step 3: Social History
const SocialHistoryStep = ({ formData, onChange, onCheckboxChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
      <Activity className="text-primary-600" size={28} />
      Social & Lifestyle History
    </h2>
    
    {/* Smoking */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Smoking History</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Smoking Status</label>
          <select value={formData.smoking_status} onChange={(e) => onChange('smoking_status', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Never">Never Smoked</option>
            <option value="Former">Former Smoker</option>
            <option value="Current">Current Smoker</option>
          </select>
        </div>
        {formData.smoking_status === 'Current' && (
          <>
            <div>
              <label className="label">Packs per Day</label>
              <input type="number" value={formData.smoking_packs_per_day} onChange={(e) => onChange('smoking_packs_per_day', e.target.value)} className="input" placeholder="e.g., 1" />
            </div>
            <div>
              <label className="label">Years Smoking</label>
              <input type="number" value={formData.smoking_years} onChange={(e) => onChange('smoking_years', e.target.value)} className="input" placeholder="e.g., 10" />
            </div>
          </>
        )}
      </div>
    </div>
    
    {/* Alcohol */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Alcohol Consumption</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Alcohol Status</label>
          <select value={formData.alcohol_status} onChange={(e) => onChange('alcohol_status', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Occasional">Occasional (1-2x/month)</option>
            <option value="Regular">Regular (1-2x/week)</option>
            <option value="Heavy">Heavy (5+ drinks/session)</option>
          </select>
        </div>
        <div>
          <label className="label">Frequency</label>
          <input type="text" value={formData.alcohol_frequency} onChange={(e) => onChange('alcohol_frequency', e.target.value)} className="input" placeholder="e.g., Weekends only" />
        </div>
      </div>
    </div>
    
    {/* Physical Activity */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Physical Activity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Activity Level</label>
          <select value={formData.physical_activity_level} onChange={(e) => onChange('physical_activity_level', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Sedentary">Sedentary (minimal activity)</option>
            <option value="Light">Light (walking, light exercise)</option>
            <option value="Moderate">Moderate (brisk walking, cycling)</option>
            <option value="Vigorous">Vigorous (running, sports)</option>
          </select>
        </div>
        <div>
          <label className="label">Hours per Week</label>
          <input type="number" value={formData.physical_activity_hours_per_week} onChange={(e) => onChange('physical_activity_hours_per_week', e.target.value)} className="input" placeholder="e.g., 3" />
        </div>
      </div>
    </div>
    
    {/* Diet */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Dietary Habits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Fruits & Vegetables (servings/day)</label>
          <input type="number" value={formData.diet_fruits_vegetables} onChange={(e) => onChange('diet_fruits_vegetables', e.target.value)} className="input" placeholder="e.g., 3" />
        </div>
        <div>
          <label className="label">Salty Foods Consumption</label>
          <select value={formData.diet_salty_foods} onChange={(e) => onChange('diet_salty_foods', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Rarely">Rarely</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Often">Often</option>
            <option value="Always">Always</option>
          </select>
        </div>
        <div>
          <label className="label">Fatty/Fried Foods</label>
          <select value={formData.diet_fatty_foods} onChange={(e) => onChange('diet_fatty_foods', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Rarely">Rarely</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Often">Often</option>
            <option value="Always">Always</option>
          </select>
        </div>
        <div>
          <label className="label">Sugary Foods/Drinks</label>
          <select value={formData.diet_sugary_foods} onChange={(e) => onChange('diet_sugary_foods', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Rarely">Rarely</option>
            <option value="Sometimes">Sometimes</option>
            <option value="Often">Often</option>
            <option value="Always">Always</option>
          </select>
        </div>
      </div>
    </div>
    
    {/* Sleep */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Sleep Pattern</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Hours per Night</label>
          <input type="number" value={formData.sleep_hours_per_night} onChange={(e) => onChange('sleep_hours_per_night', e.target.value)} className="input" placeholder="e.g., 7" />
        </div>
        <div>
          <label className="label">Sleep Quality</label>
          <select value={formData.sleep_quality} onChange={(e) => onChange('sleep_quality', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Good">Good (rested, no issues)</option>
            <option value="Fair">Fair (occasional issues)</option>
            <option value="Poor">Poor (insomnia, sleep apnea)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
)

// Step 4: Medical History
const MedicalHistoryStep = ({ formData, onMultiSelectChange, onChange }) => {
  const conditions = [
    'Hypertension', 'Diabetes Mellitus', 'Heart Disease', 'Stroke', 'Asthma',
    'COPD', 'Tuberculosis', 'Cancer', 'Kidney Disease', 'Liver Disease',
    'Mental Health Disorder', 'Epilepsy', 'Arthritis', 'Thyroid Disease',
    'Peptic Ulcer Disease', 'Allergies', 'Previous Surgery', 'Hospitalization'
  ]
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <FileText className="text-primary-600" size={28} />
        Past Medical History
      </h2>
      <p className="text-gray-600">Check all conditions the patient has been diagnosed with:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conditions.map((condition) => (
          <label key={condition} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.past_medical_history?.includes(condition) || false}
              onChange={(e) => onMultiSelectChange('past_medical_history', condition, e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700 font-medium">{condition}</span>
          </label>
        ))}
      </div>
      
      <div>
        <label className="label">Other Medical Conditions</label>
        <textarea
          value={formData.past_medical_history_other}
          onChange={(e) => onChange('past_medical_history_other', e.target.value)}
          className="input min-h-[100px] resize-none"
          placeholder="Describe any other medical conditions, allergies, or significant health events..."
        />
      </div>
      
      {/* Chief Complaint */}
      <div className="bg-blue-50 rounded-xl p-6 space-y-4 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <AlertCircle size={20} />
          Current Visit Information
        </h3>
        <div>
          <label className="label text-blue-800">Chief Complaint</label>
          <textarea
            value={formData.chief_complaint}
            onChange={(e) => onChange('chief_complaint', e.target.value)}
            className="input min-h-[80px] resize-none bg-white"
            placeholder="Patient's main reason for visit..."
          />
        </div>
        <div>
          <label className="label text-blue-800">History of Present Illness</label>
          <textarea
            value={formData.present_illness_history}
            onChange={(e) => onChange('present_illness_history', e.target.value)}
            className="input min-h-[100px] resize-none bg-white"
            placeholder="Detailed description of symptoms, duration, severity, aggravating/relieving factors..."
          />
        </div>
      </div>
    </div>
  )
}

// Step 5: OB/GYN History (for females)
const OBGYNHistoryStep = ({ formData, onChange, onCheckboxChange }) => {
  if (formData.sex !== 'Female') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Heart className="text-primary-600" size={28} />
          OB/GYN History
        </h2>
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">This section is not applicable as the patient is male.</p>
          <p className="text-gray-400 mt-2">Click "Next" to continue to Vital Signs.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <Heart className="text-primary-600" size={28} />
        OB/GYN History
      </h2>
      <p className="text-gray-600">For female patients - Reproductive and maternal health information:</p>
      
      {/* Menstrual History */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Menstrual History</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Menstrual Status</label>
            <select value={formData.menstrual_status} onChange={(e) => onChange('menstrual_status', e.target.value)} className="input">
              <option value="">Select</option>
              <option value="Pre-menarche">Pre-menarche</option>
              <option value="Menstruating">Menstruating</option>
              <option value="Pregnant">Pregnant</option>
              <option value="Postpartum">Postpartum</option>
              <option value="Menopausal">Menopausal</option>
            </select>
          </div>
          <div>
            <label className="label">Age at First Period (Menarche)</label>
            <input type="number" value={formData.age_menarche} onChange={(e) => onChange('age_menarche', e.target.value)} className="input" placeholder="e.g., 12" />
          </div>
          <div>
            <label className="label">Cycle Regular?</label>
            <select value={formData.menstrual_cycle_regular} onChange={(e) => onChange('menstrual_cycle_regular', e.target.value)} className="input">
              <option value="">Select</option>
              <option value="Regular">Regular</option>
              <option value="Irregular">Irregular</option>
            </select>
          </div>
          <div>
            <label className="label">Cycle Length (days)</label>
            <input type="number" value={formData.menstrual_cycle_length} onChange={(e) => onChange('menstrual_cycle_length', e.target.value)} className="input" placeholder="e.g., 28" />
          </div>
          <div>
            <label className="label">Last Menstrual Period</label>
            <input type="date" value={formData.last_menstrual_period} onChange={(e) => onChange('last_menstrual_period', e.target.value)} className="input" />
          </div>
        </div>
      </div>
      
      {/* Pregnancy History */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Pregnancy History (Gravida/Para)</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.pregnant_now}
              onChange={(e) => onCheckboxChange('pregnant_now', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700 font-medium">Currently Pregnant</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Total Pregnancies (Gravida)</label>
            <input type="number" value={formData.pregnancy_count} onChange={(e) => onChange('pregnancy_count', e.target.value)} className="input" placeholder="G" />
          </div>
          <div>
            <label className="label">Live Births (Para)</label>
            <input type="number" value={formData.live_births} onChange={(e) => onChange('live_births', e.target.value)} className="input" placeholder="P" />
          </div>
          <div>
            <label className="label">Abortions/Miscarriages</label>
            <input type="number" value={formData.abortions} onChange={(e) => onChange('abortions', e.target.value)} className="input" placeholder="A" />
          </div>
          <div>
            <label className="label">Contraceptive Method</label>
            <select value={formData.contraceptive_method} onChange={(e) => onChange('contraceptive_method', e.target.value)} className="input">
              <option value="">Select</option>
              <option value="None">None</option>
              <option value="Pills">Pills</option>
              <option value="IUD">IUD</option>
              <option value="Injectables">Injectables</option>
              <option value="Implant">Implant</option>
              <option value="Condom">Condom</option>
              <option value="Natural">Natural/Fertility Awareness</option>
              <option value="Ligation">Ligation</option>
              <option value="Vasectomy">Vasectomy (partner)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 6: Vital Signs
const VitalSignsStep = ({ formData, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
      <Stethoscope className="text-primary-600" size={28} />
      Vital Signs & Measurements
    </h2>
    
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-blue-800 text-sm flex items-center gap-2">
        <Calendar size={16} />
        Assessment Date: {formData.vital_date_taken}
      </p>
    </div>
    
    {/* Anthropometric Measurements */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Anthropometric Measurements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Weight (kg) <span className="text-red-500">*</span></label>
          <input type="number" step="0.1" value={formData.vital_weight_kg} onChange={(e) => onChange('vital_weight_kg', e.target.value)} className="input" placeholder="e.g., 65.5" />
        </div>
        <div>
          <label className="label">Height (cm) <span className="text-red-500">*</span></label>
          <input type="number" value={formData.vital_height_cm} onChange={(e) => onChange('vital_height_cm', e.target.value)} className="input" placeholder="e.g., 165" />
        </div>
        <div>
          <label className="label">BMI (Auto-calculated)</label>
          <input type="text" value={formData.vital_bmi} readOnly className="input bg-gray-100" placeholder="Calculated" />
        </div>
        <div>
          <label className="label">BMI Category</label>
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            formData.vital_bmi < 18.5 ? 'bg-yellow-100 text-yellow-800' :
            formData.vital_bmi < 25 ? 'bg-green-100 text-green-800' :
            formData.vital_bmi < 30 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {formData.vital_bmi < 18.5 ? 'Underweight' :
             formData.vital_bmi < 25 ? 'Normal' :
             formData.vital_bmi < 30 ? 'Overweight' :
             formData.vital_bmi ? 'Obese' : 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">Waist Circumference (cm)</label>
          <input type="number" value={formData.vital_waist_circumference} onChange={(e) => onChange('vital_waist_circumference', e.target.value)} className="input" placeholder="cm" />
        </div>
        <div>
          <label className="label">Hip Circumference (cm)</label>
          <input type="number" value={formData.vital_hip_circumference} onChange={(e) => onChange('vital_hip_circumference', e.target.value)} className="input" placeholder="cm" />
        </div>
        <div>
          <label className="label">Waist-Hip Ratio</label>
          <input type="text" value={formData.vital_waist_hip_ratio} readOnly className="input bg-gray-100" placeholder="Auto-calculated" />
        </div>
      </div>
    </div>
    
    {/* Vital Signs */}
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Vital Signs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Blood Pressure (Systolic) <span className="text-red-500">*</span></label>
          <input type="number" value={formData.vital_blood_pressure_systolic} onChange={(e) => onChange('vital_blood_pressure_systolic', e.target.value)} className="input" placeholder="mmHg" />
        </div>
        <div>
          <label className="label">Blood Pressure (Diastolic) <span className="text-red-500">*</span></label>
          <input type="number" value={formData.vital_blood_pressure_diastolic} onChange={(e) => onChange('vital_blood_pressure_diastolic', e.target.value)} className="input" placeholder="mmHg" />
        </div>
        <div>
          <label className="label">Pulse Rate</label>
          <input type="number" value={formData.vital_pulse_rate} onChange={(e) => onChange('vital_pulse_rate', e.target.value)} className="input" placeholder="bpm" />
        </div>
        <div>
          <label className="label">Respiratory Rate</label>
          <input type="number" value={formData.vital_respiratory_rate} onChange={(e) => onChange('vital_respiratory_rate', e.target.value)} className="input" placeholder="breaths/min" />
        </div>
      </div>
      <div>
        <label className="label">Temperature (°C)</label>
        <input type="number" step="0.1" value={formData.vital_temperature} onChange={(e) => onChange('vital_temperature', e.target.value)} className="input" placeholder="e.g., 36.5" />
      </div>
    </div>
  </div>
)

// Step 7: Risk Assessment
const RiskAssessmentStep = ({ formData, onCheckboxChange, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
      <AlertCircle className="text-primary-600" size={28} />
      Risk Assessment
    </h2>
    
    {/* CVD Risk */}
    <div className="bg-red-50 rounded-xl p-6 space-y-4 border border-red-200">
      <h3 className="text-lg font-semibold text-red-900">Cardiovascular Disease (CVD) Risk</h3>
      <p className="text-red-700 text-sm">Does the patient experience any of the following?</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.cv_angina} onChange={(e) => onCheckboxChange('cv_angina', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-red-600" />
          <span className="text-gray-700">Chest pain/angina</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.cv_heart_attack_history} onChange={(e) => onCheckboxChange('cv_heart_attack_history', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-red-600" />
          <span className="text-gray-700">History of heart attack</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.cv_stroke_history} onChange={(e) => onCheckboxChange('cv_stroke_history', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-red-600" />
          <span className="text-gray-700">History of stroke</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.cv_leg_pain_walking} onChange={(e) => onCheckboxChange('cv_leg_pain_walking', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-red-600" />
          <span className="text-gray-700">Leg pain when walking</span>
        </label>
      </div>
    </div>
    
    {/* Diabetes Risk */}
    <div className="bg-orange-50 rounded-xl p-6 space-y-4 border border-orange-200">
      <h3 className="text-lg font-semibold text-orange-900">Diabetes Mellitus Risk</h3>
      <p className="text-orange-700 text-sm">Check all symptoms present:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'dm_polyuria', label: 'Frequent urination (polyuria)' },
          { id: 'dm_polydipsia', label: 'Excessive thirst (polydipsia)' },
          { id: 'dm_polyphagia', label: 'Excessive hunger (polyphagia)' },
          { id: 'dm_weight_loss', label: 'Unexplained weight loss' },
          { id: 'dm_fatigue', label: 'Fatigue/weakness' },
          { id: 'dm_blurred_vision', label: 'Blurred vision' },
          { id: 'dm_poor_wound_healing', label: 'Poor wound healing' },
          { id: 'dm_previous_diagnosis', label: 'Previously diagnosed DM' },
          { id: 'dm_family_history', label: 'Strong family history' }
        ].map((item) => (
          <label key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
            <input type="checkbox" checked={formData[item.id]} onChange={(e) => onCheckboxChange(item.id, e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-orange-600" />
            <span className="text-gray-700 text-sm">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
    
    {/* TB Risk */}
    <div className="bg-yellow-50 rounded-xl p-6 space-y-4 border border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-900">Tuberculosis Risk Screening</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'tb_cough_more_than_2_weeks', label: 'Cough for more than 2 weeks' },
          { id: 'tb_bloody_sputum', label: 'Bloody sputum' },
          { id: 'tb_fever_night_sweats', label: 'Fever or night sweats' },
          { id: 'tb_weight_loss', label: 'Unexplained weight loss' },
          { id: 'tb_chest_pain', label: 'Chest pain' },
          { id: 'tb_exposure_history', label: 'Close contact with TB patient' }
        ].map((item) => (
          <label key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
            <input type="checkbox" checked={formData[item.id]} onChange={(e) => onCheckboxChange(item.id, e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-yellow-600" />
            <span className="text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
    
    {/* Mental Health Risk */}
    <div className="bg-purple-50 rounded-xl p-6 space-y-4 border border-purple-200">
      <h3 className="text-lg font-semibold text-purple-900">Mental Health Screening (PHQ-2)</h3>
      <p className="text-purple-700 text-sm">Over the last 2 weeks, how often has the patient been bothered by:</p>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.mh_depression_feeling_down} onChange={(e) => onCheckboxChange('mh_depression_feeling_down', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-purple-600" />
          <span className="text-gray-700">Little interest or pleasure in doing things</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.mh_depression_little_interest} onChange={(e) => onCheckboxChange('mh_depression_little_interest', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-purple-600" />
          <span className="text-gray-700">Feeling down, depressed, or hopeless</span>
        </label>
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
          <input type="checkbox" checked={formData.mh_anxiety_worry} onChange={(e) => onCheckboxChange('mh_anxiety_worry', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-purple-600" />
          <span className="text-gray-700">Feeling nervous, anxious, or on edge</span>
        </label>
      </div>
    </div>
    
    {/* Overall Assessment */}
    <div className="bg-gray-100 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Overall Risk Assessment</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">CVD Risk Level</label>
          <select value={formData.overall_cvd_risk} onChange={(e) => onChange('overall_cvd_risk', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="High">High Risk</option>
            <option value="Very High">Very High Risk</option>
          </select>
        </div>
        <div>
          <label className="label">Diabetes Risk Level</label>
          <select value={formData.overall_diabetes_risk} onChange={(e) => onChange('overall_diabetes_risk', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>
        <div>
          <label className="label">Overall Health Status</label>
          <select value={formData.overall_health_status} onChange={(e) => onChange('overall_health_status', e.target.value)} className="input">
            <option value="">Select</option>
            <option value="Healthy">Healthy</option>
            <option value="At Risk">At Risk</option>
            <option value="Sick">Sick/Ill</option>
          </select>
        </div>
      </div>
    </div>
  </div>
)

// Step 8: Management Plan
const ManagementStep = ({ formData, onChange, onCheckboxChange, onMultiSelectChange }) => {
  const healthEducationTopics = [
    'Smoking Cessation', 'Alcohol Reduction', 'Healthy Diet', 'Physical Activity',
    'Stress Management', 'Medication Adherence', 'Self-Monitoring', 'Family Planning'
  ]
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <Shield className="text-primary-600" size={28} />
        Management Plan
      </h2>
      
      {/* Referral */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Referral</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.management_referral_needed} onChange={(e) => onCheckboxChange('management_referral_needed', e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary-600" />
            <span className="text-gray-700 font-medium">Referral to Higher Facility Needed</span>
          </label>
        </div>
        {formData.management_referral_needed && (
          <div>
            <label className="label">Referral Facility/Department</label>
            <input type="text" value={formData.management_referral_to} onChange={(e) => onChange('management_referral_to', e.target.value)} className="input" placeholder="e.g., Cebu Provincial Hospital - Internal Medicine" />
          </div>
        )}
      </div>
      
      {/* Health Education */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Health Education Provided</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthEducationTopics.map((topic) => (
            <label key={topic} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
              <input type="checkbox" checked={formData.management_health_education?.includes(topic)} onChange={(e) => onMultiSelectChange('management_health_education', topic, e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary-600" />
              <span className="text-gray-700 text-sm">{topic}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Follow-up */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Follow-up Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Follow-up Date</label>
            <input type="date" value={formData.management_follow_up_date} onChange={(e) => onChange('management_follow_up_date', e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Assessed By</label>
            <input type="text" value={formData.assessed_by} onChange={(e) => onChange('assessed_by', e.target.value)} className="input" placeholder="Name of BHW/Nurse" />
          </div>
        </div>
      </div>
      
      {/* Remarks */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Additional Remarks</h3>
        <textarea value={formData.management_remarks} onChange={(e) => onChange('management_remarks', e.target.value)} className="input min-h-[120px] resize-none" placeholder="Enter any additional notes, recommendations, or special instructions..." />
      </div>
    </div>
  )
}

// Step 9: Review
const ReviewStep = ({ formData }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
      <Check className="text-primary-600" size={28} />
      Review Information
    </h2>
    
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-blue-800">
        Please review all the information entered before saving. This PCHRAT assessment will be saved to the patient's record.
      </p>
    </div>
    
    {/* Patient Summary */}
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.first_name} {formData.middle_name} {formData.last_name}</span></div>
        <div><span className="text-gray-500">Birthdate:</span> <span className="font-medium">{formData.birthdate}</span></div>
        <div><span className="text-gray-500">Sex:</span> <span className="font-medium">{formData.sex}</span></div>
        <div><span className="text-gray-500">Barangay:</span> <span className="font-medium">{formData.barangay}</span></div>
        <div><span className="text-gray-500">Contact:</span> <span className="font-medium">{formData.mobile}</span></div>
        <div><span className="text-gray-500">PhilHealth:</span> <span className="font-medium">{formData.philhealth_member || 'Not specified'}</span></div>
      </div>
    </div>
    
    {/* Vital Signs Summary */}
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Vital Signs Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Weight</p>
          <p className="font-bold text-lg">{formData.vital_weight_kg || '-'} kg</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Height</p>
          <p className="font-bold text-lg">{formData.vital_height_cm || '-'} cm</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">BMI</p>
          <p className="font-bold text-lg">{formData.vital_bmi || '-'}</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Blood Pressure</p>
          <p className="font-bold text-lg">{formData.vital_blood_pressure_systolic || '-'}/{formData.vital_blood_pressure_diastolic || '-'}</p>
        </div>
      </div>
    </div>
    
    {/* Risk Summary */}
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Assessment Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600">CVD Risk</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            formData.overall_cvd_risk === 'Low' ? 'bg-green-100 text-green-800' :
            formData.overall_cvd_risk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
            formData.overall_cvd_risk === 'High' ? 'bg-orange-100 text-orange-800' :
            formData.overall_cvd_risk === 'Very High' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>{formData.overall_cvd_risk || 'Not assessed'}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600">Diabetes Risk</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            formData.overall_diabetes_risk === 'Low' ? 'bg-green-100 text-green-800' :
            formData.overall_diabetes_risk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
            formData.overall_diabetes_risk === 'High' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>{formData.overall_diabetes_risk || 'Not assessed'}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
          <span className="text-gray-600">Overall Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            formData.overall_health_status === 'Healthy' ? 'bg-green-100 text-green-800' :
            formData.overall_health_status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' :
            formData.overall_health_status === 'Sick' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>{formData.overall_health_status || 'Not assessed'}</span>
        </div>
      </div>
    </div>
  </div>
)

export default BarangayPCHRATForm
