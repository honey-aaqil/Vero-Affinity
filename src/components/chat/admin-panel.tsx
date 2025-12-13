'use client';

import type { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ShieldAlert, UserX } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPurge: () => void;
}

const mockUsers = [
  { id: '1', name: 'Operator', role: 'Admin' },
  { id: '2', name: 'Asset-7', role: 'User' },
  { id: '3', name: 'Observer', role: 'Read-only' },
];

const AdminPanel: FC<AdminPanelProps> = ({ isOpen, onClose, onPurge }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card/90 backdrop-blur-lg border-destructive shadow-lg shadow-destructive/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert /> Root Administration Panel
          </DialogTitle>
          <DialogDescription>
            High-level controls. Actions taken here are irreversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <h3 className="mb-2 font-semibold">User Management</h3>
          <div className="space-y-2">
            {mockUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <UserX className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <h3 className="mb-2 font-semibold text-destructive">Amnesia Protocol</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This will permanently delete all conversation history for all users. This action cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">PURGE ALL DATA</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all messages. This data will be gone forever.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onPurge} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  Yes, Purge Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close Panel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
