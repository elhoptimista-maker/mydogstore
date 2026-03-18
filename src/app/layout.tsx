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
          <main className="min-h-screen pt-24 md:pt-36">
            {children}
          </main>
          
          {/* Footer Masivo */}
          <footer className="w-full">
            {/* Top Row (Suscripción/Newsletter) - Orgánico */}
            <div className="bg-[#FEF9F3] py-16 text-center border-t border-black/5">
              <div className="max-w-4xl mx-auto px-4 space-y-8">
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Mantente al día con <span className="text-primary">MyDog</span></h2>
                  <p className="text-muted-foreground font-medium text-lg">Recibe listas de precios actualizadas y novedades exclusivas para tu negocio.</p>
                </div>
                <div className="relative max-w-xl mx-auto">
                  <div className="relative flex items-center bg-white rounded-full h-16 px-2 shadow-lg border border-black/5">
                    <input type="email" placeholder="Tu correo electrónico empresarial" className="flex-1 h-full bg-transparent outline-none px-6 font-bold text-sm text-foreground" />
                    <Button className="rounded-full bg-primary text-white font-black px-8 h-12 text-sm shadow-md">
                      Suscribirse
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Footer (Super-Card) */}
            <div className="bg-primary text-white py-16 px-4 md:px-8 rounded-t-[3rem] mx-4 -mt-8 relative z-20 shadow-2xl">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="md:col-span-2 space-y-6">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <Dog className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <span className="font-black text-2xl tracking-tighter leading-none uppercase">MyDog</span>
                      <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
                    </div>
                  </Link>
                  <p className="text-white/60 text-base font-medium leading-relaxed max-w-sm">
                    Liderando la nutrición y el bienestar animal en Chile desde 2008. Pasión, compromiso y calidad en cada despacho.
                  </p>
                  <div className="flex gap-3">
                    <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all">
                      <Instagram className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Navegación</h4>
                  <ul className="space-y-4 text-sm font-black text-white/70">
                    {['Home', 'Tienda', 'Ofertas', 'Blog'].map(l => (
                      <li key={l}><Link href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="hover:text-white hover:underline transition-all inline-block">{l}</Link></li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Información</h4>
                  <ul className="space-y-4 text-sm font-black text-white/70">
                    {['¿Quiénes somos?', 'Términos', 'Envíos', 'FAQ'].map(l => (
                      <li key={l}><Link href="#" className="hover:text-white hover:underline transition-all inline-block">{l}</Link></li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Contacto</h4>
                  <ul className="space-y-4 text-sm font-black text-white/70">
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="leading-tight">La Cisterna, Región Metropolitana, Chile</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-secondary shrink-0" />
                      <span>+56 9 1234 5678</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-secondary shrink-0" />
                      <span>hola@mydog.cl</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                <p>© 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.</p>
                <div className="flex gap-8 opacity-30 grayscale hover:opacity-100 transition-opacity">
                  <div className="bg-white px-3 py-1.5 rounded text-black font-black">VISA</div>
                  <div className="bg-white px-3 py-1.5 rounded text-black font-black">MASTERCARD</div>
                  <div className="bg-white px-3 py-1.5 rounded text-black font-black">WEBPAY</div>
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
