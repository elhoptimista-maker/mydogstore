import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Dog } from 'lucide-react';
import Link from 'next/link';

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
          
          <footer className="bg-white border-t border-black/[0.03] pt-20 pb-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Dog className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-black text-primary tracking-tighter">MyDog Distribuidora</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Pasión por el bienestar animal. Liderando la distribución de nutrición premium en Chile desde 2008.
                </p>
                <div className="flex gap-4">
                  <Link href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                    <Twitter className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-primary">Navegación</h4>
                <ul className="text-sm space-y-4 font-bold text-muted-foreground">
                  <li><Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo Completo</Link></li>
                  <li><Link href="/b2b" className="hover:text-primary transition-colors">Venta Mayorista</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Nuestras Marcas</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Blog de Nutrición</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-primary">Información</h4>
                <ul className="text-sm space-y-4 font-bold text-muted-foreground">
                  <li><Link href="#" className="hover:text-primary transition-colors">¿Quiénes somos?</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Políticas de Envío</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em] mb-8 text-primary">Contacto</h4>
                <ul className="text-sm space-y-5">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-secondary shrink-0" />
                    <span className="font-bold text-muted-foreground">La Cisterna, Región Metropolitana, Chile</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-secondary shrink-0" />
                    <span className="font-bold text-muted-foreground">+56 9 1234 5678</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-secondary shrink-0" />
                    <span className="font-bold text-muted-foreground">hola@mydog.cl</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              <p>© 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.</p>
              <div className="flex gap-8">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Estado del Servicio</span>
                <span>Despacho a todo Chile 🇨🇱</span>
              </div>
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}