"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Send, ChevronDown, MessageCircle, ShoppingCart, ShieldCheck } from 'lucide-react';
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
    name: 'Perro', emoji: '🐶', color: 'bg-primary', description: 'Dogtor Firulais',
    greeting: "¡Guau! Soy Firulais. Para ayudarte sin darte lata, cuéntame: ¿tu perrito es Cachorro, Adulto o ya es un Senior regalón?",
    initialReplies: ["Es Cachorro", "Es Adulto", "Es Senior", "Busco Snacks"]
  },
  { 
    name: 'Gato', emoji: '🐱', color: 'bg-orange-500', description: 'Michi Sommelier',
    greeting: "¡Miau! Soy el Michi Sommelier. Antes de ver el menú, ¿para quién buscamos hoy? ¿Un gatito bebé, un adulto esterilizado o buscas arena?",
    initialReplies: ["Gatito Bebé", "Adulto Esterilizado", "Busco Arena", "Snacks Húmedos"]
  },
  { 
    name: 'Aves', emoji: '🦜', color: 'bg-green-500', description: 'Capitán Pico',
    greeting: "¡Hola! Soy el Capitán Pico. Cuéntame qué ave tienes para recomendarte la mixtura exacta que hará brillar su plumaje.",
    initialReplies: ["Es un Loro", "Canario/Cata", "Busco Vitaminas"]
  },
  { 
    name: 'Conejo y Roedor', emoji: '🐰', color: 'bg-blue-500', description: 'Profesor Orejas',
    greeting: "¡Hola! Soy el Profesor Orejas. ¿Buscamos heno fresquito o algún sustrato para mantener su espacio impecable?",
    initialReplies: ["Heno Premium", "Busco Sustrato", "Snacks de Madera"]
  },
  { 
    name: 'Peces y Tortugas', emoji: '🐠', color: 'bg-cyan-500', description: 'Almirante Burbujas',
    greeting: "¡Glup! Soy el Almirante Burbujas. ¿Cómo está tu acuario? ¿Necesitas alimento para peces de agua fría o acondicionadores?",
    initialReplies: ["Agua Fría", "Tropicales", "Tortugas"]
  },
];

