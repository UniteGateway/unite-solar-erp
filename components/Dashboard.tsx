import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Page } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ClientsIcon } from './icons/ClientsIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { ProjectIcon } from './icons/ProjectIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { supabase } from '../services/supabaseClient';

interface DashboardProps {
  setCurrentPage: (page: Page) => void;
  theme: 'light' | 'dark';
}

const sampleChartData = [
  { name: 'Jan', reports: 4 }, { name: 'Feb', reports: 3 },
  { name: 'Mar', reports: 5 }, { name: 'Apr', reports: 4 },
  { name: 'May', reports: 6 }, { name: 'Jun', reports: 8 },
];

const StatCard = ({ title, value, icon, color, darkColor }: { title: string, value: string | number, icon: React.ReactNode, color: string, darkColor: string }) => (
    <div className={`bg-card dark:bg-solar-gray p-5 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color} dark:${darkColor}`}>
        {icon}
        <div>
            <p className="text-muted-foreground dark:text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-foreground dark:text-white">{value}</p>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage, theme }) => {
  const [stats, setStats] = useState({ clients: 0, reports: 0, projects: 0, franchises: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { count: reports } = await supabase.from('feasibility_reports').select('*', { count: 'exact', head: true });
      const { count: projects } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: franchises } = await supabase.from('franchises').select('*', { count: 'exact', head: true });
      
      // Clients can be derived from reports for this example
      setStats({
        clients: reports || 0,
        reports: reports || 0,
        projects: projects || 0,
        franchises: franchises || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-display text-primary dark:text-solar-gold">Admin Dashboard</h1>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Clients" value={loading ? '...' : stats.clients} icon={<ClientsIcon className="w-8 h-8 text-blue-500"/>} color="border-blue-500" darkColor="border-blue-400" />
        <StatCard title="Reports Generated" value={loading ? '...' : stats.reports} icon={<DocumentIcon className="w-8 h-8 text-primary dark:text-solar-gold"/>} color="border-primary" darkColor="border-solar-gold" />
        <StatCard title="Active Projects" value={loading ? '...' : stats.projects} icon={<ProjectIcon className="w-8 h-8 text-accent dark:text-deep-green"/>} color="border-accent" darkColor="border-deep-green" />
        <StatCard title="Franchises" value={loading ? '...' : stats.franchises} icon={<BuildingIcon className="w-8 h-8 text-purple-500"/>} color="border-purple-500" darkColor="border-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graph Section */}
        <div className="lg:col-span-2">
            <Card title="Monthly Reports">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={sampleChartData}>
                        <defs>
                            <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FBC02D" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#FBC02D" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} />
                        <XAxis dataKey="name" stroke={theme === 'dark' ? "#9ca3af" : "#4b5563"} />
                        <YAxis stroke={theme === 'dark' ? "#9ca3af" : "#4b5563"}/>
                        <Tooltip contentStyle={theme === 'dark' ? 
                            { backgroundColor: '#212121', border: '1px solid #FBC02D' } :
                            { backgroundColor: '#ffffff', border: '1px solid #FBC02D' }
                        }/>
                        <Area type="monotone" dataKey="reports" stroke="#FBC02D" fillOpacity={1} fill="url(#colorReports)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>

        {/* Shortcut Buttons & Notifications */}
        <div>
            <Card title="Quick Actions">
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => setCurrentPage('generator')} variant="secondary">New Report</Button>
                    <Button onClick={() => setCurrentPage('clients')} variant="secondary">Manage Clients</Button>
                    <Button onClick={() => setCurrentPage('roi-calculator')} variant="secondary">ROI Calculator</Button>
                    <Button onClick={() => setCurrentPage('settings')} variant="secondary">Settings</Button>
                </div>
            </Card>
            <div className="mt-8">
                <Card title="Notifications">
                    <ul className="space-y-3 text-sm">
                        <li className="p-2 bg-secondary dark:bg-solar-black rounded-md">New Franchise Request from <span className="font-bold text-primary dark:text-solar-gold">Pune</span>.</li>
                        <li className="p-2 bg-secondary dark:bg-solar-black rounded-md">Feasibility Report for <span className="font-bold text-primary dark:text-solar-gold">ABC Corp</span> is due.</li>
                        <li className="p-2 bg-secondary dark:bg-solar-black rounded-md">System maintenance scheduled for <span className="font-bold text-primary dark:text-solar-gold">25th July</span>.</li>
                    </ul>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
};