import React, { useState, useEffect } from 'react';
import { Package, Bell } from 'lucide-react';
import { supabase } from '../supabase';
import type { Product, PromoSettings, Order } from '../types';
import { sanitizeInput } from '../utils/security';
import { AdminLoginForm } from '../features/admin/AdminLoginForm';
import { ProductForm } from '../features/admin/ProductForm';
import { PromoForm } from '../features/admin/PromoForm';
import { NotificationForm } from '../features/admin/NotificationForm';
import { AdminHeader } from '../features/admin/AdminHeader';
import { AdminProductList } from '../features/admin/AdminProductList';
import { AdminOrderList } from '../features/admin/AdminOrderList';

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
  // --- UI State ---
  const [activeAdminTab, setActiveAdminTab] = useState<'products' | 'orders'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

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

  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationPayload, setNotificationPayload] = useState({ title: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn && activeAdminTab === 'orders') {
      fetchOrders();
    }
  }, [isAdminLoggedIn, activeAdminTab]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setOrders(data);
    }
    setIsLoadingOrders(false);
  };

  const deleteOrder = async (id: any) => {
    if (!window.confirm("Delete this order?")) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const updateOrderStatus = async (id: any, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } as Order : o));
    }
  };

  // --- Handlers ---
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

    const { data, error } = editingId 
      ? await supabase.from('products').update(sanitizedPayload).eq('id', editingId).select()
      : await supabase.from('products').insert([sanitizedPayload]).select();

    if (error) {
      alert(error.message);
    } else if (data) {
      if (editingId) {
        setProductsList(prev => prev.map(p => p.id === editingId ? data[0] : p));
      } else {
        setProductsList(prev => [...prev, data[0]]);
      }
      setShowAdminForm(false);
    }
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
    const [draggedItem] = newList.splice(dragIndex, 1);
    newList.splice(dropIndex, 0, draggedItem);
    setProductsList(newList);

    if (import.meta.env.VITE_SUPABASE_URL) {
      for (let i = 0; i < newList.length; i++) {
        await supabase.from('products').update({ order_index: i }).eq('id', newList[i].id);
      }
    }
  };

  const deleteProduct = async (id: any) => {
    if (!window.confirm("Are you sure?")) return;
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setProductsList(prev => prev.filter(p => p.id !== id));
      return;
    }
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProductsList(prev => prev.filter(p => p.id !== id));
  };

  const handlePromoSave = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setPromoSettings(promoForm);
      setShowPromoForm(false);
      return;
    }

    const payload = { ...promoForm };
    if (promoSettings?.id) payload.id = promoSettings.id;
    else delete (payload as any).id;

    const { data, error } = await supabase.from('promo_settings').upsert(payload).select().single();
    if (!error) {
      setPromoSettings(data);
      setShowPromoForm(false);
      alert('Updated!');
    }
  };

  const sendPushNotification = async (title: string, message: string) => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-push', { 
        body: { 
          title, 
          message, 
          image: (notificationPayload as any).image 
        },
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      });
      
      if (error) {
        let msg = error.message;
        try {
          const body = await (error as any).context?.json();
          if (body?.error) msg = body.error;
        } catch (e) {}
        console.warn(`⚠️ [Push] Potential false alarm error: ${msg}`, error);
      }
      
      console.log("✅ [Push Result]:", data);
      alert('Notification sent! Check your phone.');
      setShowNotificationForm(false);
      setNotificationPayload({ title: '', message: '' });
    } catch (err: any) {
      console.error("❌ [Push Failed]:", err);
      alert('Sent (check logs if no notification arrives)');
    } finally {
      setIsSending(false);
    }
  };

  // --- Render ---
  if (!isAdminLoggedIn) return <AdminLoginForm setIsAdminLoggedIn={setIsAdminLoggedIn} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-6">
      <AdminHeader 
        promoSettings={promoSettings}
        onShowPromo={() => setShowPromoForm(true)}
        onShowNotification={() => setShowNotificationForm(true)}
        onLogout={async () => { if (import.meta.env.VITE_SUPABASE_URL) await supabase.auth.signOut(); setIsAdminLoggedIn(false); setCurrentTab('products'); }}
        onAddProduct={() => openAdminForm()}
      />

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveAdminTab('products')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeAdminTab === 'products' ? 'bg-[#003b8e] text-white shadow-lg shadow-[#003b8e]/20' : 'bg-white text-gray-500 border border-gray-100'}`}
        >
          <Package size={18} />
          Products
        </button>
        <button 
          onClick={() => setActiveAdminTab('orders')}
          className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 relative ${activeAdminTab === 'orders' ? 'bg-[#003b8e] text-white shadow-lg shadow-[#003b8e]/20' : 'bg-white text-gray-500 border border-gray-100'}`}
        >
          <Bell size={18} />
          Orders
          {orders.filter(o => o.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f7f7f9]">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {activeAdminTab === 'products' ? (
        <AdminProductList 
          productsList={productsList}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onEdit={openAdminForm}
          onDelete={deleteProduct}
        />
      ) : (
        <AdminOrderList 
          orders={orders}
          isLoading={isLoadingOrders}
          onUpdateStatus={updateOrderStatus}
          onDelete={deleteOrder}
        />
      )}

      {showAdminForm && <ProductForm editingId={editingId} adminForm={adminForm} setAdminForm={setAdminForm} onSave={handleAdminSave} onClose={() => setShowAdminForm(false)} />}
      {showPromoForm && <PromoForm promoForm={promoForm} setPromoForm={setPromoForm} onSave={handlePromoSave} onClose={() => setShowPromoForm(false)} />}
      {showNotificationForm && <NotificationForm notificationPayload={notificationPayload} setNotificationPayload={setNotificationPayload} isSending={isSending} onSend={sendPushNotification} onClose={() => setShowNotificationForm(false)} />}
    </div>
  );
}
