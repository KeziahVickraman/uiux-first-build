import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { MARKET_SYMBOLS, MarketSymbol, MarketCategory, formatMarketPrice } from '../data/marketsData';

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onSelectCategory: (cat: MarketCategory) => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MarketCategory>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARKET_SYMBOLS.filter((item) => {
      const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesQuery =
        !q ||
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.tickerLabel.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, categoryFilter]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Symbol Search"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-[2px] cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[600px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="w-4 h-4 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, or pair (e.g. SPX, AAPL, BTC)..."
            className="w-full text-[14px] text-[#131722] placeholder-gray-400 bg-transparent border-none focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#131722] rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'indices', 'stocks', 'crypto', 'forex'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-[12px] font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-white text-[#131722] shadow-sm border border-gray-200/70'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {results.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-[14px] font-semibold text-[#131722]">No matching symbols</p>
              <p className="text-[12px] text-[#787B86] mt-1">
                Try searching for SPX, NDX, AAPL, NVDA, BTCUSD, or EURUSD.
              </p>
            </div>
          ) : (
            results.map((item) => {
              const isPositive = item.changePct >= 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (
                      item.category === 'indices' ||
                      item.category === 'stocks' ||
                      item.category === 'crypto' ||
                      item.category === 'forex'
                    ) {
                      onSelectCategory(item.category);
                    }
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#f0f3fa]/70 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: item.badgeBg,
                        color: item.badgeTextColor ?? '#ffffff',
                      }}
                    >
                      {item.badgeText}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-[#131722]">{item.symbol}</span>
                        <span className="text-[11px] text-[#787B86] capitalize">· {item.category}</span>
                      </div>
                      <div className="text-[12px] text-[#787B86] truncate">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-[13px] font-semibold text-[#131722] tabular-nums">
                      {formatMarketPrice(item)}
                    </div>
                    <div
                      className={`text-[12px] font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePct.toFixed(2)}%
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
