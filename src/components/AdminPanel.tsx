import React, { useState, useEffect } from 'react';
import ProtectedImage from './ProtectedImage';
import { Settings, Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react';
import { supabase } from '../supabase';
import type { Product, PromoSettings } from '../types';

const sanitizeInput = (str: string) => {
  if (typeof str !== 'string') return '';
  // Strip script tags completely and their contents
  let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Strip any other HTML tags but keep the text
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, "");
  return sanitized.trim();
};

interface AdminPanelProps {
  productsList: Product[];
  setProductsList: React.Dispatch<React.SetStateAction<Product[]>>;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTab: (tab: string) => void;
  promoSettings: PromoSettings | null;
  setPromoSettings: React.Dispatch<React.SetStateAction<PromoSettings | null>>;
}

export default function AdminPanel({
  productsList,
  setProductsList,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  setCurrentTab,
  promoSettings,
  setPromoSettings
}: AdminPanelProps) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);
  const [adminForm, setAdminForm] = useState({ name: '', description: '', price: '', image: '', badge: '' });
  
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState<PromoSettings>(() => promoSettings || {
    event_name: '',
    discount_percentage: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: false
  });

  // Rate limiting logic
  const [failedAttempts, setFailedAttempts] = useState(() => parseInt(localStorage.getItem('adminFailedAttempts') || '0'));
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    const lockout = localStorage.getItem('adminLockoutUntil');
    return lockout && Number(lockout) > Date.now() ? Number(lockout) : null;
  });
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (lockoutUntil) {
       const handleTick = () => {
          const remaining = lockoutUntil - Date.now();
          if (remaining <= 0) {
             setLockoutUntil(null);
             setFailedAttempts(0);
             localStorage.removeItem('adminLockoutUntil');
             localStorage.removeItem('adminFailedAttempts');
          } else {
             setTimeLeft(Math.ceil(remaining / 1000));
          }
       };
       handleTick();
       const interval = setInterval(handleTick, 1000);
       return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const handleFailedAttempt = () => {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem('adminFailedAttempts', newAttempts.toString());

    if (newAttempts >= 3) {
      const unlockTime = Date.now() + 5 * 60 * 1000; // 5 minutes block
      setLockoutUntil(unlockTime);
      localStorage.setItem('adminLockoutUntil', unlockTime.toString());
      alert('Too many failed attempts. You are blocked for 5 minutes.');
    } else {
      alert(`Invalid credentials! Attempt ${newAttempts} of 3.`);
    }
  };

  const handleAdminSave = async () => {
    const sanitizedPayload = {
      name: sanitizeInput(adminForm.name),
      description: sanitizeInput(adminForm.description),
      price: sanitizeInput(adminForm.price),
      image: sanitizeInput(adminForm.image) || '/aura_pods_1775640875520.png',
      badge: sanitizeInput(adminForm.badge)
    };

    if (!sanitizedPayload.name || !sanitizedPayload.price) {
      alert("Name and Price are required after sanitization.");
      return;
    }
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      if (editingId) {
        setProductsList(prev => prev.map(p => p.id === editingId ? { ...sanitizedPayload, id: editingId } as Product : p));
      } else {
        setProductsList(prev => [...prev, { ...sanitizedPayload, id: Date.now() } as Product]);
      }
      setShowAdminForm(false);
      return;
    }

    if (editingId) {
      console.log(`✏️ Attempting to UPDATE product with ID: ${editingId}`, sanitizedPayload);
      const { data, error } = await supabase
        .from('products')
        .update(sanitizedPayload)
        .eq('id', editingId)
        .select();

      if (error) {
        console.error('❌ Supabase Update Error:', error);
        alert(error.message);
      } else if (data) {
        console.log(`✅ Successfully updated product ID: ${editingId}. Server Response Data:`, data);
        setProductsList(prev => prev.map(p => p.id === editingId ? data[0] : p));
      }
    } else {
      console.log(`📝 Attempting to INSERT new product:`, sanitizedPayload);
      const { data, error } = await supabase
        .from('products')
        .insert([sanitizedPayload])
        .select();
        
      if (error) {
        console.error('❌ Supabase Insert Error:', error);
        alert(error.message);
      } else if (data) {
        console.log(`✅ Successfully inserted new product. Server Response Data:`, data);
        setProductsList(prev => [...prev, data[0]]);
      }
    }
    setShowAdminForm(false);
  };

  const openAdminForm = (product: any = null) => {
    if (product) {
      setEditingId(product.id);
      setAdminForm({ name: product.name, description: product.description || '', price: product.price, image: product.image, badge: product.badge || '' });
    } else {
      setEditingId(null);
      setAdminForm({ name: '', description: '', price: '', image: '', badge: '' });
    }
    setShowAdminForm(true);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('dragIndex', index.toString());
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'));
    if (dragIndex === dropIndex || isNaN(dragIndex)) return;

    const newList = [...productsList];
    const draggedItem = newList[dragIndex];
    newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, draggedItem);
    
    setProductsList(newList);

    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        let hasAlertedError = false;
        for (let i = 0; i < newList.length; i++) {
           const { error } = await supabase
             .from('products')
             .update({ order_index: i })
             .eq('id', newList[i].id);
             
           if (error && !hasAlertedError) {
             hasAlertedError = true;
             console.error("Order update error:", error);
             if (error.code === '42703' || error.message?.includes('order_index')) {
               alert("Reordering Failed! Please add a column named 'order_index' (Type: int8/integer) to your Supabase 'products' table.");
             } else {
               alert("Error saving custom order to Supabase: " + error.message);
             }
           }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteProduct = async (id: any) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        setProductsList(prev => prev.filter(p => p.id !== id));
        return;
      }
      
      console.log(`🗑️ Attempting to DELETE product with ID: ${id}`);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('❌ Supabase Delete Error:', error);
        alert(error.message);
      } else {
        console.log(`✅ Successfully deleted product ID: ${id}`);
        setProductsList(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  const handlePromoSave = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setPromoSettings(promoForm);
      setShowPromoForm(false);
      return;
    }

    const payload: any = { ...promoForm };
    // If we have an existing ID, include it for the upsert to work as an update
    if (promoSettings?.id) {
       payload.id = promoSettings.id;
    } else {
       // Remove id from payload if it's new to let Supabase generate it
       delete payload.id;
    }

    const { data, error } = await supabase
      .from('promo_settings')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Promo Save Error:', error);
      alert('Error saving promo settings. Make sure the "promo_settings" table exists in your Supabase database.');
    } else {
      setPromoSettings(data);
      setShowPromoForm(false);
      alert('Global Promo updated successfully!');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-16 px-4">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-[#003b8e] rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings size={28} className="text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Admin Login</h2>
          <p className="text-sm text-gray-500 mb-8">Please authenticate to access the dashboard.</p>
          
          <div className="space-y-4 mb-8 text-left">
            <div>
               <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Email Address</label>
               <input type="email" disabled={!!lockoutUntil} value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] ${lockoutUntil ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="admin@example.com" />
            </div>
            <div>
               <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Password</label>
               <input type="password" disabled={!!lockoutUntil} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] ${lockoutUntil ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="••••••••" />
            </div>
          </div>
          <button 
            disabled={!!lockoutUntil}
            onClick={async () => {
              if (lockoutUntil) return;

              const cleanUsername = sanitizeInput(loginForm.username);
              // Passwords are typically not aggressively sanitized like this to avoid blocking symbols, 
              // but we rely on the backend for SQL-injection prevention.
              const cleanPassword = loginForm.password;

              if (!import.meta.env.VITE_SUPABASE_URL) {
                if (cleanUsername === 'admin' && cleanPassword === 'admin123') {
                  setIsAdminLoggedIn(true);
                  setFailedAttempts(0);
                  localStorage.removeItem('adminFailedAttempts');
                } else {
                  handleFailedAttempt();
                }
                return;
              }
              
              const { error } = await supabase.auth.signInWithPassword({
                email: cleanUsername,
                password: cleanPassword,
              });
              if (error) {
                handleFailedAttempt();
              } else {
                setIsAdminLoggedIn(true);
                setFailedAttempts(0);
                localStorage.removeItem('adminFailedAttempts');
              }
            }}
            className={`w-full ${lockoutUntil ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003b8e] hover:bg-black active:scale-[0.98]'} text-white py-4 rounded-xl font-medium text-lg transition-transform mb-3`}
          >
            {lockoutUntil ? `Blocked (${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')})` : 'Sign In'}
          </button>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button 
            onClick={async () => {
              if (!import.meta.env.VITE_SUPABASE_URL) {
                alert('Supabase not connected.');
                return;
              }
              const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
              if (error) alert(error.message);
            }}
            className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Admin<br/>Dashboard</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPromoForm(true)}
            className={`p-3 rounded-full shadow-md transition-colors ${promoSettings?.is_active ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-800 border border-gray-200'}`}
            title="Manage Global Promo"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={async () => { 
              if (import.meta.env.VITE_SUPABASE_URL) await supabase.auth.signOut();
              setIsAdminLoggedIn(false); 
              setLoginForm({username: '', password: ''}); 
              setCurrentTab('products'); 
            }} 
            className="bg-gray-100 text-gray-800 p-3 rounded-full shadow-sm hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
          <button onClick={() => openAdminForm()} className="bg-[#003b8e] text-white p-3 rounded-full shadow-md hover:bg-black transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {productsList.map((product, index) => (
          <div 
             key={product.id} 
             draggable
             onDragStart={(e) => handleDragStart(e, index)}
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => handleDrop(e, index)}
             className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
          >
            <div className="text-gray-300">
              <GripVertical size={20} />
            </div>
            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 pointer-events-none">
              <ProtectedImage src={product.image} alt={product.name} className="w-full h-full object-cover" wrapperClassName="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 pointer-events-none">
              <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
              <p className="text-xs text-gray-500 truncate">{product.description}</p>
              <p className="text-sm font-semibold text-[#003b8e] mt-1">₦ {product.price}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openAdminForm(product)} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {productsList.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No products available. Create one!</div>
        )}
      </div>

      {showAdminForm && (
        <div className="absolute inset-0 bg-[#f7f7f9] z-50 overflow-y-auto px-6 py-6 pb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display font-bold text-2xl">{editingId ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setShowAdminForm(false)} className="text-gray-400 hover:text-gray-900 bg-gray-200/60 rounded-full w-8 h-8 flex items-center justify-center">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Product Name</label>
              <input type="text" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" placeholder="E.g. Lunar Earbuds" />
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Price (NGN)</label>
              <input type="text" value={adminForm.price} onChange={e => setAdminForm({...adminForm, price: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" placeholder="45,000" />
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Description details</label>
              <textarea rows={3} value={adminForm.description} onChange={e => setAdminForm({...adminForm, description: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] resize-none" placeholder="Enter product details..."></textarea>
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Image URL</label>
              <input type="text" value={adminForm.image} onChange={e => setAdminForm({...adminForm, image: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e]" placeholder="/aura_pods_1775640875520.png" />
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Badge (Optional)</label>
              <input type="text" value={adminForm.badge} onChange={e => setAdminForm({...adminForm, badge: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e]" placeholder="E.g. NEW or SOLD OUT" />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-5 z-20">
            <div className="max-w-md mx-auto">
              <button onClick={handleAdminSave} className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {showPromoForm && (
        <div className="absolute inset-0 bg-[#f7f7f9] z-50 overflow-y-auto px-6 py-6 pb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display font-bold text-2xl">Global Discount Settings</h2>
            <button onClick={() => setShowPromoForm(false)} className="text-gray-400 hover:text-gray-900 bg-gray-200/60 rounded-full w-8 h-8 flex items-center justify-center">
              <X size={20} />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
            <p className="text-sm text-gray-500 mb-6 font-medium">Configure a site-wide discount that applies to all products for a specific duration.</p>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">Enable Promo</h4>
                  <p className="text-xs text-gray-500">Enable or disable the global discount instantly.</p>
                </div>
                <button 
                  onClick={() => setPromoForm({...promoForm, is_active: !promoForm.is_active})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${promoForm.is_active ? 'bg-[#003b8e]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${promoForm.is_active ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div>
                <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Event Name</label>
                <input 
                  type="text" 
                  value={promoForm.event_name} 
                  onChange={e => setPromoForm({...promoForm, event_name: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
                  placeholder="e.g. Black Friday Sale" 
                />
              </div>

              <div>
                <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  value={promoForm.discount_percentage} 
                  onChange={e => setPromoForm({...promoForm, discount_percentage: parseInt(e.target.value) || 0})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Start Date</label>
                  <input 
                    type="date" 
                    value={promoForm.start_date} 
                    onChange={e => setPromoForm({...promoForm, start_date: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">End Date</label>
                  <input 
                    type="date" 
                    value={promoForm.end_date} 
                    onChange={e => setPromoForm({...promoForm, end_date: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-5 z-20">
            <div className="max-w-md mx-auto">
              <button 
                onClick={handlePromoSave} 
                className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]"
              >
                Save Promo Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
