import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { MapPicker } from '../components/MapPicker';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Upload, MapPin, DollarSign, Loader2, ArrowLeft, FileText, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Calculator() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [position, setPosition] = useState({ lat: 27.1, lng: 77.7 }); 
  const [costs, setCosts] = useState({ pv: '', battery: '' });
  const [showEconomics, setShowEconomics] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
          alert("Could not get your location. Please enter manually.");
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a load profile file.");
      return;
    }

    const lat = parseFloat(position.lat);
    const lng = parseFloat(position.lng);
    
    
    const pvCost = costs.pv === '' ? 1.0 : parseFloat(costs.pv);
    const battCost = costs.battery === '' ? 0.5 : parseFloat(costs.battery);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid coordinates.");
      return;
    }
    if (isNaN(pvCost) || isNaN(battCost)) {
      alert("Please enter valid costs.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lat', lat);
    formData.append('lon', lng);
    formData.append('pv_cost', pvCost);
    formData.append('battery_cost', battCost);

    try {
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Simulation failed');
      }

      const data = await response.json();
      navigate('/dashboard', { state: { result: data, inputs: { position, costs } } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-dmsans selection:bg-emerald-100 selection:text-emerald-900">
      {loading && <LoadingOverlay />}
      {}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="pl-0 hover:bg-transparent hover:text-emerald-600 transition-colors text-gray-500" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-200"></div>
            <h1 className="font-instrument text-xl font-medium text-gray-900">New Simulation</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Step <span className="font-medium text-emerald-600">1</span> of 1
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          {}
          <div className="lg:col-span-7 space-y-10">
            <div className="max-w-2xl">
              <h2 className="font-instrument text-4xl md:text-5xl mb-4 text-gray-900 tracking-tight">Configure Analysis</h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Upload your energy profile and define site parameters to generate a precision sizing report.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {}
              <div className="relative pl-8 md:pl-12 border-l-2 border-emerald-100 pb-12 last:pb-0 last:border-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm"></div>
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">Step 01</span>
                  <h3 className="font-instrument text-2xl text-gray-900">Load Profile</h3>
                  <p className="text-gray-500 mt-1">Upload your load profile.</p>
                </div>

                <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer relative group ${file ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-300 hover:border-emerald-400 hover:bg-white hover:shadow-lg hover:shadow-emerald-100/50'}`}>
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-4 relative z-0">
                    <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${file ? 'bg-emerald-500 text-white rotate-0 scale-100 shadow-lg shadow-emerald-500/30' : 'bg-gray-100 text-gray-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/30'}`}>
                      {file ? <CheckCircle size={32} /> : <Upload size={32} />}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        {file ? file.name : "Drop your load profile here"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {file ? "File ready for analysis" : "Support for CSV, Excel (.xlsx)"}
                      </p>
                    </div>
                    {!file && (
                      <Button type="button" variant="outline" size="sm" className="mt-4 pointer-events-none border-gray-200 bg-white">
                        Browse Files
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {}
              <div className="relative pl-8 md:pl-12 border-l-2 border-emerald-100 pb-12 last:pb-0 last:border-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-200 ring-4 ring-white shadow-sm"></div>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">Step 02</span>
                    <h3 className="font-instrument text-2xl text-gray-900">Site Location</h3>
                    <p className="text-gray-500 mt-1">Select the installation coordinates for solar data.</p>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={handleLocationClick} className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100">
                    <MapPin className="w-3 h-3 mr-1.5" />
                    Locate Me
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Input 
                      label="Latitude" 
                      type="number" 
                      step="any"
                      value={position.lat} 
                      onChange={(e) => setPosition({ ...position, lat: e.target.value })}
                      className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                    />
                    <Input 
                      label="Longitude" 
                      type="number" 
                      step="any"
                      value={position.lng} 
                      onChange={(e) => setPosition({ ...position, lng: e.target.value })}
                      className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div className="h-80 w-full rounded-3xl overflow-hidden border border-gray-200 shadow-lg shadow-gray-200/50 relative z-0 group hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-500">
                    <MapPicker position={position} setPosition={setPosition} className="h-full w-full" />
                  </div>
                </div>
              </div>

              {}
              <div className="relative pl-8 md:pl-12 border-l-2 border-transparent pb-12 last:pb-0 last:border-0">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ring-4 ring-white transition-colors ${showEconomics ? 'bg-emerald-200' : 'bg-gray-200'}`}></div>
                
                <div 
                  className="mb-6 cursor-pointer group"
                  onClick={() => setShowEconomics(!showEconomics)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block group-hover:text-emerald-600 transition-colors">Optional</span>
                      <div className="flex items-center gap-2">
                        <h3 className="font-instrument text-2xl text-gray-900 group-hover:text-emerald-700 transition-colors">Economics</h3>
                        {showEconomics ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                      <p className="text-gray-500 mt-1">Define component costs for the optimization engine.</p>
                    </div>
                  </div>
                </div>

                {showEconomics && (
                  <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Input 
                      label="PV Cost" 
                      type="number" 
                      step="10"
                      value={costs.pv} 
                      onChange={(e) => setCosts({ ...costs, pv: e.target.value })}
                      className="bg-white"
                    />
                    <Input 
                      label="Battery Cost" 
                      type="number" 
                      step="10"
                      value={costs.battery} 
                      onChange={(e) => setCosts({ ...costs, battery: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

              <div className="pt-4">
                <Button type="submit" size="lg" variant="primary" className="w-full py-6 text-lg shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border-0" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Simulation...
                    </>
                  ) : (
                    "Run Analysis"
                  )}
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By running this simulation, you agree to our terms of service regarding data usage.
                </p>
              </div>
            </form>
          </div>

          {}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              {}
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/40 relative overflow-hidden border border-gray-100">
                {}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>
                
                <h2 className="font-instrument text-3xl mb-8 relative z-10 text-gray-900">How it works</h2>
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 font-instrument text-xl text-emerald-600 group-hover:scale-110 transition-transform">1</div>
                    <div>
                      <h4 className="font-medium text-lg mb-1 text-gray-900">Load Analysis</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">We analyze your load profile to understand your energy consumption patterns hour-by-hour.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 font-instrument text-xl text-emerald-600 group-hover:scale-110 transition-transform">2</div>
                    <div>
                      <h4 className="font-medium text-lg mb-1 text-gray-900">Solar Data Fetching</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">We fetch historical solar irradiance data for your specific location from NASA POWER API.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 group">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 font-instrument text-xl text-emerald-600 group-hover:scale-110 transition-transform">3</div>
                    <div>
                      <h4 className="font-medium text-lg mb-1 text-gray-900">Optimization Engine</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">Our engine simulates thousands of PV and battery combinations to find the most cost-effective system.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-lg shadow-gray-200/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-instrument text-xl text-gray-900">Need sample data?</h3>
                    <p className="text-gray-500 text-xs">Quick start with our template</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-lg shadow-emerald-600/20">Download Sample CSV</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
