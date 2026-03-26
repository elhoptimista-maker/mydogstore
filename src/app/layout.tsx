import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Newsletter from '@/components/layout/Newsletter';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { ChatProvider } from '@/context/ChatContext';
import { WishlistProvider } from '@/context/WishlistContext';
import ProductAssistantWrapper from '@/components/ProductAssistantWrapper';

// Metadata optimizada para SEO local y CTR (Click-Through Rate)
export const metadata: Metadata = {
  title: 'MyDog Distribuidora | Expertos en nutrición para tu mascota 🐾',
  description: '15 años de experiencia cuidando a las mascotas de Santiago. Compra el mejor alimento y accesorios con despacho rápido y seguro en toda la Región Metropolitana.',
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
              <div className="flex flex-col min-h-screen">
                <div id="global-header">
                  <Header />
                </div>
                <main id="global-main" className="pt-44 flex-1">
                  {children}
                </main>
                <Newsletter />
                <Footer />
              </div>
              <ProductAssistantWrapper />
              <Toaster />
            </ChatProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
