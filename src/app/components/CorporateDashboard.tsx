import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ClipboardCheck, 
  Scale, 
  BarChart, 
  Box, 
  Clock, 
  BarChart3,
  X,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Archive,
  ShoppingCart,
  History,
  TrendingUp,
  Edit,
  QrCode,
  Calendar,
  Activity,
  Zap,
  Droplets,
  Trees,
  Menu
} from 'lucide-react';
import { Card, Button, Badge, Input, cn } from './ui-components';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface CorporateDashboardProps {
  userRole: 'corp_admin' | 'campus_lead' | 'bina_sorumlusu' | 'olcum_sefi' | 'saha_personeli';
  onLogout: () => void;
}

export const CorporateDashboard: React.FC<CorporateDashboardProps> = ({ userRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Ana Sayfa');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stockSubTab, setStockSubTab] = useState('Stok Durumu');
  const [opsSubTab, setOpsSubTab] = useState('Günlük');
  const [expandedOpsBuildings, setExpandedOpsBuildings] = useState<string[]>([]);
  const [showAddLocation, setShowAddLocation] = useState(false);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddWastePoint, setShowAddWastePoint] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [selectedCheckPoint, setSelectedCheckPoint] = useState<any>(null);
  const [checkResult, setCheckResult] = useState({
    status: 'Denetlendi',
    notes: '',
    efficiency: '95'
  });
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [editingWastePoint, setEditingWastePoint] = useState<any>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrTarget, setQrTarget] = useState<any>(null);
  
  const [locations, setLocations] = useState([
    { id: '1', name: 'Merkez Kampüs', type: 'Kampüs', parent: '', title: 'Ana Yerleşke', description: 'Kurum ana yönetim merkezi ve eğitim blokları.' },
    { id: '2', name: 'Batı Kampüs', type: 'Kampüs', parent: '', title: 'Ar-Ge Yerleşkesi', description: 'Teknoloji geliştirme ve laboratuvar binaları.' },
    { id: '3', name: 'A Blok', type: 'Bina', parent: '1', title: 'Yönetim Binası', description: 'Rektörlük ve idari birimlerin bulunduğu ana bina.', groundAbove: 5, basement: 2 },
    { id: '4', name: 'B Blok', type: 'Bina', parent: '1', title: 'Fen Bilimleri', description: 'Laboratuvarlar ve dersliklerin bulunduğu bina.', groundAbove: 4, basement: 1 },
    { id: '5', name: 'Ar-Ge 1', type: 'Bina', parent: '2', title: 'Teknopark', description: 'Kuluçka merkezi ve yazılım ofisleri.', groundAbove: 3, basement: 1 },
  ]);

  const [users, setUsers] = useState([
    { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@kurum.com', role: 'corp_admin', location: 'Tüm Kurum' },
    { id: '2', name: 'Ayşe Demir', email: 'ayse@kurum.com', role: 'campus_lead', location: 'Merkez Kampüs' },
    { id: '3', name: 'Mehmet Öz', email: 'mehmet@kurum.com', role: 'bina_sorumlusu', location: 'A Blok' },
    { id: '4', name: 'Can Ak', email: 'can@kurum.com', role: 'saha_personeli', location: 'Merkez Kampüs' },
    { id: '5', name: 'Zeynep Kaya', email: 'zeynep@kurum.com', role: 'olcum_sefi', location: 'Batı Kampüs' },
  ]);

  const [wastePoints, setWastePoints] = useState([
    { id: 'WP-001', name: 'PT-001', buildingId: '3', buildingName: 'A Blok', floor: '1', staffId: '4', staffName: 'Can Ak', type: 'Plastik/Kağıt' },
    { id: 'WP-002', name: 'PT-002', buildingId: '4', buildingName: 'B Blok', floor: 'Bahçe', staffId: '4', staffName: 'Can Ak', type: 'Geri Dönüşüm' },
  ]);

  const [newWastePoint, setNewWastePoint] = useState({
    name: '',
    campusId: '',
    buildingId: '',
    floor: '',
    staffId: '',
    type: 'Karma'
  });

  const isKurumYoneticisi = userRole === 'corp_admin';
  const isKampusSorumlusu = userRole === 'campus_lead';
  const isBinaSorumlusu = userRole === 'bina_sorumlusu';

  const accessibleCampuses = React.useMemo(() => locations.filter(l => {
    if (l.type !== 'Kampüs') return false;
    if (isKurumYoneticisi) return true;
    if (isKampusSorumlusu) return l.id === '1'; // Mock: Merkez Kampüs
    if (isBinaSorumlusu) return l.id === '1'; // Mock: A Blok'un bağlı olduğu kampüs
    return false;
  }), [locations, isKurumYoneticisi, isKampusSorumlusu, isBinaSorumlusu]);

  const accessibleBuildings = React.useMemo(() => locations.filter(l => {
    if (l.type !== 'Bina') return false;
    if (isKurumYoneticisi) return true;
    if (isKampusSorumlusu) return l.parent === '1'; // Mock: Merkez Kampüs Sorumlusu varsayıyoruz
    if (isBinaSorumlusu) return l.id === '3'; // Mock: A Blok Sorumlusu varsayıyoruz
    return false;
  }), [locations, isKurumYoneticisi, isKampusSorumlusu, isBinaSorumlusu]);

  const getFilteredBuildings = (campusId: string) => {
    return accessibleBuildings.filter(b => b.parent === campusId);
  };

  const getBuildingPrefix = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getFloorOptions = (buildingId: string) => {
    const building = locations.find(l => l.id === buildingId);
    if (!building) return [];
    
    const floors = [];
    // Basement floors
    for (let i = building.basement; i > 0; i--) {
      floors.push({ label: `Bodrum ${i}`, value: `B${i}` });
    }
    // Ground floor
    floors.push({ label: 'Zemin Kat', value: '0' });
    // Above ground floors
    for (let i = 1; i <= building.groundAbove; i++) {
      floors.push({ label: `${i}. Kat`, value: i.toString() });
    }
    return floors;
  };

  useEffect(() => {
    if (newWastePoint.buildingId) {
      const building = locations.find(l => l.id === newWastePoint.buildingId);
      if (building) {
        const prefix = getBuildingPrefix(building.name);
        const count = wastePoints.filter(wp => wp.buildingId === building.id).length + 1;
        const autoName = `${prefix}-${count.toString().padStart(3, '0')}`;
        if (newWastePoint.name !== autoName) {
          setNewWastePoint(prev => ({ ...prev, name: autoName }));
        }
      }
    }
  }, [newWastePoint.buildingId, wastePoints, newWastePoint.name]);
  
  const [newLoc, setNewLoc] = useState({
    name: '',
    type: 'Bina',
    parent: '',
    title: '',
    description: '',
    groundAbove: 1,
    basement: 0
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'saha_personeli',
    campusId: '',
    buildingId: ''
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (locations.length + 1).toString();
    setLocations([...locations, { ...newLoc, id: newId } as any]);
    setShowAddLocation(false);
    toast.success(`${newLoc.type} başarıyla oluşturuldu`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = (users.length + 1).toString();
    const locationName = newUser.role === 'campus_lead' 
      ? locations.find(l => l.id === newUser.campusId)?.name || 'Belirsiz Kampüs'
      : locations.find(l => l.id === newUser.buildingId)?.name || 'Belirsiz Bina';

    setUsers([...users, { 
      id: newId, 
      name: newUser.name, 
      email: newUser.email, 
      role: newUser.role, 
      location: locationName 
    }]);
    setShowAddUser(false);
    toast.success("Personel başarıyla eklendi");
  };

  const handleAddWastePoint = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `WP-00${wastePoints.length + 1}`;
    const building = locations.find(l => l.id === newWastePoint.buildingId);
    const staff = users.find(u => u.id === newWastePoint.staffId);
    
    setWastePoints([...wastePoints, {
      ...newWastePoint,
      id: newId,
      buildingName: building?.name || 'Belirsiz',
      staffName: staff?.name || 'Atanmamış'
    }]);
    setShowAddWastePoint(false);
    toast.success("Atık noktası başarıyla oluşturuldu");
  };

  const handleEditLocation = (e: React.FormEvent) => {
    e.preventDefault();
    setLocations(locations.map(l => l.id === editingLocation.id ? editingLocation : l));
    setEditingLocation(null);
    toast.success("Lokasyon başarıyla güncellendi");
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm("Bu lokasyonu silmek istediğinize emin misiniz?")) {
      setLocations(locations.filter(l => l.id !== id));
      toast.success("Lokasyon silindi");
    }
  };

  const handleEditWastePoint = (e: React.FormEvent) => {
    e.preventDefault();
    const building = locations.find(l => l.id === editingWastePoint.buildingId);
    const staff = users.find(u => u.id === editingWastePoint.staffId);
    
    setWastePoints(wastePoints.map(wp => wp.id === editingWastePoint.id ? {
      ...editingWastePoint,
      buildingName: building?.name || wp.buildingName,
      staffName: staff?.name || wp.staffName
    } : wp));
    setEditingWastePoint(null);
    toast.success("Atık noktası güncellendi");
  };

  const handleDeleteWastePoint = (id: string) => {
    if (window.confirm("Bu atık noktasını silmek istediğinize emin misiniz?")) {
      setWastePoints(wastePoints.filter(wp => wp.id !== id));
      toast.success("Atık noktası silindi");
    }
  };

  const handlePerformCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheck = {
      id: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
      binName: selectedCheckPoint.name,
      location: `${selectedCheckPoint.buildingName} - Kat: ${selectedCheckPoint.floor}`,
      staff: 'Ahmet Yılmaz', // Mevcut giriş yapan kullanıcı
      status: checkResult.status,
      lastCheck: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      efficiency: `%${checkResult.efficiency}`
    };

    setOperationalChecks([newCheck, ...operationalChecks]);
    setShowCheckModal(false);
    setSelectedCheckPoint(null);
    setCheckResult({ status: 'Denetlendi', notes: '', efficiency: '95' });
    toast.success("Denetim kaydı başarıyla oluşturuldu");
  };

  const downloadStockHistoryExcel = () => {
    // Veriyi Excel formatına hazırla
    const data = stockHistory.map(log => ({
      'Tarih': log.date,
      'İşlem Tipi': log.type,
      'Atık Türü': log.item,
      'Miktar': log.quantity,
      'Kaynak/Alıcı': log.source
    }));

    // Workbook ve Worksheet oluştur
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stok Geçmişi");

    // Sütun genişliklerini ayarla
    const wscols = [
      { wch: 20 }, // Tarih
      { wch: 15 }, // İşlem Tipi
      { wch: 20 }, // Atık Türü
      { wch: 15 }, // Miktar
      { wch: 30 }  // Kaynak/Alıcı
    ];
    ws['!cols'] = wscols;

    // Dosyayı indir
    XLSX.writeFile(wb, `Stok_Gecmisi_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Stok geçmişi Excel dosyası olarak indirildi");
  };

  const downloadCheckHistoryExcel = () => {
    // Sadece denetlenenleri (geçmişi) filtrele
    const historyData = operationalChecks.filter(check => check.status === 'Denetlendi').map(check => ({
      'Denetim ID': check.id,
      'Atık Noktası': check.binName,
      'Lokasyon': check.location,
      'Personel': check.staff,
      'Durum': check.status,
      'Son Denetim': check.lastCheck,
      'Verimlilik': check.efficiency
    }));

    if (historyData.length === 0) {
      toast.error("İndirilecek denetim geçmişi bulunamadı");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(historyData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Denetim Geçmişi");

    const wscols = [
      { wch: 15 }, // ID
      { wch: 20 }, // Atık Noktası
      { wch: 30 }, // Lokasyon
      { wch: 20 }, // Personel
      { wch: 15 }, // Durum
      { wch: 20 }, // Son Denetim
      { wch: 15 }  // Verimlilik
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `Denetim_Gecmisi_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Denetim geçmişi Excel dosyası olarak indirildi");
  };

  const downloadStockHistoryPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("ATIK YONETIM PLATFORMU", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Kurumsal Stok Gecmis Raporu", 105, 30, { align: "center" });
    
    // Info
    doc.setTextColor(100, 116, 139); // slate-500
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleString('tr-TR')}`, 20, 50);
    doc.text(`Raporlayan: ${roleLabels[userRole]}`, 20, 55);
    
    // Table Header
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, 65, 170, 10, 'F');
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFontSize(9);
    doc.text("Tarih", 25, 71);
    doc.text("Islem", 65, 71);
    doc.text("Atik Turu", 95, 71);
    doc.text("Miktar", 135, 71);
    doc.text("Kaynak/Alici", 160, 71);
    
    // Table Body
    let y = 82;
    stockHistory.forEach((log, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setTextColor(71, 85, 105);
      doc.text(log.date.split(' ')[0], 25, y);
      doc.text(log.type, 65, y);
      doc.text(log.item, 95, y);
      doc.text(log.quantity, 135, y);
      doc.text(log.source.substring(0, 20), 160, y);
      
      // Line separator
      doc.setDrawColor(241, 245, 249);
      doc.line(20, y + 4, 190, y + 4);
      y += 10;
    });
    
    doc.save(`Stok_Gecmisi_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Stok geçmişi PDF olarak indirildi");
  };

  const handleUpdateCapacities = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedLevels = stockLevels.map(level => {
      const newCap = tempCapacities[level.category];
      if (newCap) {
        const amountNum = parseInt(level.amount.replace(/\D/g, '')) || 0;
        const capNum = parseInt(newCap.replace(/\D/g, '')) || 1;
        const ratio = (amountNum / capNum) * 100;
        
        let status: 'Normal' | 'Düşük' | 'Kritik' = 'Normal';
        if (ratio > 85) status = 'Kritik';
        else if (ratio < 25) status = 'Düşük';

        return { 
          ...level, 
          capacity: newCap.includes(' ') ? newCap : `${newCap} kg`,
          status 
        };
      }
      return level;
    });

    setStockLevels(updatedLevels);
    setShowCapacityModal(false);
    toast.success("Depolama kapasiteleri güncellendi");
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: `S-${Math.floor(200 + Math.random() * 800)}`,
      date: new Date().toISOString().split('T')[0],
      buyer: newSale.buyer,
      item: newSale.item,
      amount: newSale.amount.includes(' ') ? newSale.amount : `${newSale.amount} kg`,
      price: newSale.price.startsWith('₺') ? newSale.price : `₺${newSale.price}`
    };

    setSalesRecords([newRecord, ...salesRecords]);
    
    // Stok geçmişine de ekle
    const newHistory = {
      id: `H-${Math.floor(500 + Math.random() * 500)}`,
      date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: 'Satış',
      item: newSale.item,
      quantity: newRecord.amount,
      source: newSale.buyer
    };
    setStockHistory([newHistory, ...stockHistory]);

    setShowAddSale(false);
    setNewSale({ buyer: '', item: 'Plastik', amount: '', price: '' });
    toast.success("Satış kaydı başarıyla oluşturuldu");
  };

  const downloadQR = (id: string, name: string) => {
    const doc = new jsPDF();
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/png");
      
      doc.setFontSize(20);
      doc.text("Atık Yönetim Platformu - QR Kod", 105, 20, { align: "center" });
      doc.setFontSize(14);
      doc.text(`İsim: ${name}`, 105, 30, { align: "center" });
      doc.text(`ID: ${id}`, 105, 40, { align: "center" });
      doc.addImage(imgData, 'PNG', 55, 60, 100, 100);
      doc.save(`QR_${name}.pdf`);
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const [showAddSale, setShowAddSale] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [tempCapacities, setTempCapacities] = useState<Record<string, string>>({});
  const [newSale, setNewSale] = useState({
    buyer: '',
    item: 'Plastik',
    amount: '',
    price: ''
  });

  const [stockHistory, setStockHistory] = useState([
    { id: 'H-001', date: '2026-02-14 10:00', type: 'Giriş', item: 'Plastik Çapak', quantity: '250 kg', source: 'A Blok' },
    { id: 'H-002', date: '2026-02-13 15:30', type: 'Satış', item: 'Kağıt/Karton', quantity: '1.2 Ton', source: 'Geri Dönüşüm A.Ş.' },
    { id: 'H-003', date: '2026-02-12 09:15', type: 'Giriş', item: 'Metal Atık', quantity: '85 kg', source: 'Batı Kampüs' },
  ]);

  const [stockLevels, setStockLevels] = useState([
    { category: 'Plastik', amount: '1,240 kg', capacity: '2,000 kg', status: 'Normal' },
    { category: 'Kağıt/Karton', amount: '450 kg', capacity: '3,000 kg', status: 'Düşük' },
    { category: 'Metal', amount: '890 kg', capacity: '1,000 kg', status: 'Kritik' },
    { category: 'Cam', amount: '2,100 kg', capacity: '2,500 kg', status: 'Normal' },
  ]);

  const [salesRecords, setSalesRecords] = useState([
    { id: 'S-101', date: '2026-02-10', buyer: 'Eko Plast Ltd.', item: 'Karışık Plastik', amount: '500 kg', price: '₺12,500' },
    { id: 'S-102', date: '2026-02-05', buyer: 'Kağıt Dünyası', item: 'Atık Kağıt', amount: '2 Ton', price: '₺8,000' },
  ]);

  const rolePriority: Record<string, number> = {
    'saha_personeli': 1,
    'olcum_sefi': 2,
    'bina_sorumlusu': 3,
    'campus_lead': 4,
    'corp_admin': 5
  };

  const hasAccess = (requiredRole: string) => {
    return rolePriority[userRole] >= rolePriority[requiredRole];
  };

  useEffect(() => {
    if (showAddWastePoint) {
      if (accessibleCampuses.length === 1 && newWastePoint.campusId !== accessibleCampuses[0].id) {
        setNewWastePoint(prev => ({ ...prev, campusId: accessibleCampuses[0].id }));
      }
      if (isBinaSorumlusu && accessibleBuildings.length === 1 && newWastePoint.buildingId !== accessibleBuildings[0].id) {
        setNewWastePoint(prev => ({ 
          ...prev, 
          campusId: accessibleBuildings[0].parent || '', 
          buildingId: accessibleBuildings[0].id 
        }));
      }
    }
  }, [showAddWastePoint, accessibleCampuses, accessibleBuildings, isBinaSorumlusu, newWastePoint.campusId, newWastePoint.buildingId]);

  const menuItems = [
    { label: 'Ana Sayfa', icon: LayoutDashboard, access: 'saha_personeli' },
    { label: 'Operasyonel Kontroller', icon: ClipboardCheck, access: 'saha_personeli' },
    { label: 'Atık Ölçümü', icon: Scale, access: 'saha_personeli', maxAccess: 'olcum_sefi' },
    { label: 'Stok Takibi', icon: Archive, access: 'corp_admin' },
    { label: 'Lokasyon Yönetimi', icon: MapPin, access: 'campus_lead' },
    { label: 'Atık Noktası Yönetimi', icon: MapPin, access: 'bina_sorumlusu' },
    { label: 'Kullanıcı Yönetimi', icon: Users, access: 'bina_sorumlusu' },
    { label: 'Raporlar', icon: BarChart, access: 'corp_admin' },
    { label: 'Ayarlar', icon: Settings, access: 'campus_lead' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    const minRolePriority = rolePriority[item.access];
    const userRolePriority = rolePriority[userRole];
    
    // Check minimum access
    if (userRolePriority < minRolePriority) return false;
    
    // Check maximum access if defined (for Atık Ölçümü restriction)
    if (item.maxAccess) {
      const maxRolePriority = rolePriority[item.maxAccess];
      if (userRolePriority > maxRolePriority) return false;
    }
    
    return true;
  });

  const roleLabels: Record<string, string> = {
    corp_admin: 'Kurum Yöneticisi',
    campus_lead: 'Kampüs Sorumlusu',
    bina_sorumlusu: 'Bina Sorumlusu',
    olcum_sefi: 'Ölçüm Şefi',
    saha_personeli: 'Saha Personeli'
  };

  const [expandedKampus, setExpandedKampus] = useState<string[]>(['1']);

  const toggleKampus = (id: string) => {
    setExpandedKampus(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const [operationalChecks, setOperationalChecks] = useState([
    { id: 'CHK-001', binName: 'PT-001', campusId: '1', buildingId: '3', location: 'A Blok - Kat 1', staff: 'Can Öz', status: 'Denetlendi', lastCheck: '2026-02-14 09:30', efficiency: '%95' },
    { id: 'CHK-002', binName: 'PT-002', campusId: '1', buildingId: '4', location: 'Merkez Kampüs - B Blok', staff: 'Mehmet Demir', status: 'Beklemede', lastCheck: '-', efficiency: '-' },
    { id: 'CHK-003', binName: 'PT-003', campusId: '1', buildingId: '3', location: 'A Blok - Kat 1', staff: 'Can Öz', status: 'Denetim Gerekli', lastCheck: '2026-02-14 11:45', efficiency: '%40' },
    { id: 'CHK-004', binName: 'PT-004', campusId: '2', buildingId: '5', location: 'Batı Kampüs - Ar-Ge 1', staff: 'Selin Ak', status: 'Denetlendi', lastCheck: '2026-02-13 10:15', efficiency: '%98' },
    { id: 'CHK-005', binName: 'PT-005', campusId: '1', buildingId: '3', location: 'A Blok - Kat 2', staff: 'Can Öz', status: 'Denetlendi', lastCheck: '2026-02-12 08:00', efficiency: '%88' },
  ]);

  const getStatusColor = (status: string): "green" | "blue" | "amber" | "red" | "slate" => {
    switch (status) {
      case 'Denetlendi': return 'green';
      case 'Beklemede': return 'slate';
      case 'Denetim Gerekli': return 'red';
      default: return 'slate';
    }
  };

  const filteredChecks = operationalChecks.filter(check => {
    // Rol bazlı filtreleme
    let hasAccess = false;
    if (isKurumYoneticisi) hasAccess = true;
    else if (isKampusSorumlusu) hasAccess = check.location.includes('Merkez Kampüs');
    else if (isBinaSorumlusu) hasAccess = check.location.includes('A Blok');
    else hasAccess = true;

    if (!hasAccess) return false;

    // Alt sekme filtreleme
    if (opsSubTab === 'Günlük') {
      return check.lastCheck.includes('2026-02-14') || check.status === 'Beklemede' || check.status === 'Denetim Gerekli';
    }
    if (opsSubTab === 'Haftalık') {
      return true;
    }
    if (opsSubTab === 'Kontrol Denetimi Geçmişi') {
      return check.status === 'Denetlendi';
    }
    return true;
  });

  const stats = {
    totalWaste: "4.2 Ton",
    totalWasteGrowth: "+15%",
    wastePoints: filteredChecks.length,
    personnel: users.length,
    dailyChecks: "128",
    efficiency: "%94",
    byType: [
      { type: 'Plastik', amount: '1.2 Ton', color: 'bg-blue-500' },
      { type: 'Kağıt', amount: '0.8 Ton', color: 'bg-emerald-500' },
      { type: 'Cam', amount: '1.5 Ton', color: 'bg-amber-500' },
      { type: 'Metal', amount: '0.7 Ton', color: 'bg-slate-500' },
    ]
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Trash2 className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">EcoTrace</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = activeTab === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() => setActiveTab(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-600" : "text-slate-400")} />
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-bold">
              {userRole[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">Ahmet Yılmaz</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                {roleLabels[userRole] || userRole.replace('_', ' ')}
              </div>
            </div>
            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">EcoTrace</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.label);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-black text-lg">
              {userRole[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base font-black text-slate-900 truncate">Ahmet Yılmaz</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                {roleLabels[userRole]}
              </div>
            </div>
            <button onClick={onLogout} className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-xl border border-slate-200 shadow-sm transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-black text-slate-900 text-lg lg:text-xl">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                placeholder="Arama..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <button className="relative p-2.5 bg-slate-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-all hover:bg-emerald-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6 lg:space-y-8">
          
          {activeTab === 'Ana Sayfa' && (
             <div className="space-y-8 animate-in fade-in duration-500">
               {/* Dashboard Header */}
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 lg:p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <div>
                   <h2 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight">Hoş Geldiniz, {roleLabels[userRole]}</h2>
                   <p className="text-slate-500 text-xs lg:text-sm mt-1">Bugün kurumunuzdaki süreçler %98 verimlilikle ilerliyor.</p>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl">
                   <div className="text-left">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Son Güncelleme</p>
                     <p className="text-xs font-bold text-slate-700">14 Şubat 2026, 14:30</p>
                   </div>
                   <div className="w-10 h-10 bg-white lg:bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm lg:shadow-none">
                     <Calendar className="w-5 h-5" />
                   </div>
                 </div>
               </div>

               {/* Role-Based Dashboard Content */}
               {isKurumYoneticisi ? (
                 <div className="space-y-8">
                   {/* Admin Stats Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <Card className="p-6 bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                           <Scale className="w-6 h-6" />
                         </div>
                         <Badge color="green">{stats.totalWasteGrowth}</Badge>
                       </div>
                       <div className="text-3xl font-black text-slate-900">{stats.totalWaste}</div>
                       <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Toplam Toplanan Atık</div>
                     </Card>
                     
                     <Card className="p-6 bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                           <MapPin className="w-6 h-6" />
                         </div>
                         <Badge color="blue">Aktif</Badge>
                       </div>
                       <div className="text-3xl font-black text-slate-900">{stats.wastePoints}</div>
                       <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Toplam Atık Noktası</div>
                     </Card>

                     <Card className="p-6 bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                           <Activity className="w-6 h-6" />
                         </div>
                         <Badge color="amber">%98</Badge>
                       </div>
                       <div className="text-3xl font-black text-slate-900">{stats.efficiency}</div>
                       <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Genel Verimlilik</div>
                     </Card>

                     <Card className="p-6 bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                           <Users className="w-6 h-6" />
                         </div>
                         <Badge color="blue">Online</Badge>
                       </div>
                       <div className="text-3xl font-black text-slate-900">{stats.personnel}</div>
                       <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Aktif Saha Personeli</div>
                     </Card>
                   </div>

                   {/* Distribution by Type */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <Card className="lg:col-span-2 p-8 bg-white border-slate-100 shadow-sm">
                       <div className="flex justify-between items-center mb-8">
                         <div>
                           <h3 className="text-lg font-bold text-slate-900">Türlere Göre Atık Dağılımı</h3>
                           <p className="text-sm text-slate-500">Kurum genelinde toplanan atıkların kategorik kırılımı.</p>
                         </div>
                         <Button variant="outline" className="text-xs border-slate-200">Detaylı Rapor</Button>
                       </div>
                       
                       <div className="space-y-6">
                         {stats.byType.map((item) => (
                           <div key={item.type} className="space-y-2">
                             <div className="flex justify-between items-center text-sm">
                               <span className="font-bold text-slate-700">{item.type}</span>
                               <span className="font-black text-slate-900">{item.amount}</span>
                             </div>
                             <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className={cn("h-full rounded-full", item.color)} 
                                 style={{ width: `${(parseFloat(item.amount) / 5) * 100}%` }}
                               ></div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </Card>

                     <Card className="p-8 bg-emerald-900 text-white border-none shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                       <div className="relative z-10">
                         <h3 className="text-lg font-bold mb-2">Çevresel Etki Özeti</h3>
                         <p className="text-emerald-100/70 text-sm mb-8">Bu ayki geri dönüşüm faaliyetleriniz sonucunda:</p>
                         
                         <div className="space-y-6">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                               <Zap className="w-5 h-5 text-emerald-400" />
                             </div>
                             <div>
                               <p className="text-xs text-emerald-100/50 font-bold uppercase">Enerji Tasarrufu</p>
                               <p className="text-lg font-bold">12,400 kWh</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                               <Droplets className="w-5 h-5 text-blue-400" />
                             </div>
                             <div>
                               <p className="text-xs text-emerald-100/50 font-bold uppercase">Su Tasarrufu</p>
                               <p className="text-lg font-bold">450 Ton</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                               <Trees className="w-5 h-5 text-emerald-300" />
                             </div>
                             <div>
                               <p className="text-xs text-emerald-100/50 font-bold uppercase">Kurtarılan Ağaç</p>
                               <p className="text-lg font-bold">84 Adet</p>
                             </div>
                           </div>
                         </div>
                       </div>
                       <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                     </Card>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-8">
                   {/* Campus/Building Manager Operational View */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Card className="p-6 bg-white border-slate-100 shadow-sm">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                           <AlertTriangle className="w-6 h-6" />
                         </div>
                         <div>
                           <div className="text-2xl font-black text-slate-900">
                             {operationalChecks.filter(c => c.status === 'Denetim Gerekli').length}
                           </div>
                           <div className="text-xs text-slate-500 font-bold uppercase">Acil Denetim</div>
                         </div>
                       </div>
                       <Button 
                        onClick={() => setActiveTab('Operasyonel Kontroller')}
                        className="w-full bg-red-50 text-red-700 hover:bg-red-100 border-none font-bold text-xs"
                       >
                         Noktaları Görüntüle
                       </Button>
                     </Card>

                     <Card className="p-6 bg-white border-slate-100 shadow-sm">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                           <ClipboardCheck className="w-6 h-6" />
                         </div>
                         <div>
                           <div className="text-2xl font-black text-slate-900">
                             {operationalChecks.filter(c => c.status === 'Beklemede').length}
                           </div>
                           <div className="text-xs text-slate-500 font-bold uppercase">Bekleyen Denetim</div>
                         </div>
                       </div>
                       <Button 
                        onClick={() => setActiveTab('Operasyonel Kontroller')}
                        className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-bold text-xs"
                       >
                         Plana Git
                       </Button>
                     </Card>

                     <Card className="p-6 bg-white border-slate-100 shadow-sm">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                           <CheckCircle2 className="w-6 h-6" />
                         </div>
                         <div>
                           <div className="text-2xl font-black text-slate-900">
                             {operationalChecks.filter(c => c.status === 'Denetlendi').length}
                           </div>
                           <div className="text-xs text-slate-500 font-bold uppercase">Tamamlanan</div>
                         </div>
                       </div>
                       <Button 
                        onClick={() => {
                          setActiveTab('Operasyonel Kontroller');
                          setOpsSubTab('Kontrol Denetimi Geçmişi');
                        }}
                        className="w-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-xs"
                       >
                         Geçmişi İncele
                       </Button>
                     </Card>
                   </div>

                   {/* Recent Activity / Quick Access */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card className="p-6 bg-white border-slate-100 shadow-sm">
                       <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                         <Clock className="w-4 h-4 text-slate-400" />
                         Son Operasyonel Hareketler
                       </h3>
                       <div className="space-y-4">
                         {operationalChecks.filter(c => c.status === 'Denetlendi').slice(0, 4).map((check) => (
                           <div key={check.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                 <Box className="w-4 h-4 text-emerald-600" />
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-slate-700">{check.binName} denetlendi</p>
                                 <p className="text-[10px] text-slate-500">{check.staff} • {check.lastCheck}</p>
                               </div>
                             </div>
                             <Badge color="green" className="text-[10px]">{check.efficiency}</Badge>
                           </div>
                         ))}
                       </div>
                     </Card>

                     <Card className="p-6 bg-white border-slate-100 shadow-sm">
                       <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                         <LayoutDashboard className="w-4 h-4 text-slate-400" />
                         Hızlı Erişim
                       </h3>
                       <div className="grid grid-cols-2 gap-4">
                         {[
                           { label: 'Atık Noktası Ekle', icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                           { label: 'Personel Listesi', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                           { label: 'Haftalık Plan', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
                           { label: 'Konum Ayarları', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
                         ].map((btn) => (
                           <button key={btn.label} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors gap-2 group">
                             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", btn.bg, btn.color)}>
                               <btn.icon className="w-5 h-5" />
                             </div>
                             <span className="text-xs font-bold text-slate-600">{btn.label}</span>
                           </button>
                         ))}
                       </div>
                     </Card>
                   </div>
                 </div>
               )}
             </div>
          )}

          {activeTab === 'Stok Takibi' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Kurumsal Stok Yönetimi</h3>
                    <p className="text-sm text-slate-500">Tüm birimlerden gelen atıkların stok durumunu ve satışlarını yönetin.</p>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    {['Stok Durumu', 'Satış', 'Tüm Stok Geçmişi'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setStockSubTab(tab)}
                        className={cn(
                          "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                          stockSubTab === tab 
                            ? "bg-white text-emerald-700 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {stockSubTab === 'Stok Durumu' && (
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          const initialCaps: Record<string, string> = {};
                          stockLevels.forEach(l => initialCaps[l.category] = l.capacity);
                          setTempCapacities(initialCaps);
                          setShowCapacityModal(true);
                        }}
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" /> Kapasite Bilgileri Ekle/Düzenle
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stockLevels.map((item) => (
                      <Card key={item.category} className="p-6 border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Box className="w-5 h-5" />
                          </div>
                          <Badge color={item.status === 'Kritik' ? 'red' : item.status === 'Düşük' ? 'amber' : 'green'}>
                            {item.status}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">{item.category}</h4>
                        <div className="text-2xl font-black text-slate-800 mb-4">{item.amount}</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                            <span>Doluluk Oranı</span>
                            <span>{item.capacity} Kapasite</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                item.status === 'Kritik' ? 'bg-red-500' : 'bg-emerald-500'
                              )}
                              style={{ width: `${(parseInt(item.amount.replace(/\D/g,'')) / parseInt(item.capacity.replace(/\D/g,''))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    </div>
                  </div>
                )}

                {stockSubTab === 'Satış' && (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => setShowAddSale(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" /> Satış Ekle
                      </Button>
                    </div>
                    <div className="overflow-hidden border border-slate-100 rounded-xl">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">İşlem ID</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Alıcı Firma</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Atık Türü</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Miktar</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">Tutar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {salesRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-mono text-slate-500">{record.id}</td>
                            <td className="px-6 py-4 font-bold text-sm text-slate-900">{record.buyer}</td>
                            <td className="px-6 py-4 text-xs text-slate-600">{record.item}</td>
                            <td className="px-6 py-4 text-xs font-bold text-emerald-600">{record.amount}</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">{record.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

                {stockSubTab === 'Tüm Stok Geçmişi' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-700">Son Hareketler</h4>
                      <Button 
                        onClick={downloadStockHistoryExcel}
                        variant="outline"
                        className="text-xs border-slate-200 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <History className="w-3 h-3" /> Excel Olarak Aktar
                      </Button>
                    </div>
                    {stockHistory.map((log) => (
                      <div key={log.id} className="flex items-center gap-4 p-4 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          log.type === 'Giriş' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {log.type === 'Giriş' ? <PlusCircle className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-slate-900 text-sm">{log.item} {log.type === 'Giriş' ? 'Girişi' : 'Çıkışı'}</h5>
                              <p className="text-xs text-slate-500">{log.source} biriminden</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-black text-slate-900">{log.type === 'Giriş' ? '+' : '-'}{log.quantity}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{log.date}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Operasyonel Kontroller' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Operasyonel Kontroller</h3>
                  <p className="text-sm text-slate-500">Sorumluluk alanınızdaki atık kutularının denetim durumunu izleyin.</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex justify-start bg-slate-100 p-1 rounded-xl w-fit">
                  {['Günlük', 'Haftalık', 'Kontrol Denetimi Geçmişi'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setOpsSubTab(tab)}
                      className={cn(
                        "px-6 py-2 text-sm font-bold rounded-lg transition-all",
                        opsSubTab === tab 
                          ? "bg-white text-emerald-700 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {opsSubTab === 'Kontrol Denetimi Geçmişi' && (
                  <Button 
                    onClick={downloadCheckHistoryExcel}
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-2 px-4"
                  >
                    <History className="w-4 h-4" /> Excel'e Aktar
                  </Button>
                )}
              </div>

              {accessibleCampuses.map((campus) => {
                const campusChecks = filteredChecks.filter(c => c.campusId === campus.id);
                if (campusChecks.length === 0) return null;

                const buildingsInCampusWithChecks = locations.filter(l => l.type === 'Bina' && l.parent === campus.id && campusChecks.some(c => c.buildingId === l.id));

                return (
                  <div key={campus.id} className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                      <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {campus.name}
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          {campusChecks.length} Denetim Noktası
                        </span>
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {buildingsInCampusWithChecks.map((building) => {
                        const isExpanded = expandedOpsBuildings.includes(building.id);
                        const buildingChecks = campusChecks.filter(c => c.buildingId === building.id);

                        return (
                          <div key={building.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
                            <div 
                              onClick={() => setExpandedOpsBuildings(prev => 
                                prev.includes(building.id) ? prev.filter(id => id !== building.id) : [...prev, building.id]
                              )}
                              className={cn(
                                "p-4 flex items-center justify-between cursor-pointer transition-colors",
                                isExpanded ? "bg-slate-50/80" : "hover:bg-slate-50/50"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                  isExpanded ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                )}>
                                  <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-700">{building.name}</h5>
                                  <p className="text-xs text-slate-500">{building.title} • {buildingChecks.length} Atık Noktası</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                  {['Denetlendi', 'Beklemede', 'Denetim Gerekli'].map(status => {
                                    const count = buildingChecks.filter(c => c.status === status).length;
                                    if (count === 0) return null;
                                    return (
                                      <Badge key={status} color={getStatusColor(status)} className="text-[10px] px-1.5 h-5">
                                        {count}
                                      </Badge>
                                    );
                                  })}
                                </div>
                                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isExpanded && "rotate-180")} />
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-4 bg-white border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {buildingChecks.map((check) => (
                                    <div key={check.id} className="p-4 border border-slate-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all bg-slate-50/30">
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center">
                                            <Box className="w-4 h-4 text-slate-400" />
                                          </div>
                                          <div>
                                            <h6 className="text-sm font-bold text-slate-900">{check.binName}</h6>
                                            <p className="text-[10px] text-slate-500 font-medium">{check.location}</p>
                                          </div>
                                        </div>
                                        <Badge color={getStatusColor(check.status)} className="text-[9px] uppercase tracking-wider">{check.status}</Badge>
                                      </div>
                                      
                                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/50">
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[9px] font-bold text-emerald-700 border border-emerald-100">
                                            {check.staff.split(' ').map(n => n[0]).join('')}
                                          </div>
                                          <span className="text-[11px] font-semibold text-slate-600">{check.staff}</span>
                                        </div>
                                        <div className="text-right">
                                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Verimlilik</p>
                                          <p className={cn("text-xs font-bold", check.efficiency === '-' ? "text-slate-400" : "text-emerald-600")}>{check.efficiency}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'Lokasyon Yönetimi' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Lokasyon Yönetimi</h3>
                  <p className="text-sm text-slate-500">Kampüs ve bina yapılarını hiyerarşik olarak yönetin.</p>
                </div>
                <Button onClick={() => setShowAddLocation(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-6">
                  <Plus className="w-4 h-4 mr-2" /> Yeni Lokasyon
                </Button>
              </div>

              <div className="space-y-4">
                {locations
                  .filter(l => l.type === 'Kampüs')
                  .filter(l => isKurumYoneticisi || (isKampusSorumlusu && l.id === '1'))
                  .map((kampus) => {
                    const isExpanded = expandedKampus.includes(kampus.id);
                    const kampusBuildings = locations.filter(b => b.parent === kampus.id);
                    
                    return (
                      <div key={kampus.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div 
                          onClick={() => toggleKampus(kampus.id)}
                          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                              <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                {kampus.name}
                                <Badge color="green" className="text-[10px] h-5">Kampüs</Badge>
                              </h4>
                              <p className="text-xs text-slate-500">{kampusBuildings.length} Kayıtlı Bina</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                              e.stopPropagation();
                              setEditingLocation(kampus);
                            }}>
                              <Edit className="w-4 h-4 text-slate-400" />
                            </Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLocation(kampus.id);
                            }}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => {
                              e.stopPropagation();
                              setQrTarget({ id: kampus.id, name: kampus.name, type: 'Kampüs' });
                              setShowQrModal(true);
                            }}>
                              <QrCode className="w-4 h-4 text-emerald-400" />
                            </Button>
                            <ChevronDown className={cn(
                              "w-5 h-5 text-slate-400 transition-transform duration-300",
                              isExpanded && "rotate-180"
                            )} />
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-slate-50 bg-slate-50/30 p-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {kampusBuildings.length > 0 ? (
                                kampusBuildings.map(bina => (
                                  <Card key={bina.id} className="p-4 border-slate-100 bg-white hover:border-emerald-200 transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                          <Box className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-bold text-slate-900">{bina.name}</h5>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hizmet Binası</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingLocation(bina)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-600">
                                          <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDeleteLocation(bina.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => {
                                          setQrTarget({ id: bina.id, name: bina.name, type: 'Bina' });
                                          setShowQrModal(true);
                                        }} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-emerald-500">
                                          <QrCode className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8 mb-4">
                                      {bina.description}
                                    </p>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                      <div className="text-[10px] text-slate-400 font-bold uppercase">3 Atık Noktası</div>
                                      <Button variant="ghost" className="h-7 text-[10px] text-emerald-600 font-bold">Detay</Button>
                                    </div>
                                  </Card>
                                ))
                              ) : (
                                <div className="col-span-full py-10 text-center text-slate-400">Bu kampüste henüz bina bulunmuyor.</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {activeTab === 'Atık Noktası Yönetimi' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Atık Noktası Yönetimi</h3>
                  <p className="text-sm text-slate-500">Binalardaki atık toplama noktalarını ve görevli personelleri yönetin.</p>
                </div>
                <Button onClick={() => setShowAddWastePoint(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-6">
                  <Plus className="w-4 h-4 mr-2" /> Yeni Atık Noktası
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wastePoints.map((point) => (
                  <Card key={point.id} className="p-6 border-slate-200 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{point.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{point.type}</p>
                        </div>
                      </div>
                      <Badge color="green" variant="outline">{point.id}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{point.buildingName} - Kat: {point.floor}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                            {point.staffName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{point.staffName}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saha Görevlisi</span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-50">
                        <Button 
                          variant="ghost" 
                          className="flex-1 h-8 text-xs text-slate-400 hover:text-emerald-600 border border-slate-100"
                          onClick={() => setEditingWastePoint(point)}
                        >
                          <Edit className="w-3.5 h-3.5 mr-1.5" /> Düzenle
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-500"
                          onClick={() => {
                            setQrTarget({ id: point.id, name: point.name, type: 'Atık Noktası' });
                            setShowQrModal(true);
                          }}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                          onClick={() => handleDeleteWastePoint(point.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Kullanıcı Yönetimi' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Kullanıcı Yönetimi</h3>
                  <p className="text-sm text-slate-500">Sistemdeki personelleri ve rollerini yönetin.</p>
                </div>
                <Button onClick={() => setShowAddUser(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-6">
                  <Plus className="w-4 h-4 mr-2" /> Yeni Kullanıcı
                </Button>
              </div>

              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Ad Soyad</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">E-posta</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Rol</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-sm text-slate-900">{user.name}</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{user.email}</td>
                          <td className="px-6 py-4">
                            <Badge color={
                              user.role === 'corp_admin' ? 'blue' : 
                              user.role === 'campus_lead' ? 'green' : 'blue'
                            } className="text-[10px]">
                              {roleLabels[user.role] || user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" className="h-8 text-xs text-slate-400 hover:text-red-500">Kaldır</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'Ayarlar' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Sistem ve Hesap Ayarları</h3>
                <p className="text-sm text-slate-500">Platform tercihlerini ve sorumluluk alanı parametrelerini yönetin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-1 text-sm">Hesap Bilgileri</h4>
                    <p className="text-xs text-emerald-600/70">Kişisel profil ve güvenlik ayarlarınız.</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                    <h4 className="font-bold text-slate-700 mb-1 text-sm">Bildirimler</h4>
                    <p className="text-xs text-slate-400">Anlık ve e-posta uyarıları.</p>
                  </div>
                  {isKurumYoneticisi && (
                    <div className="p-4 bg-white rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                      <h4 className="font-bold text-slate-700 mb-1 text-sm">Kurumsal Kimlik</h4>
                      <p className="text-xs text-slate-400">Logo ve renk paleti ayarları.</p>
                    </div>
                  )}
                </div>

                <Card className="md:col-span-2 p-8 bg-white border-slate-100">
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Görünen Ad" defaultValue="Ahmet Yılmaz" />
                      <Input label="E-posta Adresi" defaultValue="ahmet@kurum.com" disabled />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50">
                      <h4 className="font-bold text-slate-800 mb-4">Uygulama Tercihleri</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-slate-700">Kritik Doluluk Uyarıları</p>
                            <p className="text-xs text-slate-500">Atık noktaları %85 doluluğa ulaştığında bildirim gönder.</p>
                          </div>
                          <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-slate-700">Haftalık Rapor Özeti</p>
                            <p className="text-xs text-slate-500">Her Pazartesi sabahı genel durum özeti gönder.</p>
                          </div>
                          <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                      <Button variant="ghost" className="text-slate-500">Değişiklikleri İptal Et</Button>
                      <Button className="bg-emerald-600 text-white px-8 shadow-lg shadow-emerald-600/20">Ayarları Kaydet</Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showAddLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Yeni Lokasyon Ekle</h3>
              <button onClick={() => setShowAddLocation(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <Input label="Lokasyon Adı" placeholder="Örn: C Blok" required value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})} />
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">Lokasyon Tipi</label>
                <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                  {isKurumYoneticisi && (
                    <button
                      type="button"
                      onClick={() => setNewLoc({...newLoc, type: 'Kampüs', parent: ''})}
                      className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                        newLoc.type === 'Kampüs' 
                          ? "bg-white text-emerald-700 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Kampüs
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setNewLoc({...newLoc, type: 'Bina'})}
                    className={cn(
                      "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                      newLoc.type === 'Bina' 
                        ? "bg-white text-emerald-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Bina
                  </button>
                </div>
              </div>
              {newLoc.type === 'Bina' && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Üst Lokasyon (Kampüs)</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    value={newLoc.parent}
                    onChange={e => setNewLoc({...newLoc, parent: e.target.value})}
                    required
                  >
                    <option value="">Kampüs Seçiniz</option>
                    {locations.filter(l => l.type === 'Kampüs').map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {newLoc.type === 'Bina' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="number" 
                    label="Zemin Üstü Kat Sayısı" 
                    min="1" 
                    value={newLoc.groundAbove} 
                    onChange={e => setNewLoc({...newLoc, groundAbove: parseInt(e.target.value)})} 
                  />
                  <Input 
                    type="number" 
                    label="Bodrum Kat Sayısı" 
                    min="0" 
                    value={newLoc.basement} 
                    onChange={e => setNewLoc({...newLoc, basement: parseInt(e.target.value)})} 
                  />
                </div>
              )}
              <Input label="Açıklama" placeholder="Kısa bir açıklama girin" value={newLoc.description} onChange={e => setNewLoc({...newLoc, description: e.target.value})} />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Kaydet</Button>
            </form>
          </Card>
        </div>
      )}

      {showAddWastePoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Yeni Atık Noktası Oluştur</h3>
              <button onClick={() => setShowAddWastePoint(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddWastePoint} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Atık Noktası Kodu</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-mono font-bold text-emerald-700">
                    {newWastePoint.name || 'Bina seçiniz...'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Atık Türü</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    value={newWastePoint.type}
                    onChange={e => setNewWastePoint({...newWastePoint, type: e.target.value})}
                  >
                    <option value="Karma">Karma</option>
                    <option value="Plastik/Kağıt">Plastik/Kağıt</option>
                    <option value="Cam">Cam</option>
                    <option value="Metal">Metal</option>
                    <option value="Geri Dönüşüm">Geri Dönüşüm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Kampüs Seçimi</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:opacity-50"
                    value={newWastePoint.campusId}
                    onChange={e => setNewWastePoint({...newWastePoint, campusId: e.target.value, buildingId: '', floor: ''})}
                    required
                    disabled={accessibleCampuses.length === 1}
                  >
                    {accessibleCampuses.length > 1 && <option value="">Kampüs Seçiniz</option>}
                    {accessibleCampuses.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Bina Seçimi</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:opacity-50"
                    value={newWastePoint.buildingId}
                    onChange={e => setNewWastePoint({...newWastePoint, buildingId: e.target.value, floor: ''})}
                    required
                    disabled={!newWastePoint.campusId || (isBinaSorumlusu && accessibleBuildings.length === 1)}
                  >
                    <option value="">Bina Seçiniz</option>
                    {getFilteredBuildings(newWastePoint.campusId).map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Bulunduğu Kat</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none disabled:opacity-50"
                  value={newWastePoint.floor}
                  onChange={e => setNewWastePoint({...newWastePoint, floor: e.target.value})}
                  required
                  disabled={!newWastePoint.buildingId}
                >
                  <option value="">Kat Seçiniz</option>
                  {getFloorOptions(newWastePoint.buildingId).map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Saha Personeli Atama</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  value={newWastePoint.staffId}
                  onChange={e => setNewWastePoint({...newWastePoint, staffId: e.target.value})}
                  required
                >
                  <option value="">Personel Seçiniz</option>
                  {users.filter(u => u.role === 'saha_personeli').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 shadow-lg shadow-emerald-600/20">
                  Noktayı Tanımla ve Personeli Ata
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Yeni Kullanıcı Tanımla</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input label="Ad Soyad" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              <Input label="E-posta" type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Rol</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as any})}
                >
                  <option value="saha_personeli">Saha Personeli</option>
                  <option value="olcum_sefi">Ölçüm Şefi</option>
                  <option value="bina_sorumlusu">Bina Sorumlusu</option>
                  <option value="campus_lead">Kampüs Sorumlusu</option>
                  {isKurumYoneticisi && <option value="corp_admin">Kurum Yöneticisi</option>}
                </select>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Ekle</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Location Modal */}
      {editingLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Lokasyonu Düzenle</h3>
              <button onClick={() => setEditingLocation(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleEditLocation} className="space-y-4">
              <Input label="İsim" value={editingLocation.name} onChange={e => setEditingLocation({...editingLocation, name: e.target.value})} required />
              <Input label="Açıklama" value={editingLocation.description} onChange={e => setEditingLocation({...editingLocation, description: e.target.value})} />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Güncelle</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Waste Point Modal */}
      {editingWastePoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Atık Noktasını Düzenle</h3>
              <button onClick={() => setEditingWastePoint(null)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleEditWastePoint} className="space-y-4">
              <Input label="Nokta İsmi" value={editingWastePoint.name} onChange={e => setEditingWastePoint({...editingWastePoint, name: e.target.value})} required />
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Atık Türü</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={editingWastePoint.type}
                  onChange={e => setEditingWastePoint({...editingWastePoint, type: e.target.value})}
                >
                  <option value="Karma">Karma</option>
                  <option value="Plastik/Kağıt">Plastik/Kağıt</option>
                  <option value="Cam">Cam</option>
                  <option value="Metal">Metal</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Sorumlu Personel</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={editingWastePoint.staffId}
                  onChange={e => setEditingWastePoint({...editingWastePoint, staffId: e.target.value})}
                >
                  {users.filter(u => u.role === 'saha_personeli').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Güncelle</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Kapasite Güncelleme Modal */}
      {showCapacityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Archive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Kapasite Yönetimi</h3>
                  <p className="text-xs text-slate-500">Atık türleri için maksimum depolama limitlerini belirleyin.</p>
                </div>
              </div>
              <button onClick={() => setShowCapacityModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleUpdateCapacities} className="space-y-4">
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {stockLevels.map((level) => (
                  <div key={level.category} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{level.category}</label>
                    <div className="flex items-center gap-3">
                      <Input 
                        placeholder="Örn: 2000 kg" 
                        value={tempCapacities[level.category] || ''}
                        onChange={(e) => setTempCapacities({...tempCapacities, [level.category]: e.target.value})}
                        required
                      />
                      <span className="text-[10px] font-bold text-slate-400 w-24 text-right">Mevcut: {level.amount}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowCapacityModal(false)} className="flex-1">İptal</Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Kapasiteleri Güncelle
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Satış Ekle Modal */}
      {showAddSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Yeni Satış Kaydı</h3>
                  <p className="text-xs text-slate-500">Dışarıya satılan atık bilgilerini girin.</p>
                </div>
              </div>
              <button onClick={() => setShowAddSale(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handleAddSale} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Satılan Firma Adı</label>
                <Input 
                  placeholder="Örn: Eko Geri Dönüşüm A.Ş." 
                  value={newSale.buyer}
                  onChange={(e) => setNewSale({...newSale, buyer: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Atık Türü</label>
                  <select 
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                    value={newSale.item}
                    onChange={(e) => setNewSale({...newSale, item: e.target.value})}
                  >
                    <option value="Plastik">Plastik</option>
                    <option value="Kağıt/Karton">Kağıt/Karton</option>
                    <option value="Metal">Metal</option>
                    <option value="Cam">Cam</option>
                    <option value="Elektronik">Elektronik</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Miktar (kg/Ton)</label>
                  <Input 
                    placeholder="Örn: 500 kg" 
                    value={newSale.amount}
                    onChange={(e) => setNewSale({...newSale, amount: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Toplam Satış Tutarı (₺)</label>
                <Input 
                  placeholder="Örn: 15.000" 
                  value={newSale.price}
                  onChange={(e) => setNewSale({...newSale, price: e.target.value})}
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowAddSale(false)} className="flex-1">İptal</Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                  Satışı Kaydet
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Denetim Modal */}
      {showCheckModal && selectedCheckPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Nokta Denetimi</h3>
                  <p className="text-xs text-slate-500">{selectedCheckPoint.name} - {selectedCheckPoint.buildingName}</p>
                </div>
              </div>
              <button onClick={() => setShowCheckModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <form onSubmit={handlePerformCheck} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Denetim Sonucu</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Denetlendi', 'Denetim Gerekli', 'Beklemede'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setCheckResult({...checkResult, status})}
                      className={cn(
                        "py-2 px-3 text-xs font-bold rounded-lg border transition-all",
                        checkResult.status === status 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Verimlilik Skoru (%0 - %100)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={checkResult.efficiency}
                    onChange={(e) => setCheckResult({...checkResult, efficiency: e.target.value})}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="text-sm font-bold text-emerald-600 w-10">%{checkResult.efficiency}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Denetim Notları</label>
                <textarea 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Opsiyonel denetim notları..."
                  value={checkResult.notes}
                  onChange={(e) => setCheckResult({...checkResult, notes: e.target.value})}
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 shadow-lg shadow-emerald-600/20">
                Denetimi Tamamla ve Kaydet
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && qrTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-8 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">QR Kod Görüntüle</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl inline-block mb-6 border border-slate-200 shadow-inner">
              <QRCodeSVG 
                id={`qr-${qrTarget.id}`}
                value={`https://ecotrace-mobile.figma.site/scan/${qrTarget.id}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="space-y-2 mb-8">
              <h4 className="text-lg font-bold text-slate-900">{qrTarget.name}</h4>
              <Badge color="blue">{qrTarget.type}</Badge>
              <p className="text-xs text-slate-500 font-mono">{qrTarget.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => window.print()} className="border-slate-200">
                <Eye className="w-4 h-4 mr-2" /> Yazdır
              </Button>
              <Button onClick={() => downloadQR(qrTarget.id, qrTarget.name)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Download className="w-4 h-4 mr-2" /> PDF İndir
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
