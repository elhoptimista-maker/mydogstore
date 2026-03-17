import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'MydogStore | Lo mejor para tu regalón en Chile',
  description: 'Compra productos premium para tus perros en Chile. Nutrición, descanso y juguetes con recomendaciones de IA.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
        {/* Schema.org Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MydogStore",
              "url": "https://mydogstore.cl",
              "logo": "https://mydogstore.cl/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "CL"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-accent/30">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        <Header />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
        <Toaster />
        <footer className="bg-white py-12 px-4 border-t border-border mt-20">
          <div className="max-w-7xl mx-auto text-center space-y-4">
             <div className="text-xl font-bold text-primary">
              My<span className="text-accent">dog</span>Store
            </div>
            <p className="text-sm text-muted-foreground">© 2024 MydogStore. Calidad premium para el mejor amigo del hombre.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}