import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useAuth() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_SUPABASE_URL) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAdminLoggedIn(!!session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAdminLoggedIn(!!session);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return {
    isAdminLoggedIn,
    setIsAdminLoggedIn
  };
}
