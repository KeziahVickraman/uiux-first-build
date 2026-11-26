import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Check } from 'lucide-react';
import { BLACK_FRIDAY_PLANS } from '../data/marketsData';

interface BlackFridayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlackFridayModal: React.FC<BlackFridayModalProps> = ({ isOpen, onClose }) => {
  // Initial countdown: 2d 6h 9m 36s as in Stitch design
  const [totalSeconds, setTotalSeconds] = useState((2 * 86400) + (6 * 3600) + (9 * 60) + 36);
  const [viewMode, setViewMode] = useState<'hero' | 'offers'>('hero');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const days = String(Math.floor(totalSeconds / 86400)).padStart(2, '0');
  const hours = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');

  return (
    <div
      aria-labelledby="bf-modal-title"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cosmic-modal-bg relative w-full max-w-[920px] min-h-[560px] rounded-[20px] overflow-hidden flex flex-col items-center justify-center px-6 py-12 text-center border border-white/10 cursor-default"
      >
        {/* Subtle Accretion Disk Visual Layer */}
        <div className="accretion-ring absolute inset-0 pointer-events-none" />

        {/* Back Button (when viewing plans) */}
        {viewMode === 'offers' && (
          <button
            type="button"
            onClick={() => {
              setViewMode('hero');
              setSelectedPlanId(null);
            }}
            className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}

        {/* Close 'X' Button */}
        <button
          type="button"
          aria-label="Close promotion modal"
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <X className="w-6 h-6" strokeWidth={1.8} />
        </button>

        {viewMode === 'hero' ? (
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <h2
              id="bf-modal-title"
              className="bf-title-gradient text-[52px] sm:text-[72px] font-extrabold tracking-tight leading-none mb-5"
            >
              Black Friday
            </h2>

            <p className="text-white text-[28px] sm:text-[36px] font-bold tracking-tight leading-tight mb-2">
              Up to 80% off
            </p>

            <p className="bf-sub-gradient text-[18px] sm:text-[20px] font-bold mb-9">
              +1 free month
            </p>

            <p className="text-white/90 text-[14px] font-medium mb-3.5">
              Sale ends in
            </p>

            {/* Countdown Timer Boxes */}
            <div className="grid grid-cols-4 gap-3 mb-9" data-purpose="countdown-timer">
              <div className="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-xl bg-black/55 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                <span className="text-white text-[20px] sm:text-[22px] font-bold leading-none mb-1 tabular-nums">
                  {days}
                </span>
                <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase">
                  DAYS
                </span>
              </div>
              <div className="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-xl bg-black/55 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                <span className="text-white text-[20px] sm:text-[22px] font-bold leading-none mb-1 tabular-nums">
                  {hours}
                </span>
                <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase">
                  HOURS
                </span>
              </div>
              <div className="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-xl bg-black/55 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                <span className="text-white text-[20px] sm:text-[22px] font-bold leading-none mb-1 tabular-nums">
                  {mins}
                </span>
                <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase">
                  MINS
                </span>
              </div>
              <div className="w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-xl bg-black/55 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center">
                <span className="text-white text-[20px] sm:text-[22px] font-bold leading-none mb-1 tabular-nums">
                  {secs}
                </span>
                <span className="text-gray-400 text-[9px] font-semibold tracking-wider uppercase">
                  SECS
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewMode('offers')}
              className="bf-btn-gradient inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white text-[15px] font-semibold transition-all duration-200 cursor-pointer"
            >
              Explore offers
            </button>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-4xl mx-auto pt-4">
            <h2 className="bf-title-gradient text-[28px] sm:text-[34px] font-extrabold tracking-tight mb-1">
              Black Friday Plans
            </h2>
            <p className="text-gray-300 text-[13px] mb-6">
              Annual billing savings up to 80% off plus 1 bonus month · Sale ends in{' '}
              <span className="text-white font-semibold tabular-nums">
                {days}d {hours}h {mins}m {secs}s
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {BLACK_FRIDAY_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-4 flex flex-col justify-between border transition-colors ${
                      plan.featured
                        ? 'bg-white/10 border-[#ff5e2b]/60'
                        : 'bg-black/50 border-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-bold bf-sub-gradient mb-1">
                        {plan.discount}
                      </div>
                      <div className="text-white text-[18px] font-bold">{plan.name}</div>
                      <div className="text-gray-400 text-[12px] mb-3">{plan.tagline}</div>
                      <div className="mb-3">
                        <span className="text-white text-[22px] font-extrabold tabular-nums">
                          {plan.salePrice}
                        </span>
                        <span className="text-gray-400 text-[12px] line-through ml-2 tabular-nums">
                          {plan.originalPrice}
                        </span>
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {plan.highlights.map((feat) => (
                          <li key={feat} className="flex items-start gap-1.5 text-[12px] text-gray-300">
                            <Check className="w-3.5 h-3.5 text-[#ff7b00] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full py-2 px-3 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#089981] text-white'
                          : plan.featured
                          ? 'bf-btn-gradient text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Choose plan'}
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedPlanId && (
              <div className="mt-5 text-[13px] text-emerald-300 font-medium">
                {BLACK_FRIDAY_PLANS.find((p) => p.id === selectedPlanId)?.name} Black Friday offer locked in.{' '}
                <button
                  type="button"
                  onClick={onClose}
                  className="underline text-white hover:text-[#ff8a00] ml-1 cursor-pointer"
                >
                  Return to Markets
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
