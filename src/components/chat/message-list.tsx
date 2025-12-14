'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageListProps {
  messages: ChatMessage[];
  currentUser: string;
  loading?: boolean;
}

const MessageList: FC<MessageListProps> = ({ messages, currentUser, loading = false }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages yet. Start the conversation.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" viewportRef={scrollAreaRef}>
      <div className="p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderAlias === currentUser;
          const isAdmin = message.senderAlias === 'Operator' || message.senderAlias.includes('Admin');
          
          return (
            <div
              key={message.id}
              className={cn('flex items-end gap-2', isSender ? 'justify-end' : 'justify-start')}
            >
              {!isSender && (
                <Avatar className={cn("w-8 h-8 flex-shrink-0", isAdmin && "ring-2 ring-destructive")}>
                  <AvatarFallback className={cn(isAdmin && "bg-destructive/20 text-destructive")}>
                    {message.senderAlias.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg backdrop-blur-sm',
                  isSender
                    ? 'bg-secondary/90 text-secondary-foreground rounded-br-none shadow-glow'
                    : 'bg-card/90 text-card-foreground rounded-bl-none'
                )}
              >
                {!isSender && (
                  <p className={cn("text-xs font-semibold mb-1", isAdmin && "text-destructive")}>
                    {message.senderAlias}
                  </p>
                )}
                {message.type === 'image' ? (
                  <Image
                    src={message.text}
                    alt="Shared image"
                    width={300}
                    height={200}
                    className="rounded-md"
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                )}
                <p className={cn(
                    "text-xs mt-1 opacity-70",
                    isSender ? "text-right" : ""
                )}>
                  {format(message.createdAt, 'p')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
