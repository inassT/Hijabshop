import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, PackageCheck, AlertCircle, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleCheckout = async () => {
    if (!token) {
      setError('Veuillez vous connecter pour valider la commande.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/orders/checkout');
      setOrderSuccess(true);
      fetchCart();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la validation. Vérifiez les stocks.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-2xl px-6"
        >
          <Card className="p-16 text-center !rounded-[4rem] shadow-premium bg-white">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <PackageCheck size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-4xl font-black text-darkText tracking-tighter mb-4">Mabrouk !</h2>
            <p className="text-xl text-darkText/40 mb-10 font-medium">
              Votre commande a été reçue avec succès. <br/>
              Nous préparons votre colis avec tout notre amour.
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/orders">
                <Button className="w-full !py-5 !text-lg !rounded-[2rem]">Suivre ma Commande</Button>
              </Link>
              <Link to="/shop">
                <Button variant="ghost" className="w-full !rounded-[2rem]">Continuer mes achats</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <Link to="/shop" className="flex items-center gap-2 text-babyPink font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ChevronLeft size={14} /> Retour à la Collection
            </Link>
            <h2 className="text-5xl font-black text-darkText tracking-tighter flex items-center gap-4">
              Votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyPink to-pink-400">Panier.</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-darkText/40 font-bold uppercase tracking-widest text-[10px] mb-1">{cartItems.length} Articles</p>
            <p className="text-2xl font-black text-darkText">{getCartTotal().toFixed(2)} DH</p>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 mb-12 rounded-[2rem] bg-red-50 text-red-600 flex items-center justify-between border border-red-100 font-bold"
          >
            <div className="flex items-center gap-4">
              <AlertCircle size={24} />
              <span>{error}</span>
            </div>
            {!token && (
              <Link to="/auth">
                <Button variant="danger" className="!py-2 !px-6 !text-xs">Se Connecter</Button>
              </Link>
            )}
          </motion.div>
        )}

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white/60 shadow-premium"
          >
            <div className="w-24 h-24 bg-nudeBeige/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={40} className="text-babyPink" />
            </div>
            <p className="text-2xl font-black text-darkText/30 mb-10">Votre panier est en attente de merveilles...</p>
            <Link to="/shop">
              <Button className="!px-12 !py-5 !text-lg !rounded-[2rem]">Découvrir les Collections</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Articles */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    key={item.id}
                  >
                    <Card className="p-6 bg-white overflow-hidden group">
                      <div className="flex flex-col sm:flex-row gap-8 items-center">
                        <div className="w-full sm:w-40 aspect-square rounded-[2rem] overflow-hidden shrink-0 shadow-soft">
                          <img 
                            src={item.image || `https://images.unsplash.com/photo-1621072156002-e2fcc60b4ef3?w=300&q=80`} 
                            alt={item.nom} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          />
                        </div>
                        
                        <div className="flex-grow flex flex-col w-full">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-black text-darkText tracking-tight">{item.nom}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                          
                          <Badge variant="user" className="w-fit mb-6">{item.couleur}</Badge>
                          
                          <div className="flex justify-between items-end mt-auto">
                            <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-100">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)} 
                                className="p-3 text-darkText/40 hover:text-babyPink transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center font-black text-darkText">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)} 
                                className="p-3 text-darkText/40 hover:text-babyPink transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <p className="text-3xl font-black text-darkText">{(item.prix * item.quantity).toFixed(2)} DH</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              <Card glass className="p-10 !rounded-[3rem] shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
                  <ShoppingBag size={120} />
                </div>

                <h3 className="text-2xl font-black text-darkText tracking-tighter mb-10 pb-6 border-b border-pastelPink/20">
                  Résumé Commande
                </h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-darkText/40 uppercase tracking-widest">Sous-total</span>
                    <span className="text-darkText">{getCartTotal().toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-darkText/40 uppercase tracking-widest">Expédition</span>
                    <Badge variant="confirmed">Standard Gratuite</Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-10 pt-6 border-t border-pastelPink/20">
                  <span className="text-lg font-black text-darkText">Total</span>
                  <span className="text-4xl font-black text-babyPink">{getCartTotal().toFixed(2)} DH</span>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full !py-6 !text-xl !rounded-[2.5rem] shadow-premium group"
                  isLoading={loading}
                >
                  Valider Ma Commande
                  <ArrowRight size={22} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 text-[10px] font-black text-darkText/30 uppercase tracking-widest">
                    <ShieldCheck size={16} className="text-emerald-500" /> Paiement Sécurisé SSL
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-darkText/30 uppercase tracking-widest">
                    <Truck size={16} className="text-babyPink" /> Livraison 48-72h
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-darkText/30 uppercase tracking-widest">
                    <RotateCcw size={16} className="text-blue-400" /> Retours Gratuits
                  </div>
                </div>
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

