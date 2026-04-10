import { ShieldCheck } from 'lucide-react';
import type { Product } from '../types';

interface ProductListProps {
  productsList: Product[];
  onViewProduct: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductList({ productsList, onViewProduct, onBuyProduct, isLoading }: ProductListProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-display text-4xl font-bold mt-2 mb-4 tracking-tight">Products</h1>
      {/* <p className="text-gray-500 text-sm leading-relaxed mb-10">
        Precision-engineered accessories for the modern professional. Curated for performance, status, and everyday utility.
      </p> */}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {[1, 2, 3, 4].map((skeleton) => (
            <div key={skeleton} className="animate-pulse flex flex-col">
              <div className="bg-gray-200/70 rounded-2xl aspect-square mb-3"></div>
              <div className="px-1">
                <div className="h-4 bg-gray-200/70 rounded-md w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200/70 rounded-md w-full mb-3"></div>
                <div className="h-5 bg-gray-200/70 rounded-md w-16 mb-2"></div>
                <div className="h-8 bg-gray-200/70 rounded-lg w-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          {productsList.map(product => (
            <div key={product.id} className="group flex flex-col">
              <div className="relative bg-white rounded-2xl aspect-square overflow-hidden mb-3 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] cursor-pointer"
                   onClick={() => onViewProduct(product)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {product.badge && (
                  <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide z-10
                    ${product.badge === 'SOLD OUT' ? 'bg-black text-white' : 'bg-white/90 backdrop-blur text-gray-900'}
                  `}>
                    {product.badge}
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 px-1">
                <h3 className="font-display font-bold text-sm sm:text-base mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
                  {product.description.split('\n')[0]}
                </p>
                
                <div className="mt-auto flex flex-col gap-2.5">
                  <span className="font-bold text-[#003b8e] text-sm">
                    ₦ {product.price}
                  </span>
                  <button 
                    onClick={() => onBuyProduct(product)}
                    className="w-full bg-[#003b8e]/5 text-[#003b8e] border border-[#003b8e]/10 py-2 rounded-xl text-xs font-bold hover:bg-[#003b8e] hover:text-white transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 bg-white rounded-3xl p-8 text-center shadow-sm">
        <ShieldCheck className="mx-auto text-gray-400 mb-4" size={32} />
        <h4 className="font-bold mb-2">Authenticity</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Every product is verified and guaranteed authentic for your peace of mind.
        </p>
      </div>
    </div>
  );
}
