import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { CorporateDashboard } from './components/CorporateDashboard';
import { ServiceStaffApp } from './components/ServiceStaffApp';
import { PlatformAdmin } from './components/PlatformAdmin';
import { ManagerMobileApp } from './components/ManagerMobileApp';
import { 
  Settings, 
  User, 
  Laptop, 
  Smartphone, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Monitor,
  X,
  RefreshCw,
  Tablet
} from 'lucide-react';
import { cn } from './components/ui/utils';
import { motion, AnimatePresence } from 'motion/react';

type AppState = 'landing' | 'corp_admin' | 'campus_lead' | 'bina_sorumlusu' | 'saha_personeli' | 'olcum_sefi' | 'platform_admin';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [showFrame, setShowFrame] = useState(true);

  // Scroll to top on state change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state]);

  const handleLogin = (role: string) => {
    if (role === 'corp_admin') setState('corp_admin');
    else if (role === 'service_staff') setState('saha_personeli');
    else if (role === 'platform_admin') setState('platform_admin');
    else setState(role as AppState);
  };

  const handleLogout = () => {
    setState('landing');
    setViewMode('desktop');
  };

  const isStaffRole = state === 'saha_personeli' || state === 'olcum_sefi';
  const isManagerRole = state === 'corp_admin' || state === 'campus_lead' || state === 'bina_sorumlusu';
  
  // Decide which mobile component to render
  const renderAppView = () => {
    if (isStaffRole) return <ServiceStaffApp role={state} onLogout={handleLogout} />;
    if (isManagerRole && (viewMode === 'mobile' || viewMode === 'tablet')) {
      return <ManagerMobileApp role={state as any} onLogout={handleLogout} />;
    }
    if (isManagerRole && viewMode === 'desktop') {
      return <CorporateDashboard userRole={state as any} onLogout={handleLogout} />;
    }
    if (state === 'platform_admin') return <PlatformAdmin onLogout={handleLogout} />;
    if (state === 'landing') return <LandingPage onLogin={handleLogin} />;
    return null;
  };

  // Determine if we should show the device frame
  const needsFrame = (isStaffRole || (isManagerRole && viewMode !== 'desktop')) && showFrame;

  return (
    <div className="antialiased text-slate-900 bg-slate-50 min-h-screen font-sans">
      <Toaster position="top-center" expand={true} richColors />
      
      <main className={cn(
        "transition-all duration-500 min-h-screen flex flex-col",
        needsFrame ? "bg-slate-200 py-12 px-4 items-center justify-center" : "bg-white"
      )}>
        {needsFrame ? (
          <DeviceFrame mode={viewMode} showFrame={showFrame}>
            {renderAppView()}
          </DeviceFrame>
        ) : (
          <div className="w-full flex-1 flex flex-col">
            {renderAppView()}
          </div>
        )}
      </main>

      {/* FIXED DEMO CONTROLLER - REFINED */}
      <div className="fixed bottom-8 right-8 z-[10000]">
        <AnimatePresence>
          {isSwitcherOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] p-5 w-80 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Simülatörü</span>
                </div>
                <button onClick={() => setIsSwitcherOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* View Mode Selection */}
                <div className="space-y-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter px-1">Görünüm Modu</p>
                  <div className="grid grid-cols-3 gap-2">
                    <ViewButton 
                      active={viewMode === 'desktop'} 
                      onClick={() => { setViewMode('desktop'); setShowFrame(false); }}
                      icon={<Monitor className="w-4 h-4" />}
                      label="Masaüstü"
                    />
                    <ViewButton 
                      active={viewMode === 'tablet'} 
                      onClick={() => { setViewMode('tablet'); setShowFrame(true); }}
                      icon={<Tablet className="w-4 h-4" />}
                      label="Tablet"
                    />
                    <ViewButton 
                      active={viewMode === 'mobile'} 
                      onClick={() => { setViewMode('mobile'); setShowFrame(true); }}
                      icon={<Smartphone className="w-4 h-4" />}
                      label="Mobil"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter px-1">Rol Değiştir</p>
                  <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    <RoleItem 
                      active={state === 'landing'} 
                      icon={<Laptop className="w-4 h-4" />} 
                      label="Landing Page" 
                      onClick={() => { setState('landing'); setViewMode('desktop'); setShowFrame(false); }} 
                    />
                    <div className="h-px bg-slate-50 my-1"></div>
                    <RoleItem 
                      active={state === 'corp_admin'} 
                      icon={<User className="w-4 h-4" />} 
                      label="Kurum Yöneticisi" 
                      onClick={() => setState('corp_admin')} 
                    />
                    <RoleItem 
                      active={state === 'campus_lead'} 
                      icon={<User className="w-4 h-4" />} 
                      label="Kampüs Sorumlusu" 
                      onClick={() => setState('campus_lead')} 
                    />
                    <RoleItem 
                      active={state === 'bina_sorumlusu'} 
                      icon={<User className="w-4 h-4" />} 
                      label="Bina Sorumlusu" 
                      onClick={() => setState('bina_sorumlusu')} 
                    />
                    <div className="h-px bg-slate-50 my-1"></div>
                    <RoleItem 
                      active={state === 'saha_personeli'} 
                      icon={<Smartphone className="w-4 h-4" />} 
                      label="Saha Personeli" 
                      onClick={() => { setState('saha_personeli'); setViewMode('mobile'); setShowFrame(true); }} 
                      tag="APP"
                    />
                    <RoleItem 
                      active={state === 'olcum_sefi'} 
                      icon={<Smartphone className="w-4 h-4" />} 
                      label="Ölçüm Şefi" 
                      onClick={() => { setState('olcum_sefi'); setViewMode('mobile'); setShowFrame(true); }} 
                      tag="APP"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
              >
                <RefreshCw className="w-3 h-3" /> Sistemi Sıfırla
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
          className={cn(
            "group flex items-center gap-3 bg-slate-900 text-white pl-5 pr-6 py-4 rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all border border-slate-800",
            isSwitcherOpen && "bg-emerald-600 border-emerald-500"
          )}
        >
          <div className="relative">
            {isSwitcherOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5 animate-[spin_4s_linear_infinite]" />}
          </div>
          <span className="text-sm font-black tracking-tight">Kontrol Paneli</span>
        </button>
      </div>
    </div>
  );
}

