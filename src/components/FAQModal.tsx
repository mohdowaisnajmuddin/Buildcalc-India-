import React from 'react';
import { X, HelpCircle, Shield, History, MapPin, Scale, HardHat } from 'lucide-react';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="faq-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="faq-modal-container"
        className="bg-white border border-neutral-200 rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-xl p-6 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-medium text-neutral-900">
              BuildCalc Documentation & FAQ
            </h2>
          </div>
          <button
            type="button"
            id="faq-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ Items */}
        <div className="space-y-5 text-sm">
          {/* Question 1: Accuracy */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-neutral-900">
              <Scale className="w-4 h-4 text-neutral-500" />
              <h3>How accurate is this estimate?</h3>
            </div>
            <p className="text-neutral-600 text-xs font-normal leading-relaxed pl-6">
              It is an ML-backed benchmark with a calibrated 90% confidence range, not a formal binding contractor contract. Our in-process gradient-boosted engine is trained on over 240 CPWD/State PWD schedule of rate records (Telangana TSSOR, Karnataka KPWD, Maharashtra PWD, and Delhi DSR). Actual market execution may vary ±7–9% based on custom interior architecture, contractor overhead margins, steel market price fluctuations, and seasonal labor demand.
            </p>
          </div>

          {/* Question 2: Labor Cost */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-neutral-900">
              <HardHat className="w-4 h-4 text-neutral-500" />
              <h3>Does this include labor cost?</h3>
            </div>
            <p className="text-neutral-600 text-xs font-normal leading-relaxed pl-6">
              <strong className="font-medium text-neutral-900">Yes, completely.</strong> BuildCalc provides an all-inclusive <em>turnkey composite rate</em>. This covers all civil construction materials (OPC/PPC cement, TMT rebar, aggregate, river/M-sand, red bricks/AAC blocks, plumbing pipes, electrical conduit) <strong>plus</strong> certified contractor masonry, carpentry, bar bending, plumbing, electrical, and supervisory labor charges.
            </p>
          </div>

          {/* Question 3: Rate Updates */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-neutral-900">
              <History className="w-4 h-4 text-neutral-500" />
              <h3>How often are rates updated?</h3>
            </div>
            <p className="text-neutral-600 text-xs font-normal leading-relaxed pl-6">
              Rates are updated manually on a strictly documented <strong className="font-medium text-neutral-900">monthly cadence</strong>. The schedule freshness date (currently <strong className="font-medium text-neutral-900">March 2026</strong>) is printed prominently alongside every calculation breakdown so that data staleness is never hidden from you.
            </p>
          </div>

          {/* Question 4: Hyderabad & Black Cotton Soil */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-neutral-900">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <h3>Why does Hyderabad cost more for some plots?</h3>
            </div>
            <p className="text-neutral-600 text-xs font-normal leading-relaxed pl-6">
              Several growth corridors of Hyderabad (including Miyapur, Kukatpally, Gachibowli, and Uppal) possess high-plasticity <strong className="font-medium text-neutral-900">Black Cotton Soil</strong>. This soil expands drastically when saturated with monsoon rains and shrinks deeply during summer heat. Building a standard isolated shallow footing on Black Cotton soil results in foundation cracks. Consequently, structural engineers mandate bored under-reamed cast in-situ pile foundations (12–18 ft depth) anchored to hard strata, which adds a structural foundation surcharge of ~14%.
            </p>
          </div>

          {/* Question 5: Privacy */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-neutral-900">
              <Shield className="w-4 h-4 text-neutral-500" />
              <h3>Is my personal data shared or stored?</h3>
            </div>
            <p className="text-neutral-600 text-xs font-normal leading-relaxed pl-6">
              <strong className="font-medium text-neutral-900">No.</strong> BuildCalc collects zero personal identifying information. There are no user sign-ups, accounts, or tracking cookies. If you use the WhatsApp sharing feature, the recipient number is used strictly on the client side to format your deep link and is never transmitted or saved to our server. Your estimate parameters are not sold to third-party builders or aggregators.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>BuildCalc v2.1 • Author: Mohammed Owais Naj Muddin</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
