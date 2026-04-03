import { MapPin, Heart } from 'lucide-react';

export interface DiscountItem {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  latitude: number;
  longitude: number;
  categoryId: number;
  dateAdded: string;
  category?: { name: string; icon: string };
}

interface Props {
  discount: DiscountItem;
  isSaved?: boolean;
  onSave?: (id: number) => void;
}

export default function DiscountCard({ discount, isSaved = false, onSave }: Props) {
  const percentageOff = Math.round((1 - discount.discountPrice / discount.originalPrice) * 100);

  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative h-40 bg-slate-200">
        <div className="absolute top-4 left-4">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {percentageOff}% OFF
          </span>
        </div>
        {onSave && (
          <button
            onClick={(e) => { e.preventDefault(); onSave(discount.id); }}
            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white text-slate-500 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-red-500" : ""} />
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
            {discount.title}
          </h3>
          <span className="badge-category ml-2 shrink-0">
            {discount.category?.name || "Deal"}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {discount.description}
        </p>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 line-through block">₴ {discount.originalPrice}</span>
            <span className="text-2xl font-extrabold text-primary-600">₴ {discount.discountPrice}</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center">
            <MapPin size={14} className="mr-1" />
            Lviv
          </div>
        </div>
      </div>
    </div>
  );
}
