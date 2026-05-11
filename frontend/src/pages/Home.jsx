import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Heart, Star, ShoppingBag, Wand2 } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-[#FAF9F6]">
      <div className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8 text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-babyPink/10 text-babyPink rounded-full w-fit mx-auto lg:mx-0">
                <Sparkles size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exclusivité HijabShop</span>
              </div>

              <h1 className="text-7xl lg:text-9xl font-black text-darkText leading-[0.85] tracking-tighter">
                L'Élégance <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-babyPink to-pink-400">Révélée.</span>
              </h1>

              <p className="text-xl text-darkText/40 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                Plus qu'un voile, une expression de votre identité. Découvrez notre collection premium guidée par notre intelligence colorimétrique unique.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 mt-4 justify-center lg:justify-start">
                <Link to="/shop">
                  <Button className="!px-12 !py-6 !text-lg !rounded-full shadow-2xl shadow-babyPink/30 group" icon={ArrowRight}>
                    Explorer la Collection
                  </Button>
                </Link>
                <Link to="/recommendation">
                  <Button variant="outline" className="!px-12 !py-6 !text-lg !rounded-full bg-white/40 backdrop-blur-md" icon={Wand2}>
                    Analyse Colorimétrique
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Visual Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative lg:h-[700px] flex justify-center items-center"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-pastelPink/30 to-nudeBeige/30 rounded-full blur-[120px] -z-10"
              />
              
              <div className="relative group">
                <div className="absolute -inset-6 bg-white/20 backdrop-blur-xl rounded-[4rem] -rotate-3 transition-transform group-hover:rotate-0 duration-1000" />
                <div className="relative z-10 w-full max-w-[480px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-premium border-[16px] border-white">
                  <img 
                    src="https://ae-pic-a1.aliexpress-media.com/kf/H590ef8eec2b14edfbc54f1f1f1bdb59f1.jpg" 
                    alt="Modèle Hijab Premium" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                  />
                  
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-10 left-10 right-10 glass-panel p-8 shadow-2xl border-white/60 text-center"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-babyPink mb-2">Nouveauté Automne</p>
                    <p className="text-2xl font-black text-darkText tracking-tighter">Collection Soie 2026</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32"
          >
            {[
              { icon: ShieldCheck, title: "Qualité Supérieure", desc: "Soie et tissus nobles sélectionnés avec une rigueur absolue." },
              { icon: Zap, title: "Technologie AI", desc: "Notre algorithme définit la palette qui illumine votre visage." },
              { icon: ShoppingBag, title: "Service Concierge", desc: "Une expérience d'achat fluide et un support dédié 24/7." }
            ].map((value, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center p-10 bg-white rounded-[3rem] shadow-premium hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 bg-babyPink/10 rounded-2xl flex items-center justify-center text-babyPink mb-8">
                  <value.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-darkText tracking-tight mb-4">{value.title}</h3>
                <p className="text-darkText/40 font-medium leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Collection */}
          <div className="mb-32">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div>
                <h2 className="text-5xl font-black text-darkText tracking-tighter mb-4">La Sélection <span className="text-babyPink">Iconique.</span></h2>
                <p className="text-darkText/40 font-bold uppercase tracking-widest text-xs">Nos pièces les plus convoitées du moment</p>
              </div>
              <Link to="/shop">
                <Button variant="ghost" className="!rounded-2xl" icon={ArrowRight}>Voir toute la boutique</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Medina Silk Nude", price: "45€", img: "https://images.unsplash.com/photo-1621072156002-e2fcc60b4ef3?w=500" },
                { name: "Satin Royal Pearl", price: "55€", img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500" },
                { name: "Premium Jersey Rose", price: "35€", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500" },
                { name: "Chiffon Creamy", price: "39€", img: "https://images.unsplash.com/photo-1552046122-03184de85e08?w=500" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-6">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-black text-darkText tracking-tight">{item.name}</h4>
                        <p className="text-babyPink font-black">{item.price}</p>
                      </div>
                      <button className="w-10 h-10 bg-darkText text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-darkText rounded-[4rem] p-12 lg:p-24 overflow-hidden mb-32"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-babyPink/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="confirmed" className="mb-8 !px-6 !py-2 !text-xs">Propulsé par HijabTech AI</Badge>
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                  Ne choisissez plus <br/>
                  <span className="text-babyPink">au hasard.</span>
                </h2>
                <p className="text-white/40 text-lg font-medium mb-12 max-w-md">
                  Notre outil d'analyse colorimétrique détermine scientifiquement les teintes qui complètent parfaitement votre carnation.
                </p>
                <Link to="/recommendation">
                  <Button className="!px-10 !py-5 !rounded-full !bg-white !text-darkText hover:!bg-babyPink hover:!text-white shadow-2xl shadow-black/50" icon={Wand2}>
                    Démarrer l'Analyse
                  </Button>
                </Link>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-64 h-64 border-2 border-white/10 rounded-full flex items-center justify-center relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-babyPink/40 rounded-full"
                  />
                  <Wand2 size={80} className="text-babyPink animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}


