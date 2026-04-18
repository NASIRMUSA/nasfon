
import { Bell, Send, X } from 'lucide-react';

interface NotificationFormProps {
  notificationPayload: { title: string; message: string };
  setNotificationPayload: (payload: any) => void;
  isSending: boolean;
  onSend: (title: string, message: string) => void;
  onClose: () => void;
}

export function NotificationForm({ 
  notificationPayload, 
  setNotificationPayload, 
  isSending, 
  onSend, 
  onClose 
}: NotificationFormProps) {
  return (
    <div className="absolute inset-0 bg-[#f7f7f9] z-50 overflow-y-auto px-6 py-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display font-bold text-2xl">Broadcast Notification</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-900 bg-gray-200/60 rounded-full w-8 h-8 flex items-center justify-center">
          <X size={20} />
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8">
        <div className="mb-6 flex justify-center">
           <div className="w-16 h-16 bg-[#003b8e]/10 rounded-full flex items-center justify-center">
              <Bell size={28} className="text-[#003b8e]" />
           </div>
        </div>
        <p className="text-sm text-gray-500 mb-6 text-center">Your message will be sent to all users who have the NasFon app installed.</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Notification Title</label>
            <input 
              type="text" 
              value={notificationPayload.title} 
              onChange={e => setNotificationPayload({...notificationPayload, title: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
              placeholder="e.g. New Product Alert! 🔥" 
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Image URL (Optional)</label>
            <input 
              type="text" 
              value={(notificationPayload as any).image || ''} 
              onChange={e => setNotificationPayload({...notificationPayload, image: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] font-medium" 
              placeholder="https://example.com/image.jpg" 
            />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-gray-500 block mb-1.5">Message Content</label>
            <textarea 
              rows={3}
              value={notificationPayload.message} 
              onChange={e => setNotificationPayload({...notificationPayload, message: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003b8e] resize-none" 
              placeholder="Enter your message here..."
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-5 z-20">
        <div className="max-w-md mx-auto">
          <button 
            disabled={isSending || !notificationPayload.title || !notificationPayload.message}
            onClick={() => onSend(notificationPayload.title, notificationPayload.message)} 
            className={`w-full ${isSending || !notificationPayload.title || !notificationPayload.message ? 'bg-gray-300' : 'bg-[#003b8e] hover:bg-black'} text-white py-4 rounded-xl font-medium text-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2`}
          >
            {isSending ? 'Sending...' : (
              <>
                <Send size={20} />
                Send Notification Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
