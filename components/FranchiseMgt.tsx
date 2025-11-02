import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BuildingIcon } from './icons/BuildingIcon';
import { DollarIcon } from './icons/DollarIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { PlusIcon } from './icons/PlusIcon';
import { Page } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { supabase } from '../services/supabaseClient';

type FranchiseStatus = 'Active' | 'Pending' | 'Inactive';
type SortKey = 'id' | 'owner' | 'location' | 'status' | 'revenue' | 'projects';
type SortDirection = 'asc' | 'desc';

interface Franchise {
  id: string;
  owner: string;
  location: string;
  status: FranchiseStatus;
  revenue: number; // Mapped from investment_capacity_inr
  projects: number; // Not in DB, will be 0
}

interface FranchiseMgtProps {
  setCurrentPage: (page: Page) => void;
}

const statusStyles: { [key in FranchiseStatus]: string } = {
  'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Inactive': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-card dark:bg-solar-gray p-5 rounded-xl shadow-lg flex items-center space-x-4">
        {icon}
        <div>
            <p className="text-muted-foreground dark:text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-foreground dark:text-white">{value}</p>
        </div>
    </div>
);

export const FranchiseMgt: React.FC<FranchiseMgtProps> = ({ setCurrentPage }) => {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FranchiseStatus | 'All'>('All');
  const [revenueFilter, setRevenueFilter] = useState<string>('All');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'revenue', direction: 'desc' });
  const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

  useEffect(() => {
    const fetchFranchises = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('franchises')
            .select('*');

        if (error) {
            setError(error.message);
            console.error("Error fetching franchises:", error);
        } else if (data) {
            const mappedData: Franchise[] = data.map(f => ({
                id: f.franchise_code,
                owner: f.owner_name,
                location: f.location,
                status: f.status.charAt(0).toUpperCase() + f.status.slice(1) as FranchiseStatus,
                revenue: f.investment_capacity_inr || 0, // Using investment as revenue for the UI
                projects: 0 // This field is not in the DB schema
            }));
            setFranchises(mappedData);
        }
        setLoading(false);
    };
    fetchFranchises();
  }, []);

  const sortedFranchises = useMemo(() => {
    let filteredItems = [...franchises];

    if (searchTerm.trim()) {
      filteredItems = filteredItems.filter(f =>
        f.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filteredItems = filteredItems.filter(f => f.status === statusFilter);
    }

    if (revenueFilter !== 'All') {
      switch (revenueFilter) {
        case 'Over 10L':
          filteredItems = filteredItems.filter(f => f.revenue > 1000000);
          break;
        case '5L - 10L':
          filteredItems = filteredItems.filter(f => f.revenue >= 500000 && f.revenue <= 1000000);
          break;
        case 'Under 5L':
          filteredItems = filteredItems.filter(f => f.revenue < 500000);
          break;
      }
    }

    filteredItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredItems;
  }, [franchises, sortConfig, searchTerm, statusFilter, revenueFilter]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };
  
  const chartData = franchises.filter(f => f.status === 'Active').map(f => ({ name: f.location.split(',')[0], revenue: f.revenue }));
  const totalRevenue = franchises.reduce((acc, f) => acc + f.revenue, 0);

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-display text-primary dark:text-solar-gold">Franchise Management</h1>
            <Button onClick={() => setCurrentPage('add-franchise')}>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add New Franchise
            </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Franchises" value={franchises.length} icon={<BuildingIcon className="w-8 h-8 text-primary dark:text-solar-gold"/>} />
            <StatCard title="Total Investment Capacity" value={`₹${(totalRevenue / 100000).toFixed(2)}L`} icon={<DollarIcon className="w-8 h-8 text-accent dark:text-deep-green"/>} />
            <StatCard title="Pending Applications" value={franchises.filter(f => f.status === 'Pending').length} icon={<DocumentIcon className="w-8 h-8 text-blue-500"/>} />
            <StatCard title="Active Partners" value={franchises.filter(f => f.status === 'Active').length} icon={<BuildingIcon className="w-8 h-8 text-green-500"/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <Card title="All Franchises">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border-b border-border dark:border-charcoal-gray pb-4">
                        <Input
                            label="Search Owner / Location"
                            name="search"
                            placeholder="e.g., Priya or Pune"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            label="Filter by Status"
                            name="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as FranchiseStatus | 'All')}
                            options={['All', 'Active', 'Pending', 'Inactive']}
                        />
                        <Select
                            label="Filter by Revenue"
                            name="revenueFilter"
                            value={revenueFilter}
                            onChange={(e) => setRevenueFilter(e.target.value)}
                            options={['All', 'Over 10L', '5L - 10L', 'Under 5L']}
                        />
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary dark:bg-charcoal-gray text-xs text-primary dark:text-solar-gold uppercase">
                                <tr>
                                    {([
                                        { key: 'id', label: 'ID' },
                                        { key: 'owner', label: 'Owner' },
                                        { key: 'location', label: 'Location' },
                                        { key: 'status', label: 'Status' },
                                        { key: 'revenue', label: 'Capacity (INR)' },
                                        { key: 'projects', label: 'Projects' },
                                    ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                                        <th key={key} className="p-3 cursor-pointer" onClick={() => requestSort(key)}>
                                            {label}{getSortIndicator(key)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-muted-foreground dark:text-gray-300">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center p-6">Loading...</td></tr>
                                ) : error ? (
                                     <tr><td colSpan={6} className="text-center p-6 text-red-500">{error}</td></tr>
                                ) : sortedFranchises.length > 0 ? sortedFranchises.map((item) => (
                                    <tr key={item.id} className="border-b border-border dark:border-solar-gray hover:bg-secondary dark:hover:bg-charcoal-gray/50">
                                        <td className="p-3 font-medium text-foreground dark:text-white">{item.id}</td>
                                        <td className="p-3">{item.owner}</td>
                                        <td className="p-3">{item.location}</td>
                                        <td className="p-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[item.status]}`}>{item.status}</span></td>
                                        <td className="p-3 font-mono text-right">{item.revenue.toLocaleString('en-IN')}</td>
                                        <td className="p-3 text-center">{item.projects}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="text-center p-6 text-muted-foreground dark:text-gray-500">
                                            No franchises match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="Investment Capacity (Active)">
                     <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} />
                            <XAxis type="number" stroke={theme === 'dark' ? "#9ca3af" : "#4b5563"} tickFormatter={(value) => `₹${Number(value) / 100000}L`}/>
                            <YAxis type="category" dataKey="name" width={80} stroke={theme === 'dark' ? "#9ca3af" : "#4b5563"} />
                            <Tooltip
                                cursor={{ fill: 'rgba(251, 192, 45, 0.1)' }}
                                contentStyle={theme === 'dark' ? 
                                    { backgroundColor: '#212121', border: '1px solid #FBC02D' } :
                                    { backgroundColor: '#ffffff', border: '1px solid #FBC02D' }
                                }
                                formatter={(value) => [new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value)), 'Capacity']}
                            />
                             <Bar dataKey="revenue" fill="#FBC02D" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    </div>
  );
};