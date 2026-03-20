
"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loginUser, registerUser, logoutUser } from '@/lib/services/auth.service';
import { updateUserProfile } from '@/lib/services/user.service';
import { fetchUserOrders, UserOrder } from '@/actions/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon, 
  LogOut, 
  Package, 
  Settings, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Heart,
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CuentaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setNewDisplayName(currentUser.displayName || '');
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
      await updateUserProfile(newDisplayName);
      toast({ title: "Perfil actualizado ✨" });
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
        <section className="relative bg-[#FEF9F3] pt-20 pb-24 border-b border-black/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Panel de Control Personal
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
                Hola, <span className="text-primary">{user.displayName || 'Miembro MyDog'}</span>
              </h1>
            </div>
          </div>
        </section>
      )}

      <div className={cn("max-w-7xl mx-auto px-4 lg:px-8", !user ? "pt-12" : "-mt-12 relative z-20")}>
        {!user ? (
          <div className="max-w-md mx-auto space-y-10 py-20">
             <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter">{isLogin ? '¡Hola de nuevo!' : 'Únete a la manada'}</h2>
                <p className="text-muted-foreground text-sm font-medium">Accede a tu cuenta MyDog en segundos.</p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Completo</Label>
                  <Input 
                    placeholder="Ej: Juan Pérez" 
                    className="h-16 rounded-[2rem] border-primary/5 bg-white font-bold px-6"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="h-16 rounded-[2rem] border-primary/5 bg-white pl-14 font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-16 rounded-[2rem] border-primary/5 bg-white pl-14 font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">
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
              <Card className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden sticky top-44">
                <div className="p-10 text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto text-4xl">
                    🐾
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">{user.displayName}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user.email}</p>
                  </div>
                  <Badge className="bg-secondary text-primary border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Cliente Verificado</Badge>
                  
                  <div className="pt-6 border-t border-black/5 flex flex-col gap-2">
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start h-12 rounded-2xl font-bold gap-3 text-red-500 hover:bg-red-50">
                      <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </Card>
            </aside>

            <main className="lg:col-span-3">
              <Tabs defaultValue="pedidos" className="space-y-8">
                <TabsList className="bg-white p-2 rounded-3xl border border-black/5 h-auto grid grid-cols-3 gap-2 shadow-sm">
                  <TabsTrigger value="pedidos" className="rounded-2xl font-black text-[10px] uppercase tracking-widest py-4 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Package className="w-4 h-4 mr-2" /> Mis Pedidos
                  </TabsTrigger>
                  <TabsTrigger value="perfil" className="rounded-2xl font-black text-[10px] uppercase tracking-widest py-4 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <Settings className="w-4 h-4 mr-2" /> Mi Perfil
                  </TabsTrigger>
                  <TabsTrigger value="seguridad" className="rounded-2xl font-black text-[10px] uppercase tracking-widest py-4 data-[state=active]:bg-primary data-[state=active]:text-white">
                    <ShieldCheck className="w-4 h-4 mr-2" /> Seguridad
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pedidos" className="space-y-6">
                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden hover:shadow-xl transition-all group">
                          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Package className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Orden #{order.id.slice(-6)}</span>
                                <h4 className="text-xl font-black">${order.totalAmount.toLocaleString('es-CL')}</h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                  <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString('es-CL')}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <Badge className={cn(
                                "rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-none",
                                order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              )}>
                                {order.status === 'completed' ? 'Entregado' : 'En Proceso'}
                              </Badge>
                              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="rounded-[3rem] border-dashed border-2 border-black/5 bg-transparent p-20 text-center">
                      <p className="text-muted-foreground font-bold">Aún no tienes pedidos registrados.</p>
                      <Button variant="link" onClick={() => router.push('/catalogo')} className="text-primary font-black uppercase tracking-widest text-[10px] mt-2">Ir a la tienda</Button>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="perfil">
                  <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight">Información Personal</h3>
                        <p className="text-sm text-muted-foreground">Actualiza cómo te vemos en la comunidad MyDog.</p>
                      </div>

                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Visible</Label>
                            <Input 
                              value={newDisplayName} 
                              onChange={(e) => setNewDisplayName(e.target.value)}
                              className="h-14 rounded-2xl border-black/5 bg-muted/30 font-bold px-6" 
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email (No editable)</Label>
                            <Input value={user.email || ''} disabled className="h-14 rounded-2xl border-black/5 bg-muted/10 font-bold px-6 opacity-50" />
                          </div>
                        </div>
                        <Button disabled={updatingProfile} className="h-14 rounded-2xl bg-primary text-white font-black px-8 gap-2">
                          {updatingProfile && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />}
                          Guardar Cambios
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="seguridad">
                   <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight">Seguridad de la Cuenta</h3>
                        <p className="text-sm text-muted-foreground">Gestiona el acceso y protección de tus datos.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-6 bg-muted/30 rounded-3xl border border-black/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                               <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Doble Factor</p>
                               <p className="font-bold text-sm">Desactivado</p>
                            </div>
                         </div>
                         <div className="p-6 bg-muted/30 rounded-3xl border border-black/5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                               <Lock className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contraseña</p>
                               <p className="font-bold text-sm">Actualizada recientemente</p>
                            </div>
                         </div>
                      </div>
                      
                      <Button variant="outline" className="h-14 rounded-2xl border-primary/20 font-black">Cambiar mi contraseña</Button>
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
