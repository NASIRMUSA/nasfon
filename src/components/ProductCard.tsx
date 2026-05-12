import { Tag, Star } from 'lucide-react';
import ProtectedImage from './ProtectedImage';
import type { Product, PromoSettings } from '../types';
import { isPromoActive, getDiscountedPrice } from '../utils/productUtils';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onBuy: (product: Product) => void;
  promoSettings?: PromoSettings | null;
  variant?: 'grid' | 'featured';
  priority?: boolean;
}

export default function ProductCard({ 
  product, 
  onView, 
  onBuy, 
  promoSettings, 
  variant = 'grid',
  priority = false
}: ProductCardProps) {
  const activePromo = isPromoActive(promoSettings);
  const discountedPrice = getDiscountedPrice(product.price, promoSettings);

  const renderStars = (size = 12) => (
    <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} fill="currentColor" />
      ))}
      <span className="text-[10px] text-gray-400 ml-1 font-medium">(4.9)</span>
    </div>
  );

  if (variant === 'featured') {
    return (
      <div
        onClick={() => onView(product)}
        className="w-full bg-white rounded-[2.5rem] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 cursor-pointer group"
      >
        {/* Image */}
        <div className="bg-[#f8f9fb] rounded-[2rem] aspect-[16/10] overflow-hidden mb-5 relative p-6 flex items-center justify-center">
          <ProtectedImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
            wrapperClassName="w-full h-full"
            priority={priority}
            width={800}
            height={500}
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              <span className="text-[10px] font-bold text-gray-900 tracking-tight">FEATURED</span>
            </div>
            {activePromo && (
               <div className="bg-red-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                 <span className="text-[8px] font-bold tracking-tight">-{promoSettings?.discount_percentage}%</span>
               </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col px-1">
          {renderStars(14)}
          
          <div className="flex justify-between items-start mb-5">
            <h3 className="font-display font-bold text-xl tracking-tight text-gray-900 group-hover:text-[#003b8e] transition-colors leading-tight truncate pr-4">
              {product.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-[#003b8e] shrink-0">₦{discountedPrice}</span>
              {activePromo && (
                <span className="text-[10px] text-gray-400 line-through">₦{product.price}</span>
              )}
            </div>
          </div>

          {/* Footer / Buy Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuy(product);
            }}
            className="w-full bg-[#003b8e] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#003b8e]/20 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Buy Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18" height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Default Grid Variant (from ProductList)
  return (
    <div className="group flex flex-col">
      <div className="relative bg-white rounded-2xl aspect-square overflow-hidden mb-3 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] cursor-pointer"
           onClick={() => onView(product)}>
        <ProtectedImage 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          wrapperClassName="w-full h-full"
          priority={priority}
          width={400}
          height={400}
        />
        {product.badge && (
          <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide z-10
            ${product.badge === 'SOLD OUT' ? 'bg-black text-white' : 'bg-white/90 backdrop-blur text-gray-900'}
          `}>
            {product.badge}
          </div>
        )}
        {activePromo && (
          <div className="absolute top-2.5 left-2.5 bg-red-600 text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide z-10 flex items-center gap-1 shadow-sm">
            <Tag size={10} />
            {promoSettings?.event_name}
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 px-1">
        {renderStars(10)}
        <h3 className="font-display font-bold text-sm sm:text-base mb-2 truncate">{product.name}</h3>
        
        <div className="mt-auto flex flex-col gap-0.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#003b8e] text-sm sm:text-base">
              ₦ {discountedPrice}
            </span>
            {activePromo && (
              <span className="text-[10px] text-gray-400 line-through">
                ₦ {product.price}
              </span>
            )}
          </div>
          <button 
            onClick={() => onBuy(product)}
            className="w-full bg-[#003b8e]/5 text-[#003b8e] border border-[#003b8e]/10 py-2 rounded-xl text-xs font-bold hover:bg-[#003b8e] hover:text-white transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
