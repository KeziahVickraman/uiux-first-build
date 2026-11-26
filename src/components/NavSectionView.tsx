import React from 'react';
import { ArrowLeft, LineChart, Users, ShieldCheck, Layers } from 'lucide-react';
import { NavSection } from './Header';
import { MarketCategory } from '../data/marketsData';

interface NavSectionViewProps {
  section: Exclude<NavSection, 'Markets'>;
  onReturnToMarkets: (category?: MarketCategory) => void;
  onOpenBlackFriday: () => void;
}

export const NavSectionView: React.FC<NavSectionViewProps> = ({
  section,
  onReturnToMarkets,
  onOpenBlackFriday,
}) => {
  const sectionConfig = {
    Products: {
      icon: LineChart,
      title: 'TradingView Suite & Screeners',
      subtitle: 'Multi-asset charting, real-time market screeners, and server-side price alerts.',
      cards: [
        {
          title: 'Supercharts',
          desc: 'Synchronized multi-pane layouts with 400+ built-in technical indicators and Pine Script.',
          actionLabel: 'Inspect Indices',
          category: 'indices' as MarketCategory,
        },
        {
          title: 'Stock & ETF Screener',
          desc: 'Filter global equities by market cap, volume, valuation ratios, and 7-day trend.',
          actionLabel: 'View Stocks',
          category: 'stocks' as MarketCategory,
        },
        {
          title: 'Crypto & Forex Scanners',
          desc: 'Track 24/7 digital asset momentum and major currency bid/range spreads.',
          actionLabel: 'View Crypto',
          category: 'crypto' as MarketCategory,
        },
      ],
    },
    Community: {
      icon: Users,
      title: 'Market Ideas & Scripts',
      subtitle: 'Explore technical setups and macro notes shared by active market analysts.',
      cards: [
        {
          title: 'S&P 500 Breakout Structure',
          desc: 'SPX holding steady near 5,985.38 (+0.42%) on broad mega-cap breadth.',
          actionLabel: 'Open Indices Table',
          category: 'indices' as MarketCategory,
        },
        {
          title: 'Bitcoin Momentum Watch',
          desc: 'BTC/USD approaching 97,420.00 (+3.15%) with strong spot volume inflow.',
          actionLabel: 'Open Crypto Table',
          category: 'crypto' as MarketCategory,
        },
        {
          title: 'G10 FX Yield Differentials',
          desc: 'EUR/USD trading at 1.0542 (-0.18%) while USD/JPY holds above 151.45.',
          actionLabel: 'Open Forex Table',
          category: 'forex' as MarketCategory,
        },
      ],
    },
    Brokers: {
      icon: ShieldCheck,
      title: 'Integrated Brokers',
      subtitle: 'Trade equities, futures, crypto, and forex directly from your market workspace.',
      cards: [
        {
          title: 'Equities & Options Execution',
          desc: 'Low-latency order routing for US and European equity exchanges.',
          actionLabel: 'Browse Stocks',
          category: 'stocks' as MarketCategory,
        },
        {
          title: 'Spot & Futures Crypto Venues',
          desc: 'Connected liquidity across regulated digital asset exchanges.',
          actionLabel: 'Browse Crypto',
          category: 'crypto' as MarketCategory,
        },
        {
          title: 'Global FX & Metals Liquidity',
          desc: 'Tight institutional spreads on EUR/USD, GBP/USD, USD/JPY, and Gold.',
          actionLabel: 'Browse Forex',
          category: 'forex' as MarketCategory,
        },
      ],
    },
    More: {
      icon: Layers,
      title: 'Workspace Tools & Membership',
      subtitle: 'Economic calendars, heatmaps, and seasonal Black Friday membership offers.',
      cards: [
        {
          title: 'Global Market Overview',
          desc: 'Compare Indices, Stocks, Crypto, and Forex side by side with 7-day sparklines.',
          actionLabel: 'Go to Markets',
          category: 'indices' as MarketCategory,
        },
        {
          title: 'Black Friday Promotion',
          desc: 'Save up to 80% on annual plans plus 1 bonus month for a limited time.',
          actionLabel: 'View Black Friday Offer',
          isPromo: true,
        },
        {
          title: 'Currency & Metals Watch',
          desc: 'Monitor spot Gold alongside major G10 currency pairs in real time.',
          actionLabel: 'Open Forex',
          category: 'forex' as MarketCategory,
        },
      ],
    },
  }[section];

  const Icon = sectionConfig.icon;

  return (
    <main className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => onReturnToMarkets()}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2962FF] hover:underline cursor-pointer mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Markets</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#2962FF]">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-[#131722] tracking-tight">{sectionConfig.title}</h1>
            <p className="text-[14px] text-[#787B86]">{sectionConfig.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sectionConfig.cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col justify-between shadow-sm"
          >
            <div>
              <h2 className="text-[16px] font-bold text-[#131722] mb-2">{card.title}</h2>
              <p className="text-[13px] text-[#787B86] leading-relaxed mb-6">{card.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if ('isPromo' in card && card.isPromo) {
                  onOpenBlackFriday();
                } else if ('category' in card && card.category) {
                  onReturnToMarkets(card.category);
                } else {
                  onReturnToMarkets();
                }
              }}
              className="self-start px-4 py-2 rounded-lg text-[13px] font-semibold bg-[#f0f3fa] hover:bg-[#e6eaf5] text-[#131722] transition-colors cursor-pointer"
            >
              {card.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};
