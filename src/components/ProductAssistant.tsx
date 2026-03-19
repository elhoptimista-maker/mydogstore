"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import { intelligentProductAssistant, type IntelligentProductAssistantOutput } from '@/ai/flows/intelligent-product-assistant';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="w-full max-h-[90vh] flex flex-col overflow-hidden">
      <Card className="rounded-[3rem] border-none shadow-none overflow-hidden bg-white flex-1 flex flex-col md:flex-row">
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Sidebar - Información de Contexto */}
          <div className="w-full md:w-2/5 bg-primary p-8 md:p-12 text-white flex flex-col justify-between shrink-0">
            <div className="space-y-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Sparkles className="text-secondary w-7 h-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tighter">Venta <br /> Consultiva IA</h3>
                <p className="text-white/60 leading-relaxed font-medium text-xs md:text-sm">
                  Nuestro consultor experto analiza el perfil de tu mascota para sugerir la dieta y accesorios ideales.
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col gap-3 pt-8">
              {['Análisis de Nutrición', 'Optimización de Dieta', 'Recomendación Técnica'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-lg shadow-secondary/50" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Área de Formulario y Resultados */}
          <div className="flex-1 p-8 md:p-12 bg-white relative overflow-hidden flex flex-col min-h-0">
            {!results ? (
              <ScrollArea className="h-full">
                <form onSubmit={handleSubmit} className="space-y-8 pr-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-primary tracking-tight">Inicia la consulta técnica</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Cuéntanos sobre tu peludo</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="breed" className="font-black text-primary/40 uppercase tracking-widest text-[8px]">Raza o Especie</Label>
                      <Input 
                        id="breed" 
                        placeholder="Ej: Pastor Alemán" 
                        className="h-12 rounded-xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 transition-all font-bold text-sm"
                        value={form.dogBreed}
                        onChange={e => setForm({...form, dogBreed: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="font-black text-primary/40 uppercase tracking-widest text-[8px]">Etapa de Vida / Edad</Label>
                      <Input 
                        id="age" 
                        placeholder="Ej: 3 años / Adulto" 
                        className="h-12 rounded-xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 transition-all font-bold text-sm"
                        value={form.dogAge}
                        onChange={e => setForm({...form, dogAge: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="needs" className="font-black text-primary/40 uppercase tracking-widest text-[8px]">Necesidades o Patologías</Label>
                      <Input 
                        id="needs" 
                        placeholder="Ej: Sensibilidad digestiva, piel delicada..." 
                        className="h-12 rounded-xl border-primary/5 bg-muted/30 focus-visible:ring-primary/20 transition-all font-bold text-sm"
                        value={form.specificNeeds}
                        onChange={e => setForm({...form, specificNeeds: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-secondary text-primary text-base font-black shadow-xl shadow-secondary/20 hover:scale-[1.01] active:scale-95 transition-all mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Consultando experto...
                      </>
                    ) : (
                      <>
                        Obtener Recomendación <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </ScrollArea>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6 shrink-0">
                  <div>
                    <h4 className="font-black text-primary text-xl tracking-tighter">Resultados MyDog IA</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Perfil: {form.dogBreed}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="font-black text-primary text-[10px] uppercase hover:bg-primary/5" onClick={() => setResults(null)}>
                    Nueva consulta
                  </Button>
                </div>

                <ScrollArea className="flex-1 -mr-4 pr-4">
                  <div className="space-y-4">
                    {results.recommendations.map((rec, i) => (
                      <div key={i} className="p-6 bg-muted/20 rounded-[2rem] border border-primary/5 group hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                              <MessageSquare className="w-3.5 h-3.5 text-white" />
                            </div>
                            <h5 className="font-black text-primary text-base leading-none">{rec.productName}</h5>
                          </div>
                          <Badge className="bg-secondary/20 text-primary border-none text-[8px] font-black uppercase">Sugerido</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">{rec.productDescription}</p>
                        <div className="p-4 bg-primary rounded-xl text-white shadow-lg shadow-primary/5">
                          <p className="text-[10px] font-bold leading-relaxed italic opacity-90">
                            <span className="font-black uppercase not-italic mr-2 text-secondary">Opinión Experta:</span>
                            {rec.reasonForRecommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
