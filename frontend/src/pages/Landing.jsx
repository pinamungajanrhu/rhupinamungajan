import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  HeartPulse, 
  FileText, 
  ArrowRight,
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

  // New images from public folder
  const rhuImages = [
    '/469513217_122137429040381937_6735949333632380003_n.jpg',
    '/469558914_122137429058381937_6027524120498438110_n.jpg',
    '/469782867_122137428176381937_2031401806476784158_n.jpg',
    '/470062506_122138039450381937_2462332216394326086_n.jpg',
    '/475505814_122145504062381937_8222510245037428534_n.jpg'
  ]

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
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary-600 font-bold mt-0.5">Health System</span>
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
      <section className="relative min-h-[90vh] pt-32 pb-20 flex items-center overflow-hidden bg-white">
        {/* Modern Background */}
        <div className="absolute top-0 right-0 w-[45%] h-full bg-slate-50 skew-x-[-8deg] origin-top translate-x-12 -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-50/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 mb-10"
              >
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Official Health Management Portal</span>
              </motion.div>

              <h1 className="text-7xl lg:text-[6.5rem] font-bold text-slate-950 leading-[0.9] mb-10 tracking-tighter">
                Healthier <br />
                <span className="text-primary-600 relative inline-block">
                  Together.
                  <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 318 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9C55.3333 4.33333 161.4 -2.6 315 9" stroke="#16A34A" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 mb-14 leading-relaxed max-w-lg font-medium">
                A unified digital platform for patient registration, assessments, 
                and consultations. Bringing modern healthcare efficiency to 
                Pinamungahan's community.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 mb-20">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={user ? handleDashboard : handleLogin}
                  className="px-12 py-6 bg-slate-950 text-white font-bold rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:bg-slate-900 transition-all flex items-center justify-center gap-4 text-lg"
                >
                  {user ? 'Enter Dashboard' : 'Get Started Now'}
                  <ArrowRight size={24} strokeWidth={3} />
                </motion.button>
                <motion.button 
                  whileHover={{ bg: '#f8fafc' }}
                  className="px-12 py-6 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 transition-all flex items-center justify-center gap-3 text-lg"
                >
                  Learn More
                </motion.button>
              </div>

              <div className="flex gap-16 items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-slate-950 tracking-tight">26</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Barangays</span>
                </div>
                <div className="w-px h-12 bg-slate-100"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-slate-950 tracking-tight">15k+</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Residents</span>
                </div>
                <div className="w-px h-12 bg-slate-100"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-bold text-slate-950 tracking-tight">100%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Digital</span>
                </div>
              </div>
            </motion.div>

            {/* Layout Adjusted Image Collage */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative lg:pl-10"
            >
              <div className="grid grid-cols-12 gap-5 h-[650px] relative">
                {/* Main Image - Center Weighted */}
                <div className="col-span-8 h-full">
                  <div className="h-full rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white relative group">
                    <img src={rhuImages[2]} alt="RHU Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-10">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-[10px] font-bold text-primary-100 uppercase tracking-[0.2em]">Live at RHU</span>
                        </div>
                        <p className="text-white text-xl font-bold leading-tight">Empowering healthcare through technology.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Side Stack */}
                <div className="col-span-4 flex flex-col gap-5 pt-12">
                  <div className="h-[45%] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={rhuImages[0]} alt="Activity" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="h-[45%] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={rhuImages[3]} alt="Staff" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>

                {/* Strategic Badge Positions */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-8 left-1/4 bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
                    <Check size={24} strokeWidth={4} />
                  </div>
                  <div className="pr-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="text-base font-bold text-slate-900">Accredited</p>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-12 -right-8 bg-white p-5 rounded-[2rem] shadow-2xl border border-slate-50 flex items-center gap-4 z-20"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Calendar size={24} strokeWidth={3} />
                  </div>
                  <div className="pr-4">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Operating</p>
                    <p className="text-base font-bold text-slate-900">Mon - Fri</p>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Geometric Background */}
              <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-slate-50 rounded-[4rem] rotate-12"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Section - Enhanced Layout */}
      <section id="community" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-6">
                <Users size={16} className="text-primary-600" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Our Community</span>
              </div>
              <h3 className="text-5xl lg:text-7xl font-bold text-slate-950 leading-tight tracking-tighter">
                Serving with <br /> <span className="text-primary-600 underline decoration-8 decoration-primary-100 underline-offset-8">Excellence.</span>
              </h3>
            </div>
            <p className="text-xl text-slate-500 max-w-sm font-semibold leading-relaxed">
              Real moments from our daily operations, showcasing our commitment to 
              Pinamungahan's health and wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { img: rhuImages[1], title: 'Patient-First Care', desc: 'Personalized medical attention for every resident.' },
              { img: rhuImages[4], title: 'Unified Healthcare', desc: 'A professional team working with modern tools.' },
              { special: true, title: 'Secure & Accessible', desc: 'Digital records built with the highest privacy standards.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                {item.special ? (
                  <div className="h-[450px] rounded-[3rem] bg-slate-950 p-12 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                      <Zap size={150} strokeWidth={1} />
                    </div>
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8">
                      <Lock size={32} strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-4xl font-bold mb-6 leading-tight">{item.title}</h4>
                      <p className="text-lg font-semibold text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className="h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="px-2">
                      <h4 className="text-2xl font-bold text-slate-950 mb-3">{item.title}</h4>
                      <p className="text-lg font-semibold text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Refined Spacing */}
      <section id="features" className="py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-[11px] font-bold text-primary-600 uppercase tracking-[0.3em] mb-6">Core Capabilities</h2>
            <h3 className="text-5xl lg:text-7xl font-bold text-slate-950 mb-10 tracking-tighter leading-none">Modern Health <br /> Ecosystem.</h3>
            <p className="text-xl text-slate-500 font-semibold leading-relaxed">
              Every feature is meticulously designed to optimize the healthcare 
              journey for both staff and residents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                <div className={`w-16 h-16 ${feature.lightColor} ${feature.iconColor} rounded-2xl flex items-center justify-center mb-10 shadow-sm`}>
                  <feature.icon size={32} strokeWidth={2.5} />
                </div>
                <h4 className="text-2xl font-bold text-slate-950 mb-6 leading-tight">{feature.title}</h4>
                <p className="text-slate-500 font-semibold text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action - Layout & Typography Focus */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-slate-950 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
            {/* Authentic Background Integration */}
            <div className="absolute inset-0 opacity-20 scale-110">
              <img src={rhuImages[3]} alt="" className="w-full h-full object-cover blur-sm" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950 to-slate-950"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl lg:text-8xl font-bold text-white mb-10 leading-[0.9] tracking-tighter">
                Ready to transform <br /> healthcare?
              </h2>
              <p className="text-2xl text-slate-400 mb-16 font-semibold leading-relaxed">
                Join the digital revolution in Pinamungahan. Secure, 
                efficient, and community-centered.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="px-12 py-6 bg-primary-600 text-white font-bold text-xl rounded-2xl shadow-2xl shadow-primary-900/40 hover:bg-primary-500 transition-all flex items-center justify-center gap-3"
                >
                  Enter Portal Now
                  <ArrowRight size={24} strokeWidth={3} />
                </motion.button>
                <motion.button
                  className="px-12 py-6 bg-white/10 text-white font-bold text-xl rounded-2xl border-2 border-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
                >
                  Contact Support
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Final Polish */}
      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/rhu logo-Photoroom.png" alt="RHU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tighter text-slate-950 leading-none">Pinamungahan</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary-600 font-bold mt-1">Health System</span>
              </div>
            </div>
            
            <div className="flex gap-16 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-primary-600 transition-all">Privacy</a>
              <a href="#" className="hover:text-primary-600 transition-all">Terms</a>
              <a href="#" className="hover:text-primary-600 transition-all">Help Center</a>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                Systems Active
              </div>
              <p className="text-xs text-slate-400 font-semibold tracking-tight">
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
