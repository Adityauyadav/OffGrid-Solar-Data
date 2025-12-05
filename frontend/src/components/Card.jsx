import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={twMerge(
        'bg-white rounded-2xl border border-gray-100 shadow-sm p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
