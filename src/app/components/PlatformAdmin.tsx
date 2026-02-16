import React, { useState } from 'react';
import { 
  Shield, 
  Building, 
  CreditCard, 
  BookOpen, 
  FileText, 
  BarChart, 
  Plus, 
  Search, 
  MoreVertical,
  ChevronRight,
  Filter,
  Users,
  MapPin,
  X,
  CheckCircle,
  Clock,
  ExternalLink,
  ArrowLeft,
  Trash2,
  Send,
  Gavel
} from 'lucide-react';
import { Card, Button, Badge, Input, cn } from './ui-components';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';

const customerStats = [
  { name: 'Oca', atik: 2400 },
  { name: 'Şub', atik: 3200 },
  { name: 'Mar', atik: 2800 },
  { name: 'Nis', atik: 3900 },
];

interface Customer {
  id: string;
  name: string;
  type: string;
  status: 'Aktif' | 'Pasif';
  subscription: 'Enterprise';
  waste: string;
  city: string;
  district: string;
  address: string;
  joinDate: string;
}

interface Education {
  id: string;
  title: string;
  description: string;
  status: 'Taslak' | 'Yayında';
  updatedAt: string;
  type: 'Video' | 'Döküman';
}

interface Regulation {
  id: string;
  title: string;
  description: string;
  content: string;
  status: 'Taslak' | 'Yayında';
  updatedAt: string;
}

