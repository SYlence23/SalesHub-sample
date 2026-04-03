import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Tag, Calendar, ExternalLink, Store, Clock, ArrowLeft, ChevronRight, User, Timer } from 'lucide-react';
import { getDiscount, getDiscounts } from '../api';
import type { DiscountItem } from '../components/DiscountCard';
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';

export default function OfferDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [discount, setDiscount] = useState<DiscountItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [similarOffers, setSimilarOffers] = useState<DiscountItem[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getDiscount(parseInt(id)).then(data => {
        setDiscount(data);
        setLoading(false);
        // Fetch similar offers from the same category
        if (data) {
          getDiscounts().then(all => {
            const similar = all.filter(d => d.categoryId === data.categoryId && d.id !== data.id);
            setSimilarOffers(similar);
          });
        }
      });
      // Scroll to top when navigating between offers
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  // Live countdown — must be before early returns (React hooks rules)
  const [daysLeft, setDaysLeft] = useState(0);
  const validUntilMs = discount?.validUntil
    ? new Date(discount.validUntil).getTime()
    : discount
      ? Date.now() + 14 * 24 * 60 * 60 * 1000
      : 0;

  useEffect(() => {
    if (!validUntilMs) return;
    const calcTime = () => {
      const diff = validUntilMs - Date.now();
      if (diff <= 0) return 0;
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    };
    setDaysLeft(calcTime());
    const interval = setInterval(() => setDaysLeft(calcTime()), 60000); // Update every minute
    return () => clearInterval(interval);
  }, [validUntilMs]);

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">Loading offer...</div>;
  }

  if (!discount) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Offer not found</h2>
        <button onClick={() => navigate(-1)} className="text-primary-600 hover:underline">Go back</button>
      </div>
    );
  }

  const percentageOff = Math.round((1 - discount.discountPrice / discount.originalPrice) * 100);
  const validUntilDate = discount.validUntil ? new Date(discount.validUntil) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const shopName = discount.shopName || "Local Vendor";
  const shopInfo = discount.shopInfo || "A highly-rated local business in the heart of Lviv providing great deals and quality customer service.";

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/users/save-discount?discountId=${discount.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setIsSaved(!isSaved);
      }
    } catch { }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-primary-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Deals
      </button>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-xl overflow-hidden">

        {/* Top Photo Banner */}
        <div className="relative h-[420px] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            {discount.imageUrl ? (
              <img src={discount.imageUrl} alt={discount.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-primary-400 to-amber-400" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>

          {/* Floating controls on the photo */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
            <button
              onClick={handleSave}
              className="p-3 bg-white/80 rounded-full text-slate-600 hover:text-red-500 transition-colors shadow-lg font-medium flex items-center gap-2 text-sm backdrop-blur-md interactive-button"
            >
              <Heart size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-red-500" : ""} />
              {isSaved ? "Saved" : "Save Deal"}
            </button>
            <span className="bg-primary-500/80 backdrop-blur-md text-white font-black text-lg px-5 py-2 rounded-full shadow-lg border border-primary-400/40">
              {percentageOff}% OFF
            </span>
          </div>

          {/* Title overlay at bottom of photo */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
            <div className="inline-flex items-center w-fit px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold mb-3 uppercase tracking-wide border border-white/30">
              <Tag size={12} className="mr-1" /> {discount.category?.name || "Deal"}
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
              {discount.title}
            </h2>
          </div>
        </div>

        {/* Price Bar */}
        <div className="bg-gradient-to-r from-primary-50 via-amber-50 to-primary-50 px-10 py-6 flex flex-wrap items-center justify-between gap-4 border-y border-primary-100/60">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Original Price</p>
              <p className="text-2xl text-slate-400 line-through font-bold">₴{discount.originalPrice}</p>
            </div>
            <div className="h-10 w-px bg-primary-200/60"></div>
            <div>
              <p className="text-primary-600 text-xs uppercase tracking-wider font-bold mb-1">Discounted Price</p>
              <p className="text-4xl text-slate-900 font-black">₴{discount.discountPrice}</p>
            </div>
            <div className="h-10 w-px bg-primary-200/60"></div>
            <div>
              <p className="text-emerald-600 text-xs uppercase tracking-wider font-bold mb-1">You Save</p>
              <p className="text-2xl text-emerald-600 font-black">₴{discount.originalPrice - discount.discountPrice}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Countdown Timer */}
            <div className="flex items-center gap-3">
              <Timer size={20} className="text-primary-500" />
              <div className="flex gap-2">
                <div className="bg-white rounded-lg px-3 py-1.5 text-center shadow-sm border border-slate-200 min-w-[60px]">
                  <p className="text-lg font-black text-slate-900 leading-none">{daysLeft}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">days left</p>
                </div>
              </div>
            </div>
            <button className="flex items-center justify-center space-x-2 px-8 py-3 rounded-full text-base font-bold interactive-button primary-gradient shadow-lg shadow-primary-500/20">
              <span>Claim Deal Now</span>
              <ExternalLink size={18} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 w-full">

          <div className="flex flex-wrap gap-5 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
            <span className="flex items-center bg-slate-50 px-4 py-2 rounded-lg">
              <Clock size={16} className="mr-2 text-primary-500" />
              <span className="font-medium">Valid until {validUntilDate.toLocaleDateString()}</span>
            </span>
            <span className="flex items-center bg-slate-50 px-4 py-2 rounded-lg">
              <Calendar size={16} className="mr-2 text-slate-400" />
              <span>Added {new Date(discount.dateAdded).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center bg-slate-50 px-4 py-2 rounded-lg">
              <MapPin size={16} className="mr-2 text-slate-400" />
              <span>Lviv, Ukraine</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Description — takes 2 columns */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Offer Description</h4>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {discount.description}
                </p>
              </div>

              {/* Posted By User */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary-400 to-amber-400 flex items-center justify-center text-white shadow-md shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Posted by</p>
                  <p className="font-bold text-slate-900 text-lg truncate">@{discount.postedBy?.username || 'anonymous'}</p>
                  <p className="text-xs text-slate-500">Member since {discount.postedBy?.memberSince || 'Unknown'}</p>
                </div>
                <button className="px-4 py-2 rounded-xl text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors shrink-0">
                  View Profile
                </button>
              </div>
            </div>

            {/* Shop Info — takes 1 column */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-400"></div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center uppercase tracking-wider">
                <Store size={18} className="mr-2 text-primary-500" />
                Shop Info
              </h4>
              <p className="font-bold text-lg text-slate-800 mb-1">{shopName}</p>
              <p className="text-slate-600 text-sm mb-4">
                {shopInfo}
              </p>
              <div className="flex items-center text-sm text-slate-500 font-medium bg-white w-fit px-3 py-2 rounded-lg border border-slate-200 mb-4">
                <MapPin size={16} className="mr-2 text-slate-400" />
                Lviv Center
              </div>
              <button
                onClick={() => navigate(`/map?lat=${discount.latitude}&lng=${discount.longitude}&id=${discount.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 transition-colors interactive-button"
              >
                <MapPin size={16} />
                View on Map
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Similar Offers Slider */}
      {similarOffers.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-2xl font-bold text-slate-900">Similar Offers</h3>
            <button
              onClick={() => sliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
              className="p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-primary-50 hover:border-primary-200 transition-colors"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {similarOffers.map(offer => {
              const pctOff = Math.round((1 - offer.discountPrice / offer.originalPrice) * 100);
              return (
                <div
                  key={offer.id}
                  onClick={() => navigate(`/offer/${offer.id}`)}
                  className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow snap-start"
                >
                  <div className="relative h-36 overflow-hidden">
                    {offer.imageUrl ? (
                      <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-amber-200" />
                    )}
                    <span className="absolute top-3 left-3 bg-primary-500/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-xs font-bold border border-primary-400/40">
                      {pctOff}% OFF
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">{offer.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3">{offer.description}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-slate-400 line-through">₴{offer.originalPrice}</span>
                        <span className="text-lg font-extrabold text-primary-600 ml-2">₴{offer.discountPrice}</span>
                      </div>
                      <span className="text-xs text-slate-400">{offer.category?.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
