import React, { useState, useMemo, useEffect } from 'react';
import { GeneratedReport, ReportData, FeasibilityFormData } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { supabase } from '../services/supabaseClient';

interface ClientsAndReportsProps {
  onViewReport: (report: GeneratedReport) => void;
}

export const ClientsAndReports: React.FC<ClientsAndReportsProps> = ({ onViewReport }) => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('feasibility_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        console.error("Error fetching reports:", error);
      } else if (data) {
        const mappedReports: GeneratedReport[] = data.map(dbReport => ({
          formData: {
            companyName: dbReport.company_name,
            contactPerson: dbReport.contact_person,
            location: dbReport.location,
            plantCapacity: dbReport.plant_capacity_kw,
            installationType: dbReport.installation_type,
            roofType: dbReport.roof_type,
            moduleBrand: dbReport.module_brand,
            operationMode: dbReport.operation_mode,
            powerTariff: dbReport.power_tariff_inr,
            amcPreference: dbReport.amc_preference,
            insurance: dbReport.insurance ? 'Yes' : 'No',
            additionalNotes: dbReport.additional_notes,
          },
          reportData: dbReport.report_data as ReportData,
        }));
        setReports(mappedReports);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(r => 
      r.formData.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.formData.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  return (
    <Card title="Clients & Feasibility Reports">
      <div className="mb-4">
        <Input 
          label="Search by Client or Location" 
          name="search"
          placeholder="Start typing to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground dark:text-gray-300">
          <thead className="bg-secondary dark:bg-charcoal-gray text-xs text-primary dark:text-solar-gold uppercase">
            <tr>
              <th className="p-3">Client Name</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-center">Capacity (kW)</th>
              <th className="p-3 text-center">ROI (%)</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-6">Loading reports...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="text-center p-6 text-red-500">{error}</td></tr>
            ) : filteredReports.length > 0 ? filteredReports.map((report, index) => (
              <tr key={index} className="border-b border-border dark:border-solar-gray hover:bg-secondary dark:hover:bg-charcoal-gray/50">
                <td className="p-3 font-medium text-foreground dark:text-white">{report.formData.companyName}</td>
                <td className="p-3">{report.formData.location}</td>
                <td className="p-3 text-center">{report.formData.plantCapacity}</td>
                <td className="p-3 text-center text-accent dark:text-deep-green font-bold">{report.reportData?.financialSummary?.roi?.toFixed(1) || 'N/A'}%</td>
                <td className="p-3 text-center">
                  <Button onClick={() => onViewReport(report)} variant="secondary" className="py-1 px-3 text-xs">
                    View Report
                  </Button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="text-center p-6 text-muted-foreground dark:text-gray-500">
                        {reports.length === 0 ? "No reports generated yet." : "No reports match your search."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};