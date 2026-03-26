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

// Metadata optimizada para SEO local, Autoridad y CTR (Click-Through Rate)
export const metadata: Metadata = {
  title: 'MyDog Distribuidora | Expertos en nutrición para tu mascota 🐾',
  description: '15 años de experiencia cuidando a las mascotas de Santiago. Compra el mejor alimento y accesorios con despacho rápido y seguro en toda la Región Metropolitana.',
  keywords: ['alimento para mascotas', 'distribuidora de mascotas santiago', 'comida para perros rm', 'accesorios mascotas', 'mydog distribuidora'],
  authors: [{ name: 'MyDog Distribuidora' }],
  openGraph: {
    title: 'MyDog Distribuidora | Expertos en nutrición para tu mascota',
    description: '15 años de experiencia cuidando a las mascotas de Santiago. Despacho rápido y seguro en toda la Región Metropolitana.',
    url: 'https://www.mydogdistribuidora.cl',
    siteName: 'MyDog Distribuidora',
    locale: 'es_CL',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Previene el zoom en inputs móviles, mejorando la experiencia de UI nativa
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager - Crítico para medir el embudo de conversión y CRO */}
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
        {/* Noscript fallback para GTM */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WHZB5RHC"
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        
        {/* Árbol de Providers - Gestión de Estado Global */}
        <CartProvider>
          <WishlistProvider>
            <ChatProvider>
              <div className="flex flex-col min-h-screen">
                <div id="global-header">
                  <Header />
                </div>
                
                {/* Contenedor principal de la aplicación */}
                <main id="global-main" className="pt-44 flex-1">
                  {children}
                </main>
                
                {/* Elementos globales de cierre y conversión */}
                <Newsletter />
                <Footer />
              </div>
              
              {/* Utilidades flotantes y notificaciones */}
              <ProductAssistantWrapper />
              <Toaster />
            </ChatProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
