import { ShieldCheck, Truck, HeadphonesIcon, Tag } from 'lucide-react';
import ProtectedImage from './ProtectedImage';
import ProductCard from './ProductCard';
import ViewportVisible from './ViewportVisible';
import type { Product, PromoSettings } from '../types';
import { isPromoActive } from '../utils/productUtils';

interface DiscoverProps {
  productsList: Product[];
  setCurrentTab: (tab: string) => void;
  onViewProduct: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
  promoSettings?: PromoSettings | null;
}

export default function Discover({ productsList, setCurrentTab, onViewProduct, onBuyProduct, promoSettings }: DiscoverProps) {
  const activePromo = isPromoActive(promoSettings);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-display text-5xl font-bold mt-2 mb-6 leading-[1.1] tracking-tight">
        Premium<br />Tech<br />Accessories<br />You'll Love
      </h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-[280px]">
        Clean design. Quality sound. Affordable price. Curated for those who demand excellence in every detail.
      </p>
      
      {activePromo && (
        <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 mb-8 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-2 rounded-lg">
              <Tag size={20} />
            </div>
            <div>
              <h3 className="text-red-600 font-bold text-sm">{promoSettings?.event_name} is LIVE!</h3>
              <p className="text-red-600/70 text-xs font-medium">Enjoy {promoSettings?.discount_percentage}% OFF everything in store.</p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setCurrentTab('products')}
        className="bg-[#003b8e] text-white px-8 py-3.5 rounded-xl font-medium mb-12 shadow-md hover:bg-black transition-colors"
      >
        Shop Now
      </button>

      <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[4/3] mb-16 shadow-lg shadow-black/5">
         <ProtectedImage 
           src="https://res.cloudinary.com/dxja7dt9a/image/upload/v1775664699/1775488312718_x5jfve.png" 
           className="w-full h-full object-cover" 
           alt="Premium wireless noise-canceling headphones featured collection" 
           wrapperClassName="w-full h-full"
           priority={true}
         />
      </div>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-1">The Essentials</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">Featured<br/>Collection</h2>
        </div>
        <button 
          onClick={() => setCurrentTab('products')}
          className="text-xs font-semibold border-b-2 border-[#003b8e] pb-0.5"
        >
          View All<br/>Products
        </button>
      </div>

      <ViewportVisible placeholderHeight={600}>
        <div className="space-y-6 pb-10">
          {productsList.slice(0, 3).map((item) => (
            <ProductCard 
              key={item.id}
              product={item}
              onView={onViewProduct}
              onBuy={onBuyProduct}
              promoSettings={promoSettings}
              variant="featured"
            />
          ))}
        </div>
      </ViewportVisible>

      <ViewportVisible placeholderHeight={400}>
        <div className="space-y-4 mt-8">
          <div className="bg-white rounded-2xl p-6 text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <ShieldCheck size={20} className="text-[#003b8e]" />
            </div>
            <h4 className="font-bold text-sm mb-1">Secure Payment</h4>
            <p className="text-xs text-gray-600">Encrypted transactions powered by Paystack for your peace of mind.</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Truck size={20} className="text-[#003b8e]" />
            </div>
            <h4 className="font-bold text-sm mb-1">Fast Delivery</h4>
            <p className="text-xs text-gray-600">Swift and reliable logistics across Nigeria.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <HeadphonesIcon size={20} className="text-[#003b8e]" />
            </div>
            <h4 className="font-bold text-sm mb-1">Customer Support</h4>
            <p className="text-xs text-gray-600">Dedicated human support available 24/7 for you.</p>
          </div>
        </div>
      </ViewportVisible>

      <ViewportVisible placeholderHeight={300}>
        <div className="mt-16 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50">
          <h2 className="font-display font-bold text-2xl mb-4">About Nasfon</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Nasfon is Nigeria's premier destination for high-end tech accessories and curated electronics. We specialize in providing the modern professional with premium headphones, sleek mobile accessories, and cutting-edge gadgets that combine performance with luxury. 
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our commitment to quality ensures that every product in our catalog is verified for authenticity and performance. With fast, reliable delivery across Taraba State and all over Nigeria, Nasfon is your trusted Smart Phone and Accessories shop for elevating your tech lifestyle.
          </p>
        </div>
      </ViewportVisible>
    </div>
  );
}
