import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-card dark:bg-solar-gray p-6 rounded-xl shadow-lg ${className}`}>
      <h3 className="text-xl font-bold font-display text-primary dark:text-solar-gold mb-4 border-b-2 border-primary/30 dark:border-solar-gold/30 pb-2">{title}</h3>
      {children}
    </div>
  );
};
