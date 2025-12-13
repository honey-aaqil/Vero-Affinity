'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MessageList from '@/components/chat/message-list';
import MessageInput from '@/components/chat/message-input';
import AdminPanel from '@/components/chat/admin-panel';
import { useTripleTap } from '@/hooks/use-triple-tap';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '@/lib/types';
import { Bot } from 'lucide-react';
import Image from 'next/image';

interface ChatScreenProps {
  username: string;
}

const initialMessages: Message[] = [
  { id: '1', text: "Hey, are you there?", sender: 'Operator', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: '2', text: "Yes. System is online. All clear.", sender: 'You', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
  { id: '3', text: "Good. The package is scheduled for delivery at 0400.", sender: 'Operator', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
  { id: '4', text: "Understood. I'll be ready.", sender: 'You', type: 'text', timestamp: new Date(Date.now() - 1000 * 60 * 1) },
];


const ChatScreen: FC<ChatScreenProps> = ({ username }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  
  const addMessage = (text: string, type: 'text' | 'image' | 'voice' = 'text') => {
    if (text.trim() === '/root-admin') {
      setIsAdminPanelOpen(true);
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'You',
      type,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  const handlePurge = () => {
    setMessages([]);
    setIsAdminPanelOpen(false);
  };
  
  const logoTapEvents = useTripleTap(() => setIsAdminPanelOpen(true));

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center gap-2 cursor-pointer" {...logoTapEvents}>
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold font-headline text-primary">Vero Affinity</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{username}</span>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUser={username} />
      </main>
      
      <footer className="p-3 border-t border-border bg-background/80 backdrop-blur-lg">
        <MessageInput onSendMessage={addMessage} />
      </footer>

      <AdminPanel 
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onPurge={handlePurge}
      />
    </div>
  );
};

export default ChatScreen;
