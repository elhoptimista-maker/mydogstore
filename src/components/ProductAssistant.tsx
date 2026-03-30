"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2, Send, ChevronDown, MessageCircle, ArrowRight, ShieldCheck, ShoppingCart, ExternalLink } from 'lucide-react';
import { productChat } from '@/ai/flows/intelligent-product-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useChat } from '@/context/ChatContext';
import { useCart } from '@/context/CartContext';
import { MARKET_INTELLIGENCE } from '@/lib/services/ranking.engine';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

const EXPERTS = [
  { 
    name: 'Perro', 
    emoji: '🐶', 
    color: 'bg-primary', 
    description: 'Dogtor Firulais',
    greeting: "¡Guau! Soy el Dogtor Firulais. ¿Tu perrito tiene el estómago sensible o es mañoso con la comida? Cuéntame qué le pasa y te buscaré el alimento perfecto entre nuestras marcas de confianza.",
    initialActions: ["Estómago Sensible", "Sobrepeso", "Cachorro"],
    categories: ["Alimento Hipoalergénico", "Snacks Saludables", "Control de Peso", "Salud Dental"]
  },
  { 
    name: 'Gato', 
    emoji: '🐱', 
    color: 'bg-orange-500', 
    description: 'Michi Sommelier',
    greeting: "¡Miau! Soy el Michi Sommelier. Si tu gato sufre de bolas de pelo o necesita cuidar su peso, pregúntame. Conozco todo el catálogo de memoria y buscaré lo mejor para su paladar.",
    initialActions: ["Bolas de Pelo", "Esterilizado", "Paladar Exigente"],
    categories: ["Alimento Húmedo", "Arena Sanitaria", "Snacks Gourmet", "Rascadores"]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    color: 'bg-green-500', 
    description: 'Capitán Pico',
    greeting: "¡Hola! Soy el Capitán Pico. Dime qué ave tienes en casa y te recomendaré la mixtura exacta para que su plumaje brille y su salud esté al máximo.",
    initialActions: ["Plumaje Brillante", "Loros", "Etapa Cría"],
    categories: ["Mixturas Premium", "Vitaminas", "Accesorios", "Higiene"]
  },
  { 
    name: 'Conejo y Roedor', 
    emoji: '🐰', 
    color: 'bg-blue-500', 
    description: 'Profesor Orejas',
    greeting: "¡Hola! Soy el Profesor Orejas. Cuéntame la edad de tu pequeño y te ayudaré a balancear su dieta con el heno más fresco y nutritivo de nuestra bodega.",
    initialActions: ["Heno Premium", "Cobayas", "Sustratos"],
    categories: ["Alimento Natural", "Snacks de Madera", "Sustratos", "Juguetes madera"]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    color: 'bg-cyan-500', 
    description: 'Almirante Burbujas',
    greeting: "¡Glup! Soy el Almirante Burbujas. Háblame de tu acuario y te daré las mejores opciones para que tus peces crezcan sanos y el agua esté siempre cristalina.",
    initialActions: ["Agua Fría", "Acondicionadores", "Tortugas"],
    categories: ["Hojuelas", "Granulados Pro", "Acondicionadores", "Filtración"]
  },
];

const LOADING_MESSAGES = [
  "Buscando la mejor opción en nuestra bodega...",
  "Revisando ingredientes y stock en tiempo real...",
  "Preparando mis mejores recomendaciones...",
  "Consultando nuestra red de distribución familiar...",
  "Olfateando el mejor precio para ti...",
];

