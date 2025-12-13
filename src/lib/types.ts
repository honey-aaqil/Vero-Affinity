export type Message = {
  id: string;
  text: string;
  sender: string; // 'You' or other username
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
};

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};
