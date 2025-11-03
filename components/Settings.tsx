import React from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-display text-primary dark:text-solar-gold">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="User Profile">
            <div className="space-y-4">
                <Input label="Full Name" name="fullName" defaultValue="Admin User" />
                <Input label="Email Address" name="email" type="email" defaultValue="admin@unitesolar.in" readOnly />
                <Button>Update Profile</Button>
            </div>
        </Card>
        <Card title="Password Management">
            <div className="space-y-4">
                <Input label="Current Password" name="currentPassword" type="password" />
                <Input label="New Password" name="newPassword" type="password" />
                <Input label="Confirm New Password" name="confirmPassword" type="password" />
                <Button>Change Password</Button>
            </div>
        </Card>
        <Card title="Notifications">
            <div className="space-y-4">
                <p className="text-muted-foreground dark:text-gray-300">Manage your email notification preferences.</p>
                <div className="flex items-center justify-between p-3 bg-secondary dark:bg-charcoal-gray rounded-lg">
                    <label htmlFor="project-updates" className="font-medium text-foreground dark:text-white">Project Updates</label>
                    <input type="checkbox" id="project-updates" className="h-5 w-5 rounded border-gray-300 text-primary dark:text-solar-gold focus:ring-primary dark:focus:ring-solar-gold bg-transparent" defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary dark:bg-charcoal-gray rounded-lg">
                    <label htmlFor="franchise-requests" className="font-medium text-foreground dark:text-white">New Franchise Requests</label>
                    <input type="checkbox" id="franchise-requests" className="h-5 w-5 rounded border-gray-300 text-primary dark:text-solar-gold focus:ring-primary dark:focus:ring-solar-gold bg-transparent" defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-3 bg-secondary dark:bg-charcoal-gray rounded-lg">
                    <label htmlFor="weekly-summary" className="font-medium text-foreground dark:text-white">Weekly Summary Report</label>
                    <input type="checkbox" id="weekly-summary" className="h-5 w-5 rounded border-gray-300 text-primary dark:text-solar-gold focus:ring-primary dark:focus:ring-solar-gold bg-transparent" />
                </div>
            </div>
        </Card>
        <Card title="Appearance">
             <p className="text-muted-foreground dark:text-gray-300">Customize the look and feel of your dashboard.</p>
             <div className="mt-4 p-3 bg-secondary dark:bg-charcoal-gray rounded-lg">
                <span className="font-medium text-foreground dark:text-white">Theme is currently managed via the Sun/Moon icon in the top bar.</span>
             </div>
        </Card>
      </div>
    </div>
  );
};