import React, { useState } from 'react';
import { Download, Printer, History, ChevronDown, ChevronUp, CheckCircle2, Bookmark, Cpu } from 'lucide-react';
import type { EstimateResponse, User } from '../types.js';
import { MetricCard } from './MetricCard.js';
import { ShareButton } from './ShareButton.js';
import { formatCurrency, formatCompactINR, formatIndianNumber } from '../utils/formatters.js';

interface EstimateResultProps {
  estimate: EstimateResponse | null;
  onOpenFaq: () => void;
  onOpenModelInfo: () => void;
  user: User | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const EstimateResult: React.FC<EstimateResultProps> = ({
  estimate,
  onOpenFaq,
  onOpenModelInfo,
  user,
  onOpenAuth,
}) => {
  const [showDetailedRows, setShowDetailedRows] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!estimate) {
    return null;
  }

  const { breakdown } = estimate;
  const gstAndWastage = breakdown.gstCost + breakdown.wastageCost;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEstimate = async () => {
    if (!user) {
      onOpenAuth('signin');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/estimates/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          input: {
            city: estimate.city,
            areaSqft: estimate.areaSqft,
            floors: estimate.floors,
            materialGrade: estimate.materialGrade,
            soilType: estimate.soilType,
          },
          totalCost: estimate.estimatedCost,
          confidenceRange: estimate.confidenceRange,
          cityName: estimate.cityName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save estimate error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="estimate-result-panel"
      className="bg-[#151518] border border-[#272730] rounded-2xl p-5 sm:p-7 space-y-6"
    >
      {/* Header & Primary Headline Metric with High Contrast Medium Numbers */}
      <div className="border-b border-[#26262e] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs uppercase tracking-wider font-normal text-neutral-400">
            Estimated Construction Cost
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 font-normal border border-emerald-800/50">
            <CheckCircle2 className="w-3 h-3" />
            Live Calculated
          </span>
        </div>

        {/* Primary Amount + Single-Line Confidence Range shown side-by-side (Not hidden in a tooltip) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span
              id="total-estimate-figure"
              className="text-3xl sm:text-4xl font-medium tracking-tight text-white"
            >
              {formatCurrency(estimate.estimatedCost)}
            </span>
            <span className="text-base font-normal text-neutral-400">
              ({formatCompactINR(estimate.estimatedCost)})
            </span>
          </div>

          {/* Single-line confidence range shown next to the total, not hidden in a tooltip */}
          <div
            id="confidence-range-badge"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1b1b22] border border-[#2c2c36] text-xs font-normal text-neutral-300"
          >
            <span className="text-neutral-400">Confidence Range:</span>
            <span className="font-medium text-white">
              {formatCompactINR(estimate.confidenceRange[0])} – {formatCompactINR(estimate.confidenceRange[1])}
            </span>
          </div>
        </div>

        {/* Specification context strip */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-3 text-xs text-neutral-400 font-normal">
          <span>
            Effective Rate:{' '}
            <strong className="font-medium text-white">
              ₹{formatIndianNumber(breakdown.effectiveRatePerSqft)}
            </strong>
            /sq ft
          </span>
          <span>•</span>
          <span>
            Built-up:{' '}
            <strong className="font-medium text-white">
              {formatIndianNumber(estimate.areaSqft)} sq ft
            </strong>{' '}
            ({estimate.floors} Floor{estimate.floors > 1 ? 's' : ''})
          </span>
          <span>•</span>
          <span>
            {estimate.cityName} ({estimate.materialGrade.toUpperCase()} grade)
          </span>
        </div>
      </div>

      {/* 3 Metric Cards side-by-side: Base Cost, GST + Wastage, Total (Total in accent color, others neutral) */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            id="metric-base-cost"
            label="1. Base Construction"
            value={formatCurrency(breakdown.baseCost + breakdown.soilSurcharge)}
            compactValue={formatCompactINR(breakdown.baseCost + breakdown.soilSurcharge)}
            sublabel="Turnkey civil, MEP & foundation"
          />

          <MetricCard
            id="metric-gst-wastage"
            label="2. GST (18%) + Wastage"
            value={formatCurrency(gstAndWastage)}
            compactValue={formatCompactINR(gstAndWastage)}
            sublabel={`Wastage ₹${formatCompactINR(breakdown.wastageCost)} + GST ₹${formatCompactINR(breakdown.gstCost)}`}
          />

          <MetricCard
            id="metric-total-cost"
            label="3. Total Estimate"
            value={formatCurrency(estimate.estimatedCost)}
            compactValue={formatCompactINR(estimate.estimatedCost)}
            sublabel="All-inclusive turnkey budget"
            isAccent={true}
          />
        </div>

        {/* Directly beneath the breakdown: model version and "rates last updated [date]" in small muted text */}
        <div
          id="staleness-metadata-bar"
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#111114] border border-[#24242c] text-[11px] text-neutral-400 font-normal"
        >
          <div className="flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-neutral-500" />
            <span>
              Rates last updated:{' '}
              <strong className="font-medium text-neutral-200">
                {estimate.ratesLastUpdated}
              </strong>{' '}
              (CPWD schedule)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenModelInfo}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
            >
              <Cpu className="w-3 h-3" />
              <span>Model {estimate.modelVersion}</span>
              <span className="text-neutral-500 font-mono">
                (MAE: ±₹{formatIndianNumber(estimate.evalScores.maeScore)})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Line-Item Breakdown */}
      <div className="border border-[#272730] rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDetailedRows(!showDetailedRows)}
          className="w-full flex items-center justify-between p-3.5 bg-[#191920] hover:bg-[#202028] text-left text-xs font-normal text-neutral-300 transition-colors cursor-pointer"
        >
          <span className="font-medium text-white">Detailed Itemized Cost Breakdown</span>
          <div className="flex items-center gap-1 text-neutral-400 font-normal text-[11px]">
            <span>{showDetailedRows ? 'Collapse' : 'Expand'}</span>
            {showDetailedRows ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {showDetailedRows && (
          <div className="p-4 bg-[#131317] text-xs space-y-3 divide-y divide-[#22222a]">
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="font-medium text-neutral-200">Civil & Structural Core (62%)</div>
                <div className="text-[11px] text-neutral-400 font-normal">
                  Excavation, footings, RCC columns, beams, slabs, masonry
                </div>
              </div>
              <span className="font-medium text-white">
                {formatCurrency(breakdown.structureAndCivil)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-medium text-neutral-200">Finishes, Joinery & MEP (38%)</div>
                <div className="text-[11px] text-neutral-400 font-normal">
                  Plastering, vitrified flooring, electrical wiring, plumbing, paint
                </div>
              </div>
              <span className="font-medium text-white">
                {formatCurrency(breakdown.finishingAndMep)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-medium text-neutral-200 flex items-center gap-1.5">
                  <span>Soil Foundation Differential</span>
                  {breakdown.soilSurchargePercent > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      +{breakdown.soilSurchargePercent}%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400 font-normal">
                  {breakdown.soilSurchargePercent > 0
                    ? `Geotechnical stabilization for ${estimate.soilType.replace('_', ' ')}`
                    : 'Standard isolated footing on normal bearing soil'}
                </div>
              </div>
              <span className="font-medium text-white">
                {breakdown.soilSurcharge > 0
                  ? `+${formatCurrency(breakdown.soilSurcharge)}`
                  : '₹0 (Standard)'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-medium text-neutral-200">
                  Cutting & Handling Wastage ({breakdown.wastagePercent}%)
                </div>
                <div className="text-[11px] text-neutral-400 font-normal">
                  Steel rebar lap wastage, cement transit loss, tile cuts
                </div>
              </div>
              <span className="font-medium text-white">
                +{formatCurrency(breakdown.wastageCost)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-medium text-neutral-200">
                  Works Contract GST ({breakdown.gstRatePercent}%)
                </div>
                <div className="text-[11px] text-neutral-400 font-normal">
                  Statutory composite works contract tax
                </div>
              </div>
              <span className="font-medium text-white">
                +{formatCurrency(breakdown.gstCost)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2.5 text-sm">
              <span className="font-normal text-neutral-300">Grand Total</span>
              <span className="text-amber-400 font-medium text-base">
                {formatCurrency(estimate.estimatedCost)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Toolbar: WhatsApp Share + Save Estimate + PDF Export */}
      <div className="space-y-3 pt-1 border-t border-[#26262e]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-normal text-neutral-400">Actions & Reports</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="save-estimate-btn"
              onClick={handleSaveEstimate}
              disabled={isSaving}
              className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-normal transition-colors cursor-pointer ${
                savedSuccess
                  ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400'
                  : 'border-[#2a2a35] bg-[#1a1a21] hover:bg-[#22222b] text-neutral-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {savedSuccess
                  ? 'Saved to Profile'
                  : user
                  ? 'Save Estimate'
                  : 'Sign In to Save'}
              </span>
            </button>

            <button
              type="button"
              id="pdf-download-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#2a2a35] bg-[#1a1a21] hover:bg-[#22222b] text-neutral-200 text-xs font-normal transition-colors cursor-pointer"
              title="Trigger printer-friendly PDF download of this estimate"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        <ShareButton estimate={estimate} />
      </div>
    </div>
  );
};
