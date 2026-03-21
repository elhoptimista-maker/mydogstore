import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WHZB5RHC');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased selection:bg-primary/20 bg-background text-foreground">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WHZB5RHC"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        <CartProvider>
          <WishlistProvider>
            <ChatProvider>
              <div className="flex flex-col">
                <Header />
                <main className="pt-44 pb-0">
                  {children}
                </main>
                <Footer />
              </div>
              <ProductAssistant />
              <Toaster />
            </ChatProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
