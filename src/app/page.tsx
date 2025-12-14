'use client';

import { useState, useEffect } from 'react';
import ChatScreen from '@/components/screens/chat-screen';
import TodoScreen from '@/components/screens/todo-screen';

export default function Home() {
  const [authState, setAuthState] = useState<{ 
    loading: boolean; 
    authenticated: boolean; 
    username: string | null 
  }>({
    loading: true,
    authenticated: false,
    username: null,
  });

  const handleUnlock = (username: string) => {
    setAuthState({ 
      loading: false, 
      authenticated: true, 
      username 
    });
  };

  // Check authentication on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Skip if we've already checked auth in this session
        const hasChecked = sessionStorage.getItem('vero-affinity-auth-checked');
        if (hasChecked) {
          setAuthState({ loading: false, authenticated: false, username: null });
          return;
        }

        const response = await fetch('/api/auth/me');
        
        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setAuthState({ 
              loading: false, 
              authenticated: true, 
              username: data.user.username 
            });
            return;
          }
        }

        // No valid auth found
        setAuthState({ loading: false, authenticated: false, username: null });
        sessionStorage.setItem('vero-affinity-auth-checked', 'true');
        
      } catch (error) {
        console.warn('Auth check failed:', error);
        if (isMounted) {
          setAuthState({ loading: false, authenticated: false, username: null });
          sessionStorage.setItem('vero-affinity-auth-checked', 'true');
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (authState.authenticated && authState.username) {
    return <ChatScreen username={authState.username} />;
  }

  return <TodoScreen onUnlock={handleUnlock} />;
}
