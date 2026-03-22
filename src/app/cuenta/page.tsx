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
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CuentaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [communes, setCommunes] = useState<string[]>([]);
  
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
    shippingAddress: '',
    commune: '',
    region: 'Metropolitana',
    billingType: 'boleta',
    rut: '',
    companyName: '',
    businessLine: '',
    billingAddress: ''
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const router = useRouter();

  // Función para normalizar texto (quitar acentos y pasar a minúsculas)
  const normalizeText = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Filtrado de comunas basado en el texto del input (insensible a acentos y mayúsculas)
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

  // Cargar comunas desde el ERP mediante Server Action
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const dbData = await getUserData(currentUser.uid);
        if (dbData) {
          setProfileData({
            displayName: currentUser.displayName || '',
            phone: dbData.phone || '',
            shippingAddress: dbData.shippingAddress || '',
            commune: dbData.commune || '',
            region: 'Metropolitana',
            billingType: dbData.billingType || 'boleta',
            rut: dbData.rut || '',
            companyName: dbData.companyName || '',
            businessLine: dbData.businessLine || '',
            billingAddress: dbData.billingAddress || ''
          });
          setCommuneSearch(dbData.commune || "");
        } else {
          setProfileData(prev => ({ ...prev, displayName: currentUser.displayName || '', region: 'Metropolitana' }));
        }

        const userOrders = await fetchUserOrders(currentUser.uid);
        setOrders(userOrders);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginUser(email, password);
        toast({ title: "¡Bienvenido de vuelta! 🐾" });
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
        commune: communeSearch, 
        region: 'Metropolitana' 
      };
      await updateUserProfile(finalData);
      toast({ title: "Perfil actualizado ✨", description: "Tus datos se guardaron correctamente." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error al actualizar" });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                Hola, <span className="text-primary">{user.displayName || 'Miembro MyDog'}</span>
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
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 space-y-6">
              <Card className="rounded-[2rem] lg:rounded-[2.5rem] border-none shadow-xl bg-white lg:sticky lg:top-48 z-10 transition-all">
                <div className="p-6 lg:p-8 flex flex-row lg:flex-col items-center lg:text-center justify-between gap-4 lg:gap-6">
                  <div className="flex items-center gap-4 lg:flex-col lg:gap-6 w-full">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 bg-primary/5 rounded-2xl lg:rounded-[2rem] flex items-center justify-center text-2xl lg:text-3xl shrink-0">
                      🐾
                    </div>
                    <div className="space-y-1 flex-1 text-left lg:text-center min-w-0">
                      <h3 className="text-lg lg:text-xl font-black tracking-tight truncate">{user.displayName || 'Miembro'}</h3>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <Badge className="bg-secondary hidden lg:inline-flex text-primary border-none rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest">Cliente Verificado</Badge>
                  
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

                <TabsContent value="perfil" className="animate-in fade-in slide-in-from-bottom-2">
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

                    {/* Dirección de Envío */}
                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-visible">
                      <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black tracking-tight">Dirección de Despacho</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">¿Dónde entregamos tus pedidos?</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Calle y Número</Label>
                            <Input 
                              placeholder="Ej: Av. Principal 123, Depto 401"
                              value={profileData.shippingAddress} 
                              onChange={(e) => setProfileData({...profileData, shippingAddress: e.target.value})}
                              className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6" 
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2 relative" ref={communeSearchRef}>
                                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Comuna</Label>
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
                                    className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6 pr-10"
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
                                  className="h-12 rounded-xl border-black/5 bg-muted/30 font-bold px-6 opacity-60 cursor-not-allowed" 
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
                        {updatingProfile && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />}
                        Guardar Configuración
                      </Button>
                    </div>
                  </form>
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
