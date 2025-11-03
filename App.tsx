import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { FeasibilityForm } from './components/FeasibilityForm';
import { ReportDisplay } from './components/ReportDisplay';
import { ClientsAndReports } from './components/ClientsAndReports';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentReportDisplay } from './components/AssessmentReportDisplay';
import { RoiCalculator } from './components/RoiCalculator';
import { ProjectTracker } from './components/ProjectTracker';
import { FranchiseMgt } from './components/FranchiseMgt';
import { AddFranchiseForm } from './components/AddFranchiseForm';
import { BioCngHybrid } from './components/BioCngHybrid';
import { Footer } from './components/Footer';
import { AiAssistant } from './components/AiAssistant';
import { User, Page, FeasibilityFormData, GeneratedReport, AssessmentFormData, GeneratedAssessmentReport } from './types';
import { generateFeasibilityReport, generateAssessmentReport } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-foreground dark:text-white p-6">
        <svg className="animate-spin-slow h-16 w-16 text-primary dark:text-solar-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-xl font-semibold font-display">{message}</p>
        <p className="text-sm text-muted-foreground dark:text-gray-400 max-w-md">Our AI is performing complex calculations and analyzing data to build your comprehensive report. This may take a moment.</p>
    </div>
);

const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    // State for Feasibility Reports
    const [currentReport, setCurrentReport] = useState<GeneratedReport | null>(null);

    // State for Assessment Reports
    const [currentAssessmentReport, setCurrentAssessmentReport] = useState<GeneratedAssessmentReport | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                // In a real app, you might fetch a user profile from a 'users' table
                setUser({ id: session.user.id, name: session.user.email || 'User', role: 'Admin', email: session.user.email || '' });
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
             // Prevent the auth listener from logging out a guest user
            if (user && user.role === 'Guest' && !session) {
                return;
            }

            setSession(session);
            if (session) {
                setUser({ id: session.user.id, name: session.user.email || 'User', role: 'Admin', email: session.user.email || '' });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        if (user?.role !== 'Guest') {
            await supabase.auth.signOut();
        }
        setUser(null);
        setCurrentPage('dashboard');
    };

    const handleGuestLogin = (guestUser: User) => {
        setUser(guestUser);
        setCurrentPage('dashboard');
    };

    const handleGenerateReport = async (formData: FeasibilityFormData) => {
        if (!user) {
            setError("You must be logged in to generate a report.");
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Generating Your Feasibility Report...');
        setError(null);
        setCurrentPage('reportDisplay');
        try {
            const reportData = await generateFeasibilityReport(formData);

            // Save to Supabase only if the user is not a guest
            if (user.role !== 'Guest' && session?.user) {
                const { error: dbError } = await supabase.from('feasibility_reports').insert({
                    created_by: session.user.id,
                    company_name: formData.companyName,
                    contact_person: formData.contactPerson,
                    location: formData.location,
                    plant_capacity_kw: formData.plantCapacity,
                    installation_type: formData.installationType,
                    roof_type: formData.roofType,
                    module_brand: formData.moduleBrand,
                    operation_mode: formData.operationMode,
                    power_tariff_inr: formData.powerTariff,
                    amc_preference: formData.amcPreference,
                    insurance: formData.insurance === 'Yes',
                    additional_notes: formData.additionalNotes,
                    report_data: reportData,
                });
                if (dbError) throw dbError;
            }

            const newReport: GeneratedReport = { formData, reportData };
            setCurrentReport(newReport);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate report: ${errorMessage}`);
            console.error(err);
            setCurrentReport(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAssessment = async (formData: AssessmentFormData) => {
        if (!user) {
            setError("You must be logged in to generate an assessment.");
            return;
        }
        setIsLoading(true);
        setLoadingMessage('Generating Your Assessment Report...');
        setError(null);
        setCurrentPage('assessmentReportDisplay');
        try {
            let powerBillUrl: string | undefined = undefined;

            // Upload power bill only if the user is not a guest
            if (formData.powerBillFile && user.role !== 'Guest' && session?.user) {
                const fileToUpload = typeof formData.powerBillFile === 'string'
                    ? dataURLtoFile(formData.powerBillFile, 'power-bill-capture.png')
                    : formData.powerBillFile;

                const filePath = `${session.user.id}/${Date.now()}-${fileToUpload.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('power_bills')
                    .upload(filePath, fileToUpload);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('power_bills')
                    .getPublicUrl(filePath);
                powerBillUrl = data.publicUrl;
            }

            const reportData = await generateAssessmentReport(formData);
            
            // Save to Supabase only if the user is not a guest
            if (user.role !== 'Guest' && session?.user) {
                const { error: dbError } = await supabase.from('assessment_reports').insert({
                    created_by: session.user.id,
                    client_name: formData.clientName,
                    state: formData.state,
                    pincode: formData.pincode,
                    contract_demand_kva: formData.contractDemand,
                    net_units_consumed_kwh: formData.netUnitsConsumed,
                    power_tariff_inr: formData.powerTariff,
                    available_space_sqft: formData.availableSpace,
                    transformer_capacity_kva: formData.transformerCapacity,
                    financing_option: formData.financingOption,
                    cmd_enhancement_cost_inr: formData.cmdEnhancementCost,
                    power_bill_url: powerBillUrl,
                    report_data: reportData,
                });
                if (dbError) throw dbError;
            }

            const newReport: GeneratedAssessmentReport = { formData, reportData };
            setCurrentAssessmentReport(newReport);
        } catch (err)
 {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate assessment: ${errorMessage}`);
            console.error(err);
            setCurrentAssessmentReport(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleViewReport = (report: GeneratedReport) => {
        setCurrentReport(report);
        setCurrentPage('reportDisplay');
    };

    const renderPage = () => {
        if (isLoading) {
            return <LoadingSpinner message={loadingMessage} />;
        }
        
        if (error && (currentPage === 'reportDisplay' || currentPage === 'assessmentReportDisplay')) {
            return (
                <div className="text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-solar-gray p-8 rounded-lg">
                    <h2 className="text-2xl mb-4 font-bold font-display">Report Generation Failed</h2>
                    <p>{error}</p>
                    <button onClick={() => { 
                        const prevPage = currentPage === 'reportDisplay' ? 'generator' : 'assessment';
                        setCurrentPage(prevPage); 
                        setError(null); 
                    }} className="mt-6 bg-primary dark:bg-solar-gold text-primary-foreground dark:text-solar-black font-bold py-2 px-6 rounded-lg transition hover:bg-yellow-400">
                        Try Again
                    </button>
                </div>
            )
        }
        
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard setCurrentPage={setCurrentPage} theme={theme} />;
            case 'generator':
                return <FeasibilityForm onSubmit={handleGenerateReport} />;
            case 'assessment':
                return <AssessmentForm onSubmit={handleGenerateAssessment} />;
            case 'clients':
                return <ClientsAndReports onViewReport={handleViewReport} />;
            case 'reportDisplay':
                if (currentReport) {
                    return <ReportDisplay reportData={currentReport.reportData} formData={currentReport.formData} onBack={() => setCurrentPage('clients')} />;
                }
                setCurrentPage('clients'); // Go to list if no report is active
                return null;
            case 'assessmentReportDisplay':
                if (currentAssessmentReport) {
                    return <AssessmentReportDisplay report={currentAssessmentReport} onBack={() => setCurrentPage('assessment')} />;
                }
                setCurrentPage('assessment');
                return null;
            case 'roi-calculator':
                return <RoiCalculator />;
            case 'project-tracker':
                return <ProjectTracker />;
            case 'franchise':
                return <FranchiseMgt setCurrentPage={setCurrentPage} />;
            case 'add-franchise':
                 return <AddFranchiseForm onCancel={() => setCurrentPage('franchise')} onSubmit={() => setCurrentPage('franchise')} />;
            case 'bio-cng':
                return <BioCngHybrid />;
            default:
                return <Dashboard setCurrentPage={setCurrentPage} theme={theme} />;
        }
    };

    if (!user) {
        return <Login onGuestLogin={handleGuestLogin} />;
    }

    return (
        <div className="flex h-screen bg-background dark:bg-solar-black text-foreground dark:text-white font-sans">
            <Sidebar
                user={user}
                isCollapsed={isSidebarCollapsed}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout}
            />
            <div className="flex flex-col flex-grow min-w-0">
                <TopBar user={user} onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} theme={theme} setTheme={setTheme} />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {renderPage()}
                </main>
                <Footer />
            </div>
            
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
                    className="bg-accent dark:bg-deep-green text-accent-foreground dark:text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:ring-offset-solar-black focus:ring-primary dark:focus:ring-solar-gold"
                    aria-label="Toggle AI Assistant"
                    title="AI Assistant"
                >
                    <SparklesIcon className="w-8 h-8"/>
                </button>
            </div>

            <AiAssistant
                isOpen={isAiAssistantOpen}
                onClose={() => setIsAiAssistantOpen(false)}
                reportContext={currentReport}
            />
        </div>
    );
};

export default App;