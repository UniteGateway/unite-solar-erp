import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LeafIcon } from './icons/LeafIcon';
import { DollarIcon } from './icons/DollarIcon';
import { BoltIcon } from './icons/BoltIcon';
import { RecycleIcon } from './icons/RecycleIcon';

const heroImageUrl = 'https://images.pexels.com/photos/8572456/pexels-photo-8572456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const BenefitCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-card dark:bg-solar-gray p-6 rounded-lg shadow-lg text-center">
    <div className="flex justify-center items-center mb-4 text-primary dark:text-solar-gold">{icon}</div>
    <h3 className="text-xl font-bold font-display text-foreground dark:text-white mb-2">{title}</h3>
    <p className="text-muted-foreground dark:text-gray-400 text-sm">{children}</p>
  </div>
);

export const BioCngHybrid: React.FC = () => {
    const [formState, setFormState] = useState({ name: '', company: '', email: '', message: '' });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you, ${formState.name}! Your request has been submitted. We will contact you at ${formState.email} shortly.`);
        setFormState({ name: '', company: '', email: '', message: '' });
    };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center rounded-xl p-8 md:p-16 min-h-[400px] flex items-center text-white" 
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-solar-gold mb-4">
            Pioneering the Future of Energy
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Unite Solar leads the way in integrated Bio-CNG and hybrid energy solutions, turning waste into a valuable, sustainable power source for a greener tomorrow.
          </p>
          <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
            Request a Consultation
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <Card title="Why Bio-CNG & Hybrid Solutions?">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <BenefitCard icon={<LeafIcon className="w-12 h-12" />} title="Reduced Emissions">
            Significantly cut your carbon footprint by replacing fossil fuels with clean, renewable Bio-CNG.
          </BenefitCard>
          <BenefitCard icon={<DollarIcon className="w-12 h-12" />} title="Economic Savings">
            Lower your operational costs by generating your own fuel and energy, reducing reliance on the grid.
          </BenefitCard>
          <BenefitCard icon={<RecycleIcon className="w-12 h-12" />} title="Waste to Wealth">
            Convert organic waste from your operations into a profitable resource, creating a circular economy.
          </BenefitCard>
          <BenefitCard icon={<BoltIcon className="w-12 h-12" />} title="Energy Independence">
            Ensure a consistent and reliable power supply, independent of grid fluctuations and price volatility.
          </BenefitCard>
        </div>
      </Card>
      
      {/* Contact Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" id="contact-form">
          <div>
              <h2 className="text-3xl font-bold font-display text-primary dark:text-solar-gold mb-4">Start Your Green Transition Today</h2>
              <p className="text-muted-foreground dark:text-gray-300">
                Our experts are ready to design a custom Bio-CNG or hybrid energy solution tailored to your specific needs. Whether you're in agriculture, food processing, or manufacturing, we can help you achieve your sustainability and financial goals.
                <br/><br/>
                Fill out the form to schedule a free, no-obligation assessment with our technical team.
              </p>
          </div>
           <Card title="Get in Touch">
              <form onSubmit={handleSubmit} className="space-y-4">
                  <Input label="Your Name" name="name" value={formState.name} onChange={handleInputChange} required />
                  <Input label="Company Name" name="company" value={formState.company} onChange={handleInputChange} required />
                  <Input label="Email Address" name="email" type="email" value={formState.email} onChange={handleInputChange} required />
                  <div>
                      <label htmlFor="message" className="block text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">Your Message</label>
                      <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formState.message}
                          onChange={handleInputChange}
                          className="w-full bg-secondary dark:bg-solar-black border border-border dark:border-gray-600 rounded-lg p-2.5 focus:ring-ring focus:border-ring transition"
                          placeholder="Tell us about your project or requirements..."
                      ></textarea>
                  </div>
                  <div className="text-right">
                      <Button type="submit">Submit Request</Button>
                  </div>
              </form>
           </Card>
      </div>
    </div>
  );
};
