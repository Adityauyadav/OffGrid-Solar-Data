import { twMerge } from 'tailwind-merge';

export function Input({ className, label, error, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-dmsans">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-dmsans',
          error && 'border-red-500 focus:ring-red-200 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 font-dmsans">{error}</p>}
    </div>
  );
}
