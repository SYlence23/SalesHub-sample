import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DiscountCard, { type DiscountItem } from '../components/DiscountCard';
import { getDiscounts, getCategories } from '../api';

export default function DiscountList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    getCategories().then(setCategories);
    getDiscounts(query).then(setDiscounts);
  }, [query]);

  const filteredDiscounts = activeCategory 
    ? discounts.filter(d => d.category?.name.toLowerCase() === activeCategory.toLowerCase())
    : discounts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Browse Deals</h1>
          <p className="mt-2 text-slate-600">
            {query ? `Search results for "${query}"` : 'All available discounts in the city'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!activeCategory ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            All
          </button>
          {categories.map(c => (
            <button 
              key={c.id} 
              onClick={() => setActiveCategory(c.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory.toLowerCase() === c.name.toLowerCase() ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {filteredDiscounts.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 rounded-3xl border border-dashed border-slate-300">
          <p className="text-xl text-slate-500 mb-2">No deals found.</p>
          <button onClick={() => {setSearchParams({}); setActiveCategory('');}} className="text-primary-600 font-medium hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDiscounts.map(d => (
            <DiscountCard key={d.id} discount={d} />
          ))}
        </div>
      )}
    </div>
  );
}
