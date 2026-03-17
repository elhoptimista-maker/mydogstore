"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Search, Briefcase } from 'lucide-react';
import { intelligentProductAssistant, type IntelligentProductAssistantOutput } from '@/ai/flows/intelligent-product-assistant';

export default function ProductAssistant() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IntelligentProductAssistantOutput | null>(null);
  const [form, setForm] = useState({
    dogBreed: '',
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
    <section className="py-20 px-4 max-w-5xl mx-auto">
      <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* Sidebar de información */}
          <div className="lg:col-span-2 bg-primary p-10 md:p-14 text-white space-y-8">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-secondary w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black leading-tight">Asistente de Nutrición</h3>
              <p className="text-white/70 leading-relaxed font-medium">
                Nuestra tecnología analiza el perfil de su mascota para recomendar los productos que mejor se adaptan a su etapa de vida y necesidades de salud.
              </p>
            </div>
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest">Recomendaciones Técnicas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest">Ahorro Inteligente</span>
              </div>
            </div>
          </div>

          {/* Formulario y Resultados */}
          <div className="lg:col-span-3 p-10 md:p-14">
            {!results ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="breed" className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Raza del Paciente / Mascota</Label>
                    <Input 
                      id="breed" 
                      placeholder="Ej: Golden Retriever, Mestizo" 
                      className="h-12 rounded-xl border-primary/10 focus-visible:ring-primary"
                      value={form.dogBreed}
                      onChange={e => setForm({...form, dogBreed: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Edad o Etapa</Label>
                    <Input 
                      id="age" 
                      placeholder="Ej: 5 años / Senior" 
                      className="h-12 rounded-xl border-primary/10 focus-visible:ring-primary"
                      value={form.dogAge}
                      onChange={e => setForm({...form, dogAge: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="needs" className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Observaciones Médicas o Nutricionales</Label>
                  <Input 
                    id="needs" 
                    placeholder="Ej: Sensibilidad gástrica, cuidado articular" 
                    className="h-12 rounded-xl border-primary/10 focus-visible:ring-primary"
                    value={form.specificNeeds}
                    onChange={e => setForm({...form, specificNeeds: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-secondary text-foreground text-lg font-black shadow-xl shadow-secondary/20 hover:scale-[1.01] transition-transform"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analizando datos técnicos...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Consultar Recomendación
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-primary text-xl uppercase tracking-tighter">Sugerencias MyDog</h4>
                  <Button variant="ghost" size="sm" className="font-bold text-muted" onClick={() => setResults(null)}>
                    Nueva Consulta
                  </Button>
                </div>
                <div className="space-y-4">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className="p-6 bg-muted/30 rounded-[2rem] border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-black text-foreground text-lg">{rec.productName}</h5>
                        <Badge variant="outline" className="border-secondary text-secondary rounded-full">Pro</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{rec.productDescription}</p>
                      <div className="p-4 bg-primary/5 rounded-2xl border-l-4 border-primary">
                        <p className="text-xs font-medium text-primary leading-relaxed italic">
                          <span className="font-black uppercase not-italic mr-2">Criterio Técnico:</span>
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
    </section>
  );
}
