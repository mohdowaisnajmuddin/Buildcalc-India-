import React, { useState, useRef, useEffect } from 'react';
import { Building2, LogOut, User as UserIcon, CheckCircle2, ChevronDown } from 'lucide-react';
import type { User } from '../types.js';

interface NavbarProps {
  activeTab: 'estimate' | 'faq';
  onSelectTab: (tab: 'estimate' | 'faq') => void;
  user: User | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  user,
  onOpenAuth,
  onSignOut,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-[#22222a] bg-[#0d0d0f]/95 backdrop-blur-xs sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Minimal Nav Links (No hamburger menu needed for a two-page app) */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onSelectTab('estimate')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-medium text-white tracking-tight">
                BuildCalc
              </span>
              <span className="text-[10px] font-normal text-amber-400/90 font-mono">
                v2.1
              </span>
            </div>
          </button>

          {/* Minimal Top Nav: Estimate (primary), FAQ */}
          <nav className="flex items-center gap-1">
            <button
              type="button"
              id="nav-estimate-tab"
              onClick={() => onSelectTab('estimate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                activeTab === 'estimate'
                  ? 'bg-[#1a1a21] text-amber-400 font-medium border border-[#2d2d38]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Estimate
            </button>
            <button
              type="button"
              id="nav-faq-tab"
              onClick={() => onSelectTab('faq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-[#1a1a21] text-amber-400 font-medium border border-[#2d2d38]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              FAQ
            </button>
          </nav>
        </div>

        {/* Right Nav: Google Sign In / Sign Up or Authenticated User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                id="user-profile-menu-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-[#16161b] hover:bg-[#1f1f26] border border-[#272730] text-xs font-normal text-neutral-200 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-medium text-[11px] overflow-hidden border border-amber-500/40">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline font-normal text-white max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#16161b] border border-[#272730] rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#26262e]">
                    <p className="font-medium text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected with Google</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      id="sign-out-btn"
                      onClick={() => {
                        onSignOut();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-[#202028] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="header-signin-btn"
                onClick={() => onOpenAuth('signin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a2a34] bg-[#141418] hover:bg-[#1d1d24] text-xs font-normal text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {/* Google G mini icon */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                <span>Sign In</span>
              </button>

              <button
                type="button"
                id="header-signup-btn"
                onClick={() => onOpenAuth('signup')}
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
