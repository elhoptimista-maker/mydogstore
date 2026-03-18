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
          
          {/* 14. Footer Masivo */}
          <footer className="w-full">
            {/* Top Row (Suscripción) */}
            <div className="bg-[#FEF9F3] py-24 text-center border-t border-black/5">
              <div className="max-w-4xl mx-auto px-4 space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Mantente al día con <span className="text-primary">MyDog</span></h2>
                  <p className="text-muted-foreground font-medium text-xl">Recibe listas de precios actualizadas y novedades exclusivas para tu negocio.</p>
                </div>
                <div className="relative max-w-xl mx-auto">
                  <div className="relative flex items-center bg-white rounded-full h-20 px-3 shadow-xl border border-black/5">
                    <input type="email" placeholder="Tu correo electrónico empresarial" className="flex-1 h-full bg-transparent outline-none px-10 font-bold text-sm text-foreground" />
                    <Button className="rounded-full bg-primary text-white font-black px-12 h-14 text-lg shadow-lg">
                      Suscribirse
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Footer (Super-Card) */}
            <div className="bg-primary text-white py-24 px-4 md:px-8 rounded-t-[4rem] mx-4 -mt-10 relative z-20 shadow-2xl">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-20">
                <div className="md:col-span-2 space-y-10">
                  <Link href="/" className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <Dog className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex flex-col -space-y-1">
                      <span className="font-black text-4xl tracking-tighter leading-none uppercase">MyDog</span>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Distribuidora</span>
                    </div>
                  </Link>
                  <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm">
                    Liderando la nutrición y el bienestar animal en Chile desde 2008. Pasión, compromiso y calidad en cada despacho.
                  </p>
                  <div className="flex gap-4">
                    <Link href="#" className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all">
                      <Instagram className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-10">
                  <h4 className="font-black text-xs uppercase tracking-[0.3em] text-secondary">Navegación</h4>
                  <ul className="space-y-6 text-sm font-black text-white/70">
                    {['Home', 'Tienda', 'Ofertas', 'Blog'].map(l => (
                      <li key={l}><Link href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="hover:text-white hover:underline transition-all inline-block">{l}</Link></li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-10">
                  <h4 className="font-black text-xs uppercase tracking-[0.3em] text-secondary">Información</h4>
                  <ul className="space-y-6 text-sm font-black text-white/70">
                    {['¿Quiénes somos?', 'Términos', 'Envíos', 'FAQ'].map(l => (
                      <li key={l}><Link href="#" className="hover:text-white hover:underline transition-all inline-block">{l}</Link></li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-10">
                  <h4 className="font-black text-xs uppercase tracking-[0.3em] text-secondary">Contacto</h4>
                  <ul className="space-y-8 text-sm font-black text-white/70">
                    <li className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-secondary shrink-0" />
                      <span>La Cisterna, Región Metropolitana, Chile</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <Phone className="w-5 h-5 text-secondary shrink-0" />
                      <span>+56 9 1234 5678</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-secondary shrink-0" />
                      <span>hola@mydog.cl</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-7xl mx-auto mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                <p>© 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.</p>
                <div className="flex gap-12 opacity-30 grayscale hover:opacity-100 transition-opacity">
                  <div className="bg-white px-5 py-2 rounded-lg text-black font-black">VISA</div>
                  <div className="bg-white px-5 py-2 rounded-lg text-black font-black">MASTERCARD</div>
                  <div className="bg-white px-5 py-2 rounded-lg text-black font-black">WEBPAY</div>
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