export default function ProductAssistant() {
  const { isOpen, setIsOpen, activeSpecies, setActiveSpecies, messages, addMessage } = useChat();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [input, setInput] = useState('');
  const [lastRecommendedAt, setLastRecommendedAt] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const followUpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const activeMessages = activeSpecies ? messages[activeSpecies] || [] : [];
  const activeExpert = EXPERTS.find(e => e.name === activeSpecies);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, loading, isOpen]);

  useEffect(() => {
    if (activeSpecies && activeExpert && (!messages[activeSpecies] || messages[activeSpecies].length === 0)) {
      addMessage(activeSpecies, {
        role: 'assistant',
        content: activeExpert.greeting
      });
    }
  }, [activeSpecies, activeExpert]);

  useEffect(() => {
    if (loading) {
      const randomMsg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      setLoadingMessage(randomMsg);
    }
  }, [loading]);

  useEffect(() => {
    if (lastRecommendedAt && !loading) {
      followUpTimerRef.current = setTimeout(() => {
        if (!loading) {
          addMessage(activeSpecies!, {
            role: 'assistant',
            content: "¿Qué te han parecido estas soluciones? Si necesitas ver otras marcas o algo más específico para tu mascota, cuéntame con confianza."
          });
        }
      }, 15000);
    }
    return () => {
      if (followUpTimerRef.current) clearTimeout(followUpTimerRef.current);
    };
  }, [lastRecommendedAt, loading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleSend = async (text: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || loading || !activeSpecies) return;

    const userMessage = text.trim();
    setInput('');
    
    addMessage(activeSpecies, { role: 'user', content: userMessage });
    setLoading(true);

    try {
      const history = (messages[activeSpecies] || []).map(m => ({ 
        role: m.role, 
        content: m.content,
        recommendedIds: m.recommendations?.map((r: any) => r.id)
      })).concat({ role: 'user', content: userMessage, recommendedIds: undefined });
      
      const chatResponse = await productChat({
        species: activeSpecies,
        history,
        message: userMessage,
      });

      addMessage(activeSpecies, { 
        role: 'assistant', 
        content: chatResponse.response,
        recommendations: chatResponse.suggestedProducts
      });

      if (chatResponse.suggestedProducts && chatResponse.suggestedProducts.length > 0) {
        setLastRecommendedAt(Date.now());
      }
    } catch (error) {
      addMessage(activeSpecies, { 
        role: 'assistant', 
        content: "Lo siento, tuve un pequeño problema al revisar el inventario. ¿Podrías repetirme eso?" 
      });
    } finally {
      setLoading(false);
    }
  };

  const isExcludedPage = pathname === '/cuenta' || pathname?.startsWith('/settings');
  if (isExcludedPage) return null;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all group animate-in slide-in-from-bottom-4"
      >
        <div className="relative">
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 bg-secondary w-3 h-3 rounded-full border-2 border-primary animate-pulse" />
        </div>
      </button>
    );
  }

  return (
    <Card 
      ref={containerRef}
      className="fixed max-md:inset-0 md:bottom-6 md:right-6 z-[100] w-full md:w-[400px] h-[100dvh] md:h-[650px] flex flex-col overflow-hidden bg-white shadow-2xl md:rounded-[2.5rem] border-none animate-in slide-in-from-bottom-10 duration-500"
    >
      {/* Header */}
      <div className={cn(
        "p-6 text-white flex items-center justify-between shrink-0 shadow-lg relative z-10 transition-colors duration-500",
        activeExpert ? activeExpert.color : "bg-primary"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <span className="text-3xl">{activeExpert?.emoji || '💬'}</span>
          </div>
          <div>
            <h3 className="text-xl font-black leading-none tracking-tight">
              {activeExpert ? `${activeExpert.description}` : 'Asesor MyDog'}
            </h3>
            <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mt-1">Asesoría Familiar en línea</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-all">
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      {!activeSpecies ? (
        <ScrollArea className="flex-1 bg-[#F9FAFB]">
          <div className="flex flex-col p-8 space-y-8 min-h-full">
            <div className="text-center space-y-2">
              <h4 className="text-lg font-black text-foreground tracking-tight">¿A quién vamos a regalonear?</h4>
              <p className="text-xs font-medium text-muted-foreground">Selecciona un asesor experto para tu mascota.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 pb-8">
              {EXPERTS.map((expert) => (
                <button
                  key={expert.name}
                  onClick={() => setActiveSpecies(expert.name)}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/[0.03] hover:border-primary/20 hover:shadow-md transition-all group text-left"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner", expert.color + "/10")}>
                    {expert.emoji}
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-black text-foreground uppercase tracking-widest mb-1">{expert.name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{expert.description}</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className="flex-1 p-6 bg-[#F9FAFB]">
            <div className="space-y-6">
              {activeMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2 animate-in fade-in slide-in-from-bottom-2`}>
                  <div 
                    className={cn(
                      "max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-foreground border border-black/5 rounded-tl-none'
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 w-full max-w-[95%] mt-4">
                      {msg.recommendations.map((rec: any, idx: number) => {
                        // Cálculos de Inteligencia Comercial en vivo
                        const brandKey = rec.brand?.toLowerCase().trim() || '';
                        const metrics = MARKET_INTELLIGENCE[brandKey];
                        const isPremium = metrics && metrics.quality >= 4;
                        const ppkg = rec.weight_kg && rec.weight_kg > 0 
                          ? Math.round(rec.sellingPrice / rec.weight_kg) 
                          : null;

                        return (
                          <div key={idx} className="bg-white p-3 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all shadow-md flex gap-4 group animate-in slide-in-from-left-4">
                            {/* Imagen clickeable hacia el detalle */}
                            <Link href={`/catalogo/${rec.slug || rec.id}`} className="relative w-20 h-20 bg-muted/30 rounded-2xl overflow-hidden shrink-0 border border-black/5 flex items-center justify-center">
                              {isPremium && (
                                <div className="absolute top-1 left-1 z-10 bg-green-500 rounded-full p-0.5 shadow-sm">
                                  <ShieldCheck className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <Image 
                                src={rec.main_image || rec.image} 
                                alt={rec.name} 
                                fill 
                                className="object-contain p-2 hover:scale-110 transition-transform" 
                                sizes="80px" 
                              />
                            </Link>

                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <div className="flex items-start justify-between mb-1 gap-2">
                                  <Link href={`/catalogo/${rec.slug || rec.id}`}>
                                    <h5 className="text-[11px] font-black text-slate-800 line-clamp-2 leading-tight hover:text-primary transition-colors">{rec.name}</h5>
                                  </Link>
                                  <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase shrink-0">{rec.brand}</Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium italic leading-tight line-clamp-2 mb-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">{rec.reason}</p>
                              </div>
                              
                              <div className="flex items-end justify-between mt-auto pt-1">
                                <div>
                                  <div className="text-sm font-black text-primary leading-none">
                                    ${rec.sellingPrice?.toLocaleString('es-CL')}
                                  </div>
                                  {ppkg && (
                                    <div className="text-[9px] font-bold text-muted-foreground mt-0.5">
                                      ${ppkg.toLocaleString('es-CL')}/kg
                                    </div>
                                  )}
                                </div>
                                
                                {/* Botón de Compra por Impulso (Fricción Cero) */}
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    addToCart({ ...rec, priceAtAddition: rec.sellingPrice, quantity: 1, cartType: 'retail' });
                                    toast({ title: "¡Añadido! 🐾", description: "Agregado desde el asistente." });
                                  }}
                                  className="h-7 px-3 text-[10px] font-black uppercase rounded-xl bg-primary hover:bg-primary/90 shadow-md hover:scale-105 transition-transform"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Agregar
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      <Link 
                        href={`/catalogo?especie=${encodeURIComponent(activeSpecies)}`}
                        className="flex items-center justify-center gap-2 py-3 bg-primary/5 rounded-2xl border border-dashed border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/10 transition-colors mt-2"
                      >
                        <ExternalLink className="w-3 h-3" /> Ver catálogo completo de {activeSpecies}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              
              {!loading && activeExpert && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {(activeMessages.length === 1 || lastRecommendedAt) && (
                    <>
                      {activeMessages.length === 1 && activeExpert.initialActions.map(action => (
                        <button
                          key={action}
                          onClick={() => handleSend(action)}
                          className="px-4 py-2 bg-white border border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          {action}
                        </button>
                      ))}

                      {activeExpert.categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => handleSend(`Necesito ${cat}`)}
                          className="px-4 py-2 bg-white border border-secondary/40 text-[10px] font-black text-primary uppercase tracking-widest rounded-full hover:bg-secondary hover:text-white transition-all flex items-center gap-2 shadow-sm"
                        >
                          <ShoppingBag className="w-3 h-3" /> {cat}
                        </button>
                      ))}

                      {lastRecommendedAt && (
                        <>
                          <button
                            onClick={() => handleSend("Muéstrame otras marcas")}
                            className="px-4 py-2 bg-primary/5 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                          >
                            <ArrowRight className="w-3 h-3" /> Ver otras marcas
                          </button>
                          <button
                            onClick={() => handleSend("Busca opciones más económicas")}
                            className="px-4 py-2 bg-primary/5 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all"
                          >
                            Más Económicos
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {loading && (
                <div className="flex items-start gap-2 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-black/5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                    {loadingMessage}
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-white border-t border-black/5">
            <div className="flex items-center justify-between mb-3 px-2">
               <button 
                 onClick={() => { setActiveSpecies(null); setLastRecommendedAt(null); }}
                 className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
               >
                 Cambiar asesor
               </button>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Consultor Familiar en línea</span>
               </div>
            </div>
            <form onSubmit={(e) => handleSend(input, e)} className="flex gap-2">
              <input 
                placeholder="Cuéntame qué necesita tu mascota..." 
                className="flex-1 h-12 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary/20 font-bold text-sm px-4 outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || loading}
                className="h-12 w-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}
