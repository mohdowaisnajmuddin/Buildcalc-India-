import React from 'react';
import { ArrowLeft, Scale, HardHat, History, MapPin, Shield, CheckCircle2 } from 'lucide-react';

interface FAQViewProps {
  onBackToEstimate: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ onBackToEstimate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToEstimate}
          className="inline-flex items-center gap-2 text-xs font-normal text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Estimator</span>
        </button>
        <span className="text-xs text-neutral-500 font-normal">BuildCalc Documentation</span>
      </div>

      {/* Main card */}
      <div className="bg-[#151518] border border-[#272730] rounded-2xl p-6 sm:p-8 space-y-7">
        <div>
          <h2 className="text-xl font-medium text-white tracking-tight">
            Frequently Asked Questions & Methodology
          </h2>
          <p className="text-xs text-neutral-400 font-normal mt-1.5 leading-relaxed">
            Everything you need to know about CPWD rate schedules, labor inclusion, geotechnical foundation surcharges, and estimate accuracy.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-[#24242d] text-xs">
          {/* Item 1 */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 font-medium text-white text-sm">
              <Scale className="w-4 h-4 text-amber-400" />
              <h3>How accurate is this benchmark estimate?</h3>
            </div>
            <p className="text-neutral-400 font-normal leading-relaxed pl-6">
              BuildCalc provides an ML-calibrated cost benchmark with an empirical 90% confidence interval, derived from over 240 CPWD/State PWD scheduled schedules (Telangana TSSOR, Karnataka KPWD, Maharashtra PWD, and Delhi DSR). Actual contractor quotes generally land within ±7–9% of this benchmark depending on custom interior finishes, steel spot prices, and site accessibility.
            </p>
          </div>

          {/* Item 2 */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 font-medium text-white text-sm">
              <HardHat className="w-4 h-4 text-amber-400" />
              <h3>Does the estimate include labor charges?</h3>
            </div>
            <p className="text-neutral-400 font-normal leading-relaxed pl-6">
              <strong className="text-white font-medium">Yes, completely.</strong> BuildCalc provides an all-inclusive <em>turnkey composite rate</em>. This covers all structural civil materials (cement, TMT steel, sand, aggregate, bricks/AAC blocks) <strong className="text-white font-medium">plus</strong> certified contractor masonry, shuttering carpentry, bar bending, electrical wiring, plumbing, and site supervisory labor.
            </p>
          </div>

          {/* Item 3 */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 font-medium text-white text-sm">
              <History className="w-4 h-4 text-amber-400" />
              <h3>How often are rate schedules updated?</h3>
            </div>
            <p className="text-neutral-400 font-normal leading-relaxed pl-6">
              Rate tables are audited and recalibrated on a monthly cadence based on PWD gazette revisions and regional wholesale commodity price indices for cement and TMT steel. The active rate schedule date is printed directly beneath every calculation.
            </p>
          </div>

          {/* Item 4 */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 font-medium text-white text-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3>Why does soil condition change the foundation cost?</h3>
            </div>
            <p className="text-neutral-400 font-normal leading-relaxed pl-6">
              Different soil strata require fundamentally different structural engineering. For example, Black Cotton soil in parts of Hyderabad undergoes heavy volumetric swelling and shrinkage, requiring bored under-reamed cast in-situ pile foundations (+14% surcharge). Rocky terrain requires mechanical pneumatic chiseling (+6.5%), while normal loam uses standard shallow isolated column footings.
            </p>
          </div>

          {/* Item 5 */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center gap-2 font-medium text-white text-sm">
              <Shield className="w-4 h-4 text-amber-400" />
              <h3>Is my project data kept private?</h3>
            </div>
            <p className="text-neutral-400 font-normal leading-relaxed pl-6">
              Yes. BuildCalc does not sell contractor leads or sell your floor dimensions to third parties. If you sign in with Google, your identity is only used to store your own calculation history for reference.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-[#26262e] flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-normal">
            BuildCalc v2.1 • Task-first estimator
          </span>
          <button
            type="button"
            onClick={onBackToEstimate}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-medium transition-colors cursor-pointer"
          >
            Go to Estimator
          </button>
        </div>
      </div>
    </div>
  );
};
