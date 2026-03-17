import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'MyDog Distribuidora | Soluciones Mayoristas para el Sector Veterinario 🐾',
  description: 'Distribución líder de nutrición premium y accesorios especializados. Abastecimiento profesional para clínicas y tiendas de mascotas.',
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
                  My<span className="text-secondary">dog</span>Distribuidora
                </span>
                <p className="text-muted text-sm leading-relaxed">
                  Socio estratégico en nutrición y salud animal. Proveemos soluciones de alta calidad para el canal profesional y especializado.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Catálogo Mayorista</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li className="hover:text-primary cursor-pointer">Nutrición de Especialidad</li>
                  <li className="hover:text-primary cursor-pointer">Equipamiento Clínico</li>
                  <li className="hover:text-primary cursor-pointer">Mobiliario de Descanso</li>
                  <li className="hover:text-primary cursor-pointer">Accesorios Técnicos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Institucional</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li className="hover:text-primary cursor-pointer">Nuestra Empresa</li>
                  <li className="hover:text-primary cursor-pointer">Centros de Distribución</li>
                  <li className="hover:text-primary cursor-pointer">Portal de Proveedores</li>
                  <li className="hover:text-primary cursor-pointer">Contacto Corporativo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Servicios B2B</h4>
                <ul className="text-sm text-muted space-y-2">
                  <li className="hover:text-primary cursor-pointer">Gestión de Pedidos</li>
                  <li className="hover:text-primary cursor-pointer">Logística y Despacho</li>
                  <li className="hover:text-primary cursor-pointer">Capacitación Técnica</li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-xs text-muted font-medium">
              © 2024 MyDog Distribuidora. Excelencia en logística para el bienestar animal.
            </div>
          </footer>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
