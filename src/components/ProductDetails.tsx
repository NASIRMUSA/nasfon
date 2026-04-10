import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, ShieldCheck, Minus, Plus } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import type { Product } from '../types';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onSuccessReturn: () => void;
  initialShowOrderModal?: boolean;
}

export default function ProductDetails({ product, onClose, onSuccessReturn, initialShowOrderModal = false }: ProductDetailsProps) {
  const [showOrderModal, setShowOrderModal] = useState(initialShowOrderModal);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [quantity, setQuantity] = useState(1);

  const currentPriceRaw = parseInt(String(product.price).replace(/,/g, ''), 10);
  const paystackConfig = {
      reference: `ref_${(new Date()).getTime()}`,
      email: "customer@example.com",
      amount: currentPriceRaw * quantity * 100, // kobo
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
      metadata: {
        custom_fields: [
          { display_name: "Phone Number", variable_name: "phone_number", value: customerPhone },
          { display_name: "Delivery Address", variable_name: "address", value: customerAddress },
          { display_name: "Quantity", variable_name: "quantity", value: quantity.toString() }
        ]
      }
  };
  const initializePayment = usePaystackPayment(paystackConfig);

  if (isSuccess) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col pt-12 pb-8 relative shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-white z-10">
          <div className="font-display font-bold text-xl tracking-tight text-[#003b8e] absolute left-1/2 -translate-x-1/2">
            <img src="https://res.cloudinary.com/dxja7dt9a/image/upload/v1775732736/nasfon-logo-transparent_oyeozo.png" alt="NasFon Logo" className="h-8 md:h-10 object-contain scale-125 hover:drop-shadow-sm transition-all" />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center text-gray-800 mt-[10vh]">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold mb-3 tracking-tight leading-tight">Payment<br/>Successful 🎉</h1>
          <p className="text-gray-500 mb-10">Your order has been received</p>
          
          <div className="w-full bg-[#f8f9fc] rounded-3xl p-6 mb-10 text-left space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Transaction Details</p>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
              <span className="text-sm text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-900">₦ {(currentPriceRaw * quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
              <span className="text-sm text-gray-500">Quantity</span>
              <span className="font-bold text-gray-900">{quantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Status</span>
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">Confirmed</span>
            </div>
          </div>
          
          <button 
            onClick={onSuccessReturn}
            className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-colors mb-6 shadow-xl shadow-black/10"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col relative shadow-2xl">
      <Helmet>
        <title>{product.name} | Nasfon Premium Shop</title>
        <meta name="description" content={`Buy ${product.name} at Nasfon. ${product.description.substring(0, 150)}...`} />
        <meta property="og:title" content={`${product.name} | Nasfon`} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.image} />
        <meta name="twitter:title" content={`${product.name} | Nasfon`} />
        <meta name="twitter:image" content={product.image} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "${product.name}",
              "image": "${product.image}",
              "description": "${product.description.replace(/"/g, '\\"')}",
              "offers": {
                "@type": "Offer",
                "price": "${parseInt(String(product.price).replace(/,/g, ''), 10)}",
                "priceCurrency": "NGN",
                "availability": "https://schema.org/InStock",
                "url": "https://nasfon.netlify.app"
              }
            }
          `}
        </script>
      </Helmet>
      <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-[#f7f7f9]/80 backdrop-blur-md z-10">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
          <div className="font-display font-bold text-xl tracking-tight text-[#003b8e] absolute left-1/2 -translate-x-1/2">
            <img src="https://res.cloudinary.com/dxja7dt9a/image/upload/v1775732736/nasfon-logo-transparent_oyeozo.png" alt="NasFon Logo" className="h-8 md:h-10 object-contain scale-125 hover:drop-shadow-sm transition-all" />
          </div>
      </header>
      
      <main className="flex-1 overflow-y-auto w-full pb-24">
        <div className="p-4">
          <div className="bg-gray-100 rounded-[2.5rem] overflow-hidden mb-6 relative aspect-[4/5] w-full group">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            {product.badge && (
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold z-10
                ${product.badge === 'SOLD OUT' ? 'bg-red-500 text-white' : 'bg-white text-gray-900 shadow-md'}
              `}>
                {product.badge}
              </div>
            )}
          </div>
          
          <div className="px-2">
            <div className="flex justify-between items-start mb-2">
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-gray-900">
                {product.name.split(' ').map((word: string, i: number) => (
                  <React.Fragment key={i}>{word}{i === 0 ? <br/> : ' '}</React.Fragment>
                ))}
              </h1>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-6 flex items-baseline gap-1">
              <span className="text-base font-semibold">₦</span> {(currentPriceRaw * quantity).toLocaleString()}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">Quantity</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="prose prose-sm text-gray-500 leading-relaxed mb-8">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </main>
      
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 p-5 pb-8 space-y-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setShowOrderModal(true)}
          className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]"
        >
          Buy Now →
        </button>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 font-medium">
          <ShieldCheck size={14} className="text-green-600" />
          Secure payment via Paystack
        </div>
      </div>

      {showOrderModal && (
        <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-[2.5rem] p-6 pt-8 pb-10 shadow-2xl animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-2xl">Delivery Details</h2>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl pb-1">×</button>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Phone Number</label>
                <input type="tel" placeholder="0801 234 5678" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e]" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Delivery Address</label>
                <textarea placeholder="Enter full delivery address..." rows={3} value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] resize-none"></textarea>
              </div>
            </div>
            <button 
              onClick={() => {
                if (!customerPhone.trim() || !customerAddress.trim()) {
                  alert("Please fill in both phone number and delivery address.");
                  return;
                }
                if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
                  alert("Please add VITE_PAYSTACK_PUBLIC_KEY to your .env file");
                  return;
                }
                initializePayment({
                  onSuccess: () => { setShowOrderModal(false); setIsSuccess(true); },
                  onClose: () => {}
                });
              }}
              className="w-full bg-[#003b8e] text-white py-4 rounded-xl font-medium text-lg hover:bg-black transition-transform active:scale-[0.98]"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
