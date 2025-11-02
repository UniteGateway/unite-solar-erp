import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { LeafIcon } from './icons/LeafIcon';
import { BoltIcon } from './icons/BoltIcon';
import { ClientsIcon } from './icons/ClientsIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { Page } from '../types';
import { SpeakerIcon } from './icons/SpeakerIcon'; 

interface SidebarProps {
  isCollapsed: boolean;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, page: 'dashboard' as Page },
  { name: 'Assessment Report', icon: SpeakerIcon, page: 'assessment' as Page },
  { name: 'Feasibility Report', icon: DocumentIcon, page: 'generator' as Page },
  { name: 'Clients & Reports', icon: ClientsIcon, page: 'clients' as Page },
  { name: 'ROI Calculator', icon: CalculatorIcon, page: 'roi-calculator' as Page },
  { name: 'Project Tracker', icon: ProjectIcon, page: 'project-tracker' as Page },
  { name: 'Franchise Mgt', icon: BuildingIcon, page: 'franchise' as Page },
  { name: 'Bio-CNG & Hybrid', icon: LeafIcon, page: 'bio-cng' as Page },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, currentPage, setCurrentPage, onLogout }) => {
  return (
    <aside className={`bg-card dark:bg-solar-gray flex-shrink-0 flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} border-r border-border dark:border-charcoal-gray`}>
      <div>
        <div className={`p-4 ${isCollapsed ? 'py-4' : 'py-7'} flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          {/* Placeholder for logo if needed */}
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="px-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(item.page);
                  }}
                  title={item.name}
                  className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                    currentPage === item.page
                      ? 'bg-primary dark:bg-solar-gold text-primary-foreground dark:text-solar-black font-bold'
                      : 'text-muted-foreground dark:text-gray-300 hover:bg-secondary dark:hover:bg-charcoal-gray hover:text-primary dark:hover:text-solar-gold'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {!isCollapsed && <span className="ml-4">{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4">
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onLogout(); }}
            title="Logout"
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 text-muted-foreground dark:text-gray-300 hover:bg-red-500/10 dark:hover:bg-red-800/50 hover:text-red-600 dark:hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
        >
            <LogoutIcon className="w-6 h-6" />
            {!isCollapsed && <span className="ml-4">Logout</span>}
        </a>
      </div>
    </aside>
  );
};
