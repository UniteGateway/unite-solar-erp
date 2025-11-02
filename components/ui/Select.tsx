import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, name, options, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full bg-secondary dark:bg-solar-black border border-border dark:border-gray-600 rounded-lg p-2.5 text-foreground dark:text-white focus:ring-ring focus:border-ring transition"
        {...props}
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};
