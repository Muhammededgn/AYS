import React, { useState } from 'react';
import { 
  QrCode, 
  Scale, 
  CheckCircle2, 
  User, 
  LogOut,
  ChevronRight,
  Package,
  ArrowLeft,
  X,
  LayoutDashboard,
  History,
  Bell,
  Settings,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { Card, Button, Badge, cn } from './ui-components';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

type StaffView = 'home' | 'scan' | 'weigh' | 'success' | 'profile' | 'history';

export const ServiceStaffApp = ({ role, onLogout }: { role: string; onLogout: () => void }) => {
  const [view, setView] = useState<StaffView>('home');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const isSahaPersoneli = role === 'saha_personeli';
  const isOlcumSefi = role === 'olcum_sefi';

  const handleScan = () => {
    setView('scan');
    // Simulate scan after 2 seconds
    setTimeout(() => {
      setScannedData("LOC-102-BINA-A-KAT3");
      setView(isOlcumSefi && view === 'weigh' ? 'weigh' : (isOlcumSefi && view === 'scan' ? 'weigh' : 'success'));
      toast.success("QR Kod Başarıyla Okundu");
    }, 2000);
  };

  const [weight, setWeight] = useState('');
  const [selectedBag, setSelectedBag] = useState<string | null>(null);

  const bags = [
    { color: 'Mavi', type: 'Kağıt', hex: '#3b82f6' },
    { color: 'Sarı', type: 'Plastik', hex: '#fbbf24' },
    { color: 'Yeşil', type: 'Cam', hex: '#10b981' },
    { color: 'Siyah', type: 'Evsel', hex: '#1e293b' },
  ];

  // Tab navigation for Staff
  const staffTabs = isSahaPersoneli ? [
    { id: 'home', icon: LayoutDashboard, label: 'Ana Sayfa' },
    { id: 'scan', icon: QrCode, label: 'Atık Noktası Kontrolü Başlat' },
    { id: 'profile', icon: User, label: 'Profil' }
  ] : [
    { id: 'home', icon: LayoutDashboard, label: 'Ana Sayfa' },
    { id: 'weigh', icon: Scale, label: 'Tartım İşlemi' },
    { id: 'scan', icon: QrCode, label: 'Atık Noktası Kontrolü' },
    { id: 'profile', icon: User, label: 'Profil' }
  ];

  const handleTabClick = (id: string) => {
    if (id === 'scan') handleScan();
    else if (id === 'weigh') setView('weigh');
    else setView(id as StaffView);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <header className="bg-white px-6 h-16 border-b border-slate-100 flex items-center justify-between shrink-0 z-10">
        {view !== 'home' && view !== 'profile' ? (
          <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Package className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-slate-900 tracking-tight">EcoTrace <span className="text-emerald-600">Saha</span></span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 space-y-6"
            >
              <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-emerald-100/70 text-xs font-bold uppercase tracking-widest mb-1">Görev Başında</div>
                  <div className="text-2xl font-black mb-6">Mehmet Demir</div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/10">
                      <div className="text-[10px] uppercase opacity-70 font-black mb-1">Bugün</div>
                      <div className="text-xl font-black">12 İşlem</div>
                    </div>
                    <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/10">
                      <div className="text-[10px] uppercase opacity-70 font-black mb-1">Kalan</div>
                      <div className="text-xl font-black">4 Görev</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              </div>

              <div>
                <h3 className="font-black text-slate-800 mb-4 flex items-center justify-between px-1">
                  Günlük Rota
                  <span className="text-[10px] font-black text-emerald-600 uppercase">A Blok</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { id: '102', location: 'A Blok - Kat 3', status: 'Bekliyor', time: '14:30' },
                    { id: '103', location: 'A Blok - Kat 4', status: 'Bekliyor', time: '15:00' },
                    { id: '201', location: 'B Blok - Yemekhane', status: 'Dolu', time: 'Acil' },
                  ].map((job, i) => (
                    <Card key={i} className="p-4 rounded-3xl border-none shadow-sm flex items-center justify-between group active:bg-slate-50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-active:scale-90", job.time === 'Acil' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400')}>
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-800">{job.location}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Planlanan: {job.time}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </Card>
                  ))}
                </div>
              </div>

              {isOlcumSefi && (
                <Card className="p-6 rounded-[2rem] bg-slate-900 text-white border-none shadow-xl">
                  <h3 className="font-black mb-4">Hızlı Tartım Geçmişi</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'Plastik', weight: '4.2kg', time: '14:20' },
                      { type: 'Kağıt', weight: '12.8kg', time: '13:45' }
                    ].map((log, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                         <div className="text-xs font-bold text-white/70">{log.type}</div>
                         <div className="text-sm font-black text-emerald-400">{log.weight}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {view === 'scan' && (
            <motion.div 
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white"
            >
              <div className="w-72 h-72 border-2 border-emerald-500/50 rounded-[3rem] mb-12 relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-emerald-500 rounded-tl-[3rem] -ml-2 -mt-2" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-emerald-500 rounded-tr-[3rem] -mr-2 -mt-2" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-emerald-500 rounded-bl-[3rem] -ml-2 -mb-2" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-emerald-500 rounded-br-[3rem] -mr-2 -mb-2" />
                
                <div className="absolute inset-x-8 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-bounce" />
                <QrCode className="w-32 h-32 text-emerald-500 opacity-20" />
              </div>
              <h2 className="text-2xl font-black mb-2">QR Kodu Taratın</h2>
              <p className="text-slate-400 text-sm max-w-xs">Atık noktası üzerindeki etiketi çerçevenin içine odaklayın.</p>
              
              <button 
                onClick={() => setView('home')} 
                className="mt-12 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {view === 'weigh' && (
            <motion.div 
              key="weigh"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-8"
            >
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Seçili Nokta</div>
                <div className="text-xl font-black text-slate-900">{scannedData || 'A Blok - 3. Kat'}</div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Atık Türü Seçin</label>
                <div className="grid grid-cols-2 gap-4">
                  {bags.map((bag) => (
                    <button
                      key={bag.color}
                      onClick={() => setSelectedBag(bag.color)}
                      className={cn(
                        "p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden",
                        selectedBag === bag.color ? "border-emerald-600 bg-white shadow-xl scale-[1.02]" : "border-transparent bg-white shadow-sm"
                      )}
                    >
                      <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: bag.hex }} />
                      <div className="text-xs font-black text-slate-800 uppercase tracking-tight">{bag.type}</div>
                      {selectedBag === bag.color && (
                        <div className="absolute top-2 right-2">
                           <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Tartım Verisi (KG)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-24 text-5xl font-black text-center border-none bg-white rounded-[2rem] shadow-sm focus:ring-4 focus:ring-emerald-500/10 outline-none"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">KG</div>
                </div>
              </div>

              <Button 
                className="h-20 w-full rounded-[2rem] text-xl font-black shadow-xl shadow-emerald-100 mt-4"
                disabled={!weight || !selectedBag}
                onClick={() => {
                  toast.success("Kayıt Başarıyla Oluşturuldu");
                  setView('success');
                }}
              >
                İşlemi Tamamla
              </Button>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 relative">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                 >
                   <CheckCircle2 className="w-16 h-16" />
                 </motion.div>
                 <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-20"></div>
              </div>
              <h2 className="text-3xl font-black text-slate-900">Harika İş!</h2>
              <p className="text-slate-500 font-medium">Veriler merkeze başarıyla iletildi. Bir sonraki göreve geçmeye hazırsınız.</p>
              <Button className="w-full h-16 rounded-[2rem] font-black text-lg" onClick={() => setView('home')}>
                Ana Sayfaya Dön
              </Button>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-24 h-24 bg-slate-200 rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center text-slate-400">
                    <User className="w-12 h-12" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-slate-900">Mehmet Demir</h2>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{roleLabels[role]}</p>
                 </div>
              </div>

              <div className="space-y-3">
                 {[
                   { icon: ShieldCheck, label: 'Kişisel Bilgiler' },
                   { icon: History, label: 'Geçmiş İşlemler' },
                   { icon: Settings, label: 'Uygulama Ayarları' }
                 ].map((item, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm border border-slate-50 active:scale-98 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                            <item.icon className="w-5 h-5" />
                         </div>
                         <span className="font-bold text-slate-800">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                   </button>
                 ))}
                 
                 <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 rounded-3xl font-black mt-8 active:scale-95 transition-all"
                 >
                    <LogOut className="w-5 h-5" />
                    <span>Oturumu Kapat</span>
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Bottom Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-t border-slate-100 h-20 flex items-center justify-around px-6 shrink-0 absolute bottom-0 left-0 right-0 z-20">
        {staffTabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              view === tab.id ? "text-emerald-600 scale-110" : "text-slate-300"
            )}
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300",
              view === tab.id ? "bg-emerald-50 shadow-inner" : ""
            )}>
              <tab.icon className="w-6 h-6" strokeWidth={view === tab.id ? 2.5 : 2} />
            </div>
            <span className={cn("text-[8px] font-black uppercase tracking-tighter transition-all duration-300", view === tab.id ? "opacity-100" : "opacity-0")}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const roleLabels: Record<string, string> = {
  saha_personeli: 'Saha Personeli',
  olcum_sefi: 'Ölçüm Şefi'
};
