
"use client";

import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loginUser, registerUser, logoutUser } from '@/lib/services/auth.service';
import { updateUserProfile, getUserData } from '@/lib/services/user.service';
import { fetchUserOrders, UserOrder } from '@/actions/orders';
import { fetchAllProducts } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Building2,
  FileText,
  Search,
  Check,
  X,
  Loader2,
  LayoutDashboard,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SanitizedProduct } from '@/types/product';
import Image from 'next/image';

export default function B2BPortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [products, setProducts] = useState<SanitizedProduct[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const [dbData, allProducts, userOrders] = await Promise.all([
          getUserData(currentUser.uid),
          fetchAllProducts(),
          fetchUserOrders(currentUser.uid)
        ]);
        setUserData(dbData);
        setProducts(allProducts);
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
        toast({ title: "Portal B2B: Sesión iniciada" });
      } else {
        // En B2B normalmente el registro es manual o vía formulario de solicitud
        router.push('/b2b'); // Redirigir al form de solicitud
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error de acceso", description: "Credenciales inválidas para el portal B2B." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/b2b');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#F6F6F6]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Cargando Portal B2B...</p>
      </div>
    );
  }

  // Si no está logueado, mostrar login específico de B2B
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
          <div className="bg-primary p-10 text-white text-center space-y-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Portal Mayorista</h1>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Acceso exclusivo para distribuidores</p>
          </div>
          <CardContent className="p-10 space-y-8">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="empresa@correo.com" 
                    className="h-14 rounded-2xl border-primary/5 bg-muted/30 pl-14 font-bold"
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
                    className="h-14 rounded-2xl border-primary/5 bg-muted/30 pl-14 font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Ingresar al Portal
              </Button>
            </form>
            <div className="text-center space-y-4 pt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">¿Aún no tienes cuenta mayorista?</p>
              <Button variant="outline" onClick={() => router.push('/b2b')} className="w-full h-12 rounded-2xl border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                Solicitar Apertura de Cuenta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Interfaz del Portal B2B una vez logueado
  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      {/* Header Portal */}
      <nav className="h-20 bg-white border-b border-black/5 flex items-center px-4 md:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tighter uppercase leading-none">B2B Portal</h2>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{userData?.companyName || 'Distribuidor'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest gap-2">
              Cerrar Sesión <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <Tabs defaultValue="catalogo" className="space-y-8">
          <TabsList className="bg-white p-1.5 rounded-2xl border border-black/5 h-auto inline-flex gap-1 shadow-sm">
            <TabsTrigger value="catalogo" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <ShoppingCart className="w-4 h-4 mr-2" /> Catálogo Mayorista
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Package className="w-4 h-4 mr-2" /> Mis Pedidos B2B
            </TabsTrigger>
            <TabsTrigger value="perfil" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Building2 className="w-4 h-4 mr-2" /> Datos Empresa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalogo" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square bg-muted/30 p-8">
                    <Image 
                      src={product.main_image} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-6 group-hover:scale-110 transition-transform" 
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-secondary text-primary border-none font-black text-[9px] uppercase">
                        Stock: {product.currentStock}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{product.brand}</p>
                      <h3 className="font-bold text-sm leading-tight h-10 line-clamp-2">{product.name}</h3>
                    </div>
                    
                    <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Precio B2B</span>
                        <span className="text-xl font-black text-primary">${product.wholesalePrice.toLocaleString('es-CL')}</span>
                        <span className="text-[8px] font-medium text-muted-foreground line-through">Ref: ${product.sellingPrice.toLocaleString('es-CL')}</span>
                      </div>
                      <Button size="icon" className="rounded-xl bg-primary hover:bg-primary/90">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pedidos" className="animate-in fade-in slide-in-from-bottom-2">
             <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                   <Card key={order.id} className="rounded-2xl border-none shadow-sm bg-white p-6">
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                           <Package className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase">Pedido #{order.id.slice(-6)}</p>
                           <p className="font-black text-lg">${order.totalAmount.toLocaleString('es-CL')}</p>
                         </div>
                       </div>
                       <Badge className="bg-green-100 text-green-700 border-none uppercase text-[9px] font-black">Procesado</Badge>
                     </div>
                   </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-dashed border-2 border-black/5">
                  <p className="font-bold text-muted-foreground">No hay pedidos B2B registrados.</p>
                </div>
              )}
             </div>
          </TabsContent>

          <TabsContent value="perfil" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden max-w-2xl">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black tracking-tighter uppercase">Información de Facturación</h3>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Datos legales de la empresa</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase">Razón Social</p>
                    <p className="font-bold">{userData?.companyName || 'No registrada'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase">RUT</p>
                    <p className="font-bold">{userData?.rut || 'No registrado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase">Giro</p>
                    <p className="font-bold">{userData?.businessLine || 'No registrado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase">Email de contacto</p>
                    <p className="font-bold">{user.email}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-black/5">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest">
                    Solicitar Actualización de Datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
