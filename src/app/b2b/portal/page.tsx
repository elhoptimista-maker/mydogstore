"use client";

import { useState, useEffect, useMemo } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loginUser, logoutUser } from '@/lib/services/auth.service';
import { getUserData } from '@/lib/services/user.service';
import { getUserOrderHistory, UserOrder } from '@/actions/orders';
import { fetchAllProducts } from '@/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Mail, 
  Lock, 
  Building2, 
  FileText, 
  Search, 
  X, 
  Loader2, 
  ShoppingCart,
  Dog,
  LogOut,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SanitizedProduct } from '@/types/product';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from '@/components/cart/CartDrawer';
import Link from 'next/link';

const ITEMS_PER_PAGE = 12;

export default function B2BPortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [products, setProducts] = useState<SanitizedProduct[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isWholesale, setIsWholesale] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { addToCart, clearCart, cartCount } = useCart();
  const { clearWishlist } = useWishlist();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateAndSetupUser = async (currentUser: User) => {
    try {
      const dbData = await getUserData(currentUser.uid);
      
      if (dbData?.role === 'wholesale' || dbData?.role === 'admin') {
        setUserData(dbData);
        setIsWholesale(true);
        setUser(currentUser);
        
        const [allProducts, userOrders] = await Promise.all([
          fetchAllProducts(),
          getUserOrderHistory(currentUser.uid)
        ]);
        setProducts(allProducts);
        setOrders(userOrders);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error validating user role:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const isValid = await validateAndSetupUser(currentUser);
        
        if (!isValid) {
          await logoutUser();
          clearCart();
          clearWishlist();
          toast({ variant: "destructive", title: "Acceso denegado" });
          setUser(null);
          setIsWholesale(false);
        }
      } else {
        setUser(null);
        setIsWholesale(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clearCart, clearWishlist]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ["Todas", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      const isValid = await validateAndSetupUser(userCredential.user);
      if (!isValid) {
         await logoutUser();
         toast({ variant: "destructive", title: "Acceso denegado", description: "Esta cuenta no tiene permisos mayoristas." });
      } else {
         toast({ title: "¡Hola de nuevo! 🐾", description: "Bienvenido a tu central de abastecimiento." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error de acceso", description: "Verifica tus datos e intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    clearCart();
    clearWishlist();
    router.push('/b2b');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#F6F6F6]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Abriendo bodega...</p>
      </div>
    );
  }

  if (!user || !isWholesale) {
    return (
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full -ml-64 -mb-64 blur-3xl pointer-events-none" />

        <Card className="w-full max-w-lg rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden relative z-10 transition-all duration-500">
          <div className="bg-primary p-12 text-white text-center space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
             <div className="relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-xl border border-white/10">
                  <Dog className="w-10 h-10 text-secondary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Central de Abastecimiento</h1>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Acceso Exclusivo para Socios</p>
                </div>
             </div>
          </div>
          <CardContent className="p-12 space-y-10">
            <div className="space-y-2 text-center">
               <h2 className="text-2xl font-black tracking-tight text-foreground">¡Hola! Qué gusto verte</h2>
               <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                 Ingresa para gestionar tus pedidos mayoristas con la rapidez y responsabilidad de siempre.
               </p>
            </div>
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input type="email" placeholder="socio@tuempresa.cl" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 rounded-2xl border-black/5 bg-muted/30 pl-14 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contraseña Segura</Label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-14 rounded-2xl border-black/5 bg-muted/30 pl-14 font-bold" />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Entrar al Portal <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
            <div className="pt-6 border-t border-black/5 space-y-6 text-center">
               <div className="flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Conexión Segura MyDog</span>
               </div>
               <Link href="/" className="inline-flex items-center text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">
                  Volver a la tienda para familias
               </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      <header className="fixed top-0 left-0 right-0 h-20 bg-primary z-50 px-4 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
              <Dog className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex flex-col -space-y-0.5 md:-space-y-1">
              <span className="font-black text-lg md:text-2xl tracking-tighter text-white leading-none uppercase">MyDog</span>
              <span className="text-[7px] md:text-[9px] font-bold text-secondary uppercase tracking-[0.2em]">B2B Portal</span>
            </div>
          </Link>
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar SKU, marca o producto..." className="h-10 md:h-12 rounded-full bg-white pl-10 md:pl-12 w-full border-none shadow-inner font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             <CartDrawer>
                <button className="relative w-10 h-10 md:w-12 md:h-12 bg-secondary text-primary rounded-xl md:rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-white text-primary font-black text-[9px] md:text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-secondary">
                      {cartCount}
                    </span>
                  )}
                </button>
             </CartDrawer>
             <Button variant="ghost" onClick={handleLogout} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/10 text-white hover:bg-red-500 transition-colors">
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
             </Button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <Tabs defaultValue="catalogo" className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 md:p-4 rounded-2xl md:rounded-[2rem] border shadow-sm">
            <TabsList className="bg-muted/50 p-1 md:p-1.5 rounded-xl h-auto flex gap-1 w-full md:w-auto overflow-x-auto no-scrollbar">
              <TabsTrigger value="catalogo" className="rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest py-2.5 md:py-3 px-4 md:px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Catálogo
              </TabsTrigger>
              <TabsTrigger value="pedidos" className="rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest py-2.5 md:py-3 px-4 md:px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Package className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Pedidos
              </TabsTrigger>
              <TabsTrigger value="perfil" className="rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest py-2.5 md:py-3 px-4 md:px-6 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                <Building2 className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Empresa
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="catalogo" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <Card key={product.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col h-full">
                  <div className="relative aspect-square bg-muted/20 p-8 shrink-0">
                    <Image src={product.main_image} alt={product.name} fill className="object-contain p-6 transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</p>
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">{product.name}</h3>
                    </div>
                    <div className="pt-4 border-t border-black/[0.03] flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Precio Mayorista</span>
                        <span className="text-xl md:text-2xl font-black tracking-tighter text-primary">${product.wholesalePrice.toLocaleString('es-CL')}</span>
                      </div>
                      <Button size="icon" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shadow-lg active:scale-90 transition-all" onClick={() => addToCart(product, false, 1, true)}>
                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="rounded-full w-12 h-12"><ChevronLeft /></Button>
                <div className="font-black text-[10px] uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm border border-black/5">Página {currentPage} de {totalPages}</div>
                <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="rounded-full w-12 h-12"><ChevronRight /></Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pedidos" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="grid grid-cols-1 gap-4">
              {orders.length > 0 ? orders.map((order) => (
                   <Card key={order.id} className="rounded-[2rem] border-none shadow-sm bg-white p-6 md:p-8 hover:shadow-md transition-all group">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="flex items-center gap-5">
                         <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                           <Package className="w-7 h-7" />
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Orden #{order.friendlyOrderId}</span>
                              <Badge className={cn(
                                "rounded-full px-2 py-0 text-[8px] font-black uppercase border-none",
                                order.status === 'completed' || order.status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                              )}>
                                {order.status === 'completed' ? 'Entregado' : (order.status === 'paid' ? 'Pagado' : 'Pendiente')}
                              </Badge>
                           </div>
                           <p className="font-black text-xl tracking-tighter">${order.total.toLocaleString('es-CL')}</p>
                           <span className="text-[10px] font-bold uppercase flex items-center gap-1 mt-1 text-muted-foreground">
                              <Clock className="w-3 h-3" /> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-CL') : 'Pendiente'}
                           </span>
                         </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                         {order.urlPdf && (
                           <Button asChild variant="outline" className="rounded-xl h-12 px-6 font-black text-[10px] uppercase tracking-widest">
                             <a href={order.urlPdf} target="_blank" rel="noopener noreferrer">
                               <Download className="w-4 h-4 mr-2" /> PDF
                             </a>
                           </Button>
                         )}
                         <Button variant="outline" className="rounded-xl h-12 px-8 flex-1 md:flex-none font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Ver Detalle</Button>
                       </div>
                     </div>
                   </Card>
              )) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-black/5">
                   <p className="text-muted-foreground font-bold">No tienes pedidos anteriores registrados.</p>
                </div>
              )}
             </div>
          </TabsContent>

          <TabsContent value="perfil" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8 md:p-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                       <FileText className="w-6 h-6" />
                     </div>
                     <div>
                       <h3 className="text-xl font-black tracking-tighter uppercase">Facturación Corporativa</h3>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Tus datos legales registrados</p>
                     </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Razón Social</p>
                        <p className="font-bold text-sm">{userData?.companyName || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">RUT Empresa</p>
                        <p className="font-bold text-sm">{userData?.rut || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Giro Comercial</p>
                      <p className="font-bold text-sm">{userData?.businessLine || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Email de Contacto</p>
                      <p className="font-bold text-sm">{user?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-8 md:p-10 space-y-8">
                   <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 text-primary">
                       <Building2 className="w-6 h-6" />
                     </div>
                     <div>
                       <h3 className="text-xl font-black tracking-tighter uppercase">Soporte MyDog B2B</h3>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Atención personalizada para socios</p>
                     </div>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-2xl space-y-4 border border-black/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tu ejecutivo asignado es:</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-lg">M</div>
                       <div>
                          <p className="font-black text-sm uppercase tracking-tight">Mesa de Ayuda MyDog</p>
                          <p className="text-[10px] font-bold text-primary">+56 9 1234 5678</p>
                       </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-primary/10 hover:bg-primary/5 transition-all">Descargar Tarifario PDF</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
