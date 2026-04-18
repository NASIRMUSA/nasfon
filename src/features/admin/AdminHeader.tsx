import React from 'react';
import { Settings, Bell, X, Plus } from 'lucide-react';
import type { PromoSettings } from '../../types';

interface AdminHeaderProps {
  promoSettings: PromoSettings | null;
  onShowPromo: () => void;
  onShowNotification: () => void;
  onLogout: () => void;
  onAddProduct: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  promoSettings,
  onShowPromo,
  onShowNotification,
  onLogout,
  onAddProduct
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">Admin<br/>Dashboard</h1>
      <div className="flex gap-2">
        <button 
          onClick={onShowPromo} 
          className={`p-3 rounded-full shadow-md transition-colors ${promoSettings?.is_active ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-gray-800 border border-gray-200'}`}
        >
          <Settings size={20} />
        </button>
        <button 
          onClick={onShowNotification} 
          className="bg-white text-gray-800 border border-gray-200 p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Bell size={20} />
        </button>
        <button 
          onClick={onLogout} 
          className="bg-gray-100 text-gray-800 p-3 rounded-full shadow-sm hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
        <button 
          onClick={onAddProduct} 
          className="bg-[#003b8e] text-white p-3 rounded-full shadow-md hover:bg-black transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};
