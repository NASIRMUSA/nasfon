import { ShieldCheck, Truck, HeadphonesIcon } from 'lucide-react';
import type { Product } from '../types';

interface DiscoverProps {
  productsList: Product[];
  setCurrentTab: (tab: string) => void;
  setViewingProduct: (product: Product) => void;
}

export default function Discover({ productsList, setCurrentTab, setViewingProduct }: DiscoverProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-display text-5xl font-bold mt-2 mb-6 leading-[1.1] tracking-tight">
        Premium<br />Tech<br />Accessories<br />You'll Love
      </h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-[280px]">
        Clean design. Quality sound. Affordable price. Curated for those who demand excellence in every detail.
      </p>
      
      <button 
        onClick={() => setCurrentTab('products')}
        className="bg-[#003b8e] text-white px-8 py-3.5 rounded-xl font-medium mb-12 shadow-md hover:bg-black transition-colors"
      >
        Shop Now
      </button>

      <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[4/3] mb-16 shadow-lg shadow-black/5">
         <img src="/headphones_1775640971368.png" className="w-full h-full object-cover" alt="Headphones" />
      </div>

      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">The Essentials</p>
          <h2 className="font-display text-3xl font-bold tracking-tight">Featured<br/>Collection</h2>
        </div>
        <button 
          onClick={() => setCurrentTab('products')}
          className="text-xs font-semibold border-b-2 border-[#003b8e] pb-0.5"
        >
          View All<br/>Products
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar snap-x">
        {productsList.slice(0, 3).map(item => (
          <div key={item.id} className="min-w-[280px] bg-white rounded-[2rem] p-4 shadow-sm snap-start shrink-0 cursor-pointer" onClick={() => setViewingProduct(item)}>
            <div className="bg-gray-50 rounded-[1.5rem] aspect-square overflow-hidden mb-4 relative p-4 flex items-center justify-center">
               <img src={item.image} alt={item.name} className="w-4/5 h-4/5 object-contain mix-blend-multiply" />
            </div>
            <div className="px-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-bold shrink-0 ml-2">₦{item.price.replace('000', 'k')}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                 {item.description.split('\n')[0]}
              </p>
              <button className="mt-4 w-full border border-gray-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                View Product
              </button>
            </div>
          </div>
        ))}
        <div className="w-2 shrink-0"></div>
      </div>

      <div className="space-y-4 mt-8">
        <div className="bg-white rounded-2xl p-6 text-center flex flex-col items-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-[#003b8e]" />
          </div>
          <h4 className="font-bold text-sm mb-1">Secure Payment</h4>
          <p className="text-xs text-gray-500">Encrypted transactions powered by Paystack for your peace of mind.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 text-center flex flex-col items-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <Truck size={20} className="text-[#003b8e]" />
          </div>
          <h4 className="font-bold text-sm mb-1">Fast Delivery</h4>
          <p className="text-xs text-gray-500">Swift and reliable logistics across Nigeria.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 text-center flex flex-col items-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <HeadphonesIcon size={20} className="text-[#003b8e]" />
          </div>
          <h4 className="font-bold text-sm mb-1">Customer Support</h4>
          <p className="text-xs text-gray-500">Dedicated human support available 24/7 for you.</p>
        </div>
      </div>
    </div>
  );
}
