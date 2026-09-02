import React, { useState } from 'react';
import { Zap, Heart, Mail, MessageCircle, X } from 'lucide-react';


interface DevCreditProps {
  whatsappNumber?: string;
  email?: string;
  dark?: boolean;
}

export const DevCredit: React.FC<DevCreditProps> = ({ 
  whatsappNumber = '', 
  email = 'codezardi@gmail.com',
  dark = true
}) => {
  const [showModal, setShowModal] = useState(false);

  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <>
      {/* Developer Credit Footer Text */}
      <div className={`text-center text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center space-x-1.5 ${dark ? 'text-[#333]':'text-slate-300/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'}`}>
        <span>Desarrollado con</span>
        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse inline-block" />
        <span>por</span>
        <button 
          onClick={() => setShowModal(true)}
          className={`${dark ? 'text-cyan-800':'text-cyan-300'} hover:text-cyan-200 font-bold underline underline-offset-4 decoration-cyan-400/50 hover:decoration-cyan-300 transition-colors cursor-pointer`}
        >
          codezardi
        </button>
      </div>

      {/* Developer Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-cyan-950/50 text-white animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-wide text-white">codezardi</h3>
              <p className="text-xs text-slate-400 mt-1">Desarrollo software administrativo a la medida de tu negocio, optimizando procesos, controlando operaciones en tiempo real y eliminando errores manuales con interfaces rápidas.</p>
            </div>

            {/* Action Links */}
            <div className="space-y-3">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 w-full p-3.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-2xl text-emerald-300 font-medium transition-all group"
              >
                <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-emerald-400/80">Escríbeme al</p>
                  <p className="text-sm font-bold">WhatsApp</p>
                </div>
              </a>

              <a 
                href={`mailto:${email}`} 
                className="flex items-center space-x-3 w-full p-3.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-2xl text-cyan-300 font-medium transition-all group"
              >
                <div className="p-2 bg-cyan-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-cyan-400/80">Envíame un</p>
                  <p className="text-sm font-bold">Correo Electrónico: {email}</p>
                </div>
              </a>
            </div>

            {/* Footer note inside modal */}
            <p className="text-center text-[10px] text-slate-200 mt-6">
              ¿Necesitas un sistema o landing page? ¡Contáctame!
            </p>
          </div>
        </div>
      )}
    </>
  );
};