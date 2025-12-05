import { useState, useEffect } from 'react';
import { Loader2, Zap, Sun, BarChart3, Cpu } from 'lucide-react';

const STEPS = [
  { message: "Initializing simulation engine...", icon: Cpu },
  { message: "Parsing load profile data...", icon: BarChart3 },
  { message: "Retrieving NASA POWER solar irradiance...", icon: Sun },
  { message: "Running optimization algorithms...", icon: Zap },
  { message: "Identifying optimal PV-Battery configuration...", icon: BarChart3 },
  { message: "Finalizing report...", icon: Cpu }
];

export function LoadingOverlay() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STEPS[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white font-dmsans">
      <div className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
          <CurrentIcon className="w-10 h-10 text-emerald-600 animate-pulse transition-all duration-500" />
        </div>

        {}
        <div className="space-y-2">
          <h3 className="text-2xl font-instrument font-medium text-gray-900 min-h-8 transition-all duration-300">
            {STEPS[currentStep].message}
          </h3>
          <p className="text-gray-400 text-sm">
            This may take a few moments depending on data size
          </p>
        </div>

        {}
        <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
