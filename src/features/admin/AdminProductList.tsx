import React from 'react';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import ProtectedImage from '../../components/ProtectedImage';
import type { Product } from '../../types';

interface AdminProductListProps {
  productsList: Product[];
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: any) => void;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({
  productsList,
  onDragStart,
  onDrop,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {productsList.map((product, index) => (
        <div 
          key={product.id} 
          draggable 
          onDragStart={(e) => onDragStart(e, index)} 
          onDragOver={(e) => e.preventDefault()} 
          onDrop={(e) => onDrop(e, index)} 
          className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-grab border border-transparent hover:border-gray-200"
        >
          <div className="text-gray-300"><GripVertical size={20} /></div>
          <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0">
            <ProtectedImage src={product.image} alt={product.name} className="w-full h-full object-cover" wrapperClassName="w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm font-semibold text-[#003b8e]">₦ {product.price}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEdit(product)} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 rounded-lg" aria-label={`Edit ${product.name}`}>
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(product.id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-lg" aria-label={`Delete ${product.name}`}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
