'use client';

import { useState } from 'react';
import ChatScreen from '@/components/screens/chat-screen';
import TodoScreen from '@/components/screens/todo-screen';

export default function Home() {
  const [unlockedState, setUnlockedState] = useState<{ unlocked: boolean; username: string | null }>({
    unlocked: false,
    username: null,
  });

  const handleUnlock = (username: string) => {
    // Persist unlocked state for the session
    try {
      sessionStorage.setItem('vero-affinity-unlocked', 'true');
      sessionStorage.setItem('vero-affinity-username', username);
    } catch (error) {
      console.warn("Could not save to session storage:", error);
    }
    setUnlockedState({ unlocked: true, username });
  };
  
  // Check session storage on initial render
  useState(() => {
    try {
      const isUnlocked = sessionStorage.getItem('vero-affinity-unlocked') === 'true';
      const savedUsername = sessionStorage.getItem('vero-affinity-username');
      if (isUnlocked && savedUsername) {
        setUnlockedState({ unlocked: true, username: savedUsername });
      }
    } catch (error) {
      console.warn("Could not read from session storage:", error);
    }
  });

  if (unlockedState.unlocked && unlockedState.username) {
    return <ChatScreen username={unlockedState.username} />;
  }

  return <TodoScreen onUnlock={handleUnlock} />;
}
