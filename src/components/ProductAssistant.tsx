"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Loader2, Send, ChevronDown, MessageCircle } from 'lucide-react';
import { productChat } from '@/ai/flows/intelligent-product-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const EXPERTS = [
  { 
    name: 'Perro', 
    emoji: '🐶', 
    color: 'bg-primary', 
    description: 'Especialista en Caninos',
    greeting: "¡Hola! 🐾 Soy tu guía experto en Perros. Me apasiona asegurar que cada peludo tenga la nutrición exacta para su energía. Para asesorarte mejor, ¿cuál es su etapa de vida o tiene alguna necesidad especial como piel sensible?",
    actions: ["Cachorro", "Adulto", "Senior", "Piel Sensible", "Ofertas"]
  },
  { 
    name: 'Gato', 
    emoji: '🐱', 
    color: 'bg-orange-500', 
    description: 'Consultor Felino',
    greeting: "¡Hola! 🐱 Soy tu guía especialista en Gatos. Entiendo lo selectivos que pueden ser y lo importante que es su salud urinaria. ¿Tu compañero es gatito, adulto, o quizás está esterilizado?",
    actions: ["Gatito", "Adulto", "Esterilizado", "Control Bolas Pelo", "Senior"]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    color: 'bg-green-500', 
    description: 'Guía de Aves',
    greeting: "¡Hola! 🦜 Soy tu consultor en nutrición aviar. Un plumaje brillante y vitalidad dependen de una mixtura correcta. ¿Buscas algo para mantenimiento, cría o especies específicas como loros o canarios?",
    actions: ["Canarios", "Loros/Cacatúas", "Etapa de Cría", "Mantenimiento", "Mixturas"]
  },
  { 
    name: 'Conejo y Roedor', 
    emoji: '🐰', 
    color: 'bg-blue-500', 
    description: 'Especialista en Pequeños Mamíferos',
    greeting: "¡Hola! 🐰 Soy tu guía para pequeños compañeros. El heno y el desgaste dental son pilares de su salud. ¿Me cuentas si tienes un conejo, cobaya o hámster para buscar el mix ideal?",
    actions: ["Conejos", "Hámster/Cobaya", "Heno Premium", "Snacks Saludables", "Gazapos"]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    color: 'bg-cyan-500', 
    description: 'Consultor Acuático',
    greeting: "¡Hola! 🐠 Soy tu guía en acuariofilia y reptiles. El equilibrio nutricional es vital en el agua. ¿Tu acuario es de agua fría, tropical, o buscas nutrición para tortugas?",
    actions: ["Agua Fría", "Peces Tropicales", "Tortugas", "Alevines", "Mantenimiento"]
  },
];

const LOADING_MESSAGES = [
  "Buscando en nuestro almacén con olfato de sabueso...",
  "Revolviendo el gallinero para encontrar lo mejor...",
  "Limpiando las algas del acuario para ver mejor...",
  "Olfateando las croquetas más frescas del depósito...",
  "Persiguiendo el puntero láser por los pasillos de snacks...",
  "Afilando las garras para darte la mejor asesoría...",
  "Contando granos de alpiste premium...",
  "Ordenando los juguetes por nivel de '¡CUA-CUA!'...",
  "Revisando el rincón secreto de las golosinas...",
  "Sincronizando ronroneos con nuestra base de datos...",
  "Cavando un hoyo para encontrar el tesoro nutricional...",
  "Explorando la madriguera de las ofertas...",
  "Nadando contra la corriente para traerte calidad...",
  "Buscando debajo de la cama (donde siempre hay tesoros)...",
  "Ajustando las antenas para captar tus necesidades..."
];

export default function ProductAssistant() {
  const { isOpen, setIsOpen, activeSpecies, setActiveSpecies, messages, addMessage } = useChat();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleSend = async (text: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || loading || !activeSpecies) return;

    const userMessage = text.trim();
    setInput('');
    
    addMessage(activeSpecies, { role: 'user', content: userMessage });
    setLoading(true);

    try {
      const history = (messages[activeSpecies] || []).concat({ role: 'user', content: userMessage });
      
      const chatResponse = await productChat({
        species: activeSpecies,
        history: history.map(m => ({ role: m.role, content: m.content })),
        message: userMessage,
      });

      addMessage(activeSpecies, { 
        role: 'assistant', 
        content: chatResponse.response,
        recommendations: chatResponse.suggestedProducts
      });
    } catch (error) {
      addMessage(activeSpecies, { 
        role: 'assistant', 
        content: "Lo siento, tuve un pequeño problema técnico con mi radar animal. ¿Podrías repetirme eso?" 
      });
    } finally {
      setLoading(false);
    }
  };

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
    <Card className="fixed bottom-6 right-6 z-[100] w-[90vw] sm:w-[400px] h-[650px] flex flex-col overflow-hidden bg-white shadow-2xl rounded-[2.5rem] border-none animate-in slide-in-from-bottom-10 duration-500">
      {/* Header del Chat */}
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
              {activeExpert ? `${activeExpert.description}` : 'Guía MyDog'}
            </h3>
            <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mt-1">Venta Consultiva Experta</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Contenido Principal */}
      {!activeSpecies ? (
        <div className="flex-1 flex flex-col p-8 space-y-8 bg-[#F9FAFB]">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-black text-foreground tracking-tight">¿Quién necesita mi ayuda hoy?</h4>
            <p className="text-xs font-medium text-muted-foreground">Habla con un guía especializado en tu mascota.</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
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
      ) : (
        <>
          <ScrollArea className="flex-1 p-6 bg-[#F9FAFB]">
            <div className="space-y-6">
              {activeMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
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
                      {msg.recommendations.map((rec, idx) => (
                        <Link key={idx} href={`/catalogo/${rec.id}`} className="group">
                          <div className="bg-white p-3 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all shadow-md flex items-center gap-4 group-hover:-translate-y-1">
                            <div className="relative w-16 h-16 bg-muted rounded-2xl overflow-hidden shrink-0 border border-black/5">
                              <Image 
                                src={rec.image} 
                                alt={rec.name} 
                                fill 
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="text-[11px] font-black text-primary truncate uppercase tracking-tighter pr-2">{rec.name}</h5>
                                <Badge className="bg-secondary/20 text-primary border-none text-[8px] font-black uppercase shrink-0">Ver</Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground font-medium italic leading-tight line-clamp-2">{rec.reason}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Sugerencias de Botones Dinámicos */}
              {!loading && activeMessages.length === 1 && activeExpert && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeExpert.actions.map(action => (
                    <button
                      key={action}
                      onClick={() => handleSend(action)}
                      className="px-4 py-2 bg-white border border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex items-start gap-2">
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
                 onClick={() => setActiveSpecies(null)}
                 className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
               >
                 Elegir otra mascota
               </button>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">En línea</span>
               </div>
            </div>
            <form onSubmit={(e) => handleSend(input, e)} className="flex gap-2">
              <input 
                placeholder="Cuéntame de tu compañero..." 
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
