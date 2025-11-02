import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { supabase } from '../services/supabaseClient';

interface AddFranchiseFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export const AddFranchiseForm: React.FC<AddFranchiseFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    companyName: '',
    email: '',
    phone: '',
    location: '',
    investment: '',
    background: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('franchises').insert({
        // A real app should generate a unique franchise_code on the backend.
        // For now, we'll create a simple one.
        franchise_code: `FS-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        owner_name: formData.ownerName,
        company_name: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        investment_capacity_inr: Number(formData.investment),
        business_background: formData.background,
        status: 'Pending', // New applications are always Pending
      });

      if (error) throw error;
      
      alert(`Application for ${formData.companyName} submitted successfully!`);
      onSubmit();

    } catch (err: any) {
      setError(err.message);
      console.error("Error submitting franchise application:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="New Franchise Application">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Owner's Full Name" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
          <Input label="Company / Franchise Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          <Input label="Proposed Location (City, State)" name="location" value={formData.location} onChange={handleChange} required />
          <Input label="Initial Investment Capacity (INR)" name="investment" type="number" value={formData.investment} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">Business Background / Experience</label>
          <textarea
            id="background"
            name="background"
            rows={4}
            value={formData.background}
            onChange={handleChange}
            className="w-full bg-secondary dark:bg-solar-black border border-border dark:border-gray-600 rounded-lg p-2.5 focus:ring-ring focus:border-ring transition"
            placeholder="Briefly describe relevant experience..."
            required
          ></textarea>
        </div>
        
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end items-center gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Card>
  );
};