import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { EstimateForm } from './components/EstimateForm.js';
import { EstimateResult } from './components/EstimateResult.js';
import { FAQView } from './components/FAQView.js';
import { FAQModal } from './components/FAQModal.js';
import { PrivacyModal } from './components/PrivacyModal.js';
import { ModelMetadataModal } from './components/ModelMetadataModal.js';
import { AuthModal } from './components/AuthModal.js';
import type { EstimateInput, EstimateResponse, User } from './types.js';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'estimate' | 'faq'>('estimate');
  const [input, setInput] = useState<EstimateInput>({
    city: 'hyderabad',
    areaSqft: 1800,
    floors: 2,
    materialGrade: 'standard',
    soilType: 'normal',
  });

  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [modelInfoOpen, setModelInfoOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('buildcalc_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Debounce ref for live recalculation
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEstimate = async (params: EstimateInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }

      const data: EstimateResponse = await response.json();
      setEstimate(data);
      setHasCalculated(true);
    } catch (err: unknown) {
      console.error('Calculation error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to calculate estimate';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform initial benchmark calculation so the user instantly sees live data
  useEffect(() => {
    fetchEstimate(input);
  }, []);

  const handleCalculateClick = (params: EstimateInput) => {
    fetchEstimate(params);
  };

  const handleInputChange = (newInput: EstimateInput) => {
    setInput(newInput);
    if (hasCalculated) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        fetchEstimate(newInput);
      }, 120);
    }
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    try {
      localStorage.setItem('buildcalc_user', JSON.stringify(authenticatedUser));
    } catch (e) {
      console.error('Failed to save user in storage:', e);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('buildcalc_user');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-neutral-100 flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Minimal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Main Single Primary Screen or FAQ View */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {errorMsg && (
          <div
            id="error-banner"
            className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center justify-between"
          >
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-red-400 font-medium hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'faq' ? (
          <FAQView onBackToEstimate={() => setActiveTab('estimate')} />
        ) : (
          /* Single Primary Screen: Form on the Left (or Top on Mobile), Live-Updating Result Panel on the Right (or Below) */
          <div className="grid grid-cols-1 min-[920px]:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Input Form Column */}
            <div className="min-[920px]:col-span-6 space-y-4">
              <EstimateForm
                input={input}
                onChange={handleInputChange}
                onCalculate={handleCalculateClick}
                hasCalculated={hasCalculated}
                isLoading={isLoading}
              />
            </div>

            {/* Live-Updating Result Panel Column */}
            <div className="min-[920px]:col-span-6">
              {hasCalculated && estimate ? (
                <EstimateResult
                  estimate={estimate}
                  onOpenFaq={() => setActiveTab('faq')}
                  onOpenModelInfo={() => setModelInfoOpen(true)}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                />
              ) : (
                <div
                  id="pre-calc-placeholder"
                  className="bg-[#151518] border border-[#272730] rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[420px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1f1f27] border border-[#2c2c36] flex items-center justify-center text-amber-400">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-base font-medium text-white">
                      Estimate Awaiting Calculation
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                      Adjust your built-up area and structural specifications on the left, then click{' '}
                      <strong className="text-white font-medium">Calculate Construction Cost</strong>.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleCalculateClick(input)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>Run Benchmark Calculation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer: links to FAQ and privacy note only */}
      <Footer
        onOpenFaq={() => setActiveTab('faq')}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />

      {/* Modals */}
      <FAQModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <ModelMetadataModal isOpen={modelInfoOpen} onClose={() => setModelInfoOpen(false)} />
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
