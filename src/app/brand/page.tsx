"use client";

import BrandLogo from '@/components/layout/BrandLogo';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Brand Playground para visualización y descomposición del componente de marca.
 * Esta página permite testear escalas y variantes en entornos controlados.
 */
export default function BrandPage() {
  const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
  const variants: ('light' | 'footer' | 'b2b' | 'mobile')[] = ['light', 'footer', 'b2b', 'mobile'];

  return (
    <div className="min-h-screen bg-[#F6F6F6] pb-24">
      {/* Header de la página de marca */}
      <section className="bg-primary pt-24 pb-20 px-4 md:px-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
            🎨 Brand Assets Lab
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Guía de Estilo <span className="text-secondary">MyDog</span></h1>
          <p className="text-white/60 max-w-2xl font-medium">Laboratorio de componentes visuales. Aquí puedes descomponer y trabajar en la consistencia de la identidad corporativa de la distribuidora.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 relative z-10">
        <Tabs defaultValue="variants" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-white p-1.5 rounded-full shadow-xl border border-black/5 h-auto">
              <TabsTrigger value="variants" className="rounded-full px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Variantes</TabsTrigger>
              <TabsTrigger value="scales" className="rounded-full px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Escalado</TabsTrigger>
              <TabsTrigger value="anatomy" className="rounded-full px-8 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Anatomía</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="variants" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {variants.map((variant) => (
                <Card key={variant} className="rounded-[2.5rem] border-none shadow-sm overflow-hidden group">
                  <div className={cn(
                    "p-12 flex items-center justify-center min-h-[200px]",
                    "bg-primary"
                  )}>
                    <BrandLogo variant={variant} size="lg" />
                  </div>
                  <CardContent className="p-8 bg-white border-t border-black/5">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <h3 className="font-black uppercase text-sm tracking-tight">Variante: {variant}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Uso: {variant === 'light' ? 'Header Principal' : variant === 'footer' ? 'Pie de página' : variant === 'b2b' ? 'Portal Socios' : 'Menú Lateral'}</p>
                      </div>
                      <code className="bg-muted px-3 py-1 rounded-md text-[9px] font-mono">&lt;BrandLogo variant="{variant}" /&gt;</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scales" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
              <div className="bg-primary p-20 flex flex-col items-center gap-16">
                {sizes.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-4 group">
                    <div className="p-4 rounded-3xl group-hover:bg-white/5 transition-colors">
                      <BrandLogo size={size} variant="light" />
                    </div>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">{size.toUpperCase()} Scale</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="anatomy" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-sm border border-black/5 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter">Descomposición <br /><span className="text-primary">Atómica</span></h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">El logo MyDog no es una imagen estática, es un sistema de tres capas diseñado para ser accesible, responsivo y dinámico.</p>
                </div>
                
                <div className="space-y-6">
                  {[
                    { t: "Imagotipo Circular", d: "Contenedor circular limpio para el imagotipo oficial de la distribuidora." },
                    { t: "Tipografía Black", d: "Fuente Inter Black con tracking-tighter para máxima autoridad." },
                    { t: "Subtexto Dorado", d: "Color secundario para descriptor de negocio y trayectoria." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center font-black text-primary shrink-0">{i+1}</div>
                      <div>
                        <h4 className="font-black uppercase text-sm">{item.t}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square flex items-center justify-center bg-primary rounded-[3rem] border-2 border-dashed border-white/20 shadow-2xl">
                <div className="scale-[2]">
                  <BrandLogo size="lg" variant="light" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-full h-px bg-white/5 absolute top-1/2" />
                   <div className="h-full w-px bg-white/5 absolute left-1/2" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
