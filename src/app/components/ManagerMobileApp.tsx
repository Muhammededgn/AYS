import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Bell, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Box,
  LogOut,
  Settings,
  Menu,
  X,
  Search,
  Filter,
  Calendar,
  Zap,
  Droplets,
  Trees,
  FileText,
  Clock,
  ArrowUpRight,
  Archive,
  ClipboardCheck,
  User,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Card, Button, Badge, cn } from './ui-components';
import { motion, AnimatePresence } from 'motion/react';

interface ManagerMobileAppProps {
  role: 'corp_admin' | 'campus_lead' | 'bina_sorumlusu';
  onLogout: () => void;
}

type TabType = 'home' | 'stock' | 'users' | 'waste_points' | 'ops' | 'profile' | 'scan';

export const ManagerMobileApp = ({ role, onLogout }: ManagerMobileAppProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const roleConfig = {
    corp_admin: {
      label: 'Kurum Yöneticisi',
      theme: 'bg-emerald-600',
      lightTheme: 'bg-emerald-50 text-emerald-600',
      tabs: [
        { id: 'home', icon: LayoutDashboard, label: 'Ana Sayfa' },
        { id: 'stock', icon: Archive, label: 'Stok Takibi' },
        { id: 'users', icon: Users, label: 'Kullanıcı Yön.' },
        { id: 'waste_points', icon: MapPin, label: 'Atık Noktası' },
        { id: 'profile', icon: User, label: 'Profil' }
      ]
    },
    campus_lead: {
      label: 'Kampüs Sorumlusu',
      theme: 'bg-blue-600',
      lightTheme: 'bg-blue-50 text-blue-600',
      tabs: [
        { id: 'home', icon: LayoutDashboard, label: 'Ana Sayfa' },
        { id: 'users', icon: Users, label: 'Kullanıcı' },
        { id: 'scan', icon: CheckCircle2, label: 'Kontrol' },
        { id: 'ops', icon: ClipboardCheck, label: 'Operasyon' },
        { id: 'profile', icon: User, label: 'Profil' }
      ]
    },
    bina_sorumlusu: {
      label: 'Bina Sorumlusu',
      theme: 'bg-indigo-600',
      lightTheme: 'bg-indigo-50 text-indigo-600',
      tabs: [
        { id: 'home', icon: LayoutDashboard, label: 'Ana Sayfa' },
        { id: 'ops', icon: ClipboardCheck, label: 'Operasyon' },
        { id: 'scan', icon: CheckCircle2, label: 'Kontrol' },
        { id: 'waste_points', icon: MapPin, label: 'Noktalar' },
        { id: 'users', icon: Users, label: 'Kullanıcı' },
        { id: 'profile', icon: User, label: 'Profil' }
      ]
    }
  };

  const config = roleConfig[role];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans">
      {/* Header */}
      <header className={cn("px-6 pt-12 pb-8 text-white shrink-0 relative transition-all duration-500", config.theme)}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Box className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tight">EcoTrace <span className="text-white/60 font-medium">Pro</span></h1>
                <div className="flex items-center gap-1.5 opacity-80">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
                </div>
             </div>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative z-10">
           <h2 className="text-xl font-black mb-1">Merhaba, Ahmet</h2>
           <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Bugün her şey kontrol altında.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Role Specific Quick Summary */}
              <div className="grid grid-cols-2 gap-4">
                 <Card className="p-5 rounded-[2rem] border-none shadow-sm flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                       <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                       <div className="text-lg font-black text-slate-900">%94</div>
                       <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verimlilik</div>
                    </div>
                 </Card>
                 <Card className="p-5 rounded-[2rem] border-none shadow-sm flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                       <Box className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                       <div className="text-lg font-black text-slate-900">1.2t</div>
                       <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Top. Atık</div>
                    </div>
                 </Card>
              </div>

              {/* Sustainability Impact Section */}
              <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-lg font-black mb-1">Eko-Tasarruf</h3>
                  <p className="text-white/50 text-[10px] font-bold uppercase mb-8">Kurumsal Etki Özeti</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black">1.2k</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black">450t</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-300/20 flex items-center justify-center text-emerald-300 border border-emerald-300/20">
                        <Trees className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black">84</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Critical Alerts */}
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Kritik Bildirimler</h3>
                <div className="space-y-3">
                   <Card className="p-5 rounded-[2rem] border-none shadow-sm relative overflow-hidden group active:bg-slate-50 transition-all">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                            <div className="text-sm font-black text-slate-800">Doluluk Alarmı</div>
                            <div className="text-xs text-slate-500 font-medium">B Blok 3. Kat %95 dolu.</div>
                         </div>
                         <ArrowUpRight className="w-5 h-5 text-slate-300" />
                      </div>
                   </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stock' && (
            <motion.div 
              key="stock"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
               <h2 className="text-xl font-black text-slate-900">Stok Takibi</h2>
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { type: 'Plastik', amount: '1.2t', cap: '%60', color: 'blue' },
                    { type: 'Kağıt', amount: '0.8t', cap: '%45', color: 'emerald' },
                    { type: 'Cam', amount: '1.5t', cap: '%85', color: 'amber' }
                  ].map((item, i) => (
                    <Card key={i} className="p-5 rounded-[2rem] border-none shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-${item.color}-50 text-${item.color}-600`)}>
                                <Box className="w-5 h-5" />
                             </div>
                             <span className="font-black text-slate-800">{item.type}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">{item.cap} Dolu</Badge>
                       </div>
                       <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                          <div className={cn("h-full", `bg-${item.color}-500`)} style={{ width: item.cap }}></div>
                       </div>
                    </Card>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
               <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-black text-slate-900">Kullanıcı Yönetimi</h2>
                  <Button className="h-10 rounded-xl px-4 text-xs">Ekle</Button>
               </div>
               <div className="space-y-3">
                  {[
                    { name: 'Can Öz', role: 'Saha Personeli', loc: 'A Blok' },
                    { name: 'Mehmet Demir', role: 'Saha Personeli', loc: 'B Blok' },
                    { name: 'Selin Ak', role: 'Ölçüm Şefi', loc: 'Merkez Kampüs' }
                  ].map((user, i) => (
                    <Card key={i} className="p-4 rounded-3xl border-none shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                             {user.name[0]}
                          </div>
                          <div>
                             <div className="text-sm font-black text-slate-800">{user.name}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-black text-emerald-600 uppercase">{user.loc}</div>
                       </div>
                    </Card>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'waste_points' && (
            <motion.div 
              key="points"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
               <h2 className="text-xl font-black text-slate-900">Atık Noktaları</h2>
               <div className="grid grid-cols-1 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="p-5 rounded-[2rem] border-none shadow-sm flex items-center justify-between group active:scale-98 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                             <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="text-sm font-black text-slate-800">Nokta #10{i}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A Blok • Kat {i}</div>
                          </div>
                       </div>
                       <ChevronRight className="w-5 h-5 text-slate-300" />
                    </Card>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'ops' && (
            <motion.div 
              key="ops"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
               <h2 className="text-xl font-black text-slate-900">Operasyonel Kontroller</h2>
               <div className="space-y-4">
                  {[
                    { title: 'Günlük Denetim', status: 'Tamamlandı', time: '14:30', color: 'emerald' },
                    { title: 'Haftalık Kontrol', status: 'Bekliyor', time: 'Bugün', color: 'blue' },
                    { title: 'Saha Denetimi', status: 'Planlandı', time: 'Yarın', color: 'slate' }
                  ].map((op, i) => (
                    <Card key={i} className="p-6 rounded-[2.5rem] border-none shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center", `bg-${op.color}-50 text-${op.color}-600`)}>
                             <ClipboardCheck className="w-7 h-7" />
                          </div>
                          <div>
                             <div className="text-base font-black text-slate-800">{op.title}</div>
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{op.time}</div>
                          </div>
                       </div>
                       <Badge variant="secondary" className={cn("text-[9px] font-black uppercase", `bg-${op.color}-100 text-${op.color}-700 border-none`)}>
                          {op.status}
                       </Badge>
                    </Card>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'scan' && (
             <motion.div 
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white pb-24"
            >
              <div className="w-64 h-64 border-2 border-emerald-500/50 rounded-[2.5rem] mb-12 relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-8 border-l-8 border-emerald-500 rounded-tl-[2.5rem] -ml-2 -mt-2" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-8 border-r-8 border-emerald-500 rounded-tr-[2.5rem] -mr-2 -mt-2" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-8 border-l-8 border-emerald-500 rounded-bl-[2.5rem] -ml-2 -mb-2" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-8 border-r-8 border-emerald-500 rounded-br-[2.5rem] -mr-2 -mb-2" />
                <QrCode className="w-24 h-24 text-emerald-500 opacity-20" />
              </div>
              <h2 className="text-xl font-black mb-2">QR Denetimi</h2>
              <p className="text-slate-400 text-xs">Atık noktası kontrolünü başlatmak için kodu taratın.</p>
              <button 
                onClick={() => setActiveTab('home')} 
                className="mt-12 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {activeTab === 'profile' && (
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
                    <h2 className="text-xl font-black text-slate-900">Ahmet Yılmaz</h2>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{config.label}</p>
                 </div>
              </div>

              <div className="space-y-3">
                 {[
                   { icon: ShieldCheck, label: 'Kişisel Bilgiler' },
                   { icon: Bell, label: 'Bildirim Tercihleri' },
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
      </main>

      {/* Dynamic Bottom Navigation based on Role */}
      <nav className="bg-white/90 backdrop-blur-xl border-t border-slate-100 h-20 flex items-center justify-around px-2 shrink-0 absolute bottom-0 left-0 right-0 z-20">
        {config.tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300 flex-1 min-w-0",
              activeTab === tab.id ? "text-slate-900 scale-105" : "text-slate-300"
            )}
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-300",
              activeTab === tab.id ? `${config.lightTheme} shadow-sm` : ""
            )}>
              <tab.icon className="w-5 h-5" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            <span className={cn("text-[7px] font-black uppercase tracking-tighter transition-all duration-300 truncate w-full text-center", activeTab === tab.id ? "opacity-100" : "opacity-0")}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Refined Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-80 bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-slate-50">
                 <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white", config.theme)}>
                       <Box className="w-5 h-5" />
                    </div>
                    <span className="font-black text-slate-900">Menü</span>
                 </div>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex-1 p-6 space-y-2">
                 {/* Sidebar menu items can be added here if needed */}
                 <p className="text-xs text-slate-400 font-bold px-3 py-2 uppercase tracking-widest">Hızlı Erişim</p>
                 <button className="w-full flex items-center gap-3 px-4 py-4 rounded-3xl hover:bg-slate-50 transition-colors text-slate-700 font-bold">
                    <Settings className="w-5 h-5 text-slate-400" />
                    <span>Ayarlar</span>
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
