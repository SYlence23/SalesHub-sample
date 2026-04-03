import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function Profile() {
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(['Food', 'Entertainment']);

  const toggleCategory = (cat: string) => {
    setFavoriteCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border border-white">
        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-slate-100">
          <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary-400 to-amber-500 shadow-lg shadow-orange-200 flex items-center justify-center text-white text-3xl font-bold">
            U
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
            <p className="text-slate-500">Manage your deals & preferences</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Heart size={20} className="mr-2 text-red-500" /> Favorite Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {['Food', 'Entertainment', 'Electronics', 'Fashion', 'Health'].map(cat => (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
                  favoriteCategories.includes(cat) 
                    ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500 ring-offset-2' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4">Selected categories will be prioritized in your feed.</p>
        </div>
        
      </div>
    </div>
  );
}
