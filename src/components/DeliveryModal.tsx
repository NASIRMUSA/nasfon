import { CreditCard, Truck } from 'lucide-react';

export type PaymentMethod = 'pay_now' | 'pay_on_delivery';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerPhone: string;
  setCustomerPhone: (value: string) => void;
  customerAddress: string;
  setCustomerAddress: (value: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
  onProceed: () => void;
}

export default function DeliveryModal({
  isOpen,
  onClose,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  paymentMethod,
  setPaymentMethod,
  onProceed
}: DeliveryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
      <div className="bg-white rounded-t-[2.5rem] p-6 pt-8 pb-10 shadow-2xl animate-in slide-in-from-bottom-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display font-bold text-2xl">Delivery Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl pb-1"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              placeholder="0801 234 5678" 
              value={customerPhone} 
              onChange={e => setCustomerPhone(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e]" 
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Delivery Address</label>
            <textarea 
              placeholder="Enter full delivery address..." 
              rows={3} 
              value={customerAddress} 
              onChange={e => setCustomerAddress(e.target.value)} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] resize-none"
            ></textarea>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm font-semibold text-gray-700 block mb-3">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('pay_now')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'pay_now' 
                  ? 'border-[#003b8e] bg-[#003b8e]/5 text-[#003b8e]' 
                  : 'border-gray-100 text-gray-500 hover:border-gray-200'
              }`}
            >
              <CreditCard size={24} />
              <span className="text-xs font-bold">Pay Now</span>
            </button>
            <button
              onClick={() => setPaymentMethod('pay_on_delivery')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                paymentMethod === 'pay_on_delivery' 
                  ? 'border-[#003b8e] bg-[#003b8e]/5 text-[#003b8e]' 
                  : 'border-gray-100 text-gray-500 hover:border-gray-200'
              }`}
            >
              <Truck size={24} />
              <span className="text-xs font-bold">Pay on Delivery</span>
            </button>
          </div>
        </div>
        
        <button 
          onClick={onProceed}
          className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]"
        >
          {paymentMethod === 'pay_now' ? 'Proceed to Payment' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
}
