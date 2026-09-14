import React from 'react';

interface FooterProps {
  onOpenFaq: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFaq, onOpenPrivacy }) => {
  return (
    <footer className="border-t border-[#1e1e26] bg-[#0d0d0f] py-6 px-4 sm:px-6 mt-16 text-xs text-neutral-500 font-normal">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span>BuildCalc • Construction cost estimator for Indian cities</span>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <button
            type="button"
            id="footer-faq-link"
            onClick={onOpenFaq}
            className="text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <span className="text-neutral-700">•</span>
          <button
            type="button"
            id="footer-privacy-link"
            onClick={onOpenPrivacy}
            className="text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            Privacy Note
          </button>
        </div>
      </div>
    </footer>
  );
};
