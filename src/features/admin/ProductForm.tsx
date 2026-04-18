
import { X } from 'lucide-react';

interface ProductFormProps {
  editingId: any;
  adminForm: {
    name: string;
    description: string;
    price: string;
    image: string;
    badge: string;
  };
  setAdminForm: (form: any) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ProductForm({ editingId, adminForm, setAdminForm, onSave, onClose }: ProductFormProps) {
  return (
    <div className="absolute inset-0 bg-[#f7f7f9] z-50 overflow-y-auto px-6 py-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display font-bold text-2xl">{editingId ? 'Edit Product' : 'New Product'}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 bg-gray-200/60 rounded-full w-8 h-8 flex items-center justify-center">
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
          <button onClick={onSave} className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]">
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
