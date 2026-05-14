import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle2, Truck, CheckCircle, XCircle, ShoppingBag, Calendar, ChevronRight, Hash, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('Identifiez-vous pour accéder à vos commandes.');
      setLoading(false);
      return;
    }

    api.get(`/orders/user/${userId}`)
      .then(response => {
        setOrders(response.data.sort((a, b) => b.id - a.id));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Impossible de récupérer l\'historique des commandes.');
        setLoading(false);
      });
  }, [userId]);

  const getStatusVariant = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'waiting';
      case 'CONFIRMEE': return 'confirmed';
      case 'EN_PREPARATION': return 'preparing';
      case 'EXPEDIEE': return 'shipped';
      case 'LIVREE': return 'delivered';
      case 'ANNULEE': return 'cancelled';
      default: return 'default';
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FAF9F6]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <Link to="/shop" className="flex items-center gap-2 text-babyPink font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-[-4px] transition-transform w-fit">
              <ArrowLeft size={14} /> Retour à la Boutique
            </Link>
            <h2 className="text-5xl font-black text-darkText tracking-tighter">
              Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyPink to-pink-400">Commandes.</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-darkText/40 font-bold uppercase tracking-widest text-[10px] mb-1">Historique Complet</p>
            <p className="text-2xl font-black text-darkText">{orders.length} Expériences</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white/60">
            <div className="w-16 h-16 border-4 border-pastelPink border-t-babyPink rounded-full animate-spin"></div>
            <p className="text-darkText/40 font-black uppercase tracking-widest text-xs">Chargement de votre univers...</p>
          </div>
        ) : error ? (
          <Card className="p-8 border-2 border-red-100 bg-red-50 text-red-600 text-center !rounded-[2.5rem]">
            <p className="font-bold">{error}</p>
            <Link to="/auth">
              <Button variant="danger" className="mt-4 !rounded-xl">Se Connecter</Button>
            </Link>
          </Card>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white/40 backdrop-blur-xl rounded-[4rem] border border-white/60 shadow-premium"
          >
            <div className="w-24 h-24 bg-nudeBeige/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={40} className="text-babyPink" />
            </div>
            <p className="text-2xl font-black text-darkText/30 mb-10">Votre voyage HijabShop commence ici.</p>
            <Link to="/shop">
              <Button className="!px-12 !py-5 !text-lg !rounded-[2rem]">Découvrir les Collections</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-8">
            {orders.map((order, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={order.id}
              >
                <Card className="p-10 bg-white hover:shadow-premium transition-all duration-500 group">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Status & ID */}
                    <div className="lg:w-64 shrink-0">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-darkText/30 group-hover:bg-babyPink group-hover:text-white transition-colors duration-500">
                          <Hash size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-darkText/30 uppercase tracking-[0.2em] mb-1">Commande</p>
                          <p className="text-xl font-black text-darkText tracking-tighter">#{order.id}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(order.statut)} className="!px-6 !py-2 !text-xs !rounded-xl">
                        {order.statut.replace('_', ' ')}
                      </Badge>
                      <div className="mt-8 pt-8 border-t border-pastelPink/10">
                        <p className="text-[10px] font-black text-darkText/30 uppercase tracking-[0.2em] mb-2">Placée le</p>
                        <div className="flex items-center gap-2 text-darkText font-bold text-sm">
                          <Calendar size={16} className="text-babyPink" />
                          {new Date(order.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex-grow flex flex-col gap-4">
                      <p className="text-[10px] font-black text-darkText/30 uppercase tracking-[0.2em] mb-2">Sélection Luxury</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-soft transition-all cursor-default">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                              <img src={item.product?.image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-darkText truncate text-sm mb-1">{item.product?.nom}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-babyPink bg-babyPink/10 px-2 py-0.5 rounded-md uppercase">{item.quantite}X</span>
                                <span className="text-xs font-bold text-darkText/40">{item.prix.toFixed(2)} DH</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total & Action */}
                    <div className="lg:w-48 flex flex-col justify-between items-end shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-darkText/30 uppercase tracking-[0.2em] mb-1">Total TTC</p>
                        <p className="text-4xl font-black text-darkText tracking-tighter">{order.total?.toFixed(2)}<span className="text-xl ml-1 text-babyPink"> DH</span></p>
                      </div>
                      
                      <Button variant="outline" className="!rounded-2xl group/btn !py-3 !px-6">
                        Détails <ChevronRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

