import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background dark:bg-solar-black p-4 text-center text-muted-foreground dark:text-gray-500 text-xs border-t border-border dark:border-solar-gray">
      <p>© 2025 Unite Developers Global Inc. | Unite Solar | <a href="http://www.unitesolar.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary dark:hover:text-solar-gold">www.unitesolar.in</a> | +91 9667660773</p>
    </footer>
  );
};
