import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ProductAssistant from '@/components/ProductAssistant';

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
          <WishlistProvider>
            <ChatProvider>
              <Header />
              <main className="min-h-screen pt-44 pb-0">
                {children}
              </main>
              <Footer />
              <ProductAssistant />
              <Toaster />
            </ChatProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
