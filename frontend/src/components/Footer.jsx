import { motion } from 'framer-motion';
import { ShoppingBag, Mail, MapPin, Phone, Sparkles, ArrowRight, Globe, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-pastelPink/20 pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-babyPink/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-babyPink rounded-xl flex items-center justify-center text-white shadow-lg shadow-babyPink/20 transition-transform group-hover:rotate-12">
                <ShoppingBag size={20} />
              </div>
              <span className="text-2xl font-black text-darkText tracking-tighter">Hijab<span className="text-babyPink">Shop.</span></span>
            </Link>
            <p className="text-darkText/40 font-medium leading-relaxed">
              L'excellence du hijab moderne. Une fusion entre tradition et élégance contemporaine pour la femme d'aujourd'hui.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageCircle, Share2].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-darkText/40 hover:bg-babyPink hover:text-white transition-all">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-darkText uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Accueil', 'Boutique', 'Colorimétrie AI', 'Mon Panier'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Accueil' ? '/' : item === 'Boutique' ? '/shop' : item === 'Colorimétrie AI' ? '/recommendation' : '/cart'} 
                    className="text-darkText/40 font-bold hover:text-babyPink transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-babyPink scale-0 group-hover:scale-100 transition-transform" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-black text-darkText uppercase tracking-[0.2em] mb-8">Service Client</h4>
            <ul className="space-y-4">
              {['Livraison & Retours', 'Guide des Tailles', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <button className="text-darkText/40 font-bold hover:text-babyPink transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-babyPink scale-0 group-hover:scale-100 transition-transform" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Sparkles size={80} />
            </div>
            <h4 className="text-sm font-black text-darkText uppercase tracking-[0.2em] mb-4">Newsletter</h4>
            <p className="text-xs font-bold text-darkText/30 mb-6 uppercase tracking-widest leading-relaxed">Recevez nos collections privées</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="votre@email.com" 
                className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-babyPink/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-babyPink text-white p-2 rounded-xl shadow-lg shadow-babyPink/20 hover:scale-110 transition-transform">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-pastelPink/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-darkText/20 uppercase tracking-[0.3em]">
            &copy; 2026 HijabShop Luxury. Crafted with Love.
          </p>
          <div className="flex gap-8">
            <button className="text-[10px] font-black text-darkText/20 uppercase tracking-[0.3em] hover:text-babyPink">Mentions Légales</button>
            <button className="text-[10px] font-black text-darkText/20 uppercase tracking-[0.3em] hover:text-babyPink">Confidentialité</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
