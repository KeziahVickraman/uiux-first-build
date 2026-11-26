import React from 'react';
import { TICKER_ITEMS, MARKET_SYMBOLS, MarketSymbol } from '../data/marketsData';

interface TickerBarProps {
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ onSelectSymbol }) => {
  const handleTickerClick = (symbolId: string) => {
    const match = MARKET_SYMBOLS.find((s) => s.id === symbolId);
    if (match) {
      onSelectSymbol(match);
    }
  };

  const renderSet = (isDuplicate: boolean) => (
    <div aria-hidden={isDuplicate} className="flex items-center shrink-0">
      {TICKER_ITEMS.map((item) => {
        const isPositive = item.changePct >= 0;
        return (
          <button
            key={`${isDuplicate ? 'dup' : 'main'}-${item.id}`}
            type="button"
            tabIndex={isDuplicate ? -1 : 0}
            onClick={() => handleTickerClick(item.symbolId)}
            className="flex items-center gap-2.5 px-5 border-r border-gray-200/80 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span
              className={`w-5 h-5 rounded-full text-white font-bold flex items-center justify-center shrink-0 ${
                item.badgeSizeClass ?? 'text-[9px]'
              }`}
              style={{ backgroundColor: item.badgeBg }}
            >
              {item.badgeText}
            </span>
            <span className="text-[13px] font-semibold text-[#131722]">{item.label}</span>
            <span className="text-[13px] font-medium text-[#131722] tabular-nums">{item.price}</span>
            <span
              className={`text-[12px] font-semibold px-1.5 py-0.5 rounded tabular-nums ${
                isPositive
                  ? 'text-[#089981] bg-[#089981]/10'
                  : 'text-[#f23645] bg-[#f23645]/10'
              }`}
            >
              {isPositive ? '+' : ''}
              {item.changePct.toFixed(2)}%
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className="w-full bg-white border-b border-gray-200/90 overflow-hidden ticker-container"
      data-purpose="market-ticker-bar"
    >
      <div className="ticker-track py-2.5">
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </div>
  );
};
