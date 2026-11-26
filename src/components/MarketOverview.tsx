import React, { useState, useMemo } from 'react';
import { ChevronRight, ArrowUpDown, Star } from 'lucide-react';
import {
  MarketCategory,
  MarketSymbol,
  MARKET_SYMBOLS,
  formatMarketPrice,
} from '../data/marketsData';

interface MarketOverviewProps {
  activeTab: MarketCategory;
  onChangeTab: (tab: MarketCategory) => void;
  onSelectSymbol: (symbol: MarketSymbol) => void;
  watchlistIds: string[];
  onToggleWatchlist: (symbolId: string) => void;
}

type SortKey = 'symbol' | 'price' | 'changePct';
type SortDirection = 'asc' | 'desc';

const TABS: { id: MarketCategory; label: string }[] = [
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
];

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  activeTab,
  onChangeTab,
  onSelectSymbol,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const [showAllIndicesCards, setShowAllIndicesCards] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const indicesSymbols = useMemo(
    () => MARKET_SYMBOLS.filter((s) => s.category === 'indices'),
    []
  );

  const displayedIndicesCards = showAllIndicesCards
    ? indicesSymbols
    : indicesSymbols.slice(0, 1);

  const tableRows = useMemo(() => {
    const filtered = MARKET_SYMBOLS.filter((s) => s.category === activeTab);
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortKey === 'price') {
        comparison = a.price - b.price;
      } else if (sortKey === 'changePct') {
        comparison = a.changePct - b.changePct;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [activeTab, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'desc') {
        setSortDir('asc');
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const columnHeaders = useMemo(() => {
    switch (activeTab) {
      case 'indices':
        return { first: 'Symbol', second: 'Price', third: 'Change %', fourth: 'Volume / Cap' };
      case 'stocks':
        return { first: 'Symbol', second: 'Price', third: 'Change %', fourth: 'Market Cap' };
      case 'crypto':
        return { first: 'Symbol', second: 'Price', third: '24h Change %', fourth: 'Market Cap' };
      case 'forex':
        return { first: 'Pair', second: 'Bid', third: 'Change %', fourth: '24h Range' };
    }
  }, [activeTab]);

  return (
    <main className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Indices Section */}
      <section aria-labelledby="indices-heading">
        <div className="flex items-center gap-1.5 mb-4">
          <button
            type="button"
            onClick={() => setShowAllIndicesCards((prev) => !prev)}
            className="inline-flex items-center gap-1.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2962FF] rounded-lg"
          >
            <h1 className="text-[26px] font-bold text-[#131722] tracking-tight" id="indices-heading">
              Indices
            </h1>
            <ChevronRight
              className={`w-5 h-5 text-[#131722] mt-0.5 transition-transform duration-200 ${
                showAllIndicesCards ? 'rotate-90' : 'group-hover:translate-x-0.5'
              }`}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* Indices Cards Row */}
        <div className="flex flex-wrap items-center gap-4">
          {displayedIndicesCards.map((indexItem) => (
            <button
              key={indexItem.id}
              type="button"
              onClick={() => onSelectSymbol(indexItem)}
              className="flex items-center gap-3 bg-[#e8eaed] hover:bg-[#dfe2e7] transition-colors rounded-2xl px-4 py-3 min-w-[200px] text-left cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-full text-white flex items-center justify-center text-[11px] font-bold tracking-tight shrink-0"
                style={{ backgroundColor: indexItem.badgeBg }}
              >
                {indexItem.badgeText}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#131722] leading-snug">
                  {indexItem.tickerLabel}
                </div>
                {showAllIndicesCards && (
                  <div className="text-[12px] font-medium text-[#787B86] tabular-nums">
                    {formatMarketPrice(indexItem)}{' '}
                    <span className={indexItem.changePct >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>
                      {indexItem.changePct >= 0 ? '+' : ''}
                      {indexItem.changePct.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Market Overview Section */}
      <section aria-labelledby="market-overview-heading" className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-[22px] font-bold text-[#131722] tracking-tight" id="market-overview-heading">
            Market Overview
          </h2>

          {/* Category Tabs */}
          <div
            className="inline-flex items-center bg-[#e8eaed] p-1 rounded-xl self-start sm:self-auto"
            role="tablist"
            aria-label="Market categories"
          >
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChangeTab(tab.id);
                    setSortKey(null);
                  }}
                  className={`px-4 py-1.5 text-[13px] rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'font-semibold bg-white text-[#131722] shadow-sm'
                      : 'font-medium text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200/80 text-[12px] font-medium text-[#787B86] uppercase tracking-wider bg-gray-50/60">
                  <th className="py-3 px-5">
                    <button
                      type="button"
                      onClick={() => handleSort('symbol')}
                      className="inline-flex items-center gap-1 hover:text-[#131722] transition-colors cursor-pointer uppercase"
                    >
                      <span>{columnHeaders.first}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortKey === 'symbol' ? 'text-[#2962FF]' : 'opacity-50'}`} />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('price')}
                      className="inline-flex items-center justify-end gap-1 hover:text-[#131722] transition-colors cursor-pointer uppercase"
                    >
                      <span>{columnHeaders.second}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortKey === 'price' ? 'text-[#2962FF]' : 'opacity-50'}`} />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('changePct')}
                      className="inline-flex items-center justify-end gap-1 hover:text-[#131722] transition-colors cursor-pointer uppercase"
                    >
                      <span>{columnHeaders.third}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortKey === 'changePct' ? 'text-[#2962FF]' : 'opacity-50'}`} />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">{columnHeaders.fourth}</th>
                  <th className="py-3 px-5 text-right">7D Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {tableRows.map((row) => {
                  const isPositive = row.changePct >= 0;
                  const isStarred = watchlistIds.includes(row.id);

                  return (
                    <tr
                      key={row.id}
                      onClick={() => onSelectSymbol(row)}
                      className="hover:bg-[#f0f3fa]/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: row.badgeBg,
                              color: row.badgeTextColor ?? '#ffffff',
                            }}
                          >
                            {row.badgeText}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#131722]">{row.symbol}</span>
                              <button
                                type="button"
                                aria-label={isStarred ? `Remove ${row.symbol} from watchlist` : `Add ${row.symbol} to watchlist`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWatchlist(row.id);
                                }}
                                className={`p-0.5 rounded transition-opacity cursor-pointer ${
                                  isStarred
                                    ? 'opacity-100 text-amber-500'
                                    : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-amber-500'
                                }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-500' : ''}`} />
                              </button>
                            </div>
                            <div className="text-[12px] text-[#787B86]">{row.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-[#131722] tabular-nums">
                        {formatMarketPrice(row)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {row.changePct.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-right text-[#787B86] hidden md:table-cell tabular-nums">
                        {row.volumeOrCap}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <svg className="inline-block w-20 h-6" viewBox="0 0 80 24" aria-hidden="true">
                          <polyline
                            fill="none"
                            points={row.sparklinePoints}
                            stroke={isPositive ? '#089981' : '#f23645'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};
