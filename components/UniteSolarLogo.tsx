import React from 'react';

export const UniteSolarLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 200 55" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Unite Solar Logo"
    >
      <g className="fill-primary dark:fill-solar-gold">
        <circle cx="22.8" cy="4.8" r="4.8" />
        <circle cx="13.2" cy="11.5" r="4.8" />
        <circle cx="4.8" cy="25.2" r="4.8" />
        <circle cx="10.8" cy="38.5" r="4.8" />
        <circle cx="25.2" cy="45.6" r="4.8" />
        <circle cx="36" cy="39.6" r="4.8" />
        <circle cx="43.2" cy="25.2" r="4.8" />
        <circle cx="38.4" cy="12" r="4.8" />
      </g>
      <g fontFamily="Montserrat, sans-serif" fontSize="34" fontWeight="800">
        <text x="55" y="38" className="fill-foreground dark:fill-white">un</text>
        <text x="120" y="38" className="fill-foreground dark:fill-white">te</text>
        <g className="fill-primary dark:fill-solar-gold">
            <rect x="106" y="17" width="9" height="21" rx="2"/>
            <circle cx="110.5" cy="8" r="5"/>
        </g>
      </g>
      <text x="55" y="52" fontFamily="Roboto, sans-serif" fontSize="16" fontWeight="500" letterSpacing="3" className="fill-muted-foreground dark:fill-gray-400">
        SOLAR
      </text>
    </svg>
  );
};
