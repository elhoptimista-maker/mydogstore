
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductChatOutput } from '@/ai/flows/intelligent-product-assistant';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: ProductChatOutput['suggestedProducts'];
}

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSpecies: string | null;
  setActiveSpecies: (species: string | null) => void;
  messages: Record<string, Message[]>;
  addMessage: (species: string, message: Message) => void;
  toggleChat: (species?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSpecies, setActiveSpecies] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  const addMessage = (species: string, message: Message) => {
    setMessages(prev => ({
      ...prev,
      [species]: [...(prev[species] || []), message]
    }));
  };

  const toggleChat = (species?: string) => {
    if (species) {
      setActiveSpecies(species);
      setIsOpen(true);
    } else {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      isOpen, 
      setIsOpen, 
      activeSpecies, 
      setActiveSpecies, 
      messages, 
      addMessage,
      toggleChat 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
