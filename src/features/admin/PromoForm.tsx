import { X } from 'lucide-react';
import type { PromoSettings } from '../../types';

interface PromoFormProps {
  promoForm: PromoSettings;
  setPromoForm: (form: PromoSettings) => void;
  onSave: () => void;
  onClose: () => void;
}

export function PromoForm({ promoForm, setPromoForm, onSave, onClose }: PromoFormProps) {
  return (
    <div className="absolute inset-0 bg-[#f7f7f9] z-50 overflow-y-auto px-6 py-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display font-bold text-2xl">Global Discount Settings</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 bg-gray-200/60 rounded-full w-8 h-8 flex items-center justify-center">
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

          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">End Time (Optional)</label>
            <input 
              type="time" 
              value={promoForm.end_time || ''} 
              onChange={e => setPromoForm({...promoForm, end_time: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-5 z-20">
        <div className="max-w-md mx-auto">
          <button 
            onClick={onSave} 
            className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]"
          >
            Save Promo Settings
          </button>
        </div>
      </div>
    </div>
  );
}
