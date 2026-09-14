import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="privacy-modal-container"
        className="bg-[#151518] border border-[#272730] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4 text-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#272730] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-medium text-white">Privacy Note</h3>
          </div>
          <button
            type="button"
            id="privacy-modal-close"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202028] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-neutral-400 font-normal">
          <p>
            <strong className="text-white font-medium">Zero Telemetry & Tracking:</strong> BuildCalc does not track your IP, sell lead data to real estate agents, or distribute numbers to contractors.
          </p>
          <p>
            <strong className="text-white font-medium">WhatsApp Sharing:</strong> Phone numbers entered for direct WhatsApp links are processed entirely on your local browser. They are never sent to or logged on any remote server.
          </p>
          <p>
            <strong className="text-white font-medium">Google Sign-in:</strong> When signing in with Google, we only request basic profile identity (name, email) to let you save your cost calculations.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#202028] hover:bg-[#2a2a34] text-white rounded-xl text-xs font-normal transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
