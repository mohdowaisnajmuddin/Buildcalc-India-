import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Phone } from 'lucide-react';
import type { EstimateResponse } from '../types.js';
import { generateWhatsAppShareUrl } from '../utils/formatters.js';

interface ShareButtonProps {
  estimate: EstimateResponse;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ estimate }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDirectPhone, setShowDirectPhone] = useState(false);

  const handleWhatsAppShare = () => {
    const url = generateWhatsAppShareUrl(estimate, phoneNumber);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    try {
      const url = generateWhatsAppShareUrl(estimate, '');
      const rawText = decodeURIComponent(url.split('text=')[1] || '');
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div id="share-action-section" className="space-y-3 pt-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          id="whatsapp-share-btn"
          type="button"
          onClick={handleWhatsAppShare}
          className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1d1d25] hover:bg-[#252530] border border-[#2e2e3a] text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Share via WhatsApp</span>
        </button>

        <button
          id="copy-breakdown-btn"
          type="button"
          onClick={handleCopyText}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-[#272730] bg-[#16161b] hover:bg-[#202027] text-neutral-300 text-xs font-normal transition-colors cursor-pointer"
          title="Copy breakdown text"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>Copy Text</span>
            </>
          )}
        </button>

        <button
          id="toggle-phone-btn"
          type="button"
          onClick={() => setShowDirectPhone(!showDirectPhone)}
          className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[#272730] bg-[#16161b] hover:bg-[#202027] text-neutral-400 text-xs transition-colors cursor-pointer"
          title="Send directly to a WhatsApp number"
        >
          <Phone className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>

      {showDirectPhone && (
        <div className="p-3 bg-[#111114] rounded-xl border border-[#26262e] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300 font-normal">Direct WhatsApp Recipient (Optional)</span>
            <span className="text-[10px] text-neutral-500">Not saved to server</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">+91</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-3 py-1.5 bg-[#18181f] border border-[#2c2c36] rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