export const PlatformAdmin = ({ onLogout }: { onLogout: () => void }) => {
  const [activeMenu, setActiveMenu] = useState('Global Dashboard');
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'İstanbul Üniversitesi', type: 'Eğitim', status: 'Aktif', subscription: 'Enterprise', waste: '124 Ton', city: 'İstanbul', district: 'Fatih', address: 'Merkez Kampüs No:1', joinDate: '12.01.2025' },
    { id: '2', name: 'Acıbadem Hastanesi', type: 'Sağlık', status: 'Aktif', subscription: 'Enterprise', waste: '45 Ton', city: 'İstanbul', district: 'Ataşehir', address: 'Barbaros Mah. No:45', joinDate: '05.02.2025' },
    { id: '3', name: 'Yıldız Holding', type: 'Kurumsal', status: 'Pasif', subscription: 'Enterprise', waste: '89 Ton', city: 'İstanbul', district: 'Üsküdar', address: 'Kısıklı Cad. No:12', joinDate: '20.12.2024' },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    { id: '1', title: 'Sıfır Atık Yönetmeliği 2026 Güncellemesi', description: 'Yeni yönetmelik kapsamında poşet renkleri ve raporlama standartları.', status: 'Taslak', updatedAt: '04.02.2026', type: 'Döküman' },
    { id: '2', title: 'Saha Personeli Eğitim Videosu', description: 'Mobil uygulamanın kullanımı ve QR kod okutma prosedürleri.', status: 'Yayında', updatedAt: '01.02.2026', type: 'Video' },
  ]);

  const [regulations, setRegulations] = useState<Regulation[]>([
    { id: '1', title: 'Tıbbi Atıkların Kontrolü Yönetmeliği', description: 'Hastaneler ve kliniklerin uyması gereken yasal prosedürler.', content: 'Detaylı regülasyon içeriği...', status: 'Yayında', updatedAt: '03.02.2026' },
    { id: '2', title: 'Sıfır Atık Mavi Bayrak Kriterleri', description: 'Deniz kıyısı işletmeler için geri dönüşüm standartları.', content: 'Detaylı kriterler...', status: 'Taslak', updatedAt: '04.02.2026' },
  ]);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddRegulation, setShowAddRegulation] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewCustomerDetail, setViewCustomerDetail] = useState(false);

  // New Customer Form State
  const [newCustomer, setNewCustomer] = useState({
    name: '', city: '', district: '', address: '', type: 'Kurumsal'
  });

  // New Education Form State
  const [newEdu, setNewEdu] = useState({
    title: '', description: '', type: 'Döküman' as 'Video' | 'Döküman'
  });

  // New Regulation Form State
  const [newReg, setNewReg] = useState({
    title: '', description: '', content: ''
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCustomer,
      status: 'Aktif',
      subscription: 'Enterprise',
      waste: '0 Ton',
      joinDate: new Date().toLocaleDateString('tr-TR'),
      type: newCustomer.type
    } as Customer;
    setCustomers([...customers, customer]);
    setShowAddCustomer(false);
    toast.success("Yeni müşteri başarıyla eklendi");
  };

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    const edu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEdu.title,
      description: newEdu.description,
      status: 'Taslak',
      updatedAt: new Date().toLocaleDateString('tr-TR'),
      type: newEdu.type
    };
    setEducations([edu, ...educations]);
    setShowAddEducation(false);
    toast.success("Eğitim taslak olarak eklendi");
  };

  const handleAddRegulation = (e: React.FormEvent) => {
    e.preventDefault();
    const reg: Regulation = {
      id: Math.random().toString(36).substr(2, 9),
      title: newReg.title,
      description: newReg.description,
      content: newReg.content,
      status: 'Taslak',
      updatedAt: new Date().toLocaleDateString('tr-TR'),
    };
    setRegulations([reg, ...regulations]);
    setShowAddRegulation(false);
    toast.success("Regülasyon taslak olarak eklendi");
  };

  const toggleEduStatus = (id: string) => {
    setEducations(educations.map(e => {
      if (e.id === id) {
        const newStatus = e.status === 'Taslak' ? 'Yayında' : 'Taslak';
        toast.info(`Eğitim ${newStatus.toLowerCase()} durumuna getirildi`);
        return { ...e, status: newStatus as 'Taslak' | 'Yayında' };
      }
      return e;
    }));
  };

  const toggleRegStatus = (id: string) => {
    setRegulations(regulations.map(r => {
      if (r.id === id) {
        const newStatus = r.status === 'Taslak' ? 'Yayında' : 'Taslak';
        toast.info(`Regülasyon ${newStatus.toLowerCase()} durumuna getirildi`);
        return { ...r, status: newStatus as 'Taslak' | 'Yayında' };
      }
      return r;
    }));
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'Aktif' ? 'Pasif' : 'Aktif';
        return { ...c, status: newStatus as 'Aktif' | 'Pasif' };
      }
      return c;
    }));
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">EcoTrace <span className="text-blue-500 font-medium">HQ</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { label: 'Global Dashboard', icon: BarChart },
            { label: 'Müşteriler', icon: Building },
            { label: 'Abonelik Yönetimi', icon: CreditCard },
            { label: 'Eğitim İçerikleri', icon: BookOpen },
            { label: 'Regülasyon Yönetimi', icon: FileText },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveMenu(item.label);
                setViewCustomerDetail(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                activeMenu === item.label && !viewCustomerDetail
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white" onClick={onLogout}>
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Logic */}
          {!viewCustomerDetail && (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{activeMenu}</h1>
                <p className="text-slate-400 text-sm mt-1">
                  {activeMenu === 'Müşteriler' ? 'Kurumsal müşterilerinizi yönetin ve yeni kurumlar oluşturun.' : 
                   activeMenu === 'Eğitim İçerikleri' ? 'Müşteriler için eğitim dökümanlarını ve videolarını yönetin.' :
                   activeMenu === 'Regülasyon Yönetimi' ? 'Yasal düzenlemeleri ve zorunlu prosedürleri merkezi olarak yayınlayın.' :
                   'Platform genelindeki verileri buradan izleyin.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {activeMenu === 'Müşteriler' && (
                  <Button onClick={() => setShowAddCustomer(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Yeni Müşteri Ekle
                  </Button>
                )}
                {activeMenu === 'Eğitim İçerikleri' && (
                  <Button onClick={() => setShowAddEducation(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Yeni Eğitim Ekle
                  </Button>
                )}
                {activeMenu === 'Regülasyon Yönetimi' && (
                  <Button onClick={() => setShowAddRegulation(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Yeni Regülasyon Ekle
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Page Content */}
          {activeMenu === 'Global Dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-900 border-slate-800 p-6 lg:col-span-2">
                <h3 className="font-bold mb-6">Global Atık Toplama Grafiği</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={customerStats}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Bar dataKey="atik" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800 p-6">
                  <div className="text-slate-400 text-sm font-medium mb-1">Aktif Kurumlar</div>
                  <div className="text-3xl font-bold">{customers.length}</div>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-6">
                  <div className="text-slate-400 text-sm font-medium mb-1">Bekleyen Regülasyonlar</div>
                  <div className="text-3xl font-bold">{regulations.filter(r => r.status === 'Taslak').length}</div>
                </Card>
              </div>
            </div>
          )}

          {activeMenu === 'Müşteriler' && (
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Kurum Adı / Sektör</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Lokasyon</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Toplam Atık</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Durum</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-200">{customer.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{customer.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-400">
                            <MapPin className="w-3.5 h-3.5" /> {customer.district}, {customer.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-400">{customer.waste}</td>
                        <td className="px-6 py-4">
                          <Badge color={customer.status === 'Aktif' ? 'green' : 'red'}>{customer.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            className="text-blue-400 hover:text-blue-300 h-8 text-xs font-bold"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setViewCustomerDetail(true);
                              setActiveMenu('Abonelik Yönetimi');
                            }}
                          >
                            Detay <ChevronRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeMenu === 'Abonelik Yönetimi' && !viewCustomerDetail && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {customers.map((c) => (
                  <Card key={c.id} className="bg-slate-900 border-slate-800 p-6 flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                        <Building className="w-6 h-6" />
                      </div>
                      <Badge color={c.status === 'Aktif' ? 'green' : 'red'}>{c.status}</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{c.name}</h3>
                    <p className="text-slate-500 text-xs mb-6">Kayıt Tarihi: {c.joinDate}</p>
                    
                    <div className="mt-auto space-y-3 pt-4 border-t border-slate-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Paket</span>
                        <span className="font-bold text-blue-400">Enterprise</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-slate-700 text-slate-300 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setViewCustomerDetail(true);
                        }}
                      >
                        Yönet
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'Abonelik Yönetimi' && viewCustomerDetail && selectedCustomer && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <button 
                onClick={() => setViewCustomerDetail(false)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Geri Dön
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-slate-900 border-slate-800 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                        <p className="text-slate-400 text-sm">{selectedCustomer.type} / {selectedCustomer.city}</p>
                      </div>
                      <Badge color={selectedCustomer.status === 'Aktif' ? 'green' : 'red'}>{selectedCustomer.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Açık Adres</div>
                        <p className="text-slate-200 text-sm leading-relaxed">{selectedCustomer.address}, {selectedCustomer.district}/{selectedCustomer.city}</p>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Sektör Bilgisi</div>
                        <p className="text-slate-200 text-sm">{selectedCustomer.type}</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800">
                      <h3 className="font-bold mb-4">Abonelik Türü Değiştir</h3>
                      <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold">Enterprise Plan (Aktif)</div>
                            <div className="text-xs text-slate-500">Sınırsız kampüs ve bina yönetimi, gelişmiş analitik.</div>
                          </div>
                        </div>
                        <Badge color="blue">MVP STANDART</Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-slate-900 border-slate-800 p-6">
                    <h3 className="font-bold mb-4">Hızlı İşlemler</h3>
                    <div className="space-y-3">
                      <Button 
                        variant={selectedCustomer.status === 'Aktif' ? 'outline' : 'primary'} 
                        className="w-full justify-start gap-3 border-slate-700"
                        onClick={() => toggleCustomerStatus(selectedCustomer.id)}
                      >
                        <Clock className="w-4 h-4" /> {selectedCustomer.status === 'Aktif' ? 'Erişimi Duraklat' : 'Erişimi Etkinleştir'}
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-3 border-slate-700 text-red-400 hover:bg-red-500 hover:text-white">
                        <Trash2 className="w-4 h-4" /> Kurumu Sil
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Eğitim İçerikleri' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educations.map((edu) => (
                <Card key={edu.id} className="bg-slate-900 border-slate-800 p-6 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500">
                      {edu.type === 'Video' ? <ExternalLink className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                    </div>
                    <Badge color={edu.status === 'Taslak' ? 'slate' : 'green'}>{edu.status}</Badge>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{edu.title}</h4>
                  <p className="text-sm text-slate-400 mb-6">{edu.description}</p>
                  
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Güncelleme: {edu.updatedAt}</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        className="h-8 text-xs font-bold text-slate-400 hover:text-white"
                        onClick={() => toggleEduStatus(edu.id)}
                      >
                        {edu.status === 'Taslak' ? <Send className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        {edu.status === 'Taslak' ? 'Yayına Al' : 'Taslağa Çek'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeMenu === 'Regülasyon Yönetimi' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regulations.map((reg) => (
                <Card key={reg.id} className="bg-slate-900 border-slate-800 p-6 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-500">
                      <Gavel className="w-6 h-6" />
                    </div>
                    <Badge color={reg.status === 'Taslak' ? 'slate' : 'green'}>{reg.status}</Badge>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{reg.title}</h4>
                  <p className="text-sm text-slate-400 mb-6">{reg.description}</p>
                  
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Güncelleme: {reg.updatedAt}</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        className="h-8 text-xs font-bold text-slate-400 hover:text-white"
                        onClick={() => toggleRegStatus(reg.id)}
                      >
                        {reg.status === 'Taslak' ? <Send className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        {reg.status === 'Taslak' ? 'Yayına Al' : 'Taslağa Çek'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      
      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Yeni Müşteri Oluştur</h2>
              <button onClick={() => setShowAddCustomer(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-6">
              <Input 
                label="Kurum Adı" 
                className="bg-slate-800 border-slate-700" 
                placeholder="Örn: X Üniversitesi"
                required
                value={newCustomer.name}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="İl" 
                  className="bg-slate-800 border-slate-700" 
                  placeholder="Örn: İstanbul"
                  required
                  value={newCustomer.city}
                  onChange={e => setNewCustomer({...newCustomer, city: e.target.value})}
                />
                <Input 
                  label="İlçe" 
                  className="bg-slate-800 border-slate-700" 
                  placeholder="Örn: Fatih"
                  required
                  value={newCustomer.district}
                  onChange={e => setNewCustomer({...newCustomer, district: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1.5">Sektör</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={newCustomer.type}
                  onChange={e => setNewCustomer({...newCustomer, type: e.target.value})}
                >
                  <option>Kurumsal</option>
                  <option>Eğitim</option>
                  <option>Sağlık</option>
                  <option>Ticari</option>
                  <option>Kamu</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Açık Adres</label>
                <textarea 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none"
                  placeholder="Sokak, Bina No, Kat vb."
                  required
                  value={newCustomer.address}
                  onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 h-12 font-bold mt-4">Müşteriyi Kaydet</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Add Education Modal */}
      {showAddEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Yeni Eğitim İçeriği</h2>
              <button onClick={() => setShowAddEducation(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddEducation} className="space-y-6">
              <Input 
                label="Eğitim Başlığı" 
                className="bg-slate-800 border-slate-700" 
                placeholder="Örn: Atık Ayıştırma Kuralları"
                required
                value={newEdu.title}
                onChange={e => setNewEdu({...newEdu, title: e.target.value})}
              />
              <div>
                <label className="text-sm font-medium text-slate-400 block mb-1.5">İçerik Tipi</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={newEdu.type}
                  onChange={e => setNewEdu({...newEdu, type: e.target.value as any})}
                >
                  <option value="Döküman">Döküman (PDF/Metin)</option>
                  <option value="Video">Video Linki</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Açıklama</label>
                <textarea 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-32 resize-none"
                  placeholder="Eğitim içeriği özeti..."
                  required
                  value={newEdu.description}
                  onChange={e => setNewEdu({...newEdu, description: e.target.value})}
                />
              </div>
              <p className="text-xs text-slate-500">Not: Yeni eklenen içerikler otomatik olarak 'Taslak' durumunda başlar.</p>
              <Button type="submit" className="w-full bg-blue-600 h-12 font-bold mt-4">Taslak Oluştur</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Add Regulation Modal */}
      {showAddRegulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Yeni Regülasyon İçeriği</h2>
              <button onClick={() => setShowAddRegulation(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddRegulation} className="space-y-6">
              <Input 
                label="Regülasyon Başlığı" 
                className="bg-slate-800 border-slate-700" 
                placeholder="Örn: 2026 Atık Beyan Standardı"
                required
                value={newReg.title}
                onChange={e => setNewReg({...newReg, title: e.target.value})}
              />
              <Input 
                label="Kısa Özet" 
                className="bg-slate-800 border-slate-700" 
                placeholder="Kısa bir açıklama..."
                required
                value={newReg.description}
                onChange={e => setNewReg({...newReg, description: e.target.value})}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Tam Metin İçeriği</label>
                <textarea 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-48 resize-none"
                  placeholder="Yasal metnin tamamını buraya girin..."
                  required
                  value={newReg.content}
                  onChange={e => setNewReg({...newReg, content: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 h-12 font-bold mt-4">Regülasyonu Taslak Olarak Kaydet</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
