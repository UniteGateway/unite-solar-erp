import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, name, error, ...props }) => {
  const errorClasses = error ? 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-border dark:border-gray-600 focus:ring-ring focus:border-ring';
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`w-full bg-secondary dark:bg-solar-black rounded-lg p-2.5 text-foreground dark:text-white transition ${errorClasses}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};