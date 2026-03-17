import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Truck, CheckCircle2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function B2BPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Hero B2B */}
      <section className="text-center space-y-6 max-w-4xl mx-auto py-10">
        <Badge className="bg-secondary/20 text-foreground font-bold px-4 py-1 text-xs">SOLUCIONES PARA NEGOCIOS</Badge>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-primary">
          Tu Socio Estratégico en <span className="text-secondary">Distribución</span>
        </h1>
        <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
          Desde 2008 abastecemos a tiendas de mascotas, almacenes y profesionales con las marcas más confiables del mercado.
        </p>
      </section>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: <History className="w-8 h-8 text-primary" />, title: '15+ Años', desc: 'Trayectoria familiar en el rubro.' },
          { icon: <Building2 className="w-8 h-8 text-primary" />, title: 'Precios Mayoristas', desc: 'Escalas de descuento por volumen.' },
          { icon: <Truck className="w-8 h-8 text-primary" />, title: 'Logística Regional', desc: 'Despacho eficiente en Santiago y regiones.' },
          { icon: <CheckCircle2 className="w-8 h-8 text-primary" />, title: 'Sello MyDog', desc: 'Cercanía y compromiso técnico.' }
        ].map((benefit, i) => (
          <Card key={i} className="rounded-[2rem] border-none bg-white shadow-xl shadow-black/5">
            <CardContent className="p-8 space-y-4">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold">{benefit.title}</h3>
              <p className="text-muted text-sm">{benefit.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form Section */}
      <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 md:p-16 space-y-8 bg-primary text-white">
          <h2 className="text-3xl md:text-5xl font-black">Apertura de Cuenta Mayorista</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Nacimos como un pequeño pet shop y sabemos lo que tu negocio necesita. Únete a nuestra red de distribución y accede a precios preferenciales.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-medium">Atención especial a almacenes y feriantes</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-medium">Catálogo completo de más de 70 marcas</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 md:p-16 bg-white">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Razón Social / Nombre</Label>
                <Input placeholder="Ej: Tienda de Mascotas SPA" className="rounded-xl border-primary/10" />
              </div>
              <div className="space-y-2">
                <Label>RUT o Identificación</Label>
                <Input placeholder="12.345.678-9" className="rounded-xl border-primary/10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Correo de Contacto</Label>
              <Input type="email" placeholder="contacto@tunegocio.cl" className="rounded-xl border-primary/10" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Negocio</Label>
              <select className="w-full h-10 rounded-xl border border-primary/10 bg-background px-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                <option>Tienda de Mascotas (Pet Shop)</option>
                <option>Almacén / Minimarket</option>
                <option>Veterinaria</option>
                <option>Venta en Ferias</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Mensaje Adicional</Label>
              <Textarea placeholder="Cuéntanos un poco más sobre tu requerimiento..." className="rounded-xl border-primary/10 h-32" />
            </div>
            <Button className="w-full h-14 rounded-2xl bg-secondary text-foreground font-black hover:bg-secondary/90 shadow-lg shadow-secondary/20">
              Enviar Solicitud de Apertura
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={cn("px-3 py-1 rounded-full text-[10px] uppercase tracking-widest inline-block", className)}>{children}</span>;
}
