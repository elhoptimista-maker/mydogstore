import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'MydogStore | La App de tu mejor amigo 🐾',
  description: 'Todo lo que tu mascota necesita en un solo lugar. Nutrición premium, accesorios Pro y asesoría AI en Chile.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MydogStore Chile",
              "url": "https://mydogstore.cl",
              "logo": "https://mydogstore.cl/logo.png",
              "sameAs": [
                "https://facebook.com/mydogstore",
                "https://instagram.com/mydogstore"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-primary/20 bg-[#f6f6f6]">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-white border-t border-border/50 py-20 px-4 mt-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <span className="text-3xl font-extrabold text-primary tracking-tight">
                My<span className="text-secondary">dog</span>Store
              </span>
              <p className="text-muted text-sm leading-relaxed max-w-xs">
                Somos apasionados por el bienestar canino. Seleccionamos solo lo mejor para que tu peludo sea el más feliz de la cuadra.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">📸</div>
                <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">📘</div>
                <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center hover:bg-primary/10 cursor-pointer transition-colors">🐦</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Comprar</h4>
              <ul className="text-sm text-muted space-y-3">
                <li className="hover:text-primary cursor-pointer transition-colors">Alimentos Premium</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Juguetes Pro</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Camas & Descanso</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Accesorios de Paseo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Nosotros</h4>
              <ul className="text-sm text-muted space-y-3">
                <li className="hover:text-primary cursor-pointer transition-colors">Nuestra Historia</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Puntos de Venta</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Blog Perruno</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Trabaja con nosotros</li>
              </ul>
            </div>
            <div className="bg-secondary/10 p-8 rounded-[2.5rem] border border-secondary/20">
              <h4 className="font-bold text-lg mb-4">¿Necesitas ayuda?</h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Estamos listos para asesorarte con la nutrición de tu mascota.</p>
              <Button className="w-full rounded-2xl bg-secondary text-foreground font-bold hover:scale-[1.02] transition-transform">Habla con un Experto</Button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border/50 text-center text-[10px] text-muted font-bold uppercase tracking-widest">
            © 2024 MydogStore Chile. Hecho con ❤️ para los peludos más bakánes.
          </div>
        </footer>
        <Toaster />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </html>
  );
}