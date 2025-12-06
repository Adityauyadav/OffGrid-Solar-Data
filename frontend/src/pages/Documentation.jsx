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
              
              <div className="space-y-8 text-gray-600">
                <p>
                  The engine uses a rigorous iterative simulation to determine the optimal system configuration. 
                  Below is the concrete mathematical model used in the backend.
                </p>

                {/* Definitions */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">1. Definitions</h3>
                  <ul className="list-disc list-inside space-y-2 bg-gray-50 p-6 rounded-xl border border-gray-100 font-mono text-sm">
                    <li><span className="font-bold text-purple-700">load[t]</span> : Demand time series (kW)</li>
                    <li><span className="font-bold text-purple-700">solar[t]</span> : Solar irradiance or normalized generation time series</li>
                    <li><span className="font-bold text-purple-700">pv</span> : Scaling factor for solar generation (kW)</li>
                    <li><span className="font-bold text-purple-700">battery</span> : Energy storage capacity (kWh)</li>
                    <li><span className="font-bold text-purple-700">soc[t]</span> : State of charge at time t (kWh)</li>
                  </ul>
                </div>

                {/* Core Model */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">2. Core Feasibility Model</h3>
                  <p className="mb-4">
                    The system state evolves according to the energy balance equation:
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    net[t] = (pv * solar[t]) - load[t]<br/>
                    soc[t] = min(battery, max(0, soc[t-1] + net[t]))
                  </div>
                  <p className="mt-4">
                    A configuration <code>(pv, battery)</code> is considered <strong>feasible</strong> if and only if
                    <code> soc[t]</code> never drops below 0 for any timestep <code>t</code> in the simulation period (8760 hours).
                    The function <code>survives(load, solar, pv, battery)</code> executes this check.
                  </p>
                </div>

                {/* Battery Search */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">3. Battery Search (Binary Search)</h3>
                  <p className="mb-4">
                    For a fixed PV size, we find the minimum battery capacity required using a binary search algorithm.
                    This is computationally efficient and precise.
                  </p>
                  <ul className="list-decimal list-inside space-y-2 ml-2">
                    <li><strong>Pre-check:</strong> If <code>Σ(net[t]) &lt; 0</code>, the PV size is insufficient to cover the total annual load. The candidate is discarded immediately.</li>
                    <li><strong>Search Interval:</strong> <code>[0, Σ(load)]</code>.</li>
                    <li><strong>Halting Threshold:</strong> The search stops when the interval size is less than 1.0 kWh.</li>
                    <li><strong>Logic:</strong> At each step <code>mid</code>, we check <code>survives(..., mid)</code>.
                      <ul className="list-disc list-inside ml-6 mt-1 text-sm text-gray-500">
                        <li>If feasible: Try smaller battery (search lower half).</li>
                        <li>If infeasible: Need larger battery (search upper half).</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* PV Search */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">4. PV Search (Linear Grid)</h3>
                  <p className="mb-4">
                    The engine explores a range of PV sizes to find the global optimum.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm">
                    <p className="font-mono mb-2"><strong>Initial Estimate:</strong> start_pv = mean(load) / mean(solar)</p>
                    <p className="font-mono mb-2"><strong>Search Space:</strong> [start_pv, 5 * start_pv]</p>
                    <p className="font-mono"><strong>Resolution:</strong> 100 uniformly spaced samples</p>
                  </div>
                  <p className="mt-4">
                    For each PV candidate, we calculate the minimal feasible battery. If no battery size works (e.g., due to energy deficit), that PV size is discarded.
                  </p>
                </div>

                {/* Cost Optimization */}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">5. Cost Optimization</h3>
                  <p className="mb-4">
                    Among all feasible <code>(pv, battery)</code> pairs, we select the one that minimizes the total system cost function:
                  </p>
                  <div className="bg-emerald-50 text-emerald-900 p-4 rounded-lg font-mono text-sm border border-emerald-100">
                    C(pv, battery) = (pv * pv_cost) + (battery * battery_cost)
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    * pv_cost and battery_cost are user-provided economic weights (defaulting to 1 for PV and 0.5 for Battery as a ratio).
                  </p>
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
