export type Message = {
  id: string;
  text: string;
  sender: string; // 'You' or other username
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
};

export interface ChatMessage {
  id: string;
  senderId: string;
  senderAlias: string;
  text: string;
  ciphertext?: string;
  plaintext?: string;
  type: 'text' | 'image' | 'voice';
  createdAt: Date;
  mediaId?: string;
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};
