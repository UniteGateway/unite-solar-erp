import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "font-bold font-display py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: "bg-primary dark:bg-solar-gold text-primary-foreground dark:text-solar-black hover:bg-yellow-400 focus:ring-4 focus:ring-yellow-300",
    secondary: "bg-secondary dark:bg-solar-gray text-secondary-foreground dark:text-white hover:bg-gray-200 dark:hover:bg-charcoal-gray border border-border dark:border-solar-gold",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
