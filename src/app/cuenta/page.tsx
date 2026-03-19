"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loginUser, registerUser, logoutUser } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, LogOut, Package, Settings, ShieldCheck, Mail, Lock, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CuentaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
        toast({ title: "¡Bienvenido de vuelta! 🐾", description: "Has iniciado sesión correctamente." });
      } else {
        await registerUser(email, password, displayName);
        toast({ title: "¡Cuenta creada! ✨", description: "Bienvenido a la manada MyDog." });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Error de autenticación", 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({ title: "Sesión cerrada", description: "Vuelve pronto." });
      router.push('/');
    } catch (error) {
      console.error(error);
    }
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
      {/* Hero Account - Solo visible si hay usuario */}
      {user && (
        <section className="relative h-48 md:h-64 flex items-center bg-[#FEF9F3] overflow-hidden mb-12 border-b border-black/5">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Gestión de perfil</span>
              <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                Hola, {user.displayName || 'Miembro MyDog'}
              </h1>
            </div>
          </div>
        </section>
      )}

      <div className={cn("max-w-7xl mx-auto px-4 lg:px-8", !user && "pt-24 md:pt-32")}>
        {!user ? (
          /* Formulario de Login/Registro Simplificado */
          <div className="max-w-md mx-auto space-y-10">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter text-foreground leading-none">
                  {isLogin ? '¡Hola de nuevo!' : 'Únete a la manada'}
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                  {isLogin ? 'Ingresa tus datos para continuar.' : 'Crea tu cuenta MyDog en segundos.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nombre Completo</Label>
                  <Input 
                    placeholder="Ej: Juan Pérez" 
                    className="h-16 rounded-[2rem] border-primary/5 bg-white shadow-sm focus-visible:ring-primary/20 font-bold px-6"
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
                    className="h-16 rounded-[2rem] border-primary/5 bg-white shadow-sm pl-14 focus-visible:ring-primary/20 font-bold"
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
                    className="h-16 rounded-[2rem] border-primary/5 bg-white shadow-sm pl-14 focus-visible:ring-primary/20 font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary text-white font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                {isLogin ? 'Entrar a MyDog' : 'Crear mi cuenta'}
              </Button>
            </form>

            <div className="text-center pt-6">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline"
              >
                {isLogin ? '¿Aún no eres parte? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
              </button>
            </div>
          </div>
        ) : (
          /* Dashboard de Usuario Logueado */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar de Perfil */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
                <div className="p-10 text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto relative group">
                    <span className="text-4xl">🐾</span>
                    <button className="absolute inset-0 bg-primary/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">{user.displayName || 'Miembro MyDog'}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{user.email}</p>
                  </div>
                  <Badge className="bg-secondary text-primary border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Cliente Verificado</Badge>
                  
                  <div className="pt-6 border-t border-black/5 flex flex-col gap-2">
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl font-bold gap-3 text-muted-foreground hover:text-primary hover:bg-primary/5">
                      <Settings className="w-5 h-5" /> Configuración
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="w-full justify-start h-12 rounded-2xl font-bold gap-3 text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contenido Principal */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <Package className="w-6 h-6" />, title: 'Mis Pedidos', desc: 'Ver historial y seguimiento', link: '#' },
                  { icon: <Heart className="w-6 h-6" />, title: 'Favoritos', desc: 'Ver mis productos guardados', link: '/wishlist' },
                  { icon: <ShieldCheck className="w-6 h-6" />, title: 'Seguridad', desc: 'Gestionar contraseña y datos', link: '#' },
                  { icon: <Mail className="w-6 h-6" />, title: 'Suscripciones', desc: 'Preferencias de boletín', link: '#' }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => item.link !== '#' && router.push(item.link)}
                    className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex items-center gap-6 group"
                  >
                    <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight">{item.title}</h4>
                      <p className="text-xs font-medium text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden border border-black/5">
                <div className="p-10 space-y-6">
                  <h3 className="text-xl font-black tracking-tight">Última Actividad</h3>
                  <div className="bg-muted/30 p-8 rounded-3xl text-center border border-dashed border-primary/20">
                    <p className="text-sm font-medium text-muted-foreground">No tienes pedidos recientes.</p>
                    <Button variant="link" onClick={() => router.push('/catalogo')} className="text-primary font-black uppercase tracking-widest text-[10px] mt-2">Ir a comprar</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
