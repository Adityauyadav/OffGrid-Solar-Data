import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200',
    dark: 'bg-gray-900 text-white hover:bg-black shadow-sm',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm',
    ghost: 'bg-transparent text-gray-600 hover:bg-emerald-50 hover:text-emerald-700',
    outline: 'border border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-dmsans cursor-pointer active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
