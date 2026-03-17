"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Truck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function B2BPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Hero B2B */}
      <section className="text-center space-y-6 max-w-3xl mx-auto py-10">
        <Badge className="bg-primary/10 text-primary font-bold px-4 py-1 text-xs">SOLUCIONES CORPORATIVAS</Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary">
          Impulsa tu negocio con <span className="text-secondary">MyDog Store</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Precios mayoristas, gestión logística y atención preferencial para clínicas veterinarias y tiendas especializadas.
        </p>
      </section>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Building2 className="w-8 h-8 text-primary" />, title: 'Tarifas Mayoristas', desc: 'Descuentos progresivos según volumen de compra.' },
          { icon: <Truck className="w-8 h-8 text-primary" />, title: 'Distribución Nacional', desc: 'Despacho prioritario para el sector profesional.' },
          { icon: <CheckCircle2 className="w-8 h-8 text-primary" />, title: 'Condiciones Flexibles', desc: 'Opciones de pago adaptadas a las necesidades de su empresa.' }
        ].map((benefit, i) => (
          <Card key={i} className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-black/5 hover:scale-[1.02] transition-transform">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
              <p className="text-muted text-sm">{benefit.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <section className="bg-primary rounded-[3rem] p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-black">Asóciese con nosotros</h2>
          <p className="text-white/80 text-lg">Complete el formulario y un ejecutivo comercial se pondrá en contacto en menos de 24 horas hábiles.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Soporte técnico especializado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span>Acceso a catálogo exclusivo B2B</span>
            </div>
          </div>
        </div>
        
        <Card className="rounded-[2rem] border-none bg-white shadow-2xl p-8">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre</Label>
                <Input placeholder="Nombre completo" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">RUT Empresa</Label>
                <Input placeholder="Identificación fiscal" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Correo Corporativo</Label>
              <Input type="email" placeholder="ejemplo@empresa.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Consulta o Requerimiento</Label>
              <Textarea placeholder="Describa brevemente su necesidad..." className="rounded-xl" />
            </div>
            <Button className="w-full h-12 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/90">
              Solicitar Apertura de Cuenta
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={cn("px-3 py-1 rounded-full text-[10px] uppercase tracking-widest inline-block", className)}>{children}</span>;
}
