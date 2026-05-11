import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, ShoppingBag, Users, Plus, Edit2, Trash2, 
  Search, X, Save, ShieldAlert, CheckCircle2, PackageCheck, AlertCircle, 
  Clock, Truck, RotateCcw, UserPlus, ShieldCheck, Mail, LayoutDashboard,
  TrendingUp, Activity, PieChart, ChevronRight, LogOut, ArrowUpRight, ChevronDown
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [globalMsg, setGlobalMsg] = useState({ type: '', text: '' });

  // --- Données ---
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // --- Formulaires & UI ---
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({ nom: '', description: '', prix: '', couleur: '', image: '', stock: '' });
  
  const [searchTerm, setSearchTerm] = useState('');

  // ===================== INITIALISATION =====================
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadProducts(), loadOrders(), loadUsers()]);
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const r = await api.get('/products');
      setProducts(r.data);
    } catch (e) { console.error(e); }
  };

  const loadOrders = async () => {
    try {
      const r = await api.get('/admin/orders');
      setOrders(r.data.sort((a, b) => b.id - a.id));
    } catch (e) { console.error(e); }
  };

  const loadUsers = async () => {
    try {
      const r = await api.get('/admin/users');
      setUsers(r.data);
    } catch (e) { console.error(e); }
  };

  const showToast = (text, type = 'success') => {
    setGlobalMsg({ text, type });
    setTimeout(() => setGlobalMsg({ text: '', type: '' }), 4000);
  };

  // ===================== ACTIONS =====================
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...productForm, prix: parseFloat(productForm.prix), stock: parseInt(productForm.stock) };
    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        showToast('Produit mis à jour !');
      } else {
        await api.post('/products', payload);
        showToast('Produit créé avec succès !');
      }
      setIsProductFormOpen(false);
      resetProductForm();
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Produit supprimé');
      loadProducts();
    } catch (err) { showToast('Erreur', 'error'); }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      showToast(`Commande #${orderId} : ${newStatus}`);
      loadOrders();
    } catch (err) { showToast('Erreur', 'error'); }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast('Rôle mis à jour');
      loadUsers();
    } catch (err) { showToast('Erreur', 'error'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast('Utilisateur supprimé');
      loadUsers();
    } catch (err) { showToast('Erreur', 'error'); }
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProductForm({ nom: '', description: '', prix: '', couleur: '', image: '', stock: '' });
  };

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

  // ===================== UI CONSTANTS =====================
  const sidebarItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'products', label: 'Catalogue', icon: Package },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag },
    { id: 'users', label: 'Utilisateurs', icon: Users }
  ];

  const totalRevenue = orders.filter(o => o.statut === 'LIVREE').reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      
      {/* Sidebar */}
      <div className="w-80 h-screen sticky top-0 hidden lg:flex flex-col p-8 border-r border-pastelPink/20 bg-white">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center text-white shadow-soft">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-darkText leading-none">HijabShop</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-babyPink">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-babyPink text-white shadow-xl shadow-babyPink/20' 
                    : 'text-darkText/40 hover:bg-pastelPink/10 hover:text-darkText'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={isActive ? 'text-white' : 'text-darkText/20 group-hover:text-babyPink transition-colors'} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <Button variant="danger" className="w-full !rounded-2xl !py-4" icon={LogOut} onClick={() => window.location.href = '/'}>
            Quitter l'Admin
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 lg:p-12 overflow-x-hidden">
        
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-darkText tracking-tighter">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-darkText/40 font-medium">Bon retour, Administrateur.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-darkText/30" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher partout..." 
                className="w-full bg-white border border-pastelPink/20 rounded-2xl py-4 pl-12 pr-4 focus:ring-4 focus:ring-babyPink/10 outline-none transition-all text-sm font-medium shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab === 'products' && (
              <Button onClick={() => { resetProductForm(); setIsProductFormOpen(true); }} icon={Plus}>
                Ajouter
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card glass className="p-8 flex flex-col gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-darkText/30 mb-1">Chiffre d'Affaires</p>
                  <p className="text-3xl font-black text-darkText">{totalRevenue.toFixed(2)}€</p>
                </div>
              </Card>
              <Card glass className="p-8 flex flex-col gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-darkText/30 mb-1">Commandes</p>
                  <p className="text-3xl font-black text-darkText">{orders.length}</p>
                </div>
              </Card>
              <Card glass className="p-8 flex flex-col gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-darkText/30 mb-1">Clients</p>
                  <p className="text-3xl font-black text-darkText">{users.length}</p>
                </div>
              </Card>
              <Card glass className="p-8 flex flex-col gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-darkText/30 mb-1">Produits</p>
                  <p className="text-3xl font-black text-darkText">{products.length}</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 p-10 bg-white">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-darkText">Activité Récente</h3>
                  <Badge variant="confirmed">Live Feed</Badge>
                </div>
                <div className="space-y-6">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-pastelPink/20 flex items-center justify-center text-babyPink">
                          <Activity size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-darkText text-sm">Commande #{order.id} - {order.user?.nom}</p>
                          <p className="text-xs text-darkText/30">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(order.statut)}>{order.statut}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-10 bg-premium-gradient text-white flex flex-col justify-center relative overflow-hidden">
                <PieChart className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
                <h3 className="text-2xl font-black mb-4 z-10">Optimisez <br/>vos ventes</h3>
                <p className="text-white/80 text-sm mb-8 z-10">Utilisez nos analyses pour comprendre quelles couleurs de hijab sont les plus populaires cette saison.</p>
                <Button variant="outline" className="!bg-white/20 !text-white !border-white/40 !w-fit z-10">
                  Voir Analyses <ArrowUpRight size={18} />
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[500px]">
          
          {/* TAB CATALOGUE */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {products.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                  <Card key={product.id} className="group !rounded-[2.5rem] bg-white overflow-hidden border border-pastelPink/10">
                    <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[1.5rem]">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={() => { setEditingProductId(product.id); setProductForm({...product}); setIsProductFormOpen(true); }}
                          className="p-3 bg-white/90 backdrop-blur rounded-2xl text-blue-500 shadow-xl hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-3 bg-white/90 backdrop-blur rounded-2xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-darkText truncate pr-4">{product.nom}</h3>
                        <span className="text-2xl font-black text-babyPink">{product.prix}€</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="user">{product.couleur}</Badge>
                        <span className={`text-xs font-black uppercase tracking-tighter ${product.stock < 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {product.stock} en stock
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* TAB COMMANDES */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.filter(o => o.id.toString().includes(searchTerm) || o.user?.nom.toLowerCase().includes(searchTerm.toLowerCase())).map(order => (
                <Card key={order.id} className="p-8 bg-white border border-pastelPink/5 flex flex-col lg:flex-row lg:items-center gap-10 group">
                  <div className="lg:w-64">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-babyPink tracking-[0.3em] uppercase">COMMANDE #{order.id}</span>
                    </div>
                    <h4 className="text-xl font-bold text-darkText mb-1">{order.user?.nom || 'Client'}</h4>
                    <p className="text-xs text-darkText/40 flex items-center gap-2">
                      <Clock size={14} /> {new Date(order.date).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex-grow flex flex-wrap gap-3">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group-hover:border-babyPink/20 transition-colors">
                        <img src={item.product?.image} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs font-black text-darkText">{item.quantite}x</span>
                        <span className="text-xs font-medium text-darkText/60 truncate max-w-[120px]">{item.product?.nom}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-12">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-darkText/20 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-3xl font-black text-darkText">{order.total?.toFixed(2)}€</p>
                    </div>

                    <div className="relative">
                      <div className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] border-2 transition-all ${
                        order.statut === 'EN_ATTENTE' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        order.statut === 'LIVREE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        <select 
                          value={order.statut}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-transparent font-black text-xs uppercase tracking-widest outline-none cursor-pointer appearance-none pr-6"
                        >
                          <option value="EN_ATTENTE">En attente</option>
                          <option value="CONFIRMEE">Confirmée</option>
                          <option value="EN_PREPARATION">En préparation</option>
                          <option value="EXPEDIEE">Expédiée</option>
                          <option value="LIVREE">Livrée</option>
                          <option value="ANNULEE">Annulée</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* TAB UTILISATEURS */}
          {activeTab === 'users' && (
            <Card className="bg-white overflow-hidden !rounded-[3rem] border border-pastelPink/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-darkText/30 uppercase tracking-[0.2em] border-b border-pastelPink/5">
                    <th className="p-8">Profil Utilisateur</th>
                    <th className="p-8">Contact & Accès</th>
                    <th className="p-8 text-right">Actions de Gestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pastelPink/5">
                  {users.filter(u => u.nom.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-premium-gradient text-white flex items-center justify-center font-black text-2xl shadow-soft">
                            {user.nom.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-darkText text-xl tracking-tight">{user.nom}</p>
                            <Badge variant="default" className="mt-1">ID #{user.id}</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm font-medium text-darkText/60">
                            <Mail size={16} className="text-babyPink" /> {user.email}
                          </div>
                          <Badge variant={user.role === 'ADMIN' ? 'admin' : 'user'}>
                            {user.role === 'ADMIN' ? 'Administrateur' : 'Client Standard'}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => updateUserRole(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                            className="p-4 bg-slate-100 text-darkText/40 rounded-2xl hover:bg-babyPink hover:text-white transition-all shadow-sm"
                            title="Inverser le rôle"
                          >
                            <RotateCcw size={20} />
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Modal Produit */}
        <AnimatePresence>
          {isProductFormOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-darkText/40 backdrop-blur-xl" onClick={() => setIsProductFormOpen(false)} />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden p-12">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h3 className="text-3xl font-black text-darkText tracking-tighter">{editingProductId ? 'Éditer le Hijab' : 'Nouvelle Création'}</h3>
                    <p className="text-darkText/40 font-medium">Définissez les standards du luxe.</p>
                  </div>
                  <button onClick={() => setIsProductFormOpen(false)} className="p-4 hover:bg-slate-100 rounded-3xl transition-all"><X size={28} /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4">Nom du Modèle</label>
                      <input className="input-premium !rounded-[2rem] !py-4" value={productForm.nom} onChange={e => setProductForm({...productForm, nom: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4">Couleur</label>
                      <input className="input-premium !rounded-[2rem] !py-4" value={productForm.couleur} onChange={e => setProductForm({...productForm, couleur: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4">Prix (€)</label>
                      <input className="input-premium !rounded-[2rem] !py-4" type="number" step="0.01" value={productForm.prix} onChange={e => setProductForm({...productForm, prix: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4">Stock</label>
                      <input className="input-premium !rounded-[2rem] !py-4" type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4">URL Image</label>
                      <input className="input-premium !rounded-[2rem] !py-4" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-darkText/30 ml-4">Description</label>
                    <textarea className="input-premium !rounded-[2rem] !py-6 resize-none" rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full !py-6 !text-xl !rounded-[2.5rem]" isLoading={loading}>
                    Confirmer l'Enregistrement
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Toast */}
        <AnimatePresence>
          {globalMsg.text && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-12 right-12 z-[1000] p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border-2 ${globalMsg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              {globalMsg.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <span className="font-black text-sm uppercase tracking-widest">{globalMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

