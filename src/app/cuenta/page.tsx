
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
  MapPinIcon,
  Map,
  Plus,
  Trash2
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

  // Función para normalizar texto
  const normalizeText = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filtrado de comunas
  const filteredCommunes = communes.filter(c => 
    normalizeText(c).includes(normalizeText(communeSearch))
  );

  // Manejador de clics fuera del buscador de comunas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (communeSearchRef.current && !communeSearchRef.current.contains(event.target as Node)) {
        setShowCommuneResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar comunas
  useEffect(() => {
    const loadCommunes = async () => {
      const list = await fetchCommunes();
      if (list.length > 0) {
        setCommunes(list);
      } else {
        setCommunes(["La Cisterna", "San Bernardo", "Maipú", "Santiago Central"]);
      }
    };
    loadCommunes();
  }, []);

  const validateAndSetupRetailUser = async (currentUser: User) => {
    try {
      const dbData = await getUserData(currentUser.uid);
      if (dbData?.role === 'wholesale') {
        return { isValid: false, reason: 'wholesale' };
      }
      return { isValid: true, dbData };
    } catch (error) {
      console.error("Error validating user role:", error);
      return { isValid: false, reason: 'error' };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setDataLoading(true);
        const { isValid, reason, dbData } = await validateAndSetupRetailUser(currentUser);
        
        if (!isValid) {
           if (reason === 'wholesale') {
             toast({ title: "Redirigiendo", description: "Detectamos que eres distribuidor. Te llevaremos al Portal B2B." });
             router.push('/b2b/portal');
           } else {
             await logoutUser();
             clearCart();
             clearWishlist();
             setUser(null);
             toast({ variant: "destructive", title: "Error", description: "Hubo un problema verificando tu cuenta." });
           }
           setLoading(false);
           setDataLoading(false);
           return;
        }

        setUser(currentUser);
        
        try {
          const userOrders = await fetchUserOrders(currentUser.uid);

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

            // Compatibilidad hacia atrás
            if (dbData.addresses && dbData.addresses.length > 0) {
               setAddresses(dbData.addresses);
            } else if (dbData.shippingAddress) {
               setAddresses([{
                  id: 'default',
                  name: 'Principal',
                  streetAndNumber: dbData.shippingAddress,
                  apartmentOrLocal: '',
                  commune: dbData.commune || '',
                  region: 'Metropolitana',
                  isDefault: true
               }]);
            }
          } else {
            setProfileData(prev => ({ 
              ...prev, 
              displayName: currentUser.displayName || ''
            }));
          }
          setOrders(userOrders);
        } catch (error) {
          console.error("Error cargando pedidos:", error);
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
  }, [router, clearCart, clearWishlist]);

  const getLoyaltyStatus = () => {
    if (profileData.role === 'admin') return { text: "Staff MyDog", color: "bg-primary text-white shadow-none" };
    if (orders.length >= 5) return { text: "Miembro de Honor 🏆", color: "bg-secondary text-primary shadow-lg shadow-secondary/20" };
    if (orders.length > 0) return { text: "Cliente Amigo 🦴", color: "bg-primary/10 text-primary shadow-none" };
    return { text: "Nuevo en la Manada 🐾", color: "bg-muted text-muted-foreground shadow-none" };
  };

  const loyalty = getLoyaltyStatus();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const userCredential = await loginUser(email, password);
        const { isValid, reason } = await validateAndSetupRetailUser(userCredential.user);
        
        if (!isValid) {
           if (reason === 'wholesale') {
              toast({ title: "Redirigiendo", description: "Detectamos que eres distribuidor. Te llevaremos al Portal B2B." });
              router.push('/b2b/portal');
           } else {
              await logoutUser();
              toast({ variant: "destructive", title: "Error", description: "Error al validar la cuenta." });
           }
        } else {
           toast({ title: "¡Bienvenido de vuelta! 🐾" });
        }
      } else {
        await registerUser(email, password, displayName);
        toast({ title: "¡Cuenta creada! ✨" });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Verifica tus credenciales e intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const finalData = { 
        ...profileData, 
        addresses 
      };
      await updateUserProfile(finalData);
      toast({ title: "Perfil actualizado ✨", description: "Tus datos se guardaron correctamente." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error al actualizar" });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!currentAddress.streetAndNumber || !communeSearch || !currentAddress.name) {
       toast({ variant: "destructive", title: "Faltan datos", description: "Nombre, Calle y Comuna son obligatorios." });
       return;
    }

    setSavingAddress(true);
    try {
      const addrId = (editingAddressId && editingAddressId !== 'new') ? editingAddressId : Math.random().toString(36).substring(2, 9);
      const addrToSave = {
         ...currentAddress,
         id: addrId,
         commune: communeSearch,
         isDefault: (addresses.length === 0) ? true : currentAddress.isDefault
      };

      let newAddresses = [...addresses];

      // Si la nueva dirección es predeterminada, quitamos el flag a las demás
      if (addrToSave.isDefault) {
         newAddresses = newAddresses.map(a => ({...a, isDefault: false}));
      }

      if (editingAddressId && editingAddressId !== 'new') {
         newAddresses = newAddresses.map(a => a.id === editingAddressId ? addrToSave : a);
      } else {
         newAddresses.push(addrToSave);
      }

      // Actualizar en Firestore inmediatamente para que sea intuitivo
      await updateUserProfile({ addresses: newAddresses });
      
      setAddresses(newAddresses);
      setEditingAddressId(null);
      setCurrentAddress({ id: '', name: 'Casa', streetAndNumber: '', apartmentOrLocal: '', commune: '', region: 'Metropolitana', isDefault: false });
      setCommuneSearch("");
      toast({ title: "Dirección guardada ✨", description: "La libreta de direcciones se actualizó en la nube." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error al guardar", description: "No se pudo sincronizar con el servidor." });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
     const newAddresses = addresses.filter(a => a.id !== id);
     if (newAddresses.length > 0 && addresses.find(a => a.id === id)?.isDefault) {
        newAddresses[0].isDefault = true;
     }
     
     try {
       await updateUserProfile({ addresses: newAddresses });
       setAddresses(newAddresses);
       toast({ title: "Dirección eliminada" });
     } catch (error) {
       toast({ variant: "destructive", title: "Error al eliminar" });
     }
  };

  const handleEditAddress = (addr: any) => {
     setEditingAddressId(addr.id);
     setCurrentAddress(addr);
     setCommuneSearch(addr.commune || "");
  };

  const handleLogout = async () => {
    await logoutUser();
    clearWishlist();
    clearCart();
    router.push('/');
  };

  if (loading || (user && dataLoading && orders.length === 0)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-24">
      {user && (
        <section className="relative bg-[#FEF9F3] pt-12 pb-16 border-b border-black/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Panel de Control Personal
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                Hola, <span className="text-primary">{profileData.displayName || user.displayName || 'Miembro MyDog'}</span>
              </h1>
            </div>
          </div>
        </section>
      )}

      <div className={cn("max-w-7xl mx-auto px-4 lg:px-8", !user ? "pt-12" : "-mt-8 relative z-20")}>
        {!user ? (
          <div className="max-w-md mx-auto space-y-10 py-12">
             <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center mx-auto">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tighter">{isLogin ? '¡Hola de nuevo!' : 'Únete a la manada'}</h2>
                <p className="text-muted-foreground text-sm font-medium">Accede a tu cuenta MyDog en segundos.</p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Completo</Label>
                  <Input 
                    placeholder="Ej: Juan Pérez" 
                    className="h-14 rounded-2xl border-primary/5 bg-white font-bold px-6"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="h-14 rounded-2xl border-primary/5 bg-white pl-14 font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl border-primary/5 bg-white pl-14 font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                {isLogin ? 'Entrar a MyDog' : 'Crear mi cuenta'}
              </Button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">
              {isLogin ? '¿Aún no eres parte? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
            </button>
            
            <div className="pt-8 border-t border-black/5 mt-8 text-center">
               <p className="text-[10px] font-bold text-muted-foreground uppercase mb-4">¿Tienes un negocio?</p>
               <Link href="/b2b/portal" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl border border-secondary/50 text-secondary bg-secondary/5 font-black text-[10px] uppercase tracking-widest hover:bg-secondary/10 transition-colors w-full">
                  <Building2 className="w-4 h-4" /> Ir al Portal Mayorista <ArrowRight className="w-3 h-3" />
               </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <Card className="rounded-[2rem] lg:rounded-[2.5rem] border-none shadow-xl bg-white lg:sticky lg:top-48 z-10 transition-all overflow-visible">
                <div className="p-6 lg:p-8 flex flex-row lg:flex-col items-center lg:text-center justify-between gap-4 lg:gap-6">
                  <div className="flex items-center gap-4 lg:flex-col lg:gap-6 w-full">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 bg-primary/5 rounded-2xl lg:rounded-[2rem] flex items-center justify-center text-2xl lg:text-3xl shrink-0">
                      🐾
                    </div>
                    <div className="space-y-1 flex-1 text-left lg:text-center min-w-0">
                      <h3 className="text-lg lg:text-xl font-black tracking-tight truncate">{profileData.displayName || user.displayName || 'Miembro'}</h3>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <Badge className={cn(
                    "hidden lg:inline-flex border-none rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest transition-all",
                    loyalty.color
                  )}>
                    {loyalty.text}
                  </Badge>
                  
                  <div className="w-auto lg:w-full lg:pt-6 lg:border-t lg:border-black/5 flex flex-col gap-2 shrink-0">
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="lg:hidden w-12 h-12 rounded-xl text-red-500 hover:bg-red-50 bg-red-50/50">
                      <span className="text-xl">👋</span>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="hidden lg:flex w-full justify-center h-11 rounded-xl font-bold gap-3 text-red-500 hover:bg-red-50 transition-colors">
                      <span className="text-lg">👋</span> Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </Card>
            </aside>

            <main className="lg:col-span-3">
              <Tabs defaultValue="pedidos" className="space-y-8">
                <TabsList className="bg-white p-1.5 rounded-2xl border border-black/5 h-auto grid grid-cols-3 gap-1 shadow-sm">
                  <TabsTrigger value="pedidos" className="rounded-xl font-black text-[9px] uppercase tracking-widest py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <Package className="w-3.5 h-3.5 mr-2" /> Mis Pedidos
                  </TabsTrigger>
                  <TabsTrigger value="perfil" className="rounded-xl font-black text-[9px] uppercase tracking-widest py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <Settings className="w-3.5 h-3.5 mr-2" /> Mi Perfil
                  </TabsTrigger>
                  <TabsTrigger value="seguridad" className="rounded-xl font-black text-[9px] uppercase tracking-widest py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Seguridad
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pedidos" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all group">
                          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Package className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Orden #{order.id.slice(-6)}</span>
                                <h4 className="text-lg font-black">${order.totalAmount.toLocaleString('es-CL')}</h4>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                  <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString('es-CL')}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <Badge className={cn(
                                "rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-widest border-none",
                                order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              )}>
                                {order.status === 'completed' ? 'Entregado' : 'En Proceso'}
                              </Badge>
                              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="rounded-[2.5rem] border-dashed border-2 border-black/5 bg-transparent p-16 text-center">
                      <p className="text-muted-foreground font-bold">Aún no tienes pedidos registrados.</p>
                      <Button variant="link" onClick={() => router.push('/catalogo')} className="text-primary font-black uppercase tracking-widest text-[9px] mt-2">Ir a la tienda</Button>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="perfil" className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {/* Datos Personales */}
                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-visible">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black tracking-tight">Información Personal</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tus datos básicos de contacto</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Visible</Label>
                            <Input 
                              value={profileData.displayName} 
                              onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                              className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Teléfono de Contacto</Label>
                            <div className="relative">
                              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input 
                                placeholder="+56 9 1234 5678"
                                value={profileData.phone} 
                                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold pl-14" 
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Datos de Facturación */}
                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black tracking-tight">Datos de Facturación</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Información para tus comprobantes de pago</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Tipo de Documento</Label>
                            <Select 
                              value={profileData.billingType} 
                              onValueChange={(val) => setProfileData({...profileData, billingType: val})}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-none shadow-xl">
                                <SelectItem value="boleta" className="font-bold">Boleta</SelectItem>
                                <SelectItem value="factura" className="font-bold">Factura</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {profileData.billingType === 'factura' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">RUT Empresa</Label>
                                  <Input 
                                    placeholder="12.345.678-9"
                                    value={profileData.rut} 
                                    onChange={(e) => setProfileData({...profileData, rut: e.target.value})}
                                    className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Razón Social</Label>
                                  <Input 
                                    placeholder="Nombre de la empresa"
                                    value={profileData.companyName} 
                                    onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                    className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6" 
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Giro del Negocio</Label>
                                <Input 
                                  placeholder="Ej: Venta de accesorios para mascotas"
                                  value={profileData.businessLine} 
                                  onChange={(e) => setProfileData({...profileData, businessLine: e.target.value})}
                                  className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Dirección Tributaria</Label>
                                <Input 
                                  placeholder="Misma dirección o una distinta"
                                  value={profileData.billingAddress} 
                                  onChange={(e) => setProfileData({...profileData, billingAddress: e.target.value})}
                                  className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6" 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                      <Button 
                        disabled={updatingProfile} 
                        className="h-14 rounded-2xl bg-primary text-white font-black px-12 gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                      >
                        {updatingProfile && <Loader2 className="animate-spin h-4 w-4" />}
                        Guardar Perfil y Facturación
                      </Button>
                    </div>
                  </form>

                  {/* Direcciones de Envío (Sincronización Inmediata) */}
                  <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-visible">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black tracking-tight">Mis Direcciones</h3>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gestión instantánea de puntos de despacho</p>
                            </div>
                          </div>
                          {!editingAddressId && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                  setEditingAddressId('new');
                                  setCurrentAddress({ id: '', name: 'Casa', streetAndNumber: '', apartmentOrLocal: '', commune: '', region: 'Metropolitana', isDefault: false });
                                  setCommuneSearch("");
                              }}
                              className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest"
                            >
                              <Plus className="w-3 h-3 mr-1" /> Nueva
                            </Button>
                          )}
                      </div>

                      {/* Lista de Direcciones Guardadas */}
                      {!editingAddressId && addresses.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                            {addresses.map((addr) => (
                                <div key={addr.id} className="p-4 rounded-2xl border border-black/5 bg-muted/20 relative group">
                                  {addr.isDefault && (
                                      <Badge className="absolute -top-2.5 -right-2 bg-primary text-white border-none text-[8px] uppercase tracking-widest px-2 py-0.5">Predeterminada</Badge>
                                  )}
                                  <div className="flex items-center gap-2 mb-2">
                                      <MapPin className="w-4 h-4 text-primary" />
                                      <span className="font-black text-sm uppercase">{addr.name}</span>
                                  </div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">{addr.streetAndNumber} {addr.apartmentOrLocal}</p>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{addr.commune}, {addr.region}</p>
                                  
                                  <div className="absolute bottom-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button type="button" onClick={() => handleEditAddress(addr)} className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                                        <Settings className="w-3 h-3" /> Editar
                                      </button>
                                      <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-1 text-xs font-bold text-destructive hover:underline">
                                        <Trash2 className="w-3 h-3" /> Eliminar
                                      </button>
                                  </div>
                                </div>
                            ))}
                          </div>
                      )}

                      {/* Formulario de Edición/Creación */}
                      {editingAddressId && (
                          <div className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-black/5 animate-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-black text-sm uppercase tracking-widest">
                                  {editingAddressId === 'new' ? 'Nueva Dirección' : 'Editar Dirección'}
                              </h4>
                              <button type="button" onClick={() => setEditingAddressId(null)} className="text-muted-foreground hover:text-foreground">
                                  <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre (Ej: Casa) *</Label>
                                <Input 
                                  value={currentAddress.name} 
                                  onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})}
                                  placeholder="Casa, Oficina, Local..."
                                  className="h-12 rounded-xl border-black/5 bg-white font-bold px-4" 
                                />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número *</Label>
                                <Input 
                                  value={currentAddress.streetAndNumber} 
                                  onChange={(e) => setCurrentAddress({...currentAddress, streetAndNumber: e.target.value})}
                                  placeholder="Av. Principal 123"
                                  className="h-12 rounded-xl border-black/5 bg-white font-bold px-4" 
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Depto/Casa/Local</Label>
                                <Input 
                                  value={currentAddress.apartmentOrLocal} 
                                  onChange={(e) => setCurrentAddress({...currentAddress, apartmentOrLocal: e.target.value})}
                                  placeholder="Depto 402"
                                  className="h-12 rounded-xl border-black/5 bg-white font-bold px-4" 
                                />
                              </div>
                              <div className="space-y-2 relative" ref={communeSearchRef}>
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna *</Label>
                                <div className="relative">
                                  <Input 
                                    placeholder="Escribe tu comuna..."
                                    value={communeSearch}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCommuneSearch(val);
                                      setShowCommuneResults(val.trim().length > 0);
                                    }}
                                    onFocus={() => {
                                      if (communeSearch.trim().length > 0) {
                                        setShowCommuneResults(true);
                                      }
                                    }}
                                    className="h-12 rounded-xl border-black/5 bg-white font-bold px-4 pr-10"
                                  />
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                                    {communeSearch ? (
                                      <X className="w-4 h-4 cursor-pointer hover:text-primary" onClick={() => { setCommuneSearch(""); setShowCommuneResults(false); }} />
                                    ) : (
                                      <Search className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>

                                {showCommuneResults && communeSearch.trim().length > 0 && (
                                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-black/[0.03] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                    <ScrollArea className="max-h-[210px] min-h-[40px]">
                                      <div className="p-2 space-y-1">
                                        {filteredCommunes.length > 0 ? (
                                          filteredCommunes.map((c) => (
                                            <button
                                              key={c}
                                              type="button"
                                              className={cn(
                                                "flex w-full items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all text-left",
                                                communeSearch === c 
                                                  ? "bg-primary text-white" 
                                                  : "hover:bg-primary/5 text-foreground"
                                              )}
                                              onClick={() => {
                                                setCommuneSearch(c);
                                                setShowCommuneResults(false);
                                              }}
                                            >
                                              {c}
                                              {communeSearch === c && <Check className="w-3 h-3 text-secondary" />}
                                            </button>
                                          ))
                                        ) : (
                                          <div className="p-8 text-center">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sin resultados</p>
                                          </div>
                                        )}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Región</Label>
                                <Input 
                                  value="Metropolitana" 
                                  readOnly
                                  className="h-12 rounded-xl border-black/5 bg-white font-bold px-4 opacity-60 cursor-not-allowed" 
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-black/5">
                              <Label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={currentAddress.isDefault}
                                    onChange={(e) => setCurrentAddress({...currentAddress, isDefault: e.target.checked})}
                                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                                  />
                                  <span className="text-xs font-bold">Fijar como predeterminada</span>
                              </Label>
                              <Button 
                                type="button" 
                                disabled={savingAddress}
                                onClick={handleSaveAddress} 
                                className="h-12 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all gap-2"
                              >
                                {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Sincronizar y Guardar
                              </Button>
                            </div>
                          </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="seguridad" className="animate-in fade-in slide-in-from-bottom-2">
                   <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-xl font-black tracking-tight">Seguridad de la Cuenta</h3>
                        <p className="text-sm text-muted-foreground">Gestiona el acceso y protección de tus datos.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-6 bg-muted/30 rounded-2xl border border-black/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                               <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Doble Factor</p>
                               <p className="font-bold text-xs">Desactivado</p>
                            </div>
                         </div>
                         <div className="p-6 bg-muted/30 rounded-2xl border border-black/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                               <Lock className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Contraseña</p>
                               <p className="font-bold text-xs">Protegida</p>
                            </div>
                         </div>
                      </div>
                      
                      <div className="pt-6 border-t border-black/5 flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-bold">Cambiar Contraseña</p>
                          <p className="text-[10px] text-muted-foreground font-medium">Recibirás un enlace en tu correo para restablecerla.</p>
                        </div>
                        <Button variant="outline" className="h-11 rounded-xl border-primary/20 font-black px-6 text-[10px] uppercase tracking-widest">Solicitar Cambio</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
