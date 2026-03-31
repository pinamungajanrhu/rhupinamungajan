import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Shield,
  Users,
  HeartPulse,
  FileText,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  LogIn,
  UserPlus,
  Home,
  LogOut,
  CheckCircle2,
  Stethoscope,
  Activity,
  Database,
  Lock,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  Award,
  Calendar,
  Zap,
  Check,
  Sun,
  Moon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Landing = () => {
  const { user, loading, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [communitySlideIndex, setCommunitySlideIndex] = useState(0)
  const [hoveredService, setHoveredService] = useState(null)
  const [activeServiceTab, setActiveServiceTab] = useState(null)

  // New images from public folder
  const rhuImages = [
    '/469513217_122137429040381937_6735949333632380003_n.jpg',
    '/469558914_122137429058381937_6027524120498438110_n.jpg',
    '/469782867_122137428176381937_2031401806476784158_n.jpg',
    '/470062506_122138039450381937_2462332216394326086_n.jpg',
    '/475505814_122145504062381937_8222510245037428534_n.jpg'
  ]

  // Community section slideshow images
  const communityImages = [
    { img: rhuImages[0], title: 'Patient-First Care', desc: 'Personalized medical attention for every resident.' },
    { img: rhuImages[1], title: 'Community Health Programs', desc: 'Reaching out to all 26 barangays with quality healthcare.' },
    { img: rhuImages[2], title: 'Maternal Health Services', desc: 'Comprehensive care for mothers and newborns.' },
    { img: rhuImages[3], title: 'Modern Health Facilities', desc: 'Equipped with the latest medical technology.' },
    { img: rhuImages[4], title: 'Dedicated Healthcare Team', desc: 'Professional staff committed to serving the community.' }
  ]

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % rhuImages.length)
    }, 5000) // Change every 5 seconds
    return () => clearInterval(interval)
  }, [rhuImages.length])

  // Auto-rotate community section images
  useEffect(() => {
    const interval = setInterval(() => {
      setCommunitySlideIndex((prev) => (prev + 1) % communityImages.length)
    }, 6000) // Change every 6 seconds
    return () => clearInterval(interval)
  }, [communityImages.length])

  // Manual navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % rhuImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + rhuImages.length) % rhuImages.length)
  }

  const nextCommunitySlide = () => {
    setCommunitySlideIndex((prev) => (prev + 1) % communityImages.length)
  }

  const prevCommunitySlide = () => {
    setCommunitySlideIndex((prev) => (prev - 1 + communityImages.length) % communityImages.length)
  }

  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Comprehensive digital records for every resident, tracking health history and demographics across all barangays.',
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: HeartPulse,
      title: 'Health Assessment',
      description: 'Standardized PCHRAT assessments to identify health risks early and categorize patients for appropriate care.',
      color: 'bg-rose-600',
      lightColor: 'bg-rose-50',
      iconColor: 'text-rose-600'
    },
    {
      icon: Stethoscope,
      title: 'Doctor Consultations',
      description: 'Efficient workflow for doctors to review assessments, record findings, and provide digital prescriptions.',
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Activity,
      title: 'Real-time Analytics',
      description: 'Live dashboards and reports for health officers to monitor community health trends and resource needs.',
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ]

  const serviceRequirements = [
    {
      category: "Consultation & Clinical",
      items: [
        { name: "Pediatric Consultation (Age 0-17)", schedule: "Every Tuesday" },
        { name: "Prenatal Referral", schedule: "Every Wednesday (AM)" },
        { name: "Non-Communicable Diseases (Hypertension, Diabetes)", schedule: "Every Thursday" },
        { name: "Adult Consultation", schedule: "Every Friday" },
        { name: "Minor Surgery", schedule: "Schedule may vary depending on availability of physician", reqs: ["Complicated cases may be referred to higher level facility"] }
      ],
      notes: [
        "Schedule may vary upon further notice depending on availability of physicians",
        "Emergency cases upon doctor's assessment are prioritized anytime during office hours"
      ]
    },
    {
      category: "Maternal & Child Care",
      items: [
        { name: "Labor and Delivery", schedule: "Available 24/7", reqs: ["Official Receipt (FEE = ₱2,500.00)", "Mother's Book", "Routine Laboratory results (CBC, BT, UA, FBS, HBSAG, HIV, SYPHILIS, ULTRASOUND)"] },
        { name: "Newborn Screening", schedule: "Ideally within 3 days from birth", reqs: ["Official Receipt (FEE = ₱1,750.00)"] },
        { name: "Childhood Routine Immunization", schedule: "Schedule may vary", reqs: ["Available in all BHS", "Baby's book"] },
        { name: "Prenatal", schedule: "Schedule may vary", reqs: ["Available in all BHS", "Mother's book", "Routine laboratory results (CBC, BT, UA, FBS, HBSAG, HIV, SYPHILIS, ULTRASOUND)"] },
        { name: "Family Planning", schedule: "Everyday within office hours", reqs: ["Trained service providers for depo injection, IUD and subdermal implant insertion are available in the birthing center", "Ideally must visit during 1st menstrual day", "Free family planning commodities (pills, depo, condom) allocated per BHS"] }
      ]
    },
    {
      category: "Treatments & Preventive Care",
      items: [
        { name: "Animal Bite Treatment / Anti-Rabies Vaccination", schedule: "Every Tuesday & Friday", reqs: ["Official Receipt (FEE = ₱50.00)", "Valid ID with address or Barangay Certification of Residency", "Short envelope (New patients)", "2 Insulin syringes"] },
        { name: "TB DOTS Treatment", schedule: "Every Thursday & Friday", reqs: ["Barangay Health Worker assigned", "Gene Xpert or DSSM result FREE for patients; FEE = ₱50.00 for employment Chest X-Ray result"] },
        { name: "Laboratory", schedule: "Everyday (Weekdays)", reqs: ["Official Receipt from Municipal Treasurer's Office", "Laboratory request"] }
      ]
    },
    {
      category: "Certificates & Permits",
      items: [
        { name: "Medical Certificate", schedule: "Every Monday (AM) & Wednesday (PM)", reqs: ["Official Receipt (FEE = ₱85.00)", "For Employment/Health Card - Urinalysis, Stool Exam, Chest X-Ray", "For Enrolment - labs requested from school", "For DepEd Teachers - labs requested from DepEd", "For Return To Work - physician's discretion"] },
        { name: "Medicolegal Certificate", schedule: "Every Monday (AM) & Wednesday (PM)", reqs: ["Police Blotter / Request for medical exam", "Official Receipt (FEE = ₱140.00; Exemption: VAWC cases)", "If seen and examined by doctors in District Hospital - note of initial findings", "Prescription", "Preferably with pictures of the injury on the date of the incident (for verification)"] },
        { name: "Death Cert. / Approval For Embalming", schedule: "Everyday (Weekdays)", reqs: ["Barangay Certification of Death", "Previous laboratory results", "Previous prescriptions", "Medical Abstract or Certificate"] },
        { name: "Sanitary Permit", reqs: ["For Water Refilling - Ask RSI for checklist of requirements", "MICRO TO MEDIUM-SCALE BUSINESS - Urinalysis, Stool Exam, Chest X-ray", "LARGE-SCALE BUSINESS - Urinalysis, Stool Exam, Chest X-ray, CBC and Hepatitis screening (ANTI-HAV for food establishment; HbsAg for non-food establishment)"] },
        { name: "Exhumation Permit", reqs: ["Official Receipt (FEE = ₱110.00)", "Copy of registered death certificate"] },
        { name: "Transfer of Cadaver Permit", reqs: ["Official Receipt (FEE = ₱110.00)", "Copy of Death Certificate"] },
        { name: "COVID Vaccination Certificate", reqs: ["Official Receipt (FEE = ₱110.00)", "If lost - Affidavit Of Loss", "Schedule may vary depending on availability of nurse focal assigned"] }
      ]
    },
    {
      category: "Laboratory Schedule",
      items: [
        {
          name: "Daily (Monday - Friday)",
          reqs: [
            "CBC, Blood Typing, Urinalysis, Stool Exam, Occult Blood Rapid Tests (Dengue NS1, IgG, IgM, Anti-HAV, HbsAg, HIV, Syphilis/VDRL, Typhidot IgG, IgM)",
            "ORBS, Hemoglobin, Cholesterol, BUA (using test strips)",
            "DSSM (Sputum Smear Microscopy)",
            "Thyroid Panel (TSH, FT3, FT4)"
          ]
        },
        {
          name: "TTH (Tuesday & Thursday)",
          reqs: [
            "Lipid Panel (Total Cholesterol, Triglycerides)",
            "Kidney Function Test (BUN, Creatinine)",
            "Liver Function Test (SGPT, SGOT)",
            "Fasting Blood Sugar, HbA1c",
            "PSA (Prostate Specific Antigen)"
          ]
        },
        {
          name: "Every Friday",
          reqs: [
            "Routine Laboratory tests for pregnant women (CBC, Blood Typing, UA, FBS, HIV, HbsAg, Syphilis)"
          ]
        }
      ]
    }
  ]

  const handleLogin = () => navigate('/login')
  const handleDashboard = () => navigate('/dashboard')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center">
                <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain hover:rotate-6 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">Pinamungajan</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary-600 dark:text-primary-400 font-bold mt-0.5">Health Care System</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-8 lg:gap-12">
                <a href="#community" className="text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all relative group">
                  Community
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full rounded-full"></span>
                </a>
                <a href="#features" className="text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all relative group">
                  Service List
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full rounded-full"></span>
                </a>
                <a href="#mission-vision" className="text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-all relative group">
                  End Goal
                  <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full rounded-full"></span>
                </a>
                {user ? (
                  <div className="flex items-center gap-6 pl-8 border-l border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Welcome back,</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName.split(' ')[0]}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDashboard}
                      className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold rounded-xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                    >
                      Dashboard
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    className="px-8 py-3 bg-primary-600 text-white text-sm font-bold rounded-xl shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all"
                  >
                    Sign In
                  </motion.button>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images - Slideshow */}
        <div className="absolute inset-0 z-0">
          {rhuImages.map((img, index) => (
            <motion.div
              key={img}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={img}
                alt={`RHU ${index + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
          ))}
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50 z-10"></div>
        </div>

        {/* Image Indicators Only */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {rhuImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white/80 w-2'
                }`}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-7xl lg:text-[6.5rem] font-bold text-white leading-[0.9] mb-10 tracking-tighter drop-shadow-lg">
                Healthier <br />
                <span className="text-primary-400 relative inline-block">
                  Together.
                  <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9C55.3333 4.33333 161.4 -2.6 315 9" stroke="#4ADE80" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-14 leading-relaxed max-w-lg font-medium drop-shadow-md">
                A unified digital platform for patient registration, assessments,
                and consultations. Bringing modern healthcare efficiency to
                Pinamungahan's community.
              </p>

              <div className="flex gap-16 items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight drop-shadow-md">26</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Barangays</span>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight drop-shadow-md">15k+</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Residents</span>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight drop-shadow-md">100%</span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Digital</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section - Slideshow with Services Intro */}
      <section id="community" className="relative py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-white/10 border border-primary-500/20 dark:border-white/20 mb-6">
                <Users size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white/90">Our Community</span>
              </div>
              <h3 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight tracking-tighter">
                Serving with <br /> <span className="text-primary-600 dark:text-primary-400 underline decoration-8 decoration-primary-500/50 underline-offset-8">Excellence.</span>
              </h3>
            </div>
            <p className="text-xl text-slate-600 dark:text-white/70 max-w-sm font-semibold leading-relaxed">
              Real moments from our daily operations, showcasing our commitment to
              Pinamungahan's health and wellbeing.
            </p>
          </div>

          {/* Slideshow Container */}
          <div className="relative">
            {/* Main Slideshow Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-white/10">
              {communityImages.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: index === communitySlideIndex ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Overlay with text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-16">
                    <motion.h4
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: index === communitySlideIndex ? 0 : 20, opacity: index === communitySlideIndex ? 1 : 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-4xl lg:text-5xl font-bold text-white mb-4"
                    >
                      {item.title}
                    </motion.h4>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: index === communitySlideIndex ? 0 : 20, opacity: index === communitySlideIndex ? 1 : 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-xl text-white/80 font-medium max-w-2xl"
                    >
                      {item.desc}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
              {/* Prev Button */}
              <motion.button
                onClick={prevCommunitySlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <ArrowLeft size={24} />
              </motion.button>

              {/* Indicators */}
              <div className="flex gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                {communityImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCommunitySlideIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === communitySlideIndex ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white/80 w-2'
                      }`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                onClick={nextCommunitySlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                <ChevronRight size={28} />
              </motion.button>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">26 Barangays</h4>
              <p className="text-slate-500 dark:text-white/60 text-sm font-medium">Serving the entire municipality with accessible healthcare</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Mon - Fri</h4>
              <p className="text-slate-500 dark:text-white/60 text-sm font-medium">8:00 AM - 5:00 PM regular operating hours</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-primary-600 dark:text-primary-400" size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">DOH Accredited</h4>
              <p className="text-slate-500 dark:text-white/60 text-sm font-medium">Licensed and certified primary care facility</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section - Facility Services */}
      <section id="features" className="py-32 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-6">Our Facility</h2>
            <h3 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-10 tracking-tighter leading-none">Medical & Laboratory <br /> Services.</h3>
            <p className="text-xl text-slate-600 dark:text-white/70 font-semibold leading-relaxed">
              Comprehensive healthcare services available at Pinamungajan RHU.
            </p>
          </div>

          {/* Services Grid - 2 Categories */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Medical Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setHoveredService(hoveredService === 'medical' ? null : 'medical')}
              className="relative bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 overflow-hidden cursor-pointer transition-all duration-500 hover:border-primary-500/30"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>

              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-100 dark:bg-gradient-to-br dark:from-primary-500/20 dark:to-primary-600/10 rounded-2xl flex items-center justify-center border border-primary-200 dark:border-primary-500/20">
                  <Stethoscope size={28} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Services</h4>
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 uppercase tracking-wider font-bold">Primary Care</span>
                </div>
                <motion.div
                  animate={{ rotate: hoveredService === 'medical' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center"
                >
                  <ChevronDown size={16} className="text-primary-600 dark:text-primary-400" />
                </motion.div>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: hoveredService === 'medical' ? 'auto' : 0,
                  opacity: hoveredService === 'medical' ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="pt-8">
                  <ul className="space-y-1">
                    {[
                      'Medical Certificate',
                      'Health Certificate',
                      'Medico legal fees',
                      'COVID Vaccination Certificate',
                      'Quarantine/Isolation Certificate',
                      'Vaccine Certificate',
                      'Cardiopulmonary Clearance Certificate',
                      'Birthing Center Fee',
                      'Hygiene Examination',
                      'Drug Dependency Examination'
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-slate-600 dark:text-white/70 text-xs group cursor-default"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-600 dark:group-hover:bg-primary-400 transition-colors"></span>
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors font-medium">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Updated as of 2026 - Badge Style */}
                  <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
                    <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold">Updated as of 2026</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
                  </div>

                  {/* Second Section */}
                  <ul className="space-y-1">
                    {[
                      'Tooth Extraction',
                      'Tooth Filing',
                      'Cleaning/Oral Prophylaxis',
                      'Dental Certificate',
                      'Burial Permit Fees',
                      'Transfer of Cadaver',
                      'Fee for Exhumation/Removal of Cadaver',
                      'Animal Bite Treatment Center (ABTC) Fee'
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-slate-600 dark:text-white/70 text-xs group cursor-default"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-600 dark:group-hover:bg-primary-400 transition-colors"></span>
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors font-medium">{item}</span>
                      </motion.li>
                    ))}
                    <li className="flex items-center gap-2 text-slate-600 dark:text-white/70 text-xs mt-2 font-bold">
                      <span className="w-1 h-1 rounded-full bg-primary-500/50"></span>
                      <span className="text-slate-900 dark:text-white/80">Pre-marriage Counseling Fee:</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 dark:text-white/50 text-xs ml-4 font-medium">
                      <span className="text-primary-500/40 text-[10px]">◦</span>
                      <span>Residents</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 dark:text-white/50 text-xs ml-4 font-medium">
                      <span className="text-primary-500/40 text-[10px]">◦</span>
                      <span>Non-residents</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-500 dark:text-white/50 text-xs ml-4 font-medium">
                      <span className="text-primary-500/40 text-[10px]">◦</span>
                      <span>Foreigner/Special</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>

            {/* Laboratory Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => setHoveredService(hoveredService === 'lab' ? null : 'lab')}
              className="relative bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 overflow-hidden cursor-pointer transition-all duration-500 hover:border-rose-500/30"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>

              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-rose-100 dark:bg-gradient-to-br dark:from-rose-500/20 dark:to-rose-600/10 rounded-2xl flex items-center justify-center border border-rose-200 dark:border-rose-500/20">
                  <Activity size={28} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Laboratory Services</h4>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 uppercase tracking-wider font-bold">Diagnostics</span>
                </div>
                <motion.div
                  animate={{ rotate: hoveredService === 'lab' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center"
                >
                  <ChevronDown size={16} className="text-rose-600 dark:text-rose-400" />
                </motion.div>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: hoveredService === 'lab' ? 'auto' : 0,
                  opacity: hoveredService === 'lab' ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="pt-6">

                  {/* Hematology */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-0.5 h-3 bg-rose-500/50 rounded-full"></div>
                      <h5 className="text-rose-600 dark:text-rose-300 font-bold text-xs">Hematology</h5>
                    </div>
                    <ul className="space-y-0.5 ml-2 flex gap-4">
                      <li className="flex items-center gap-1.5 text-slate-600 dark:text-white/70 text-xs group">
                        <span className="text-rose-500/40 text-[10px] font-mono">a.</span>
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors font-medium">Complete Blood Count (CBC)</span>
                      </li>
                      <li className="flex items-center gap-1.5 text-slate-600 dark:text-white/70 text-xs group">
                        <span className="text-rose-500/40 text-[10px] font-mono">b.</span>
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors font-medium">Blood Typing</span>
                      </li>
                    </ul>
                  </div>

                  {/* Blood Chemistry Tests */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-0.5 h-3 bg-rose-500/50 rounded-full"></div>
                      <h5 className="text-rose-600 dark:text-rose-300 font-bold text-xs">Blood Chemistry Tests</h5>
                    </div>
                    <ul className="space-y-0.5 ml-2 grid grid-cols-2 gap-x-4">
                      {[
                        { letter: 'a', text: '75 grams OGTT' },
                        { letter: 'b', text: 'ALT/SGPT' },
                        { letter: 'c', text: 'AST/SGOT' },
                        { letter: 'd', text: 'BUN' },
                        { letter: 'e', text: 'BUA' },
                        { letter: 'f', text: 'Calcium' },
                        { letter: 'g', text: 'Chloride' },
                        { letter: 'h', text: 'Creatinine' },
                        { letter: 'i', text: 'Fasting Blood Sugar' },
                        { letter: 'j', text: 'Lipid Panel' },
                        { letter: 'k', text: 'Potassium' },
                        { letter: 'l', text: 'Random Blood Sugar' },
                        { letter: 'm', text: 'Sodium' }
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-white/70 text-xs group">
                          <span className="text-rose-500/40 text-[10px] font-mono w-3">{item.letter}.</span>
                          <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors truncate font-medium">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Updated As of 2026 - Badge Style */}
                  <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent"></div>
                    <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">Updated As of 2026</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent"></div>
                  </div>

                  {/* Clinical Microscopy Test */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-0.5 h-3 bg-rose-500/50 rounded-full"></div>
                      <h5 className="text-rose-600 dark:text-rose-300 font-bold text-xs">Clinical Microscopy Test</h5>
                    </div>
                    <ul className="space-y-0.5 ml-2 flex flex-wrap gap-x-4">
                      {[
                        { letter: 'a', text: 'Sputum Examination' },
                        { letter: 'b', text: 'Stool Examination' },
                        { letter: 'c', text: 'Fecal Occult Blood Test' },
                        { letter: 'd', text: 'Urinalysis' }
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-white/70 text-xs group">
                          <span className="text-rose-500/40 text-[10px] font-mono w-3">{item.letter}.</span>
                          <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors font-medium">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Immunologic Test */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-0.5 h-3 bg-rose-500/50 rounded-full"></div>
                      <h5 className="text-rose-600 dark:text-rose-300 font-bold text-xs">Immunologic Test</h5>
                    </div>
                    <ul className="space-y-0.5 ml-2 grid grid-cols-2 gap-x-3">
                      {[
                        { letter: 'a', text: 'Anti-HAV' },
                        { letter: 'b', text: 'COVID-19 Rapid Antigen' },
                        { letter: 'c', text: 'Dengue Duo' },
                        { letter: 'd', text: 'Dengue IgG/IgM' },
                        { letter: 'e', text: 'Dengue NS1' },
                        { letter: 'f', text: 'Free T3 (FT3)' },
                        { letter: 'g', text: 'Free T4 (FT4)' },
                        { letter: 'h', text: 'HbA1c' },
                        { letter: 'i', text: 'Hepatitis B (HbsAg)' },
                        { letter: 'j', text: 'HIV Testing*' },
                        { letter: 'k', text: 'Pregnancy Test (PT)' },
                        { letter: 'l', text: 'PSA' },
                        { letter: 'm', text: 'Syphilis (VDRL)' },
                        { letter: 'n', text: 'TSH' },
                        { letter: 'o', text: 'Typhi DOT IgG/IgM' }
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-white/70 text-xs group">
                          <span className="text-rose-500/40 text-[10px] font-mono w-3">{item.letter}.</span>
                          <span className="group-hover:text-slate-900 dark:group-hover:text-white/90 transition-colors truncate font-medium" title={item.text === 'HIV Testing*' ? 'For prenatal care and employment purposes only' : item.text}>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-slate-400 dark:text-white/30 text-[10px] mt-1 ml-2 italic font-medium">*HIV Testing - for prenatal care and employment purposes only</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Services Requirements - Modern Tabbed Interface */}
          <div className="mt-16 bg-white dark:bg-slate-900/40 rounded-[3rem] p-8 lg:p-12 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

            <div className="relative z-10 mb-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-700/30 mb-6 shadow-sm">
                <Calendar size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">Service List, Requirements & Schedule</h4>
              <p className="text-lg text-slate-500 dark:text-white/60 font-medium max-w-2xl">Complete guidelines, schedules, and requirements for all available services at the Rural Health Unit.</p>
            </div>

            <div className="relative z-10 flex flex-col gap-8">
              {/* Horizontal Tabs Top Navigation */}
              <div className="flex flex-row flex-wrap justify-center gap-3">
                {serviceRequirements.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveServiceTab(activeServiceTab === idx ? null : idx)}
                    className={`px-6 py-3.5 rounded-[1.5rem] md:rounded-full transition-all duration-300 relative overflow-hidden group border ${activeServiceTab === idx
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-slate-600'
                      }`}
                  >
                    {activeServiceTab === idx && (
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 bg-emerald-500 z-0"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <span className="font-bold text-[14px] whitespace-nowrap">{category.category}</span>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${activeServiceTab === idx ? 'text-white rotate-180' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Content Panel */}
              <div className="w-full relative">
                <AnimatePresence mode="wait">
                  {activeServiceTab !== null && (
                    <motion.div
                      key={activeServiceTab}
                      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full"
                    >
                      <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
                        {serviceRequirements[activeServiceTab].items.map((item, itemIdx) => (
                          <motion.div
                            key={itemIdx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: itemIdx * 0.05, duration: 0.3 }}
                            className="bg-white dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                          >
                            <h6 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.name}</h6>

                            {item.schedule && (
                              <div className="flex items-start gap-2 mb-4 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                <Clock size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{item.schedule}</span>
                              </div>
                            )}

                            {item.reqs && item.reqs.length > 0 && (
                              <div className="mt-auto pt-2">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Requirements</div>
                                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
                                </div>
                                <ul className="space-y-2.5">
                                  {item.reqs.map((req, reqIdx) => (
                                    <li key={reqIdx} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-[5px] shrink-0 group-hover:bg-emerald-500 transition-colors"></div>
                                      <span className="leading-snug">{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {serviceRequirements[activeServiceTab].notes && serviceRequirements[activeServiceTab].notes.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl px-6 py-5 border border-amber-100 dark:border-amber-800/30 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Zap size={16} className="text-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Important Notes</span>
                          </div>
                          <ul className="space-y-2">
                            {serviceRequirements[activeServiceTab].notes.map((note, noteIdx) => (
                              <li key={noteIdx} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300/80 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 mt-1 shrink-0"></div>
                                <span className="leading-snug">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission-vision" className="py-32 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/20 dark:border-primary-500/30 mb-8">
                  <HeartPulse size={16} className="text-primary-600 dark:text-primary-400" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">Mission</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
                  Upgrade Human Dignity
                </h3>
                <p className="text-xl text-slate-600 dark:text-white/70 leading-relaxed font-semibold">
                  To upgrade human dignity through individualized and quality health care delivery system.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 mb-8">
                  <Award size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Vision</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
                  A Healthy & Dynamic Community
                </h3>
                <p className="text-xl text-slate-600 dark:text-white/70 leading-relaxed font-semibold">
                  A healthy and dynamic community whose constituents have active participation in all health endeavors.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white leading-none">Pinamungajan</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 font-bold mt-1">Health Care System</span>
              </div>
            </div>

            <div className="flex gap-16 text-[11px] font-bold text-slate-400 dark:text-white/50 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-all">Privacy</a>
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-all">Terms</a>
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-all">Help Center</a>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-full border border-primary-200 dark:border-primary-500/30">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                Systems Active
              </div>
              <p className="text-xs text-slate-400 dark:text-white/50 font-bold tracking-tight">
                &copy; 2026 RHU Pinamungahan.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
