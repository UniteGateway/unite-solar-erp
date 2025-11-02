import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CalculationInputs {
  systemCapacity: number;
  costPerKw: number;
  annualDegradation: number;
  electricityTariff: number;
  tariffEscalation: number;
  loanAmountPercentage: number;
  interestRate: number;
  loanTenure: number;
}

interface YearlyData {
  year: number;
  energyGeneration: number;
  savings: number;
  loanPayment: number;
  netSavings: number;
  cumulativeSavings: number;
}

interface CalculationResults {
  totalProjectCost: number;
  paybackPeriod: number;
  net25YearSavings: number;
  yearlyBreakdown: YearlyData[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
};

export const RoiCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    systemCapacity: 50,
    costPerKw: 50000,
    annualDegradation: 0.8,
    electricityTariff: 8.0,
    tariffEscalation: 3.0,
    loanAmountPercentage: 80,
    interestRate: 9.0,
    loanTenure: 7,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleCalculate = () => {
    const totalProjectCost = inputs.systemCapacity * inputs.costPerKw;
    const loanAmount = totalProjectCost * (inputs.loanAmountPercentage / 100);
    const downPayment = totalProjectCost - loanAmount;

    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const numberOfMonths = inputs.loanTenure * 12;
    
    const emi = numberOfMonths > 0 && monthlyInterestRate > 0
        ? loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths) / (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1)
        : (loanAmount / (numberOfMonths || 1));
        
    const annualLoanPayment = emi * 12;

    const initialEnergyGeneration = inputs.systemCapacity * 4.5 * 365 * 0.78; // Base generation
    
    const yearlyBreakdown: YearlyData[] = [];
    let cumulativeSavings = -downPayment; // Tracks net savings minus downpayment
    let paybackPeriod = 0;
    let cumulativeNetSavingsForPayback = 0;

    for (let i = 0; i < 25; i++) {
        const year = i + 1;
        const energyGeneration = initialEnergyGeneration * Math.pow(1 - inputs.annualDegradation / 100, i);
        const currentTariff = inputs.electricityTariff * Math.pow(1 + inputs.tariffEscalation / 100, i);
        const savings = energyGeneration * currentTariff;
        const loanPayment = year <= inputs.loanTenure ? annualLoanPayment : 0;
        const netSavings = savings - loanPayment;
        
        cumulativeSavings += netSavings;

        const prevCumulativeNetSavings = cumulativeNetSavingsForPayback;
        cumulativeNetSavingsForPayback += netSavings;

        if (paybackPeriod === 0 && cumulativeNetSavingsForPayback >= totalProjectCost) {
            const amountNeeded = totalProjectCost - prevCumulativeNetSavings;
            if (netSavings > 0) {
                paybackPeriod = i + (amountNeeded / netSavings);
            } else if (amountNeeded <= 0) { // Paid back exactly last year
                paybackPeriod = i;
            }
        }
        
        yearlyBreakdown.push({ year, energyGeneration, savings, loanPayment, netSavings, cumulativeSavings });
    }
    
    if (paybackPeriod === 0) {
        paybackPeriod = Infinity; // Will be handled in JSX
    }

    setResults({
        totalProjectCost,
        paybackPeriod,
        net25YearSavings: cumulativeNetSavingsForPayback,
        yearlyBreakdown,
    });
  };

  return (
    <Card title="ROI & Savings Calculator">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Inputs Column */}
            <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-semibold text-foreground dark:text-white border-b border-border dark:border-charcoal-gray pb-2">Input Parameters</h3>
                <Input label="System Capacity (kW)" name="systemCapacity" type="number" value={String(inputs.systemCapacity)} onChange={handleChange} />
                <Input label="Cost per kW (₹)" name="costPerKw" type="number" value={String(inputs.costPerKw)} onChange={handleChange} />
                <Input label="Electricity Tariff (₹/kWh)" name="electricityTariff" type="number" value={String(inputs.electricityTariff)} step="0.01" onChange={handleChange} />
                <Input label="Tariff Escalation (% p.a.)" name="tariffEscalation" type="number" value={String(inputs.tariffEscalation)} step="0.1" onChange={handleChange} />
                <Input label="Annual Degradation (% p.a.)" name="annualDegradation" type="number" value={String(inputs.annualDegradation)} step="0.1" onChange={handleChange} />
                <Input label="Loan Amount (%)" name="loanAmountPercentage" type="number" value={String(inputs.loanAmountPercentage)} onChange={handleChange} />
                <Input label="Interest Rate (% p.a.)" name="interestRate" type="number" value={String(inputs.interestRate)} step="0.1" onChange={handleChange} />
                <Input label="Loan Tenure (Years)" name="loanTenure" type="number" value={String(inputs.loanTenure)} onChange={handleChange} />
                <Button onClick={handleCalculate} className="w-full mt-4">Calculate Projections</Button>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-foreground dark:text-white border-b border-border dark:border-charcoal-gray pb-2">Financial Projections</h3>
                {results ? (
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-secondary dark:bg-charcoal-gray p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Project Cost</p>
                                <p className="text-xl font-bold text-foreground dark:text-white">{formatCurrency(results.totalProjectCost)}</p>
                            </div>
                            <div className="bg-secondary dark:bg-charcoal-gray p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Payback Period</p>
                                <p className="text-xl font-bold text-accent dark:text-deep-green">
                                    {results.paybackPeriod === Infinity ? '> 25' : results.paybackPeriod.toFixed(1)} Yrs
                                </p>
                            </div>
                            <div className="bg-secondary dark:bg-charcoal-gray p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">25-Year Savings</p>
                                <p className="text-xl font-bold text-accent dark:text-deep-green">{formatCurrency(results.net25YearSavings)}</p>
                            </div>
                             <div className="bg-secondary dark:bg-charcoal-gray p-3 rounded-lg">
                                <p className="text-sm text-muted-foreground dark:text-gray-400">1st Year Savings</p>
                                <p className="text-xl font-bold text-foreground dark:text-white">{formatCurrency(results.yearlyBreakdown[0].netSavings)}</p>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[450px] border border-border dark:border-charcoal-gray rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-secondary dark:bg-charcoal-gray text-xs text-primary dark:text-solar-gold uppercase sticky top-0">
                                    <tr>
                                        <th className="p-2">Year</th>
                                        <th className="p-2">Generation (kWh)</th>
                                        <th className="p-2">Savings</th>
                                        <th className="p-2">Loan Payment</th>
                                        <th className="p-2">Net Savings</th>
                                    </tr>
                                </thead>
                                <tbody className="text-muted-foreground dark:text-gray-300">
                                    {results.yearlyBreakdown.map(d => (
                                        <tr key={d.year} className="border-b border-border dark:border-solar-gray/50 hover:bg-secondary/50 dark:hover:bg-charcoal-gray/50">
                                            <td className="p-2 font-medium text-foreground dark:text-white">{d.year}</td>
                                            <td className="p-2">{d.energyGeneration.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                            <td className="p-2">{formatCurrency(d.savings)}</td>
                                            <td className="p-2 text-red-500">{formatCurrency(d.loanPayment)}</td>
                                            <td className={`p-2 font-bold ${d.netSavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>{formatCurrency(d.netSavings)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground dark:text-gray-400 p-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Awaiting Calculation</h2>
                            <p>Enter your project parameters and click "Calculate Projections" to see your detailed financial forecast.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </Card>
  );
};