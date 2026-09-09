import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

export const WhatsAppFloat = () => {
  const message = encodeURIComponent("Hello OT Mildred, I would like to inquire about therapy services.");
  const whatsappUrl = `${SITE_CONFIG.whatsappBaseUrl}?text=${message}`;

  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      <div className="absolute bottom-full right-0 mb-4 w-48 bg-white text-black p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold/20">
        <p className="text-xs font-medium">Chat with us on WhatsApp. We respond during working hours.</p>
        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-gold/20 rotate-45"></div>
      </div>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#3a9b7a] hover:bg-[#2f8669] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default WhatsAppFloat;
