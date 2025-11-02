import React, { useRef, useState } from 'react';
import { GeneratedAssessmentReport } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { BoltIcon } from './icons/BoltIcon';
import { DollarIcon } from './icons/DollarIcon';
import { HomeIcon } from './icons/HomeIcon';
import { LeafIcon } from './icons/LeafIcon';
import { WarningIcon } from './icons/WarningIcon';
import { generatePdfFromSections } from '../services/pdfService';


interface AssessmentReportDisplayProps {
  report: GeneratedAssessmentReport;
  onBack: () => void;
}

const InfoRow: React.FC<{ label: string; value: string | number; unit?: string; highlight?: boolean }> = ({ label, value, unit, highlight = false }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-border dark:border-solar-gray/50">
        <span className="text-muted-foreground dark:text-gray-300">{label}</span>
        <span className={`font-bold text-lg ${highlight ? 'text-primary dark:text-solar-gold' : 'text-foreground dark:text-white'}`}>{value} {unit}</span>
    </div>
);

export const AssessmentReportDisplay: React.FC<AssessmentReportDisplayProps> = ({ report, onBack }) => {
    const { formData, reportData } = report;
    const { analysis, financials, enhancementPotential, summary } = reportData;
    const reportContainerRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleGeneratePdf = async () => {
        setIsGeneratingPdf(true);
        try {
            await generatePdfFromSections(
                reportContainerRef.current,
                '.pdf-section',
                `Quotation-${formData.clientName.replace(/\s/g, '_') || 'Assessment'}.pdf`
            );
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Sorry, an error occurred while generating the PDF.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div ref={reportContainerRef}>
                <div className="pdf-section">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-primary dark:text-solar-gold font-display">On-Site Assessment Report</h1>
                            <p className="text-muted-foreground dark:text-gray-300">Prepared for: <span className="font-semibold text-foreground dark:text-white">{formData.clientName}</span></p>
                        </div>
                        <Button onClick={onBack} variant="secondary" className="no-print">Back to Form</Button>
                    </div>
                </div>

                <div className="space-y-6 mt-6">
                    <div className="pdf-section">
                        <Card title="Key Recommendations">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <BoltIcon className="w-12 h-12 mx-auto text-primary dark:text-solar-gold mb-2"/>
                                    <p className="text-muted-foreground dark:text-gray-400">Recommended Capacity</p>
                                    <p className="text-3xl font-bold text-foreground dark:text-white">{analysis.recommendedCapacity.toFixed(1)} <span className="text-xl">kW</span></p>
                                </div>
                                 <div>
                                    <DollarIcon className="w-12 h-12 mx-auto text-accent dark:text-deep-green mb-2"/>
                                    <p className="text-muted-foreground dark:text-gray-400">Est. Monthly Savings</p>
                                    <p className="text-3xl font-bold text-foreground dark:text-white">₹{financials.monthlySavings.toLocaleString('en-IN')}</p>
                                </div>
                                 <div>
                                    <HomeIcon className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 mb-2"/>
                                    <p className="text-muted-foreground dark:text-gray-400">Payback Period</p>
                                    <p className="text-3xl font-bold text-foreground dark:text-white">{financials.paybackPeriod.toFixed(1)} <span className="text-xl">Years</span></p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pdf-section">
                        <Card title="Technical Analysis">
                            <InfoRow label="Permitted Capacity (by CMD)" value={analysis.permittedCapacityCMD.toFixed(1)} unit="kW" />
                            <InfoRow label="Permitted Capacity (by Space)" value={analysis.permittedCapacitySpace.toFixed(1)} unit="kW" />
                            <InfoRow label="Final Recommended Capacity" value={analysis.recommendedCapacity.toFixed(1)} unit="kW" highlight />
                            <InfoRow label="Estimated Annual Generation" value={analysis.annualGeneration.toLocaleString('en-IN')} unit="kWh" />
                        </Card>

                        <Card title="Financial Projection">
                            <InfoRow label="Estimated System Cost" value={`₹${financials.estimatedSystemCost.toLocaleString('en-IN')}`} />
                            <InfoRow label="Financing Option" value={financials.loanType} />
                            {financials.advancePayment > 0 && <InfoRow label="Upfront Advance" value={`₹${financials.advancePayment.toLocaleString('en-IN')}`} />}
                            <InfoRow label="Monthly EMI" value={`₹${financials.monthlyEMI.toLocaleString('en-IN')}`} />
                            <InfoRow label="Interest Rate" value={financials.interestRate} />
                        </Card>
                    </div>

                    {enhancementPotential.isEnhancementPossible && (
                        <div className="pdf-section">
                            <Card title="Capacity Enhancement Potential">
                                <div className="flex items-center p-4 bg-green-50 dark:bg-deep-green/10 border-l-4 border-accent dark:border-deep-green rounded-lg">
                                    <LeafIcon className="w-10 h-10 text-accent dark:text-deep-green mr-4"/>
                                    <div>
                                        <h4 className="font-bold text-lg text-foreground dark:text-white">Unlock Greater Savings!</h4>
                                        <p className="text-muted-foreground dark:text-gray-300">{enhancementPotential.recommendationText}</p>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                    <InfoRow label="Potential Capacity with Full Space" value={enhancementPotential.potentialCapacity.toFixed(1)} unit="kW"/>
                                    <InfoRow label="Est. Cost for CMD Enhancement" value={`₹${enhancementPotential.estimatedCMDCost.toLocaleString('en-IN')}`}/>
                                    {enhancementPotential.transformerUpgradeRequired && (
                                        <div className="md:col-span-2 mt-2 flex items-start p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
                                            <WarningIcon className="w-6 h-6 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h5 className="font-bold text-red-800 dark:text-red-300">Transformer Capacity Warning</h5>
                                                <p className="text-sm text-red-700 dark:text-red-400">
                                                    The current transformer may be insufficient to support the enhanced capacity. An upgrade will likely be required, which could incur additional costs and time.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}
                    
                    <div className="pdf-section">
                        <Card title="Summary & Next Steps">
                            <p className="text-muted-foreground dark:text-gray-300 whitespace-pre-wrap">{summary.conclusion}</p>
                        </Card>
                    </div>
                </div>
            </div>

             <div className="text-center pt-4">
                <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? 'Generating...' : 'Generate Quotation'}
                </Button>
            </div>
        </div>
    );
};