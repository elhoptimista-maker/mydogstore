
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
  MapPinIcon
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
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">{isLogin ? '¡Hola de nuevo!' : 'Sé parte de nosotros'}</h1>
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
              
              <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">
                {isLogin ? '¿Aún no tienes cuenta? Regístrate aquí' : '¿Ya eres miembro? Ingresa aquí'}
              </button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
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

          <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
            <Tabs defaultValue="compras" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden lg:sticky lg:top-48">
                  <TabsList className="flex flex-col h-auto bg-transparent p-4 gap-2">
                    <TabsTrigger value="compras" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <Package className="w-4 h-4" /> Mis Compras
                    </TabsTrigger>
                    <TabsTrigger value="perfil" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <Settings className="w-4 h-4" /> Mi Identidad
                    </TabsTrigger>
                    <TabsTrigger value="direcciones" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <MapPin className="w-4 h-4" /> Mis Puntos de Despacho
                    </TabsTrigger>
                    <TabsTrigger value="seguridad" className="w-full justify-start h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                      <ShieldCheck className="w-4 h-4" /> Seguridad
                    </TabsTrigger>
                  </TabsList>
                </Card>
              </aside>

              <div className="lg:col-span-3">
                <TabsContent value="compras" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Mis Compras Realizadas</h2>
                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-md transition-all group">
                          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
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
                            <div className="flex items-center gap-4">
                              <Badge className={cn("rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none", order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>
                                {order.status === 'completed' ? 'Recibido' : 'En camino'}
                              </Badge>
                              <Button variant="outline" className="rounded-xl h-12 font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">Repetir Pedido</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-black/5 space-y-6">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Package className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-black text-foreground">Aún no hay compras en tu historial</p>
                        <p className="text-muted-foreground text-sm font-medium">¿Vamos a buscar algo rico para regalonearlos?</p>
                      </div>
                      <Link href="/catalogo">
                        <Button className="h-14 px-10 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 mt-4">
                          Ir a la tiendita <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="perfil" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
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
                            <Input value={profileData.displayName} onChange={(e) => setProfileData({...profileData, displayName: e.target.value})} className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono</Label>
                            <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+56 9 XXXX XXXX" className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-10 space-y-8">
                        <div className="flex items-center gap-4 border-b border-black/5 pb-6">
                          <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
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
                              <SelectTrigger className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-2xl">
                                <SelectItem value="boleta" className="font-bold">Boleta</SelectItem>
                                <SelectItem value="factura" className="font-bold">Factura</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {profileData.billingType === 'factura' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                              <Input placeholder="RUT Empresa" value={profileData.rut} onChange={(e) => setProfileData({...profileData, rut: e.target.value})} className="h-14 rounded-2xl" />
                              <Input placeholder="Razón Social" value={profileData.companyName} onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} className="h-14 rounded-2xl" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button disabled={updatingProfile} className="h-16 px-12 rounded-full bg-primary text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all gap-3">
                        {updatingProfile && <Loader2 className="w-5 h-5 animate-spin" />}
                        Sincronizar mis Datos <Check className="w-5 h-5" />
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="direcciones" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Mis Puntos de Despacho</h2>
                    <Button onClick={() => { setEditingAddressId('new'); setCurrentAddress({ id: '', name: 'Casa', streetAndNumber: '', apartmentOrLocal: '', commune: '', region: 'Metropolitana', isDefault: false }); setCommuneSearch(""); }} className="h-12 rounded-2xl bg-secondary text-primary font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-secondary/20">
                      <Plus className="w-4 h-4" /> Agregar Nueva
                    </Button>
                  </div>

                  {editingAddressId ? (
                    <Card className="rounded-[3rem] border-none shadow-xl bg-white p-10 animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black uppercase tracking-widest">{editingAddressId === 'new' ? 'Nuevo punto de despacho' : 'Editar dirección'}</h3>
                        <button onClick={() => setEditingAddressId(null)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre (Ej: Oficina) *</Label><Input value={currentAddress.name} onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})} className="h-14 rounded-2xl bg-muted/30 font-bold px-6" /></div>
                        <div className="md:col-span-2 space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número *</Label><Input value={currentAddress.streetAndNumber} onChange={(e) => setCurrentAddress({...currentAddress, streetAndNumber: e.target.value})} className="h-14 rounded-2xl bg-muted/30 font-bold px-6" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Depto/Local</Label><Input value={currentAddress.apartmentOrLocal} onChange={(e) => setCurrentAddress({...currentAddress, apartmentOrLocal: e.target.value})} className="h-14 rounded-2xl bg-muted/30 font-bold px-6" /></div>
                        <div className="space-y-2 relative" ref={communeSearchRef}>
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna (Región Metropolitana) *</Label>
                          <Input value={communeSearch} onChange={(e) => { setCommuneSearch(e.target.value); setShowCommuneResults(true); }} onFocus={() => setShowCommuneResults(true)} className="h-14 rounded-2xl bg-muted/30 font-bold px-6" />
                          {showCommuneResults && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-black/5 z-[100] overflow-hidden">
                              <ScrollArea className="max-h-48">
                                {filteredCommunes.map(c => <button key={c} onClick={() => { setCommuneSearch(c); setShowCommuneResults(false); }} className="w-full text-left px-6 py-3 font-bold text-xs hover:bg-primary/5 transition-colors">{c}</button>)}
                              </ScrollArea>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Región</Label><Input value="Metropolitana" readOnly className="h-14 rounded-2xl bg-muted/10 font-bold px-6 opacity-50 cursor-not-allowed" /></div>
                      </div>
                      <div className="flex items-center justify-between pt-8 border-t border-black/5">
                        <Label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={currentAddress.isDefault} onChange={(e) => setCurrentAddress({...currentAddress, isDefault: e.target.checked})} className="w-5 h-5 rounded-md accent-primary" /><span className="text-sm font-bold">Fijar como dirección principal</span></Label>
                        <Button onClick={handleSaveAddress} disabled={savingAddress} className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 gap-3">
                          {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Guardar punto de despacho
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.length > 0 ? addresses.map((addr) => (
                        <Card key={addr.id} className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 relative group hover:shadow-md transition-all">
                          {addr.isDefault && <Badge className="absolute top-6 right-6 bg-primary text-white border-none text-[8px] uppercase tracking-widest px-3 py-1">Principal</Badge>}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><MapPin className="w-5 h-5" /></div>
                              <h4 className="text-lg font-black uppercase truncate">{addr.name}</h4>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-foreground">{addr.streetAndNumber} {addr.apartmentOrLocal}</p>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{addr.commune}, RM</p>
                            </div>
                            <div className="flex gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingAddressId(addr.id); setCurrentAddress(addr); setCommuneSearch(addr.commune); }} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Editar</button>
                              <button onClick={async () => { const upd = addresses.filter(a => a.id !== addr.id); await updateUserProfile({ addresses: upd }); setAddresses(upd); }} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Eliminar</button>
                            </div>
                          </div>
                        </Card>
                      )) : (
                        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-black/5">
                          <p className="text-muted-foreground font-bold">No tienes direcciones guardadas para tus despachos.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="seguridad" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Protección de Cuenta</h2>
                  <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-10 space-y-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-muted/30 rounded-[2rem] border border-black/5">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><Lock className="w-6 h-6" /></div>
                          <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-widest">Contraseña de acceso</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actualiza tu clave periódicamente</p>
                          </div>
                        </div>
                        <Button variant="outline" className="h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-primary/20">Cambiar Contraseña</Button>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-muted/30 rounded-[2rem] border border-black/5">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><ShieldCheck className="w-6 h-6" /></div>
                          <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-widest">Doble factor (2FA)</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Máxima seguridad para tu rincón</p>
                          </div>
                        </div>
                        <Badge className="bg-muted text-muted-foreground border-none rounded-full px-4 h-8 text-[8px] font-black uppercase tracking-widest">Próximamente</Badge>
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
