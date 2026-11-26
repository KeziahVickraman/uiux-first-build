import { useState, useEffect, useMemo } from 'react';
import { Header, NavSection } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { MarketOverview } from './components/MarketOverview';
import { BlackFridayModal } from './components/BlackFridayModal';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { SearchCommandModal } from './components/SearchCommandModal';
import { NavSectionView } from './components/NavSectionView';
import { MARKET_SYMBOLS, MarketCategory, MarketSymbol } from './data/marketsData';

const WATCHLIST_STORAGE_KEY = 'tv_markets_watchlist_v1';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavSection>('Markets');
  const [activeMarketTab, setActiveMarketTab] = useState<MarketCategory>('indices');
  const [language, setLanguage] = useState('EN');
  const [isBlackFridayOpen, setIsBlackFridayOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol | null>(null);

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch {
      // ignore storage errors
    }
  }, [watchlistIds]);

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const watchlistSymbols = useMemo(
    () => MARKET_SYMBOLS.filter((s) => watchlistIds.includes(s.id)),
    [watchlistIds]
  );

  const toggleWatchlist = (symbolId: string) => {
    setWatchlistIds((prev) =>
      prev.includes(symbolId) ? prev.filter((id) => id !== symbolId) : [...prev, symbolId]
    );
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#131722] flex flex-col">
      <Header
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleBlackFriday={() => setIsBlackFridayOpen((prev) => !prev)}
        language={language}
        onChangeLanguage={setLanguage}
        watchlistSymbols={watchlistSymbols}
        onSelectSymbol={setSelectedSymbol}
        onToggleWatchlist={toggleWatchlist}
      />

      <TickerBar onSelectSymbol={setSelectedSymbol} />

      {activeNav === 'Markets' ? (
        <MarketOverview
          activeTab={activeMarketTab}
          onChangeTab={setActiveMarketTab}
          onSelectSymbol={setSelectedSymbol}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      ) : (
        <NavSectionView
          section={activeNav}
          onReturnToMarkets={(category) => {
            if (category) {
              setActiveMarketTab(category);
            }
            setActiveNav('Markets');
          }}
          onOpenBlackFriday={() => setIsBlackFridayOpen(true)}
        />
      )}

      <BlackFridayModal
        isOpen={isBlackFridayOpen}
        onClose={() => setIsBlackFridayOpen(false)}
      />

      <SymbolDetailModal
        symbol={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
        isStarred={selectedSymbol ? watchlistIds.includes(selectedSymbol.id) : false}
        onToggleWatchlist={toggleWatchlist}
      />

      <SearchCommandModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={setSelectedSymbol}
        onSelectCategory={(cat) => {
          setActiveMarketTab(cat);
          setActiveNav('Markets');
        }}
      />
    </div>
  );
}
