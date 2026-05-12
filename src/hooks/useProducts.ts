import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import type { Product, PromoSettings } from '../types';

export function useProducts() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoSettings, setPromoSettings] = useState<PromoSettings | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setProductsList([]);
      setIsLoading(false);
      return;
    }
    
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      alert(`Supabase Fetch Error: ${error.message} \n Hint: ${error.hint}`);
      setProductsList([]);
    } else {
      const sortedData = (data || []).sort((a: any, b: any) => {
         const orderA = a.order_index ?? a.id;
         const orderB = b.order_index ?? b.id;
         return orderA - orderB;
      });
      setProductsList(sortedData);
    }
    setIsLoading(false);
  }, []);

  const fetchPromoSettings = useCallback(async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    const { data, error } = await supabase.from('promo_settings').select('*').single();
    if (!error && data) {
      setPromoSettings(data);
    } else if (error && error.code === 'PGRST116') {
      setPromoSettings(null);
    }
  }, []);

  useEffect(() => {
    // Try to use early-fetched data from index.html
    const tryEarlyFetch = async () => {
      let productsLoaded = false;
      let promoLoaded = false;

      const productsPromise = (window as any).__PRODUCTS_DATA__;
      const promoPromise = (window as any).__PROMO_DATA__;

      if (productsPromise) {
        const data = await productsPromise;
        if (data && Array.isArray(data)) {
          setProductsList(data);
          setIsLoading(false);
          productsLoaded = true;
        }
      }

      if (promoPromise) {
        const data = await promoPromise;
        if (data) {
          setPromoSettings(Array.isArray(data) ? data[0] : data);
          promoLoaded = true;
        }
      }

      if (!productsLoaded) fetchProducts();
      if (!promoLoaded) fetchPromoSettings();
    };

    tryEarlyFetch();
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      const productsChannel = supabase.channel('products-all')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
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
        .subscribe();

      return () => {
        supabase.removeChannel(productsChannel);
      };
    }
  }, [fetchProducts, fetchPromoSettings]);

  return {
    productsList,
    setProductsList,
    isLoading,
    promoSettings,
    setPromoSettings,
    refreshProducts: fetchProducts,
    refreshPromo: fetchPromoSettings
  };
}
