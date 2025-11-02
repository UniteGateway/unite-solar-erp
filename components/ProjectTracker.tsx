import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/Card';
import { CalendarIcon } from './icons/CalendarIcon';
import { supabase } from '../services/supabaseClient';

type ProjectStatus = 'Planning & Design' | 'Procurement' | 'Installation' | 'Commissioning' | 'Completed';
type SortKey = 'clientName' | 'status' | 'capacity' | 'assignedTo' | 'dueDate' | 'progress';
type SortDirection = 'asc' | 'desc';

interface Project {
  id: string;
  clientName: string;
  capacity: number;
  status: ProjectStatus;
  assignedTo: string;
  dueDate: string;
  progress: number;
}

const statusStyles: { [key in ProjectStatus]: string } = {
  'Planning & Design': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Procurement': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Installation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Commissioning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
        {status}
    </span>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="flex items-center gap-2">
        <div className="w-full bg-secondary dark:bg-charcoal-gray rounded-full h-2.5 flex-grow">
            <div className="bg-accent dark:bg-deep-green h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs font-medium text-muted-foreground dark:text-gray-400 w-10 text-right">{progress}%</span>
    </div>
);

export const ProjectTracker: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'dueDate', direction: 'asc' });

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*');

            if (error) {
                setError(error.message);
                console.error("Error fetching projects:", error);
            } else if (data) {
                const mappedProjects: Project[] = data.map(p => ({
                    id: p.id,
                    clientName: p.client_name,
                    capacity: p.capacity_kw,
                    status: p.status,
                    assignedTo: p.assigned_to,
                    dueDate: p.due_date,
                    progress: p.progress_percentage
                }));
                setProjects(mappedProjects);
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);


    const sortedProjects = useMemo(() => {
        let sortableItems = [...projects];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [projects, sortConfig]);

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

  return (
    <Card title="Project Tracker">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-secondary dark:bg-charcoal-gray text-xs text-primary dark:text-solar-gold uppercase">
                    <tr>
                        {([
                            { key: 'clientName', label: 'Client Name' },
                            { key: 'status', label: 'Status' },
                            { key: 'capacity', label: 'Capacity (kW)' },
                            { key: 'assignedTo', label: 'Assigned To' },
                            { key: 'dueDate', label: 'Due Date' },
                            { key: 'progress', label: 'Progress (%)' },
                        ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                            <th key={key} className="p-3 cursor-pointer" onClick={() => requestSort(key)}>
                                {label}{getSortIndicator(key)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-muted-foreground dark:text-gray-300">
                    {loading ? (
                        <tr><td colSpan={6} className="text-center p-6">Loading projects...</td></tr>
                    ) : error ? (
                        <tr><td colSpan={6} className="text-center p-6 text-red-500">{error}</td></tr>
                    ) : sortedProjects.map((project) => (
                        <tr key={project.id} className="border-b border-border dark:border-solar-gray hover:bg-secondary dark:hover:bg-charcoal-gray/50">
                            <td className="p-3 font-medium text-foreground dark:text-white">{project.clientName}</td>
                            <td className="p-3"><StatusBadge status={project.status} /></td>
                            <td className="p-3 text-center">{project.capacity}</td>
                            <td className="p-3">{project.assignedTo}</td>
                            <td className="p-3">{project.dueDate}</td>
                            <td className="p-3"><ProgressBar progress={project.progress} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
  );
};