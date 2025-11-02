import React from 'react';
import { User } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { BellIcon } from './icons/BellIcon';
import { UniteSolarLogo } from './UniteSolarLogo';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface TopBarProps {
  user: User;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onToggleSidebar, theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-card dark:bg-solar-gray h-16 flex items-center justify-between px-6 flex-shrink-0 shadow-md border-b border-border dark:border-charcoal-gray">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-solar-gold">
          <MenuIcon className="w-6 h-6" />
        </button>
        <UniteSolarLogo className="h-10 w-auto hidden sm:block"/>
      </div>
      <div className="flex items-center space-x-6">
        <button onClick={toggleTheme} className="text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-solar-gold" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
        <button className="relative text-muted-foreground dark:text-gray-300 hover:text-primary dark:hover:text-solar-gold">
            <BellIcon className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="text-right">
            <p className="font-bold text-foreground dark:text-white">{user.name}</p>
            <p className="text-xs text-primary dark:text-solar-gold">{user.role}</p>
        </div>
      </div>
    </header>
  );
};
