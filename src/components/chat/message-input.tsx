'use client';

import type { FC } from 'react';
import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Paperclip, Mic, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MessageInputProps {
  onSendMessage: (text: string, type: 'text' | 'image' | 'voice') => void;
}

const MessageInput: FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text, 'text');
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
      if (randomImage) {
        onSendMessage(randomImage.imageUrl, 'image');
      } else {
        // Fallback if placeholder images are not available
        onSendMessage('https://picsum.photos/seed/fallback/400/300', 'image');
      }
      toast({
        title: "Image Selected",
        description: "Image attached. Not uploaded for privacy.",
      });
    }
  };

  const handleVoiceClick = () => {
    toast({
        title: "Voice Notes",
        description: "Voice recording is not yet implemented.",
        variant: "default",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 resize-none bg-card/80 backdrop-blur-md focus:ring-2 focus:ring-accent/50 focus:shadow-glow min-h-0 transition-all"
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button variant="ghost" size="icon" onClick={handleAttachClick} className="hover:text-accent transition-colors">
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleVoiceClick} className="hover:text-accent transition-colors">
        <Mic className="w-5 h-5" />
      </Button>
      <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90 shadow-glow transition-all">
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MessageInput;
