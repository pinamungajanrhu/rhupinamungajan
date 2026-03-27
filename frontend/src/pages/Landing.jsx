import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  Check
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Landing = () => {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // New images from public folder
  const rhuImages = [
    '/469513217_122137429040381937_6735949333632380003_n.jpg',
    '/469558914_122137429058381937_6027524120498438110_n.jpg',
    '/469782867_122137428176381937_2031401806476784158_n.jpg',
    '/470062506_122138039450381937_2462332216394326086_n.jpg',
    '/475505814_122145504062381937_8222510245037428534_n.jpg'
  ]

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % rhuImages.length)
    }, 5000) // Change every 5 seconds
    return () => clearInterval(interval)
  }, [rhuImages.length])

  // Manual navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % rhuImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + rhuImages.length) % rhuImages.length)
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

  const handleLogin = () => navigate('/login')
  const handleDashboard = () => navigate('/dashboard')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center">
                <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain hover:rotate-6 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Pinamungahan</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary-600 font-bold mt-0.5">Health Care System</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-12">
              <a href="#features" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-all relative group">
                Features
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full rounded-full"></span>
              </a>
              <a href="#community" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-all relative group">
                Community
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full rounded-full"></span>
              </a>
              {user ? (
                <div className="flex items-center gap-6 pl-8 border-l border-slate-200">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Welcome back,</span>
                    <span className="text-sm font-bold text-slate-900">{user.fullName.split(' ')[0]}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDashboard}
                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                  >
                    Dashboard
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  className="px-8 py-3 bg-primary-600 text-white text-sm font-bold rounded-xl shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all"
                >
                  Sign In
                </motion.button>
              )}
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

        {/* Image Indicators & Navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
          {/* Prev Button */}
          <motion.button
            onClick={prevImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20} />
          </motion.button>

          {/* Indicators */}
          <div className="flex gap-2">
            {rhuImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white/80 w-2'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={nextImage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight size={24} />
          </motion.button>
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
                    <path d="M3 9C55.3333 4.33333 161.4 -2.6 315 9" stroke="#4ADE80" strokeWidth="6" strokeLinecap="round"/>
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

        {/* Floating Badges */}
       


      </section>

      {/* Community Section - Dark Theme (No Background Image) */}
      <section id="community" className="relative py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <Users size={16} className="text-primary-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">Our Community</span>
              </div>
              <h3 className="text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tighter">
                Serving with <br /> <span className="text-primary-400 underline decoration-8 decoration-primary-500/50 underline-offset-8">Excellence.</span>
              </h3>
            </div>
            <p className="text-xl text-white/70 max-w-sm font-semibold leading-relaxed">
              Real moments from our daily operations, showcasing our commitment to 
              Pinamungahan's health and wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { img: rhuImages[0], title: 'Patient-First Care', desc: 'Personalized medical attention for every resident.' },
              { img: rhuImages[4], title: 'Unified Healthcare', desc: 'A professional team working with modern tools.' },
              { special: true, title: 'Secure & Accessible', desc: 'Digital records built with the highest privacy standards.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative"
              >
                {item.special ? (
                  <div className="h-[450px] rounded-[3rem] bg-white/10 p-12 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden border border-white/20">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                      <Zap size={150} strokeWidth={1} />
                    </div>
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-900/40">
                      <Lock size={32} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-4xl font-bold mb-6 leading-tight">{item.title}</h4>
                      <p className="text-lg font-semibold text-white/70">{item.desc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className="h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="px-2">
                      <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
                      <p className="text-lg font-semibold text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Dark Theme */}
      <section id="features" className="py-32 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-[11px] font-bold text-primary-400 uppercase tracking-[0.3em] mb-6">Core Capabilities</h2>
            <h3 className="text-5xl lg:text-7xl font-bold text-white mb-10 tracking-tighter leading-none">Modern Health <br /> Ecosystem.</h3>
            <p className="text-xl text-white/70 font-semibold leading-relaxed">
              Every feature is meticulously designed to optimize the healthcare 
              journey for both staff and residents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] hover:bg-white/10 transition-all duration-500"
              >
                <div className={`w-16 h-16 ${feature.color} bg-opacity-20 rounded-2xl flex items-center justify-center mb-10 shadow-sm`}>
                  <feature.icon size={32} strokeWidth={2.5} className="text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-6 leading-tight">{feature.title}</h4>
                <p className="text-white/70 font-semibold text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden border border-white/10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-8">
                  <HeartPulse size={16} className="text-primary-400" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-400">Our Mission</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
                  Quality Care for Mothers & Newborns
                </h3>
                <p className="text-xl text-white/70 leading-relaxed font-medium">
                  To provide quality maternal and neonatal services to all pregnant mothers and newborn babies through a service-oriented, passionate and efficient health workers.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-900 rounded-[3rem] p-12 lg:p-16 relative overflow-hidden border border-white/10"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8">
                  <Award size={16} className="text-blue-400" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">Our Vision</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
                  DOH & PhilHealth Accredited Facility
                </h3>
                <p className="text-xl text-white/70 leading-relaxed font-medium">
                  Pinamungajan Primary Care Facility is a DOH and PhilHealth Accredited, mother and child-friendly birthing facility that caters to all low-risk pregnant mothers through normal deliveries which are attended only by competent and skilled (BEMONC-trained) birth attendants.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Dark Theme */}
      <footer className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tighter text-white leading-none">Pinamungahan</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary-400 font-bold mt-1">Health Care System</span>
              </div>
            </div>
            
            <div className="flex gap-16 text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-primary-400 transition-all">Privacy</a>
              <a href="#" className="hover:text-primary-400 transition-all">Terms</a>
              <a href="#" className="hover:text-primary-400 transition-all">Help Center</a>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400 bg-primary-900/30 px-3 py-1.5 rounded-full border border-primary-500/30">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                Systems Active
              </div>
              <p className="text-xs text-white/50 font-semibold tracking-tight">
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
