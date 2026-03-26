
"use client";

import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loginUser, registerUser, logoutUser } from '@/lib/services/auth.service';
import { updateUserProfile, getUserData } from '@/lib/services/user.service';
import { fetchUserOrders, UserOrder } from '@/actions/orders';
import { fetchCommunes } from '@/actions/communes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { 
  User as UserIcon, 
  Package, 
  Settings, 
  ShieldCheck, 
  Mail, 
  Lock, 
  ChevronRight,
  Clock,
  Phone,
  MapPin,
  FileText,
  Search,
  Check,
  X,
  Loader2,
  Building2,
  ArrowRight,
  Plus,
  Trash2,
  LogOut,
  MapPinIcon,
  CreditCard
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CuentaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [communes, setCommunes] = useState<string[]>([]);
  
  const { clearWishlist } = useWishlist();
  const { clearCart } = useCart();

  // Search state for communes
  const [communeSearch, setCommuneSearch] = useState("");
  const [showCommuneResults, setShowCommuneResults] = useState(false);
  const communeSearchRef = useRef<HTMLDivElement>(null);

  // Auth Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    displayName: '',
    phone: '',
    billingType: 'boleta',
    rut: '',
    companyName: '',
    businessLine: '',
    billingAddress: '',
    role: 'customer'
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState({
    id: '',
    name: 'Casa',
    streetAndNumber: '',
    apartmentOrLocal: '',
    commune: '',
    region: 'Metropolitana',
    isDefault: false
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const router = useRouter();

  const normalizeText = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredCommunes = communes.filter(c => 
    normalizeText(c).includes(normalizeText(communeSearch))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (communeSearchRef.current && !communeSearchRef.current.contains(event.target as Node)) {
        setShowCommuneResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadCommunes = async () => {
      const list = await fetchCommunes();
      if (list.length > 0) setCommunes(list);
    };
    loadCommunes();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setDataLoading(true);
        const dbData = await getUserData(currentUser.uid);
        
        if (dbData?.role === 'wholesale') {
          router.push('/b2b/portal');
          return;
        }

        setUser(currentUser);
        
        try {
          const userOrders = await fetchUserOrders(currentUser.uid);
          setOrders(userOrders);

          if (dbData) {
            setProfileData({
              displayName: currentUser.displayName || dbData.displayName || '',
              phone: dbData.phone || '',
              billingType: dbData.billingType || 'boleta',
              rut: dbData.rut || '',
              companyName: dbData.companyName || '',
              businessLine: dbData.businessLine || '',
              billingAddress: dbData.billingAddress || '',
              role: dbData.role || 'customer'
            });
            setAddresses(dbData.addresses || []);
          }
        } catch (error) {
          console.error("Error cargando perfil:", error);
        } finally {
          setDataLoading(false);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const getLoyaltyStatus = () => {
    if (orders.length >= 5) return { text: "Miembro de Honor 🏆", color: "bg-secondary text-primary shadow-lg shadow-secondary/20" };
    if (orders.length > 0) return { text: "Cliente Amigo 🦴", color: "bg-primary/10 text-primary" };
    return { text: "Nuevo en la Manada 🐾", color: "bg-muted text-muted-foreground" };
  };

  const loyalty = getLoyaltyStatus();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginUser(email, password);
        toast({ title: "¡Bienvenido de vuelta! 🐾" });
      } else {
        await registerUser(email, password, displayName);
        toast({ title: "¡Cuenta creada! ✨", description: "Ya eres parte de nuestra Manada." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error de acceso", description: "Verifica tus datos e intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await updateUserProfile(profileData);
      toast({ title: "Perfil actualizado ✨", description: "Tus datos se guardaron correctamente." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error al actualizar" });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!currentAddress.streetAndNumber || !communeSearch) {
       toast({ variant: "destructive", title: "Faltan datos obligatorios" });
       return;
    }

    setSavingAddress(true);
    try {
      const addrId = editingAddressId === 'new' ? Math.random().toString(36).substring(2, 9) : editingAddressId!;
      const addrToSave = { ...currentAddress, id: addrId, commune: communeSearch };
      
      let newAddresses = [...addresses];
      if (addrToSave.isDefault) newAddresses = newAddresses.map(a => ({...a, isDefault: false}));
      
      if (editingAddressId === 'new') newAddresses.push(addrToSave);
      else newAddresses = newAddresses.map(a => a.id === editingAddressId ? addrToSave : a);

      await updateUserProfile({ addresses: newAddresses });
      setAddresses(newAddresses);
      setEditingAddressId(null);
      toast({ title: "Dirección guardada ✨" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error al guardar" });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    clearWishlist();
    clearCart();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#F6F6F6]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Abriendo tu rincón...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-24">
      {!user ? (
        <div className="max-w-md mx-auto pt-20 px-4">
          <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
            <div className="bg-primary p-12 text-white text-center space-y-6">
              <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl border border-white/10">
                <UserIcon className="w-10 h-10 text-secondary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
                  {isLogin ? '¡Hola de nuevo!' : 'Sé parte de nosotros'}
                </h1>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Hogar Virtual MyDog</p>
              </div>
            </div>
            
            <CardContent className="p-10 space-y-8">
              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Completo</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contraseña</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6" />
                </div>
                <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  {isLogin ? 'Entrar al Hogar' : 'Unirse a la Manada'} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
              
              <div className="space-y-6 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline block w-full">
                  {isLogin ? '¿Aún no tienes cuenta? Regístrate aquí' : '¿Ya eres miembro? Ingresa aquí'}
                </button>
                <div className="pt-6 border-t border-black/5">
                  <Link href="/b2b/portal" className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <Building2 className="w-3 h-3" /> ¿Eres cliente mayorista? Entra aquí
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Dashboard Header - Hero Refinado */}
          <section className="bg-[#FEF9F3] pt-12 pb-20 border-b border-black/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    Mi Rincón Personal MyDog
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                    Hola, <span className="text-primary">{profileData.displayName || user.displayName || 'Miembro'}</span>
                  </h1>
                  <Badge className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none", loyalty.color)}>
                    {loyalty.text}
                  </Badge>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="w-fit h-12 rounded-2xl bg-white text-red-500 font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-red-50 gap-2 border border-black/5">
                  Cerrar Sesión <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Dashboard Content - Layout de Rejilla Profesional */}
          <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
            <Tabs defaultValue="compras" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Sidebar de Navegación (3 col) */}
              <aside className="lg:col-span-3">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden sticky top-48">
                  <TabsList className="flex flex-col h-auto bg-transparent p-4 gap-2">
                    <TabsTrigger value="compras" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <Package className="w-4 h-4" /> Mis Compras
                    </TabsTrigger>
                    <TabsTrigger value="perfil" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <Settings className="w-4 h-4" /> Mi Identidad
                    </TabsTrigger>
                    <TabsTrigger value="direcciones" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <MapPin className="w-4 h-4" /> Puntos de Despacho
                    </TabsTrigger>
                    <TabsTrigger value="seguridad" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <ShieldCheck className="w-4 h-4" /> Seguridad
                    </TabsTrigger>
                  </TabsList>
                </Card>
              </aside>

              {/* Área de Visualización (9 col) */}
              <div className="lg:col-span-9">
                {/* Mis Compras */}
                <TabsContent value="compras" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Mis Compras Realizadas</h2>
                  
                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                                  <Package className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Orden #{order.id.slice(-6).toUpperCase()}</span>
                                  <h4 className="text-2xl font-black text-foreground">${order.totalAmount.toLocaleString('es-CL')}</h4>
                                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString('es-CL')}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 w-full md:w-auto">
                                <Badge className={cn(
                                  "rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-none grow text-center md:grow-0",
                                  order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                )}>
                                  {order.status === 'completed' ? 'Entregado' : 'En proceso'}
                                </Badge>
                                <Button variant="outline" className="rounded-xl h-12 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all grow md:grow-0 border-primary/10">
                                  Repetir Pedido
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-black/5 space-y-8">
                      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
                        <Package className="w-12 h-12 text-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black text-foreground">Aún no hay compras en tu historial</p>
                        <p className="text-muted-foreground text-sm font-medium max-w-xs mx-auto leading-relaxed">
                          ¿Vamos a buscar algo rico para regalonear a tu mascota hoy mismo?
                        </p>
                      </div>
                      <Link href="/catalogo">
                        <Button className="h-16 px-12 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                          Ir a la tiendita <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>

                {/* Perfil e Identidad */}
                <TabsContent value="perfil" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Configuración de Perfil</h2>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    {/* Identidad MyDog */}
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                            <UserIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Mi Identidad MyDog</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tus datos básicos de contacto</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Visible</Label>
                            <Input value={profileData.displayName} onChange={(e) => setProfileData({...profileData, displayName: e.target.value})} className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6 focus-visible:ring-primary/20" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono de contacto</Label>
                            <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+56 9 XXXX XXXX" className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6 focus-visible:ring-primary/20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Datos de Facturación */}
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Datos para mi Boleta</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Información legal para tus compras</p>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tipo de Documento</Label>
                            <Select value={profileData.billingType} onValueChange={(val) => setProfileData({...profileData, billingType: val})}>
                              <SelectTrigger className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6 focus:ring-primary/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                <SelectItem value="boleta" className="font-bold py-3">Emitir Boleta de Venta</SelectItem>
                                <SelectItem value="factura" className="font-bold py-3">Emitir Factura (Empresas)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {profileData.billingType === 'factura' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">RUT Empresa</Label>
                                <Input placeholder="12.345.678-9" value={profileData.rut} onChange={(e) => setProfileData({...profileData, rut: e.target.value})} className="h-14 rounded-2xl bg-muted/10 font-bold" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Razón Social</Label>
                                <Input placeholder="Ej: Veterinaria SPA" value={profileData.companyName} onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} className="h-14 rounded-2xl bg-muted/10 font-bold" />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                      <Button disabled={updatingProfile} className="h-16 px-12 rounded-full bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all gap-3">
                        {updatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        Sincronizar mis Datos MyDog
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Direcciones */}
                <TabsContent value="direcciones" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Mis Puntos de Despacho</h2>
                    <Button onClick={() => { setEditingAddressId('new'); setCurrentAddress({ id: '', name: 'Casa', streetAndNumber: '', apartmentOrLocal: '', commune: '', region: 'Metropolitana', isDefault: false }); setCommuneSearch(""); }} className="h-12 rounded-2xl bg-secondary text-primary font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                      <Plus className="w-4 h-4" /> Agregar Nueva Dirección
                    </Button>
                  </div>

                  {editingAddressId ? (
                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-10 animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-center mb-10 border-b border-black/5 pb-6">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black uppercase tracking-widest text-primary">
                            {editingAddressId === 'new' ? 'Nueva Dirección' : 'Editar Punto de Despacho'}
                          </h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asegura tu entrega rápida en la RM</p>
                        </div>
                        <button onClick={() => setEditingAddressId(null)} className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre (Ej: Oficina)</Label>
                            <Input value={currentAddress.name} onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})} className="h-14 rounded-2xl bg-muted/30 font-bold px-6 border-none focus-visible:ring-primary/20" />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número *</Label>
                            <Input value={currentAddress.streetAndNumber} onChange={(e) => setCurrentAddress({...currentAddress, streetAndNumber: e.target.value})} className="h-14 rounded-2xl bg-muted/30 font-bold px-6 border-none focus-visible:ring-primary/20" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Depto/Local</Label>
                            <Input value={currentAddress.apartmentOrLocal} onChange={(e) => setCurrentAddress({...currentAddress, apartmentOrLocal: e.target.value})} className="h-14 rounded-2xl bg-muted/30 font-bold px-6 border-none focus-visible:ring-primary/20" />
                          </div>
                          <div className="space-y-2 relative" ref={communeSearchRef}>
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna (Región Metropolitana) *</Label>
                            <div className="relative">
                              <Input value={communeSearch} onChange={(e) => { setCommuneSearch(e.target.value); setShowCommuneResults(true); }} onFocus={() => setShowCommuneResults(true)} className="h-14 rounded-2xl bg-muted/30 font-bold px-6 border-none focus-visible:ring-primary/20" />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30"><Search className="w-4 h-4" /></div>
                            </div>
                            {showCommuneResults && (
                              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-black/5 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <ScrollArea className="max-h-48">
                                  <div className="p-2 space-y-1">
                                    {filteredCommunes.map(c => (
                                      <button key={c} onClick={() => { setCommuneSearch(c); setShowCommuneResults(false); }} className="w-full text-left px-6 py-3 font-bold text-xs rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                                        {c}
                                      </button>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Región</Label>
                            <Input value="Metropolitana" readOnly className="h-14 rounded-2xl bg-muted/10 font-bold px-6 opacity-50 cursor-not-allowed border-none" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-black/5">
                          <Label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={currentAddress.isDefault} onChange={(e) => setCurrentAddress({...currentAddress, isDefault: e.target.checked})} className="w-6 h-6 rounded-lg accent-primary cursor-pointer" />
                            <span className="text-sm font-bold group-hover:text-primary transition-colors">Fijar como dirección principal de despacho</span>
                          </Label>
                          <Button onClick={handleSaveAddress} disabled={savingAddress} className="h-16 px-12 rounded-full bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 gap-3 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                            {savingAddress ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />} Guardar Dirección
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.length > 0 ? addresses.map((addr) => (
                        <Card key={addr.id} className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 relative group hover:shadow-md transition-all overflow-hidden border border-black/[0.03]">
                          {addr.isDefault && (
                            <Badge className="absolute top-6 right-6 bg-primary text-white border-none text-[8px] uppercase tracking-widest px-3 py-1 shadow-lg shadow-primary/10">Principal</Badge>
                          )}
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                <MapPin className="w-6 h-6" />
                              </div>
                              <h4 className="text-lg font-black uppercase truncate tracking-tight">{addr.name}</h4>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-sm font-bold text-foreground leading-snug">{addr.streetAndNumber} {addr.apartmentOrLocal}</p>
                              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                <Building2 className="w-3 h-3" /> {addr.commune}, Santiago RM
                              </div>
                            </div>
                            <div className="flex gap-6 pt-4 border-t border-black/[0.03]">
                              <button onClick={() => { setEditingAddressId(addr.id); setCurrentAddress(addr); setCommuneSearch(addr.commune); }} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-70 transition-all flex items-center gap-2">
                                <Settings className="w-3 h-3" /> Editar
                              </button>
                              <button onClick={async () => { const upd = addresses.filter(a => a.id !== addr.id); await updateUserProfile({ addresses: upd }); setAddresses(upd); }} className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] hover:opacity-70 transition-all flex items-center gap-2">
                                <Trash2 className="w-3 h-3" /> Eliminar
                              </button>
                            </div>
                          </div>
                        </Card>
                      )) : (
                        <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-black/5 space-y-6">
                          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <MapPinIcon className="w-10 h-10 text-muted-foreground/30" />
                          </div>
                          <p className="text-muted-foreground font-bold max-w-xs mx-auto">Aún no tienes direcciones guardadas para tus despachos rápidos en Santiago.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Seguridad */}
                <TabsContent value="seguridad" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Protección de Cuenta</h2>
                  
                  <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-10 space-y-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-muted/30 rounded-[2rem] border border-black/5 group hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <Lock className="w-7 h-7" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black uppercase tracking-widest text-foreground">Contraseña de acceso</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protege tu rincón personal</p>
                          </div>
                        </div>
                        <Button variant="outline" className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white transition-all px-8">
                          Cambiar mi Clave
                        </Button>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-muted/30 rounded-[2rem] border border-black/5 group">
                        <div className="flex items-center gap-6 opacity-60">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                            <ShieldCheck className="w-7 h-7" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-black uppercase tracking-widest">Doble factor (2FA)</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Seguridad nivel experto</p>
                          </div>
                        </div>
                        <Badge className="bg-white text-muted-foreground border border-black/5 rounded-full px-6 h-10 text-[9px] font-black uppercase tracking-widest">Próximamente</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </>
      )}
    </div>
  );
}
