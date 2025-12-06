import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Sun, Battery, Zap, ArrowRight, Globe, BarChart3, CheckCircle2, Upload, Sliders, Trophy } from 'lucide-react';
import batteryLogo from '../assets/battery.png';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-dmsans selection:bg-emerald-100 selection:text-emerald-900">
      {}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={batteryLogo} alt="OffGridCalc Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-instrument text-2xl font-medium tracking-tight">OffGridCalc</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">How it Works</a>
            <Link to="/calculator">
              <Button size="sm" variant="primary">Launch App</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-sm text-emerald-700 font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Powered by NASA POWER API
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-instrument text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 text-gray-900 tracking-tight"
            >
              Precision Off-Grid <br />
              <span className="text-emerald-600 italic">Sizing Engine</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg"
            >
              Optimize your off-grid energy systems with scientific accuracy. 
              Upload your load profile, pinpoint your location, and let our algorithms find the perfect PV and battery balance.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/calculator" className="w-full sm:w-auto">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start Calculation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/documentation" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Documentation
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-12 flex items-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant results</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-emerald-100/50 rounded-4xl rotate-3 blur-2xl"></div>
            <div className="relative rounded-4xl overflow-hidden shadow-2xl shadow-emerald-900/20 aspect-4/3 group">
              <img 
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2432&auto=format&fit=crop" 
                alt="Solar Panels" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-medium uppercase tracking-wider opacity-80 mb-2">Sustainable Future</p>
                <p className="font-instrument text-3xl">Energy Independence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-instrument text-4xl md:text-5xl mb-6">Scientific approach to sizing</h2>
            <p className="text-xl text-gray-600">We combine local meteorological data with your specific consumption patterns to deliver the most accurate system recommendations.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Load Analysis",
                desc: "Upload hourly load profiles (CSV/Excel) to simulate real-world usage patterns.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Global Irradiance",
                desc: "Automatic fetching of historical solar data for any coordinate on Earth via NASA.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2344&auto=format&fit=crop"
              },
              {
                icon: <Battery className="w-6 h-6" />,
                title: "Battery Optimization",
                desc: "Cost-function algorithms determine the most economic storage capacity.",
                image: "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?w=900&auto=format&fit=crop"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-instrument text-2xl mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
        {}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-500 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Simple Workflow
            </div>
            <h2 className="font-instrument text-4xl md:text-5xl mb-6 text-gray-900">From data to decision</h2>
            <p className="text-xl text-gray-600">Three simple steps to optimize your off-grid energy system.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Profile",
                desc: "Import your hourly energy consumption data (CSV/Excel) to define your specific energy needs.",
                icon: <Upload className="w-6 h-6" />
              },
              {
                step: "02",
                title: "Set Parameters",
                desc: "Enter your location coordinates and component costs to tailor the simulation to your budget.",
                icon: <Sliders className="w-6 h-6" />
              },
              {
                step: "03",
                title: "Get Results",
                desc: "Receive optimal PV and battery sizing recommendations based on the lowest lifecycle cost.",
                icon: <Trophy className="w-6 h-6" />
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-6 right-8 font-instrument text-6xl text-gray-100 group-hover:text-emerald-50 transition-colors select-none">
                  {item.step}
                </div>
                
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 relative z-10">
                  {item.icon}
                </div>
                
                <h3 className="font-instrument text-2xl mb-3 text-gray-900 relative z-10">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-emerald-900 isolate"
        >
          {}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-3xl mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-3xl mix-blend-screen"></div>
          </div>
          
          {}
          <div className="px-6 py-12 md:px-12 md:py-16 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-instrument text-4xl md:text-6xl text-white mb-6 tracking-tight"
            >
              Ready to design your system?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg md:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Stop guessing. Start calculating. Get precise PV and battery sizing recommendations in seconds.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link to="/calculator">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-900 hover:bg-emerald-50 border-0 min-w-[200px] h-14 text-base font-medium shadow-xl shadow-emerald-900/20"
                >
                  Launch Calculator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src={batteryLogo} alt="OffGridCalc Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-instrument text-xl">OffGridCalc</span>
          </Link>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="https://www.linkedin.com/in/aditya-sumesh/" className="hover:text-emerald-600 transition-colors">Linkedin</a>
            <a href="https://www.x.com/aditya_sumesh" className="hover:text-emerald-600 transition-colors">X</a>
            <a href="https://github.com/Adityauyadav/OffGrid-Solar-Data" className="hover:text-emerald-600 transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-gray-400">© 2025 OffGridCalc. Personal Project by Aditya Yadav</p>
        </motion.div>
      </footer>
    </div>
  );
}
