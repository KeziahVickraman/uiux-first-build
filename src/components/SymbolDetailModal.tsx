import React, { useState, useMemo, useEffect } from 'react';
import { X, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketSymbol, formatMarketPrice } from '../data/marketsData';

interface SymbolDetailModalProps {
  symbol: MarketSymbol | null;
  onClose: () => void;
  isStarred: boolean;
  onToggleWatchlist: (symbolId: string) => void;
}

type Timeframe = '1D' | '7D' | '1M' | '1Y';

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  symbol,
  onClose,
  isStarred,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && symbol) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [symbol, onClose]);

  useEffect(() => {
    setHoverIdx(null);
    setTimeframe('7D');
  }, [symbol?.id]);

  const chartData = useMemo(() => {
    if (!symbol) return [];
    const base = symbol.series7D;
    if (timeframe === '7D') return base;
    if (timeframe === '1D') {
      const last = base[base.length - 1];
      const prev = base[base.length - 2];
      const diff = last - prev;
      return [
        prev,
        prev + diff * 0.25,
        prev + diff * 0.15,
        prev + diff * 0.45,
        prev + diff * 0.65,
        prev + diff * 0.8,
        last,
      ];
    }
    if (timeframe === '1M') {
      return base.map((v, i) => Number((v * (0.965 + i * 0.0058)).toFixed(symbol.decimals)));
    }
    return base.map((v, i) => Number((v * (0.84 + i * 0.026)).toFixed(symbol.decimals)));
  }, [symbol, timeframe]);

  if (!symbol) return null;

  const isPositive = symbol.changePct >= 0;
  const strokeColor = isPositive ? '#089981' : '#f23645';

  const minVal = Math.min(...chartData);
  const maxVal = Math.max(...chartData);
  const range = maxVal - minVal || 1;

  const width = 560;
  const height = 180;
  const padX = 12;
  const padY = 16;

  const points = chartData.map((val, idx) => {
    const x = padX + (idx / (chartData.length - 1)) * (width - padX * 2);
    const y = height - padY - ((val - minVal) / range) * (height - padY * 2);
    return { x, y, val };
  });

  const polylineStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaStr = `${padX},${height} ${polylineStr} ${width - padX},${height}`;

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];
  const displayPrice = activePoint
    ? `${symbol.pricePrefix ?? ''}${activePoint.val.toLocaleString('en-US', {
        minimumFractionDigits: symbol.decimals,
        maximumFractionDigits: symbol.decimals,
      })}`
    : formatMarketPrice(symbol);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="symbol-detail-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              className="w-10 h-10 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0"
              style={{
                backgroundColor: symbol.badgeBg,
                color: symbol.badgeTextColor ?? '#ffffff',
              }}
            >
              {symbol.badgeText}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="symbol-detail-title" className="text-[18px] font-bold text-[#131722]">
                  {symbol.symbol}
                </h2>
                <span className="text-[12px] font-medium text-[#787B86]">{symbol.exchange}</span>
              </div>
              <p className="text-[13px] text-[#787B86]">{symbol.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWatchlist(symbol.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer ${
                isStarred
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-gray-50 border-gray-200 text-[#131722] hover:bg-gray-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isStarred ? 'Watching' : 'Watchlist'}</span>
            </button>
            <button
              type="button"
              aria-label="Close symbol details"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-[#131722] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price + Timeframe Row */}
        <div className="px-6 pt-5 pb-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[28px] font-bold text-[#131722] tabular-nums leading-tight">
              {displayPrice}
            </div>
            <div
              className={`inline-flex items-center gap-1 text-[13px] font-semibold tabular-nums mt-0.5 ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPositive ? '+' : ''}
                {symbol.changePct.toFixed(2)}%
              </span>
              <span className="text-[#787B86] font-normal ml-1">({timeframe})</span>
            </div>
          </div>

          <div className="inline-flex items-center bg-[#f0f3fa] p-1 rounded-lg">
            {(['1D', '7D', '1M', '1Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-[12px] font-semibold rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-[#131722] shadow-sm'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="px-6 py-2">
          <div className="relative w-full bg-gray-50/70 rounded-xl border border-gray-100 p-3">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-[180px] overflow-visible"
              onMouseLeave={() => setHoverIdx(null)}
            >
              <defs>
                <linearGradient id={`grad-${symbol.id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <polygon fill={`url(#grad-${symbol.id})`} points={areaStr} />
              <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {activePoint && (
                <>
                  <line
                    x1={activePoint.x}
                    y1={8}
                    x2={activePoint.x}
                    y2={height - 4}
                    stroke="#94a3b8"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="5"
                    fill={strokeColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </>
              )}

              {points.map((pt, idx) => (
                <rect
                  key={idx}
                  x={pt.x - (width / points.length) / 2}
                  y={0}
                  width={width / points.length}
                  height={height}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoverIdx(idx)}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Key Stats & Description */}
        <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3">
            <div>
              <div className="text-[11px] font-medium text-[#787B86] uppercase tracking-wider">Open</div>
              <div className="text-[13px] font-semibold text-[#131722] tabular-nums mt-0.5">
                {symbol.openPrice}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#787B86] uppercase tracking-wider">24h High</div>
              <div className="text-[13px] font-semibold text-[#131722] tabular-nums mt-0.5">
                {symbol.high24h}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#787B86] uppercase tracking-wider">24h Low</div>
              <div className="text-[13px] font-semibold text-[#131722] tabular-nums mt-0.5">
                {symbol.low24h}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#787B86] uppercase tracking-wider">
                {symbol.category === 'forex' ? '24h Range' : 'Vol / Cap'}
              </div>
              <div className="text-[13px] font-semibold text-[#131722] tabular-nums mt-0.5">
                {symbol.volumeOrCap}
              </div>
            </div>
          </div>
          <p className="text-[12px] text-[#787B86] leading-relaxed">{symbol.description}</p>
        </div>
      </div>
    </div>
  );
};
