"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import { intelligentProductAssistant, type IntelligentProductAssistantOutput } from '@/ai/flows/intelligent-product-assistant';
import { Badge } from '@/components/ui/badge';

interface ProductAssistantProps {
  defaultBreed?: string;
}

export default function ProductAssistant({ defaultBreed = '' }: ProductAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IntelligentProductAssistantOutput | null>(null);
  const [form, setForm] = useState({
    dogBreed: defaultBreed,
    dogAge: '',
    specificNeeds: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await intelligentProductAssistant(form);
      setResults(output);
    } catch (error) {
      console.error('Error en asesoría:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="rounded-[3rem] border-none shadow-none overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
          {/* Sidebar - Contextual Information */}
          <div className="lg:col-span-2 bg-primary p-10 md:p-16 text-white flex flex-col justify-between">
            <div className="space-y-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Sparkles className="text-secondary w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-black leading-none tracking-tighter">Venta <br /> Consultiva IA</h3>
                <p className="text-white/60 leading-relaxed font-medium text-sm md:text-base">
                  Nuestro consultor experto analiza el perfil de tu mascota para sugerir la dieta y accesorios ideales.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 pt-10">
              {['Análisis de Nutrición', 'Optimización de Dieta', 'Recomendación Técnica'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-lg shadow-secondary/50" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form & Results Area */}
          <div className="lg:col-span-3 p-10 md:p-16 flex flex-col justify-center bg-white relative">
            {!results ? (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-primary tracking-tight">Inicia la consulta técnica</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cuéntanos sobre tu peludo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="breed" className="font-black text-primary/40 uppercase tracking-widest text-[9px]">Raza o Especie</Label>
                    <Input 
                      id="breed" 
                      placeholder="Ej: Pastor Alemán" 
                      className="h-14 rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 transition-all font-bold text-sm"
                      value={form.dogBreed}
                      onChange={e => setForm({...form, dogBreed: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="age" className="font-black text-primary/40 uppercase tracking-widest text-[9px]">Etapa de Vida / Edad</Label>
                    <Input 
                      id="age" 
                      placeholder="Ej: 3 años / Adulto" 
                      className="h-14 rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 transition-all font-bold text-sm"
                      value={form.dogAge}
                      onChange={e => setForm({...form, dogAge: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="needs" className="font-black text-primary/40 uppercase tracking-widest text-[9px]">Necesidades o Patologías</Label>
                  <Input 
                    id="needs" 
                    placeholder="Ej: Sensibilidad digestiva, piel delicada..." 
                    className="h-14 rounded-2xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 transition-all font-bold text-sm"
                    value={form.specificNeeds}
                    onChange={e => setForm({...form, specificNeeds: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-3xl bg-secondary text-primary text-lg font-black shadow-2xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Consultando experto...
                    </>
                  ) : (
                    <>
                      Obtener Recomendación <ArrowRight className="ml-3 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-primary text-2xl tracking-tighter">Resultados MyDog IA</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Basado en el perfil ingresado</p>
                  </div>
                  <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/5" onClick={() => setResults(null)}>
                    Nueva consulta
                  </Button>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-4 no-scrollbar">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className="p-8 bg-muted/20 rounded-[2.5rem] border border-primary/5 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <h5 className="font-black text-primary text-lg leading-none">{rec.productName}</h5>
                        </div>
                        <Badge className="bg-secondary/20 text-primary border-none text-[9px] font-black uppercase">Sugerido</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 font-medium leading-relaxed">{rec.productDescription}</p>
                      <div className="p-5 bg-primary rounded-2xl text-white shadow-xl shadow-primary/10">
                        <p className="text-[11px] font-bold leading-relaxed italic opacity-90">
                          <span className="font-black uppercase not-italic mr-2 text-secondary">Opinión Experta:</span>
                          {rec.reasonForRecommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
