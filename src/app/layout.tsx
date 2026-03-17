import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MydogStore | La App de tu mejor amigo',
  description: 'Todo lo que tu mascota necesita en un solo lugar. Diseño premium y atención personalizada.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased selection:bg-primary/20 bg-[#f6f6f6]">
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
                Expertos en nutrición y bienestar canino en Chile. Calidad premium para el regalón de la casa.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Comprar</h4>
              <ul className="text-sm text-muted space-y-2">
                <li>Alimentos Premium</li>
                <li>Juguetes Pro</li>
                <li>Camas & Descanso</li>
                <li>Accesorios</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="text-sm text-muted space-y-2">
                <li>Sobre Nosotros</li>
                <li>Puntos de Venta</li>
                <li>Blog Perruno</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ayuda</h4>
              <ul className="text-sm text-muted space-y-2">
                <li>Preguntas Frecuentes</li>
                <li>Envíos & Devoluciones</li>
                <li>Garantía de Felicidad</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-xs text-muted font-medium">
            © 2024 MydogStore Chile. Hecho con amor por los peludos.
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
