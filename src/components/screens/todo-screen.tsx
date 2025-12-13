'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ListTodo, Plus, Trash2 } from 'lucide-react';
import { useLongPress } from '@/hooks/use-long-press';
import { useSwipe } from '@/hooks/use-swipe';
import type { Todo } from '@/lib/types';

interface TodoScreenProps {
  onUnlock: (username: string) => void;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const initialTodos: Todo[] = [
  { id: '1', text: 'Finalize quarterly report', completed: false },
  { id: '2', text: 'Book flight to Tokyo', completed: false },
  { id: '3', text: 'Call plumber about leaky faucet', completed: true },
];

const TodoScreen: FC<TodoScreenProps> = ({ onUnlock }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUnlock(values.username);
  }

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([{ id: Date.now().toString(), text: newTodo, completed: false }, ...todos]);
      setNewTodo('');
    }
  };
  
  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const openDialog = () => setIsDialogOpen(true);
  const longPressEvents = useLongPress(openDialog);
  const swipeEvents = useSwipe({ onSwipeRight: openDialog });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border">
        <CardHeader className="text-center">
          <div {...longPressEvents} className="inline-block mx-auto cursor-pointer">
            <div className="flex items-center justify-center gap-2">
              <ListTodo className="text-primary" />
              <CardTitle className="font-headline text-foreground">Daily Tasks</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              placeholder="Add a new task..."
              className="bg-background/50 backdrop-blur-sm focus:shadow-glow"
            />
            <Button onClick={handleAddTodo} className="shadow-glow">Add</Button>
          </div>
          <div className="space-y-2">
            {todos.map(todo => (
              <div
                key={todo.id}
                {...swipeEvents}
                className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-secondary/50"
              >
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-grow text-sm ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {todo.text}
                </label>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTodo(todo.id)} className="w-8 h-8">
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={openDialog}
        variant="ghost"
        size="icon"
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-glow hover:bg-primary/90"
      >
        <Plus className="w-8 h-8" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-lg border-border">
          <DialogHeader>
            <DialogTitle>Create Identity</DialogTitle>
            <DialogDescription>
              Enter a username to begin a secure session.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="affinity_user" {...field} className="bg-background/50 backdrop-blur-sm focus:shadow-glow"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full shadow-glow">Create</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoScreen;
