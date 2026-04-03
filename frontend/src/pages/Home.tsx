
import { useState, useEffect } from 'react';
import { Search, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DiscountCard, { type DiscountItem } from '../components/DiscountCard';
import { getDiscounts } from '../api';

export default function Home() {
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getDiscounts().then(setDiscounts);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/list?q=${search}`);
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-50 to-orange-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm animate-slide-up">
            <Ticket className="text-primary-500 w-5 h-5" />
            <span className="font-semibold text-slate-700">
              <span className="text-primary-600 font-bold">{discounts.length}</span> Active Deals in Lviv
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Find the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-800">Local Deals</span> instantly
          </h1>

          <p className="text-lg text-slate-600 animate-slide-up max-w-xl mx-auto" style={{ animationDelay: '200ms' }}>
            Discover exclusive discounts for food, entertainment, and shopping scattered around the beautiful city of Lviv.
          </p>

          <form onSubmit={handleSearch} className="animate-slide-up relative max-w-xl mx-auto" style={{ animationDelay: '300ms' }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-32 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-lg shadow-slate-200/50"
                placeholder="What are you looking for?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  type="submit"
                  className="interactive-button primary-gradient px-6 py-2"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Recommended Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="flex justify-center space-x-4 mb-4 overflow-x-auto py-2">
          {["Food", "Entertainment", "Electronics"].map(cat => (
            <button key={cat} onClick={() => navigate(`/list?category=${cat}`)} className="glass-card px-6 py-3 whitespace-nowrap font-medium text-slate-700 hover:text-primary-600">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Recents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Recently Added</h2>
          <button onClick={() => navigate('/list')} className="text-primary-600 font-medium hover:text-primary-800 flex items-center">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {discounts.map(d => (
            <DiscountCard key={d.id} discount={d} />
          ))}
        </div>
      </section>
    </div>
  );
}
