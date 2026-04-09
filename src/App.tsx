import { useState, useEffect } from 'react';
import { Menu, Globe, Settings } from 'lucide-react';
import { supabase } from './supabase';
import type{ Product } from './types';
import Discover from './components/Discover';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import AdminPanel from './components/AdminPanel';

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
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      // Auth Listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAdminLoggedIn(!!session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdminLoggedIn(!!session);
      });

      // Realtime Database Listener
      const productsChannel = supabase.channel('products-all')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            console.log('⚡ Realtime Event Received:', payload);
            if (payload.eventType === 'INSERT') {
              setProductsList(prev => {
                 if (prev.find(p => p.id === payload.new.id)) return prev;
                 return [...prev, payload.new as Product];
              });
            } else if (payload.eventType === 'UPDATE') {
              setProductsList(prev => prev.map(p => p.id === payload.new.id ? payload.new as Product : p));
            } else if (payload.eventType === 'DELETE') {
              setProductsList(prev => prev.filter(p => p.id !== payload.old.id));
            }
          }
        )
        .subscribe((status, err) => {
           console.log('📡 Realtime Subscription Status:', status, err ? `Error: ${err}` : '');
        });

      return () => {
        subscription.unsubscribe();
        supabase.removeChannel(productsChannel);
      };
    }
  }, []);

  const fetchProducts = async () => {
    console.log('🔄 Initiating Database Fetch...');
    setIsLoading(true);
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.warn('⚠️ Supabase URL not configured. Aborting fetch.');
      setProductsList([]);
      setIsLoading(false);
      return;
    }
    
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      console.error('❌ Supabase Fetch Error:', error);
      console.error('❌ Error Details:', error.message, error.hint, error.details);
      alert(`Supabase Fetch Error: ${error.message} \n Hint: ${error.hint}`);
      setProductsList([]);
    } else {
      console.log(`✅ Successfully fetched ${data?.length || 0} products from Supabase.`, data);
      const sortedData = (data || []).sort((a: any, b: any) => {
         const orderA = a.order_index ?? a.id;
         const orderB = b.order_index ?? b.id;
         return orderA - orderB;
      });
      setProductsList(sortedData);
    }
    setIsLoading(false);
  };

  const renderHeader = () => (
    <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-[#f7f7f9]/80 backdrop-blur-md z-10">
      <button className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
        <Menu size={24} className="text-gray-800" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="flex items-center cursor-pointer" onClick={() => { setViewingProduct(null); setCurrentTab('products'); }}>
          <img src="https://res.cloudinary.com/dxja7dt9a/image/upload/v1775732736/nasfon-logo-transparent_oyeozo.png" alt="NasFon Logo" className="h-8 md:h-10 object-contain scale-125 hover:drop-shadow-sm transition-all" />
        </span>
      </div>
      <button className="p-2 -mr-2 rounded-full hover:bg-gray-200 transition-colors relative" onClick={() => setCurrentTab('admin')}>
        <Settings size={22} className="text-gray-800" />
      </button>
    </header>
  );

  const renderFooter = () => (
    <footer className="py-8 px-6 text-center text-sm text-gray-500 mt-8 border-t border-gray-200/50">
      <div className="flex items-center justify-center gap-2">
        <Globe size={16} /> NasFon | Nigeria
      </div>
    </footer>
  );

  if (viewingProduct) {
    return (
      <>
        <ProductDetails 
          product={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
          onSuccessReturn={() => {
             setViewingProduct(null);
             setCurrentTab('products');
          }}
        />
        <WhatsAppButton />
      </>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f7f7f9] text-gray-800 shadow-2xl relative">
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
        {currentTab === 'admin' && (
           <AdminPanel 
             productsList={productsList} 
             setProductsList={setProductsList}
             isAdminLoggedIn={isAdminLoggedIn}
             setIsAdminLoggedIn={setIsAdminLoggedIn}
             setCurrentTab={setCurrentTab}
           />
        )}
        
        {currentTab === 'products' && (
           <ProductList
             productsList={productsList}
             setViewingProduct={setViewingProduct}
             isLoading={isLoading}
           />
        )}

        {currentTab === 'collections' && (
           <Discover 
             productsList={productsList}
             setCurrentTab={setCurrentTab}
             setViewingProduct={setViewingProduct}
           />
        )}
      </main>

      {currentTab !== 'products' && currentTab !== 'admin' && renderFooter()}
      <WhatsAppButton />
    </div>
  );
}

export default App;
