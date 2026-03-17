import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'MydogStore | Nutrición y Bienestar Animal 🐾',
  description: 'Todo lo que tu mascota necesita en un solo lugar. Nutrición premium, accesorios especializados y asesoría profesional.',
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
      <body className="font-sans antialiased selection:bg-primary/20 bg-[#f6f6f6]">
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-16 pb-10">
            {children}
          </main>
          
          <footer className="bg-white border-t border-border py-12 px-4 mt-12 hidden md:block">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <span className="text-2xl font-bold text-primary tracking-tight">
                  My<span className="text-secondary">dog</span>Store
                </span>
                <p className="text-muted text-sm leading-relaxed">
                  Expertos en nutrición y salud animal. Ofrecemos soluciones de alta calidad para el bienestar de tu mascota.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Catálogo</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li className="hover:text-primary cursor-pointer">Alimentos Premium</li>
                  <li className="hover:text-primary cursor-pointer">Juguetes de Estimulación</li>
                  <li className="hover:text-primary cursor-pointer">Descanso y Camas</li>
                  <li className="hover:text-primary cursor-pointer">Accesorios</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Institucional</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li className="hover:text-primary cursor-pointer">Sobre Nosotros</li>
                  <li className="hover:text-primary cursor-pointer">Puntos de Venta</li>
                  <li className="hover:text-primary cursor-pointer">Blog de Bienestar</li>
                  <li className="hover:text-primary cursor-pointer">Contacto</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Soporte</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li className="hover:text-primary cursor-pointer">Preguntas Frecuentes</li>
                  <li className="hover:text-primary cursor-pointer">Envíos y Devoluciones</li>
                  <li className="hover:text-primary cursor-pointer">Garantía de Satisfacción</li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-xs text-muted font-medium">
              © 2024 MydogStore. Compromiso con el bienestar animal.
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
