import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { Mail, Phone, MapPin, Instagram, Dog } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'MyDog Distribuidora | Expertos en Nutrición Mascotas 🐾',
  description: 'Distribución mayorista y venta al detalle de las mejores marcas para perros y gatos. Más de 15 años de experiencia.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased selection:bg-primary/20 bg-background text-foreground">
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-40 md:pt-48 pb-0">
            {children}
          </main>
          
          <footer className="w-full">
            {/* Newsletter Orgánico - Se integra sin margen superior para flujo continuo con Trust Bar */}
            <div className="bg-[#FEF9F3] py-12 md:py-16 text-center border-t border-black/[0.03]">
              <div className="max-w-4xl mx-auto px-4 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Únete a la manada <span className="text-primary">MyDog</span></h2>
                  <p className="text-muted-foreground font-medium text-lg">Recibe ofertas exclusivas y consejos de nutrición para tus mascotas.</p>
                </div>
                <div className="relative max-w-xl mx-auto">
                  <div className="relative flex items-center bg-white rounded-full h-14 md:h-16 px-1.5 shadow-lg border border-black/5">
                    <input 
                      type="email" 
                      placeholder="Tu correo electrónico" 
                      className="flex-1 h-full bg-transparent outline-none px-6 font-bold text-sm text-foreground" 
                    />
                    <Button className="rounded-full bg-primary text-white font-black px-8 h-11 md:h-13 text-sm">
                      Suscribirse
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Super-Card */}
            <div className="bg-primary text-white py-12 px-4 md:px-8 rounded-t-[3rem] mx-4 -mt-8 relative z-20 shadow-2xl">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
                <div className="md:col-span-2 space-y-6">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <Dog className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <span className="font-black text-xl tracking-tighter leading-none uppercase">MyDog</span>
                      <span className="text-[8px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
                    </div>
                  </Link>
                  <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
                    Expertos en bienestar animal desde 2008. Distribución profesional de las mejores marcas para Santiago y regiones.
                  </p>
                  <div className="flex gap-3">
                    <Link href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all">
                      <Instagram className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Tienda</h4>
                  <ul className="space-y-3 text-sm font-bold text-white/70">
                    <li><Link href="/catalogo" className="hover:text-white transition-all">Alimentos</Link></li>
                    <li><Link href="/catalogo" className="hover:text-white transition-all">Snacks</Link></li>
                    <li><Link href="/catalogo" className="hover:text-white transition-all">Accesorios</Link></li>
                    <li><Link href="/ofertas" className="hover:text-white transition-all">Ofertas</Link></li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Ayuda</h4>
                  <ul className="space-y-3 text-sm font-bold text-white/70">
                    <li><Link href="#" className="hover:text-white transition-all">Envíos</Link></li>
                    <li><Link href="#" className="hover:text-white transition-all">Términos</Link></li>
                    <li><Link href="#" className="hover:text-white transition-all">FAQ</Link></li>
                    <li><Link href="/b2b" className="hover:text-white transition-all">Mayoristas</Link></li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Contacto</h4>
                  <ul className="space-y-3 text-sm font-bold text-white/70">
                    <li className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-secondary shrink-0" />
                      <span className="leading-tight">La Cisterna, RM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-secondary shrink-0" />
                      <span>+56 9 1234 5678</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-secondary shrink-0" />
                      <span>hola@mydog.cl</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                <p>© 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.</p>
                <div className="flex gap-4 opacity-40 grayscale">
                  <div className="bg-white px-2 py-1 rounded text-black">VISA</div>
                  <div className="bg-white px-2 py-1 rounded text-black">MASTERCARD</div>
                  <div className="bg-white px-2 py-1 rounded text-black">WEBPAY</div>
                </div>
              </div>
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}