import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowLeft, Book, Cpu, Database, Activity, AlertTriangle, Layers, Users } from 'lucide-react';
import batteryLogo from '../assets/battery.png';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-dmsans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={batteryLogo} alt="OffGridCalc Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-instrument text-2xl font-medium tracking-tight">OffGridCalc</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/calculator">
              <Button size="sm" variant="primary">Launch App</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="font-instrument text-5xl md:text-6xl mb-6 text-gray-900">Technical Documentation</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A deep dive into the algorithms, data sources, and optimization logic behind the OffGridCalc sizing engine.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-12">
            
            {/* Section 1: System Overview */}
            <section className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Book size={24} />
                </div>
                <h2 className="font-instrument text-3xl m-0">System Overview</h2>
              </div>
              <p className="text-gray-600">
                OffGridCalc is a deterministic simulation engine designed to size standalone photovoltaic (PV) and battery storage systems. 
                Unlike simple "rule of thumb" calculators, it performs a time-series simulation over a full typical meteorological year (8760 hours) 
                to ensure system reliability under varying weather conditions and load patterns.
              </p>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: Data Pipeline */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Database size={24} />
                </div>
                <h2 className="font-instrument text-3xl">Data Pipeline</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Load Profile
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Users upload a CSV or Excel file containing hourly energy consumption data (kW). 
                    The engine parses this into a NumPy array of length 8760. Missing data points are handled via interpolation or error flagging.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Solar Irradiance
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We integrate with the <strong>NASA POWER API</strong> to fetch "All Sky Surface Shortwave Downward Irradiance" (ALLSKY_SFC_SW_DWN). 
                    This provides hourly historical solar data for the specific latitude and longitude provided.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 3: Optimization Engine */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Cpu size={24} />
                </div>
                <h2 className="font-instrument text-3xl">Optimization Logic</h2>
              </div>
              <div className="space-y-6 text-gray-600">
                <p>
                  The core engine uses a "Pinch Point Analysis" approach adapted for battery sizing. The goal is to find the 
                  <strong> Lowest Cost Combination</strong> of PV and Battery that satisfies the load 100% of the time.
                </p>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-4">The Algorithm Step-by-Step:</h4>
                  <ol className="list-decimal list-inside space-y-3 marker:text-emerald-600 marker:font-bold">
                    <li>
                      <strong>PV Iteration:</strong> The engine tests a range of PV array sizes (from 0 kW up to a large upper bound).
                    </li>
                    <li>
                      <strong>Net Load Calculation:</strong> For each hour $t$, we calculate:
                      <br />
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm mt-2 inline-block">Net_Load(t) = Load(t) - (PV_Size × Solar_Irradiance(t))</code>
                    </li>
                    <li>
                      <strong>Battery Sizing (The "Survives" Check):</strong> For a fixed PV size, we calculate the minimum battery capacity required 
                      to ensure the State of Charge (SoC) never drops below zero. This is done by simulating the cumulative energy balance 
                      and finding the maximum deficit.
                    </li>
                    <li>
                      <strong>Cost Minimization:</strong> We calculate the Total System Cost for every valid (PV, Battery) pair:
                      <br />
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm mt-2 inline-block">Cost = (PV_Size × PV_Cost) + (Battery_Size × Battery_Cost)</code>
                    </li>
                    <li>
                      <strong>Selection:</strong> The pair with the global minimum cost is selected as the optimal configuration.
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 4: Tradeoffs & Limitations */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="font-instrument text-3xl">Tradeoffs & Limitations</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-orange-200 pl-6 py-2">
                  <h3 className="font-bold text-gray-900 mb-2">Reliability vs. Cost</h3>
                  <p className="text-gray-600 text-sm">
                    The current model targets <strong>100% reliability</strong> (Loss of Load Probability = 0). 
                    In reality, allowing a small amount of outage (e.g., 99.9% reliability) can significantly reduce system costs. 
                    This feature is planned for future updates.
                  </p>
                </div>
                <div className="border-l-4 border-orange-200 pl-6 py-2">
                  <h3 className="font-bold text-gray-900 mb-2">Battery Physics</h3>
                  <p className="text-gray-600 text-sm">
                    The simulation assumes an ideal battery (100% efficiency, no degradation, no depth-of-discharge limits). 
                    Real-world sizing should apply a safety factor (typically 1.2x - 1.5x) to the calculated battery capacity.
                  </p>
                </div>
                <div className="border-l-4 border-orange-200 pl-6 py-2">
                  <h3 className="font-bold text-gray-900 mb-2">Temporal Resolution</h3>
                  <p className="text-gray-600 text-sm">
                    Calculations are hourly. Sub-hourly fluctuations (e.g., passing clouds) are averaged out, which may 
                    underestimate the battery buffer needed for short-term stability.
                  </p>
                </div>
                <div className="border-l-4 border-orange-200 pl-6 py-2">
                  <h3 className="font-bold text-gray-900 mb-2">Future Enhancements</h3>
                  <p className="text-gray-600 text-sm">
                    This is a theoretical implementation with practical foundations. Future versions aim to incorporate deep domain expertise 
                    including component efficiency curves, battery degradation models, and more granular weather data for real-world precision.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Section 5: Community & Collaboration */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <Users size={24} />
                </div>
                <h2 className="font-instrument text-3xl">Community & Collaboration</h2>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We believe that the best tools are built with community insight. If you have domain expertise in renewable energy systems, 
                  battery chemistry, or meteorological data analysis, we welcome your advice to make this platform more applicable to real-world scenarios.
                </p>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <span>Reach out at:</span>
                  <a href="mailto:adityauyadav7@gmail.com" className="underline hover:text-emerald-600 transition-colors">
                    adityauyadav7@gmail.com
                  </a>
                </div>
              </div>
            </section>

          </div>
          
          {/* Footer CTA */}
          <div className="mt-20 p-8 bg-emerald-900 rounded-3xl text-center text-white">
            <h3 className="font-instrument text-3xl mb-4">Ready to design your system?</h3>
            <p className="text-emerald-100 mb-8 max-w-lg mx-auto">
              Apply this logic to your own data and get results in seconds.
            </p>
            <Link to="/calculator">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-none border-0">
                Start Simulation
              </Button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}

// Helper icon component since Globe wasn't imported in the main block above but used
function Globe({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}
