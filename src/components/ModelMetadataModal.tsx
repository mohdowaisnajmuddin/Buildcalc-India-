import React, { useEffect, useState } from 'react';
import { X, Cpu, Database, Award, Check } from 'lucide-react';
import type { ModelMetadata } from '../types.js';
import { formatCurrency } from '../utils/formatters.js';

interface ModelMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelMetadataModal: React.FC<ModelMetadataModalProps> = ({ isOpen, onClose }) => {
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/model/metadata')
      .then((res) => res.json())
      .then((data) => {
        setMetadata(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="model-metadata-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="model-metadata-container"
        className="bg-[#151518] border border-[#272730] rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-5 text-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-medium text-white">
              ML Pipeline & Model Evaluation
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202028] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="py-8 text-center text-xs text-neutral-400">
            Fetching latest model evaluation metrics...
          </div>
        )}

        {metadata && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 bg-[#1b1b22] rounded-xl border border-[#272730]">
                <div className="text-neutral-400 font-normal text-[11px]">Model Version</div>
                <div className="text-sm font-medium text-white font-mono mt-0.5">
                  {metadata.versionId}
                </div>
              </div>
              <div className="p-3 bg-[#1b1b22] rounded-xl border border-[#272730]">
                <div className="text-neutral-400 font-normal text-[11px]">Eval MAE</div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {formatCurrency(metadata.maeScore)}
                </div>
              </div>
              <div className="p-3 bg-[#1b1b22] rounded-xl border border-[#272730]">
                <div className="text-neutral-400 font-normal text-[11px]">Eval RMSE</div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {formatCurrency(metadata.rmseScore)}
                </div>
              </div>
              <div className="p-3 bg-[#1b1b22] rounded-xl border border-[#272730]">
                <div className="text-neutral-400 font-normal text-[11px]">Training Points</div>
                <div className="text-sm font-medium text-white mt-0.5">
                  {metadata.sampleSize} rows
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#1b1b22] rounded-xl border border-[#272730] space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-white text-xs">
                <Database className="w-3.5 h-3.5 text-amber-500" />
                <span>Reference Training Sources</span>
              </div>
              <p className="text-neutral-400 leading-relaxed font-normal">
                {metadata.dataSource}
              </p>
            </div>

            <div className="p-4 bg-[#1b1b22] rounded-xl border border-[#272730] space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-white text-xs">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Engine Features & Architectural Tradeoffs</span>
              </div>
              <p className="text-neutral-400 leading-relaxed font-normal">
                {metadata.tradeoffDocumentation}
              </p>
              <div className="pt-2">
                <span className="text-neutral-400 block mb-1">Engine Features Enforced:</span>
                <div className="flex flex-wrap gap-1.5">
                  {metadata.features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#141418] border border-[#2a2a34] font-mono text-[10px] text-neutral-300"
                    >
                      <Check className="w-2.5 h-2.5 text-amber-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-[#272730] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#202028] hover:bg-[#282833] text-white rounded-xl text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
