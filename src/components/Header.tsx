import React, { useState, useRef, useEffect } from 'react';
import { Globe, User, Search, Check, Star, X } from 'lucide-react';
import { LANGUAGES, MarketSymbol, formatMarketPrice } from '../data/marketsData';

export type NavSection = 'Products' | 'Community' | 'Markets' | 'Brokers' | 'More';

interface HeaderProps {
  activeNav: NavSection;
  onSelectNav: (section: NavSection) => void;
  onOpenSearch: () => void;
  onToggleBlackFriday: () => void;
  language: string;
  onChangeLanguage: (code: string) => void;
  watchlistSymbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onToggleWatchlist: (symbolId: string) => void;
}

const NAV_ITEMS: NavSection[] = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
  onOpenSearch,
  onToggleBlackFriday,
  language,
  onChangeLanguage,
  watchlistSymbols,
  onSelectSymbol,
  onToggleWatchlist,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full h-[60px] bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between gap-4">
        {/* Left: Logo, Search Bar, and Primary Navigation */}
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            aria-label="TradingView Home"
            onClick={() => onSelectNav('Markets')}
            className="flex items-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2962FF] rounded"
          >
            <svg fill="none" height="28" viewBox="0 0 36 28" width="36" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 22H7V11H0V4H14V22ZM28 4H21L15.5 22H22.5L28 4Z" fill="#131722" />
              <circle cx="31.5" cy="7.5" fill="#131722" r="3.5" />
            </svg>
          </button>

          {/* Search Bar Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="relative hidden sm:flex items-center w-[200px] md:w-[220px] h-9 pl-9 pr-4 text-[14px] text-left bg-[#f0f3fa] hover:bg-[#e6eaf5] text-gray-500 rounded-full cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2962FF]/40"
          >
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
            <span className="truncate">Search (Ctrl+K)</span>
          </button>

          {/* Primary Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#131722]">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectNav(item)}
                  className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none focus-visible:underline ${
                    isActive
                      ? 'text-[#2962FF] font-semibold'
                      : 'text-[#131722] hover:text-[#2962FF]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Language Selector, User Icon, and Black Friday Badge */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Mobile Search Button */}
          <button
            type="button"
            aria-label="Search markets"
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-gray-700 hover:text-[#2962FF] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => {
                setLangMenuOpen((prev) => !prev);
                setProfileMenuOpen(false);
              }}
              aria-expanded={langMenuOpen}
              aria-label="Select language"
              className="flex items-center gap-1.5 text-[14px] font-medium text-[#131722] hover:text-[#2962FF] transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-[18px] h-[18px] text-gray-700" strokeWidth={1.6} />
              <span>{language}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 z-40">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#787B86] uppercase tracking-wider">
                  Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onChangeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-[13px] flex items-center justify-between hover:bg-[#f0f3fa] text-[#131722] transition-colors cursor-pointer"
                  >
                    <span>
                      <span className="font-semibold mr-2">{lang.code}</span>
                      <span className="text-[#787B86]">{lang.label}</span>
                    </span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile & Watchlist Icon */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              aria-label="User Account and Watchlist"
              aria-expanded={profileMenuOpen}
              onClick={() => {
                setProfileMenuOpen((prev) => !prev);
                setLangMenuOpen(false);
              }}
              className="relative p-1.5 text-gray-700 hover:text-[#2962FF] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" strokeWidth={1.7} />
              {watchlistSymbols.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#2962FF] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {watchlistSymbols.length}
                </span>
              )}
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-40">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-[#131722]">Market Watchlist</div>
                    <div className="text-[11px] text-[#787B86]">
                      {watchlistSymbols.length} saved {watchlistSymbols.length === 1 ? 'symbol' : 'symbols'}
                    </div>
                  </div>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>

                {watchlistSymbols.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[12px] text-[#787B86]">
                    Star any symbol in Market Overview to track it here.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {watchlistSymbols.map((sym) => {
                      const isPositive = sym.changePct >= 0;
                      return (
                        <div
                          key={sym.id}
                          className="px-4 py-2.5 flex items-center justify-between hover:bg-[#f0f3fa]/70 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onSelectSymbol(sym);
                              setProfileMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer"
                          >
                            <span
                              className="w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: sym.badgeBg,
                                color: sym.badgeTextColor ?? '#ffffff',
                              }}
                            >
                              {sym.badgeText}
                            </span>
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold text-[#131722] truncate">{sym.symbol}</div>
                              <div className="text-[11px] text-[#787B86] truncate">{sym.name}</div>
                            </div>
                          </button>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <div className="text-right">
                              <div className="text-[12px] font-semibold text-[#131722] tabular-nums">
                                {formatMarketPrice(sym)}
                              </div>
                              <div
                                className={`text-[11px] font-semibold tabular-nums ${
                                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                                }`}
                              >
                                {isPositive ? '+' : ''}
                                {sym.changePct.toFixed(2)}%
                              </div>
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove ${sym.symbol} from watchlist`}
                              onClick={() => onToggleWatchlist(sym.id)}
                              className="p-1 text-gray-400 hover:text-[#f23645] rounded cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Black Friday Promo Badge Button */}
          <button
            type="button"
            onClick={onToggleBlackFriday}
            className="nav-badge-gradient text-white px-3.5 py-1 rounded-md text-center leading-tight shadow-sm hover:opacity-95 transition-opacity cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span className="block text-[12px] font-bold tracking-tight">Black Friday</span>
            <span className="block text-[10px] font-medium opacity-95">Up to 80% OFF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
