import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MyDog Distribuidora | Nutrición y Accesorios para Mascotas en Chile 🐾',
  description: 'Somos una empresa familiar con más de 15 años de experiencia. Distribución mayorista y venta al detalle de las mejores marcas para perros y gatos.',
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
          <main className="min-h-screen pt-16">
            {children}
          </main>
          
          <footer className="bg-white border-t border-border pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <span className="text-2xl font-bold text-primary tracking-tight">
                  My<span className="text-secondary">Dog</span>Distribuidora
                </span>
                <p className="text-muted text-sm leading-relaxed">
                  Desde 2008 cuidando a tus mascotas con compromiso y calidad. Expertos en distribución mayorista y minorista.
                </p>
                <div className="flex gap-4">
                  <Facebook className="w-5 h-5 text-primary cursor-pointer" />
                  <Instagram className="w-5 h-5 text-primary cursor-pointer" />
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-foreground">Catálogo</h4>
                <ul className="text-sm text-muted space-y-3">
                  <li className="hover:text-primary cursor-pointer">Alimento Seco</li>
                  <li className="hover:text-primary cursor-pointer">Alimento Húmedo</li>
                  <li className="hover:text-primary cursor-pointer">Snacks y Premios</li>
                  <li className="hover:text-primary cursor-pointer">Accesorios</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-foreground">Institucional</h4>
                <ul className="text-sm text-muted space-y-3">
                  <li className="hover:text-primary cursor-pointer">¿Quiénes somos?</li>
                  <li className="hover:text-primary cursor-pointer">Venta Mayorista</li>
                  <li className="hover:text-primary cursor-pointer">Términos y Condiciones</li>
                  <li className="hover:text-primary cursor-pointer">Preguntas Frecuentes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-foreground">Contacto</h4>
                <ul className="text-sm text-muted space-y-4">
                  <li className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-secondary" /> La Cisterna, Santiago
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-secondary" /> +56 9 1234 5678
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-secondary" /> contacto@mydog.cl
                  </li>
                </ul>
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted font-medium">
              <p>© 2024 MyDog Distribuidora. Compromiso, cercanía y calidad.</p>
              <div className="flex gap-6">
                <span>Venta Mayorista</span>
                <span>Despacho a todo Chile</span>
              </div>
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
