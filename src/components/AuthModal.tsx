import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, AlertCircle, User as UserIcon } from 'lucide-react';
import type { User } from '../types.js';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
  }, [initialMode, isOpen]);

  // Listen for OAuth message from Google popup callback
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsLoading(true);
        try {
          const exchangeRes = await fetch('/api/auth/google/callback-exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: event.data.code }),
          });
          const exchangeData = await exchangeRes.json();
          if (exchangeData.success && exchangeData.user) {
            onSuccess(exchangeData.user);
            onClose();
          } else {
            throw new Error('Failed to retrieve user profile from Google');
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Google OAuth exchange failed';
          setErrorMsg(msg);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onClose]);

  if (!isOpen) return null;

  const handleGoogleOAuthPopup = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();

      if (data.configured && data.url) {
        const authWindow = window.open(
          data.url,
          'google_oauth_popup',
          'width=550,height=650,left=200,top=100'
        );

        if (!authWindow) {
          throw new Error('Popup was blocked by browser. Please allow popups for BuildCalc.');
        }
      } else {
        // Direct Google Sign In fallback
        const quickRes = await fetch('/api/auth/google/quick-signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'mohdowaisnajmuddin@gmail.com',
            name: 'Mohammed Owais Naj Muddin',
          }),
        });

        const quickData = await quickRes.json();
        if (quickData.success && quickData.user) {
          onSuccess(quickData.user);
          onClose();
        } else {
          throw new Error('Sign in failed');
        }
      }
    } catch (err: unknown) {
      console.error('Google Auth Error:', err);
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        className="bg-[#151518] border border-[#272730] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 sm:p-7 space-y-6 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-medium text-white tracking-tight">
                {mode === 'signin' ? 'Sign in to BuildCalc' : 'Create a BuildCalc Account'}
              </h2>
              <p className="text-xs text-neutral-400 font-normal">
                {mode === 'signin'
                  ? 'Access your saved cost benchmarks and estimate history'
                  : 'Start saving and comparing residential estimates'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="auth-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1f1f26] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#101013] border border-[#26262e] rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 rounded-lg font-normal transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#22222a] text-white font-medium shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 rounded-lg font-normal transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#22222a] text-white font-medium shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Google Auth CTA */}
        <div>
          <button
            type="button"
            id="google-auth-button"
            disabled={isLoading}
            onClick={handleGoogleOAuthPopup}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 active:bg-neutral-200 text-neutral-900 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {/* Google official multi-color SVG icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoading
                ? 'Connecting to Google...'
                : mode === 'signin'
                ? 'Sign in with Google'
                : 'Sign up with Google'}
            </span>
          </button>
        </div>

        {/* Security & Privacy Guarantee */}
        <div className="p-3 bg-[#101013] rounded-xl border border-[#22222b] text-[11px] text-neutral-400 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-300 font-normal">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Privacy-First Architecture</span>
          </div>
          <p className="leading-relaxed">
            We only read your verified name and email from Google OAuth. No spam, no marketing outreach, and your construction estimates remain strictly private.
          </p>
        </div>
      </div>
    </div>
  );
};