// HIGH QUALITY DEVICE FRAME
function DeviceFrame({ children, mode, showFrame }: { children: React.ReactNode, mode: 'mobile' | 'tablet' | 'desktop', showFrame: boolean }) {
  if (mode === 'desktop') return <>{children}</>;

  const isTablet = mode === 'tablet';
  
  return (
    <div className="relative flex items-center justify-center animate-in zoom-in duration-500">
      {/* Outer Case */}
      <div className={cn(
        "relative bg-slate-800 border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden transition-all duration-700",
        isTablet ? "w-[768px] h-[1024px] rounded-[3.5rem]" : "w-[340px] h-[680px]"
      )}>
        {/* Hardware details */}
        <div className="absolute top-0 inset-x-0 h-8 flex justify-center items-center z-50">
           <div className={cn("bg-slate-900 rounded-full", isTablet ? "w-24 h-4" : "w-28 h-6 flex items-center justify-center")}>
              {!isTablet && <div className="w-12 h-1.5 bg-slate-800 rounded-full"></div>}
           </div>
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white overflow-hidden">
          {children}
        </div>
        
        {/* Buttons simulation */}
        <div className="absolute -left-[14px] top-24 w-1 h-12 bg-slate-900 rounded-l-lg"></div>
        <div className="absolute -left-[14px] top-40 w-1 h-16 bg-slate-900 rounded-l-lg"></div>
        <div className="absolute -right-[14px] top-32 w-1 h-20 bg-slate-900 rounded-r-lg"></div>
      </div>
      
      {/* Decorative backdrop */}
      <div className="absolute -inset-20 bg-emerald-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
}

function ViewButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all",
        active 
          ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
          : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
      )}
    >
      {icon}
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function RoleItem({ active, icon, label, onClick, tag }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, tag?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group",
        active 
          ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100 scale-[1.02]" 
          : "text-slate-600 hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-1.5 rounded-lg transition-colors",
          active ? "bg-white/20" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
        )}>
          {icon}
        </div>
        <span className="truncate">{label}</span>
      </div>
      {active && <Check className="w-3.5 h-3.5" />}
      {!active && tag && (
        <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 font-black uppercase">{tag}</span>
      )}
    </button>
  );
}
