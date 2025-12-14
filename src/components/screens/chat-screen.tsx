'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import MessageList from '@/components/chat/message-list';
import MessageInput from '@/components/chat/message-input';
import AdminPanel from '@/components/chat/admin-panel';
import { useTripleTap } from '@/hooks/use-triple-tap';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage } from '@/lib/types';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatScreenProps {
  username: string;
}

const ChatScreen: FC<ChatScreenProps> = ({ username }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const { toast } = useToast();
  
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/chats', {
        headers: {
          'X-User-Username': username,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages.map((msg: ChatMessage) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [username, toast]);
  
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  const addMessage = async (text: string, type: 'text' | 'image' | 'voice' = 'text') => {
    if (text.trim() === '/root-admin') {
      setIsAdminPanelOpen(true);
      return;
    }
    
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: 'temp',
      senderAlias: username,
      text,
      type,
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Username': username,
        },
        body: JSON.stringify({ text, type }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      const serverMessage: ChatMessage = {
        ...data.message,
        createdAt: new Date(data.message.createdAt),
      };
      
      setMessages(prev => 
        prev.map(msg => msg.id === optimisticMessage.id ? serverMessage : msg)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handlePurge = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'DELETE',
        headers: {
          'X-User-Username': username,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to purge messages');
      }
      
      setMessages([]);
      setIsAdminPanelOpen(false);
      toast({
        title: 'Success',
        description: 'All messages have been purged.',
      });
    } catch (error) {
      console.error('Error purging messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to purge messages.',
        variant: 'destructive',
      });
    }
  };
  
  const logoTapEvents = useTripleTap(() => setIsAdminPanelOpen(true));

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-border bg-background/80 backdrop-blur-lg shadow-lg">
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
        <MessageList messages={messages} currentUser={username} loading={loading} />
      </main>
      
      <footer className="p-3 border-t border-border bg-background/80 backdrop-blur-lg shadow-lg">
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
