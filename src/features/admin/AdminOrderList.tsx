import React from 'react';
import { Trash2, CheckCircle, Clock, Package } from 'lucide-react';
import type { Order } from '../../types';

interface AdminOrderListProps {
  orders: Order[];
  isLoading: boolean;
  onUpdateStatus: (id: any, status: string) => void;
  onDelete: (id: any) => void;
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({ 
  orders, 
  isLoading, 
  onUpdateStatus, 
  onDelete 
}) => {
  if (isLoading) {
    return <div className="text-center py-10 text-gray-400">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <Package size={40} className="mx-auto text-gray-200 mb-2" />
        <p className="text-gray-400 font-medium">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  order.status === 'paid' ? 'bg-green-100 text-green-600' : 
                  order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {order.status}
                </span>
                <span className="text-[10px] text-gray-600 font-medium flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-gray-900">{order.product_name}</h3>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#003b8e]">₦ {order.total_price.toLocaleString()}</p>
              <p className="text-[10px] text-gray-600 font-medium">Qty: {order.quantity}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <a href={`tel:${order.customer_phone}`} className="font-bold text-gray-900 underline">{order.customer_phone}</a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-bold text-gray-900 text-right max-w-[150px]">{order.customer_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment:</span>
              <span className="font-bold text-[#003b8e]">{order.payment_method.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {order.status === 'pending' && (
              <button 
                onClick={() => onUpdateStatus(order.id, 'completed')}
                className="flex-1 bg-green-50 text-green-600 py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={14} />
                Complete
              </button>
            )}
            <button 
              onClick={() => onDelete(order.id)}
              className="p-2.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl transition-all"
              aria-label="Delete Order"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
