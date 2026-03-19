
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, Send, MessageSquare, Briefcase, X, ChevronDown, MessageCircle } from 'lucide-react';
import { productChat } from '@/ai/flows/intelligent-product-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const EXPERTS = [
  { name: 'Perro', emoji: '🐶', color: 'bg-primary' },
  { name: 'Gato', emoji: '🐱', color: 'bg-orange-500' },
  { name: 'Aves', emoji: '🦜', color: 'bg-green-500' },
  { name: 'Conejo y Roedor', emoji: '🐰', color: 'bg-blue-500' },
  { name: 'Peces y Tortugas', emoji: '🐠', color: 'bg-cyan-500' },
];

export default function ProductAssistant() {
  const { isOpen, setIsOpen, activeSpecies, setActiveSpecies, messages, addMessage } = useChat();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeMessages = activeSpecies ? messages[activeSpecies] || [] : [];
  const activeExpert = EXPERTS.find(e => e.name === activeSpecies);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages, loading, isOpen]);

  // Mensaje inicial si no hay historial
  useEffect(() => {
    if (activeSpecies && (!messages[activeSpecies] || messages[activeSpecies].length === 0)) {
      addMessage(activeSpecies, {
        role: 'assistant',
        content: `¡Hola! 🐾 Soy tu experto en ${activeSpecies}. Para recomendarte lo mejor, cuéntame: ¿Tu peludo es cachorro, adulto o senior?`
      });
    }
  }, [activeSpecies]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading || !activeSpecies) return;

    const userMessage = input.trim();
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
        content: "Lo siento, tuve un pequeño problema técnico. ¿Podrías repetirme eso?" 
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
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-primary font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-primary/10">
          ¿Necesitas ayuda? 🐾
        </div>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-[100] w-[90vw] sm:w-[400px] h-[600px] flex flex-col overflow-hidden bg-white shadow-2xl rounded-[2.5rem] border-none animate-in slide-in-from-bottom-10 duration-500">
      {/* Header del Chat */}
      <div className={cn(
        "p-6 text-white flex items-center justify-between shrink-0 shadow-lg relative z-10 transition-colors duration-500",
        activeExpert ? activeExpert.color : "bg-primary"
      )}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
            <span className="text-3xl">{activeExpert?.emoji || '💬'}</span>
          </div>
          <div>
            <h3 className="text-xl font-black leading-none tracking-tight">
              {activeExpert ? `Experto ${activeSpecies}` : 'Asistente MyDog'}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">En línea</p>
            </div>
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
            <h4 className="text-lg font-black text-foreground leading-tight">¿Con quién te gustaría hablar hoy?</h4>
            <p className="text-xs font-medium text-muted-foreground">Selecciona un experto para comenzar tu asesoría personalizada.</p>
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
                  <span className="block text-sm font-black text-foreground uppercase tracking-widest leading-none mb-1">{expert.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-60">Especialista Nutricional</span>
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
                    <div className="grid grid-cols-1 gap-3 w-full max-w-[95%] mt-2">
                      <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest pl-2">Sugerencias recomendadas:</p>
                      {msg.recommendations.map((rec, idx) => (
                        <Link key={idx} href={`/catalogo/${rec.id}`} className="group">
                          <div className="bg-white p-4 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-primary">
                                <Briefcase className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="text-xs font-black text-primary group-hover:underline truncate">{rec.name}</h5>
                                <p className="text-[10px] text-muted-foreground italic line-clamp-1">{rec.reason}</p>
                              </div>
                            </div>
                            <Badge className="bg-secondary/20 text-primary border-none text-[8px] font-black uppercase shrink-0">Ver</Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-black/5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Pensando...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-white border-t border-black/5">
            <div className="flex items-center justify-between mb-3">
               <button 
                 onClick={() => setActiveSpecies(null)}
                 className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
               >
                 <ChevronDown className="w-3 h-3 rotate-90" /> Cambiar Experto
               </button>
               <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Chat Activo</span>
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                placeholder="Escribe aquí tu duda..." 
                className="flex-1 h-12 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary/20 font-bold text-sm"
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
