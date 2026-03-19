"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, Send, MessageSquare, Briefcase } from 'lucide-react';
import { productChat, type ProductChatOutput } from '@/ai/flows/intelligent-product-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: ProductChatOutput['suggestedProducts'];
}

interface ProductAssistantProps {
  species: string;
  emoji: string;
}

export default function ProductAssistant({ species, emoji }: ProductAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `¡Hola! 🐾 Soy tu experto en ${species}. Para recomendarte lo mejor, cuéntame: ¿Tu peludo es cachorro, adulto o senior?` 
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const chatResponse = await productChat({
        species,
        history: newMessages.map(m => ({ role: m.role, content: m.content })),
        message: userMessage,
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: chatResponse.response,
        recommendations: chatResponse.suggestedProducts
      }]);
    } catch (error) {
      console.error('Error en chat IA:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Lo siento, tuve un pequeño problema técnico. ¿Podrías repetirme eso?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[600px] flex flex-col overflow-hidden bg-white">
      {/* Header del Chat */}
      <div className="bg-primary p-6 text-white flex items-center justify-between shrink-0 shadow-lg relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <span className="text-3xl">{emoji}</span>
          </div>
          <div>
            <h3 className="text-xl font-black leading-none tracking-tight">Experto MyDog</h3>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Especialista en {species}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest opacity-60">En línea</span>
        </div>
      </div>

      {/* Área de Mensajes */}
      <ScrollArea className="flex-1 p-6 bg-[#F9FAFB]">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
              <div 
                className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-foreground border border-black/5 rounded-tl-none'
                }`}
              >
                {msg.content}
              </div>

              {/* Recomendaciones de Productos */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="grid grid-cols-1 gap-3 w-full max-w-[90%] mt-2">
                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest pl-2">Sugerencias del experto:</p>
                  {msg.recommendations.map((rec, idx) => (
                    <Link key={idx} href={`/catalogo/${rec.id}`} className="group">
                      <div className="bg-white p-4 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-primary">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-primary group-hover:underline">{rec.name}</h5>
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
            <div className="flex items-start gap-2 animate-pulse">
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

      {/* Input de Chat */}
      <div className="p-4 bg-white border-t border-black/5">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            placeholder="Escribe aquí tu duda..." 
            className="flex-1 h-14 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary/20 font-bold text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || loading}
            className="h-14 w-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all shrink-0"
          >
            <Send className="w-6 h-6" />
          </Button>
        </form>
        <p className="text-center text-[8px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-3">
          Asistente IA MyDog v2.0 • Especialista Nutricional
        </p>
      </div>
    </div>
  );
}
