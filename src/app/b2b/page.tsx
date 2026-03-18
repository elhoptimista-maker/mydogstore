import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Truck, CheckCircle2, History, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function B2BPage() {
  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-24">
      {/* Hero B2B - Coherente con Home */}
      <section className="relative bg-[#FEF9F3] pt-20 pb-24 border-b border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            🤝 Alianzas Profesionales
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
            Tu Socio Estratégico <br /> en <span className="text-primary">Distribución</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Desde 2008 abastecemos a tiendas de mascotas, almacenes y profesionales con las marcas más confiables del mercado nacional e internacional.
          </p>
        </div>
        
        {/* Decoración sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-0" />
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20 space-y-24">
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <History className="w-8 h-8" />, title: '15+ Años', desc: 'Trayectoria familiar y técnica en el rubro.' },
            { icon: <Building2 className="w-8 h-8" />, title: 'Precios Mayoristas', desc: 'Escalas de descuento competitivas por volumen.' },
            { icon: <Truck className="w-8 h-8" />, title: 'Logística Regional', desc: 'Despacho eficiente en Santiago y todo Chile.' },
            { icon: <CheckCircle2 className="w-8 h-8" />, title: 'Sello MyDog', desc: 'Compromiso real con el crecimiento de tu negocio.' }
          ].map((benefit, i) => (
            <Card key={i} className="rounded-[2.5rem] border-none bg-white shadow-xl shadow-black/5 hover:-translate-y-2 transition-all duration-300 group">
              <CardContent className="p-10 space-y-6 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary mx-auto group-hover:bg-primary group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{benefit.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form Section - Super Card */}
        <section className="bg-white rounded-[3rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-black/5">
          <div className="p-12 md:p-20 space-y-10 bg-primary text-white relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <Badge className="bg-secondary text-primary border-none rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest">Apertura de Cuenta</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Únete a nuestra <br /><span className="text-secondary">Red de Distribución</span></h2>
              <p className="text-white/70 text-lg font-medium leading-relaxed max-w-md">
                Nacimos como un pequeño pet shop y entendemos los desafíos de tu negocio. Accede a un catálogo de más de 70 marcas con precios preferenciales.
              </p>
              
              <div className="space-y-6 pt-4">
                {[
                  "Atención especial a almacenes y feriantes",
                  "Asesoría técnica en mix de productos",
                  "Plataforma de pedidos 24/7 para socios"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="font-bold text-sm text-white/90">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Elemento decorativo */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="p-12 md:p-20 bg-white">
            <form className="space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Razón Social</Label>
                    <Input placeholder="Ej: Tienda Mascotas SPA" className="h-14 rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 font-bold" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">RUT Empresa</Label>
                    <Input placeholder="12.345.678-9" className="h-14 rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 font-bold" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Correo Electrónico Corporativo</Label>
                  <Input type="email" placeholder="contacto@tunegocio.cl" className="h-14 rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 font-bold" />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo de Establecimiento</Label>
                  <select className="w-full h-14 rounded-2xl border border-primary/5 bg-muted/30 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                    <option>Pet Shop / Tienda Especializada</option>
                    <option>Veterinaria / Clínica</option>
                    <option>Almacén / Minimarket</option>
                    <option>Distribuidor Regional</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mensaje o Requerimiento</Label>
                  <Textarea placeholder="Cuéntanos sobre tu negocio y qué marcas te interesan..." className="rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 font-bold min-h-[120px]" />
                </div>
              </div>

              <Button className="w-full h-16 rounded-3xl bg-primary text-white font-black text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Enviar Solicitud de Distribución <ArrowRight className="w-5 h-5" />
              </Button>
              
              <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                🔒 Tus datos están protegidos por MyDog Distribuidora
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
