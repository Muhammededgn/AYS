import React from 'react';
import { motion } from 'framer-motion';
import { 
  Recycle, 
  BarChart3, 
  ShieldCheck, 
  Smartphone, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  Building2,
  Users
} from 'lucide-react';
import { Button } from './ui-components';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const LandingPage = ({ onLogin }: { onLogin: (role: string) => void }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Recycle className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">EcoTrace</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Özellikler</a>
            <a href="#impact" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Çevresel Etki</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:flex" onClick={() => onLogin('platform_admin')}>Admin</Button>
            <Button onClick={() => onLogin('corp_admin')}>Giriş Yap</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Sürdürülebilir Gelecek İçin Dijital Dönüşüm
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Kurumsal Atık Yönetiminde <span className="text-emerald-600">Yeni Nesil</span> Standart.
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl">
              EcoTrace, kurumların sıfır atık hedeflerine ulaşmasını sağlayan, uçtan uca dijital takip ve raporlama sunan kapsamlı bir atık yönetim platformudur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="h-12 px-8 text-base" onClick={() => onLogin('corp_admin')}>
                Hemen Başlayın <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="h-12 px-8 text-base" onClick={() => onLogin('service_staff')}>
                Saha Personeli Girişi
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-slate-400">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">1.2M+</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Ton Geri Dönüşüm</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900">500+</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Aktif Kurum</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1762805544550-f12a8ebceb2e?q=80&w=1080"
                alt="EcoTrace Dashboard"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Aylık Tasarruf</div>
                  <div className="text-lg font-bold text-slate-900">%24 Artış</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[74%]" />
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[45%]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Operasyonel Mükemmellik</h2>
            <p className="text-slate-600">
              Atık yönetim süreçlerinizi kağıttan dijitale taşıyarak verimliliği artırın, hataları minimize edin ve yasal regülasyonlara tam uyum sağlayın.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Regülasyon Uyumu",
                desc: "Sıfır atık yönetmeliği ve diğer yasal gerekliliklere %100 uyumlu raporlama ve takip sistemi."
              },
              {
                icon: BarChart3,
                title: "Gerçek Zamanlı Analiz",
                desc: "Kampüs, bina ve birim bazlı atık verilerini anlık olarak izleyin ve stratejik kararlar alın."
              },
              {
                icon: Smartphone,
                title: "Mobil Saha Yönetimi",
                desc: "Saha personelinin QR kod ile hızlı veri girişi yapmasını sağlayan kullanıcı dostu mobil arayüz."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 italic">"Veriyle yönetilen sürdürülebilirlik, gezegenimiz için en büyük yatırım."</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "CO2 Azaltımı", val: "450 Ton" },
              { label: "Su Tasarrufu", val: "2.1M Litre" },
              { label: "Enerji Tasarrufu", val: "1.2 GWh" },
              { label: "Geri Kazanım", val: "85%" }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">{stat.val}</div>
                <div className="text-emerald-200 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Recycle className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">EcoTrace</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 EcoTrace Waste Management Systems. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-emerald-600">Gizlilik</a>
            <a href="#" className="text-sm text-slate-500 hover:text-emerald-600">Şartlar</a>
            <a href="#" className="text-sm text-slate-500 hover:text-emerald-600">Destek</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
