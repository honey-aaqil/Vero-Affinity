'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';

interface MessageListProps {
  messages: Message[];
  currentUser: string;
}

const MessageList: FC<MessageListProps> = ({ messages, currentUser }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full" viewportRef={scrollAreaRef}>
      <div className="p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.sender === 'You';
          return (
            <div
              key={message.id}
              className={cn('flex items-end gap-2', isSender ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg',
                  isSender
                    ? 'bg-secondary text-secondary-foreground rounded-br-none'
                    : 'bg-card text-card-foreground rounded-bl-none'
                )}
              >
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
                    "text-xs mt-1",
                    isSender ? "text-muted-foreground/70 text-right" : "text-muted-foreground/70"
                )}>
                  {format(message.timestamp, 'p')}
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
