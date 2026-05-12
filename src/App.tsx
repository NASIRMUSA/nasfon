import { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Menu, Globe, Settings } from 'lucide-react';
import type { Product } from './types';
import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import { usePushNotifications } from './hooks/usePushNotifications';

// Lazy load components
const Discover = lazy(() => import('./components/Discover'));
const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CountdownTimer = lazy(() => import('./components/CountdownTimer'));
import { useSecurity } from './hooks/useSecurity';

function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 left-0 right-0 pointer-events-none flex justify-end max-w-md mx-auto px-6 z-[60]">
      <a 
        href="https://wa.me/2349071943490"
        target="_blank" 
        rel="noopener noreferrer"
        className="pointer-events-auto bg-[#25D366] text-white p-3.5 rounded-full shadow-xl shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-all hover:scale-110 active:scale-95 flex items-center justify-center animate-in fade-in zoom-in duration-500"
        aria-label="Contact Support on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState('products'); // 'products' | 'collections' | 'admin'
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  // Custom Hooks
  const { productsList, setProductsList, isLoading, promoSettings, setPromoSettings } = useProducts();
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useAuth();
  usePushNotifications();
  useSecurity();

  const renderHeader = () => (
    <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-[#f7f7f9]/80 backdrop-blur-md z-10">
      <button className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Open Menu">
        <Menu size={24} className="text-gray-800" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="flex items-center cursor-pointer" onClick={() => { setViewingProduct(null); setCurrentTab('products'); }}>
          <img 
            src="/logo.png" 
            alt="NasFon Logo" 
            className="h-10 md:h-12 object-contain hover:drop-shadow-sm" 
            fetchPriority="high"
            width={160}
            height={48}
          />
        </span>
      </div>
      <button className="p-2 -mr-2 rounded-full hover:bg-gray-200 transition-colors relative" onClick={() => setCurrentTab('admin')} aria-label="Open Admin Settings">
        <Settings size={22} className="text-gray-800" />
      </button>
    </header>
  );

  const renderFooter = () => (
    <footer className="py-8 px-6 text-center text-sm text-gray-600 mt-8 border-t border-gray-200/50">
      <div className="flex items-center justify-center gap-2">
        <Globe size={16} /> NasFon | Nigeria
      </div>
    </footer>
  );

  if (viewingProduct) {
    return (
      <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#f7f7f9] animate-pulse">Loading Product...</div>}>
        <ProductDetails 
          product={viewingProduct} 
          onClose={() => { setViewingProduct(null); setIsDirectBuy(false); }} 
          onSuccessReturn={() => {
             setViewingProduct(null);
             setIsDirectBuy(false);
             setCurrentTab('products');
          }}
          initialShowOrderModal={isDirectBuy}
          promoSettings={promoSettings}
        />
        <WhatsAppButton />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f7f7f9] text-gray-800 shadow-2xl relative">
      <Helmet>
        <title>Nasfon — Premium Tech Accessories & Electronics in Nigeria</title>
        <meta name="description" content="Shop the best collection of premium tech accessories, high-end headphones, and luxury electronics at Nasfon. Verified quality, fast delivery across Nigeria, and secure payments via Paystack." />
        <meta name="keywords" content="Nasfon, premium tech accessories, headphones Nigeria, luxury gadgets Lagos, tech store Nigeria, high-end electronics" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              "name": "Nasfon",
              "description": "Premium Tech Accessories and Electronics Boutique in Nigeria",
              "image": "https://nasfon.netlify.app/logo.png",
              "url": "https://nasfon.netlify.app",
              "priceRange": "₦₦",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lagos",
                "addressCountry": "NG"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://nasfon.netlify.app/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </Helmet>
      {renderHeader()}
      
      {currentTab !== 'admin' && (
        <div className="flex justify-center mb-4 sticky top-16 z-20 bg-[#f7f7f9]/90 backdrop-blur pb-2 pt-2">
          <div className="bg-gray-200/60 p-1 rounded-full flex gap-1">
            <button onClick={() => setCurrentTab('collections')} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${currentTab === 'collections' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Discover</button>
            <button onClick={() => setCurrentTab('products')} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${currentTab === 'products' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>All Products</button>
          </div>
        </div>
      )}

      <main className="px-6 pb-20">
        <Suspense fallback={<div className="h-40 flex items-center justify-center animate-pulse text-gray-400">Loading...</div>}>
          {currentTab !== 'admin' && promoSettings && <CountdownTimer promoSettings={promoSettings} />}
          
          {currentTab === 'admin' && (
             <AdminPanel 
               productsList={productsList} 
               setProductsList={setProductsList}
               isAdminLoggedIn={isAdminLoggedIn}
               setIsAdminLoggedIn={setIsAdminLoggedIn}
               setCurrentTab={setCurrentTab}
               promoSettings={promoSettings}
               setPromoSettings={setPromoSettings}
             />
          )}
          
          {currentTab === 'products' && (
             <ProductList
               productsList={productsList}
               onViewProduct={(product) => { setViewingProduct(product); setIsDirectBuy(false); }}
               onBuyProduct={(product) => { setViewingProduct(product); setIsDirectBuy(true); }}
               isLoading={isLoading}
               promoSettings={promoSettings}
             />
          )}
  
          {currentTab === 'collections' && (
             <Discover 
               productsList={productsList}
               setCurrentTab={setCurrentTab}
               onViewProduct={(product) => { setViewingProduct(product); setIsDirectBuy(false); }}
               onBuyProduct={(product) => { setViewingProduct(product); setIsDirectBuy(true); }}
               promoSettings={promoSettings}
             />
          )}
        </Suspense>
      </main>

      {currentTab !== 'products' && currentTab !== 'admin' && renderFooter()}
      <WhatsAppButton />
    </div>
  );
}

export default App;
