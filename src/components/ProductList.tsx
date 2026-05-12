import { ShieldCheck } from 'lucide-react';
import ProductCard from './ProductCard';
import ViewportVisible from './ViewportVisible';
import type { Product, PromoSettings } from '../types';

interface ProductListProps {
  productsList: Product[];
  onViewProduct: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
  isLoading?: boolean;
  promoSettings?: PromoSettings | null;
}

export default function ProductList({ productsList, onViewProduct, onBuyProduct, isLoading, promoSettings }: ProductListProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="font-display text-4xl font-bold mt-2 mb-4 tracking-tight">Products</h1>

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
          {productsList.map((product, index) => (
            <ViewportVisible 
              key={product.id} 
              initialVisible={index < 4} 
              placeholderHeight={280}
            >
              <ProductCard 
                product={product}
                onView={onViewProduct}
                onBuy={onBuyProduct}
                promoSettings={promoSettings}
                variant="grid"
                priority={index < 2}
              />
            </ViewportVisible>
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
