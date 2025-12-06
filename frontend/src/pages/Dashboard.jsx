import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, Zap, Download, Calendar, Activity, Sun, TrendingUp } from 'lucide-react';
import { 
  ComposedChart, LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

  const { 
    pv_kw: rawOptimalPv, 
    battery_kwh: rawOptimalBatt, 
    load_profile: loadProfile,
    solar_profile: solarProfile 
  } = result || {};
  
  
  const optimalPv = Math.ceil(rawOptimalPv || 0);
  const optimalBatt = Math.ceil(rawOptimalBatt || 0);
  
  

  
  const stats = useMemo(() => {
    if (!loadProfile || loadProfile.length === 0) return { peak: 0, avgDaily: 0, totalAnnual: 0 };
    
    
    
    const peak = loadProfile.reduce((max, val) => (val > max ? val : max), 0);
    const totalLoad = loadProfile.reduce((a, b) => a + b, 0);
    
    return {
      peak: Math.ceil(peak || 0),
      avgDaily: Math.ceil((totalLoad || 0) / 365),
      totalAnnual: Math.ceil((totalLoad || 0) / 1000), 
    };
  }, [loadProfile]);

  // 1. Solar Volatility Data Transformation
  const solarVolatilityData = useMemo(() => {
    if (!solarProfile || solarProfile.length === 0) return [];
    
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dailySums = [];
    for (let d = 0; d < 365; d++) {
        let sum = 0;
        for (let h = 0; h < 24; h++) {
            const idx = d * 24 + h;
            if (idx < solarProfile.length) sum += solarProfile[idx];
        }
        dailySums.push(sum);
    }
    
    let currentDay = 0;
    return monthNames.map((month, i) => {
        const days = daysInMonth[i];
        const monthValues = dailySums.slice(currentDay, currentDay + days);
        currentDay += days;
        
        if (monthValues.length === 0) return { month, max: 0, min: 0, avg: 0 };

        const max = Math.max(...monthValues);
        const min = Math.min(...monthValues);
        const avg = monthValues.reduce((a, b) => a + b, 0) / days;
        
        return {
            month,
            max: parseFloat(max.toFixed(2)),
            min: parseFloat(min.toFixed(2)),
            avg: parseFloat(avg.toFixed(2))
        };
    });
  }, [solarProfile]);

  // 2. Seasonal Load Data Transformation
  const seasonalLoadData = useMemo(() => {
    if (!loadProfile || loadProfile.length === 0) return [];
    
    const summerHours = Array(24).fill(0);
    const summerCounts = Array(24).fill(0);
    const summerMax = Array(24).fill(0);
    
    const winterHours = Array(24).fill(0);
    const winterCounts = Array(24).fill(0);
    const winterMax = Array(24).fill(0);
    
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const dayToMonth = [];
    daysInMonth.forEach((days, monthIdx) => {
        for(let i=0; i<days; i++) dayToMonth.push(monthIdx);
    });
    
    for (let h = 0; h < 8760; h++) {
        if (h >= loadProfile.length) break;
        
        const day = Math.floor(h / 24);
        if (day >= 365) break;
        
        const month = dayToMonth[day];
        const hourOfDay = h % 24;
        const val = loadProfile[h];
        
        if (month >= 3 && month <= 8) {
            summerHours[hourOfDay] += val;
            summerCounts[hourOfDay]++;
            if (val > summerMax[hourOfDay]) summerMax[hourOfDay] = val;
        } else {
            winterHours[hourOfDay] += val;
            winterCounts[hourOfDay]++;
            if (val > winterMax[hourOfDay]) winterMax[hourOfDay] = val;
        }
    }
    
    return Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        summerAvg: parseFloat((summerHours[i] / (summerCounts[i] || 1)).toFixed(2)),
        winterAvg: parseFloat((winterHours[i] / (winterCounts[i] || 1)).toFixed(2)),
        summerMax: parseFloat(summerMax[i].toFixed(2)),
        winterMax: parseFloat(winterMax[i].toFixed(2))
    }));
  }, [loadProfile]);

  
  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-dmsans">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Zap size={32} />
          </div>
          <h2 className="text-2xl font-instrument mb-2">No simulation data found</h2>
          <p className="text-gray-500 mb-8">Please start a new simulation to see results.</p>
          <Button onClick={() => navigate('/calculator')} variant="primary">Go to Calculator</Button>
        </div>
      </div>
    );
  }

  
  
  const handleDownloadReport = () => {
    const reportContent = `
OffGridCalc Simulation Report
===========================
Date: ${new Date().toLocaleDateString()}

Optimal Configuration
---------------------
PV Array Size: ${optimalPv} kW
Battery Bank: ${optimalBatt} kWh

Load Statistics
---------------
Peak Load: ${stats.peak} kW
Avg Daily Load: ${stats.avgDaily} kWh
Annual Consumption: ${stats.totalAnnual} MWh

---------------------------
Generated by OffGridCalc
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OffGridCalc_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-emerald-50/30 font-dmsans p-6 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-7xl mx-auto">
        {}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/calculator')} className="pl-0 hover:bg-transparent hover:text-emerald-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-instrument text-3xl text-gray-900">Simulation Results</h1>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </header>

        {}
        <Card className="mb-8 bg-linear-to-br from-white to-emerald-50/50 border-emerald-100 shadow-lg shadow-emerald-100/50 relative overflow-hidden group hover:shadow-emerald-200/50 transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-emerald-600">
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <Zap size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Optimal Configuration</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">PV Array</p>
                <p className="text-5xl font-instrument text-gray-900">{optimalPv} <span className="text-xl font-sans text-gray-400">kW</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Battery Bank</p>
                <p className="text-5xl font-instrument text-gray-900">{optimalBatt} <span className="text-xl font-sans text-gray-400">kWh</span></p>
              </div>
              <div>
              </div>
            </div>
          </div>
        </Card>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm bg-white hover:bg-orange-50/50 transition-colors group hover:-translate-y-1 duration-300">
            <div className="flex items-center gap-3 mb-2 text-gray-500 group-hover:text-orange-600 transition-colors">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100 transition-colors">
                <Activity size={18} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">Peak Load</span>
            </div>
            <p className="text-3xl font-instrument text-gray-900 group-hover:text-orange-900 transition-colors">{stats.peak} <span className="text-base font-sans text-gray-500 group-hover:text-orange-700/60">kW</span></p>
          </Card>
          <Card className="border-0 shadow-sm bg-white hover:bg-blue-50/50 transition-colors group hover:-translate-y-1 duration-300">
            <div className="flex items-center gap-3 mb-2 text-gray-500 group-hover:text-blue-600 transition-colors">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Zap size={18} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">Avg Daily Load</span>
            </div>
            <p className="text-3xl font-instrument text-gray-900 group-hover:text-blue-900 transition-colors">{stats.avgDaily} <span className="text-base font-sans text-gray-500 group-hover:text-blue-700/60">kWh</span></p>
          </Card>
          <Card className="border-0 shadow-sm bg-white hover:bg-purple-50/50 transition-colors group hover:-translate-y-1 duration-300">
            <div className="flex items-center gap-3 mb-2 text-gray-500 group-hover:text-purple-600 transition-colors">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Calendar size={18} />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">Annual Consumption</span>
            </div>
            <p className="text-3xl font-instrument text-gray-900 group-hover:text-purple-900 transition-colors">{stats.totalAnnual} <span className="text-base font-sans text-gray-500 group-hover:text-purple-700/60">MWh</span></p>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 border-0 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                        <Sun size={20} />
                      </div>
                      <div>
                        <h3 className="font-instrument text-xl text-gray-900">Solar Reliability</h3>
                        <p className="text-xs text-gray-500">Monthly Max vs Min Potential</p>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={solarVolatilityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value, name) => [`${value} kWh`, name]}
                            itemSorter={(item) => {
                              if (item.name === 'Max Potential') return 1;
                              if (item.name === 'Average') return 2;
                              if (item.name === 'Min Guarantee') return 3;
                              return 4;
                            }}
                          />
                          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                          <Area type="monotone" dataKey="max" fill="#fef08a" stroke="none" name="Max Potential" />
                          <Line type="monotone" dataKey="avg" stroke="#eab308" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Average" />
                          <Line type="monotone" dataKey="min" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} name="Min Guarantee" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50/50 rounded-xl border border-yellow-100 text-xs text-yellow-800/80 leading-relaxed">
                      <span className="font-medium text-yellow-900">Note:</span> Solar reliability is calculated assuming a 75% performance ratio to account for real-world factors like dust, heat, and system losses.
                    </div>
                  </Card>

                  {/* Chart B: Daily Load Habits */}
          <Card className="p-6 border-0 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-instrument text-xl text-gray-900">Seasonal Load Patterns</h3>
                <p className="text-xs text-gray-500">Average Daily Consumption Profile</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonalLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`${value} kW`, '']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="winterMax" stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Winter Peak" />
                  <Line type="monotone" dataKey="summerMax" stroke="#f97316" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Summer Peak" />
                  <Line type="monotone" dataKey="winterAvg" stroke="#3b82f6" strokeWidth={2} dot={false} name="Winter Avg" />
                  <Line type="monotone" dataKey="summerAvg" stroke="#f97316" strokeWidth={2} dot={false} name="Summer Avg" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}