export default function ProductAssistant() {
  const { isOpen, setIsOpen, activeSpecies, setActiveSpecies, messages, addMessage } = useChat();
  const { cart, addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [currentQuickReplies, setCurrentQuickReplies] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const activeMessages = activeSpecies ? messages[activeSpecies] || [] : [];
  const activeExpert = EXPERTS.find(e => e.name === activeSpecies);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, loading, isOpen, currentQuickReplies]);

  useEffect(() => {
    if (activeSpecies && activeExpert && (!messages[activeSpecies] || messages[activeSpecies].length === 0)) {
      addMessage(activeSpecies, {
        role: 'assistant',
        content: activeExpert.greeting
      });
      setCurrentQuickReplies(activeExpert.initialReplies);
    }
  }, [activeSpecies, activeExpert, addMessage, messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleSend = async (text: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || loading || !activeSpecies) return;

    const userMessage = text.trim();
    setInput('');
    setCurrentQuickReplies([]); 
    
    addMessage(activeSpecies, { role: 'user', content: userMessage });
    setLoading(true);

    try {
      const history = (messages[activeSpecies] || []).map(m => ({ 
        role: m.role, 
        content: m.content,
        recommendedIds: m.recommendations?.map((r: any) => r.id)
      })).concat({ role: 'user', content: userMessage, recommendedIds: undefined });
      
      const cartContext = cart.map(item => ({
        name: item.name,
        category: item.category || 'Varios',
        price: item.priceAtAddition
      }));

      const chatResponse = await productChat({
        species: activeSpecies,
        history,
        message: userMessage,
        cartContext
      });

      addMessage(activeSpecies, { 
        role: 'assistant', 
        content: chatResponse.response,
        recommendations: chatResponse.suggestedProducts
      });

      if (chatResponse.quickReplies && chatResponse.quickReplies.length > 0) {
        setCurrentQuickReplies(chatResponse.quickReplies);
      } else if (chatResponse.suggestedProducts && chatResponse.suggestedProducts.length > 0) {
        setCurrentQuickReplies(["Ver más económicos", "Otras marcas", "Gracias, es todo"]);
      }
    } catch (error) {
      addMessage(activeSpecies, { 
        role: 'assistant', 
        content: "Se me cruzaron los cables un segundo. ¿Podrías repetirme lo último?" 
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
      className="fixed max-md:inset-0 md:bottom-6 md:right-6 z-[100] w-full md:w-[420px] h-[100dvh] md:h-[680px] flex flex-col overflow-hidden bg-white shadow-2xl md:rounded-[2.5rem] border-none animate-in slide-in-from-bottom-10 duration-500"
    >
      <div className={cn(
        "p-5 text-white flex items-center justify-between shrink-0 shadow-sm relative z-10 transition-colors duration-500",
        activeExpert ? activeExpert.color : "bg-primary"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <span className="text-2xl">{activeExpert?.emoji || '💬'}</span>
          </div>
          <div>
            <h3 className="text-lg font-black leading-none tracking-tight">
              {activeExpert ? activeExpert.description : 'Asesor MyDog'}
            </h3>
            <p className="text-[10px] font-bold text-white/80 mt-0.5">Asesoría Familiar Experta</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-all">
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {!activeSpecies ? (
        <ScrollArea className="flex-1 bg-slate-50">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h4 className="text-lg font-black text-foreground tracking-tight">¿Para quién buscamos hoy?</h4>
              <p className="text-xs font-medium text-muted-foreground">Selecciona un asesor experto.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 pb-8">
              {EXPERTS.map((expert) => (
                <button
                  key={expert.name}
                  onClick={() => setActiveSpecies(expert.name)}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 hover:border-primary/30 hover:shadow-md transition-all group text-left"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform", expert.color + "/10")}>
                    {expert.emoji}
                  </div>
                  <div className="flex-1">
                    <span className="block text-sm font-black text-foreground uppercase tracking-widest">{expert.name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">{expert.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className="flex-1 p-5 bg-slate-50">
            <div className="space-y-6">
              {activeMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2 animate-in fade-in`}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-3xl text-[13px] font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 border border-black/5 rounded-tl-none'
                  )}>
                    {msg.content}
                  </div>

                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 w-full max-w-[95%] mt-3">
                      {msg.recommendations.map((rec: any, idx: number) => {
                        const brandKey = rec.brand?.toLowerCase().trim() || '';
                        const metrics = MARKET_INTELLIGENCE[brandKey];
                        const isPremium = metrics && metrics.quality >= 4;
                        const ppkg = rec.weight_kg && rec.weight_kg > 0 ? Math.round(rec.sellingPrice / rec.weight_kg) : null;

                        return (
                          <div key={idx} className="bg-white p-3 rounded-2xl border border-primary/10 shadow-sm flex gap-3 group animate-in slide-in-from-left-4">
                            <Link href={`/catalogo/${rec.slug || rec.id}`} className="relative w-16 h-16 bg-muted/30 rounded-xl overflow-hidden shrink-0 border border-black/5 flex items-center justify-center">
                              {isPremium && <div className="absolute top-1 left-1 z-10 bg-green-500 rounded-full p-0.5 shadow-sm"><ShieldCheck className="w-3 h-3 text-white" /></div>}
                              <Image src={rec.main_image} alt={rec.name} fill className="object-contain p-1.5 hover:scale-110 transition-transform" sizes="64px" />
                            </Link>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h5 className="text-[11px] font-black text-slate-800 line-clamp-1 leading-tight">{rec.name}</h5>
                                <p className="text-[9px] text-muted-foreground italic leading-tight line-clamp-2 mt-1">{rec.reason}</p>
                              </div>
                              <div className="flex items-end justify-between mt-2">
                                <div>
                                  <div className="text-xs font-black text-primary leading-none">${rec.sellingPrice?.toLocaleString('es-CL')}</div>
                                  {ppkg && <div className="text-[8px] font-bold text-muted-foreground mt-0.5">${ppkg.toLocaleString('es-CL')}/kg</div>}
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    addToCart({ ...rec, priceAtAddition: rec.sellingPrice, quantity: 1, cartType: 'retail' });
                                    toast({ title: "¡Añadido! 🐾" });
                                  }}
                                  className="h-7 px-3 text-[9px] font-black uppercase rounded-lg bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95"
                                >
                                  Agregar
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {!loading && currentQuickReplies.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 animate-in slide-in-from-bottom-2">
                  {currentQuickReplies.map(reply => (
                    <button
                      key={reply}
                      onClick={() => handleSend(reply)}
                      className="px-4 py-2 bg-white border border-primary/20 text-[11px] font-bold text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex items-center gap-2 animate-pulse text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Revisando bodega...</span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-white border-t border-black/5">
            <div className="flex items-center justify-between mb-2 px-1">
               <button 
                 onClick={() => { setActiveSpecies(null); setCurrentQuickReplies([]); }}
                 className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
               >
                 Cambiar asesor
               </button>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">En línea</span>
               </div>
            </div>
            <form onSubmit={(e) => handleSend(input, e)} className="flex gap-2">
              <input 
                placeholder="Escribe tu duda aquí..." 
                className="flex-1 h-12 rounded-2xl bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/20 text-sm px-4 outline-none transition-all font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || loading}
                className="h-12 w-12 rounded-2xl bg-primary text-white shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
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
