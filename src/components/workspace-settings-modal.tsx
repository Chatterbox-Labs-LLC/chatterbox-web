'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Loader2, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface WorkspaceSettingsModalProps {
  space: {
    id: string;
    name: string;
    description: string | null;
    slug: string;
  };
  onUpdate: () => void;
}

export default function WorkspaceSettingsModal({ space, onUpdate }: WorkspaceSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(space.name);
  const [description, setDescription] = useState(space.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdate = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('spaces')
        .update({
          name: name.trim(),
          description: description.trim(),
        })
        .eq('id', space.id);

      if (error) throw error;
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('[WorkspaceSettings] Error updating space:', error);
      alert('Failed to update workspace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workspace? This action cannot be undone and all data will be lost.')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', space.id);

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('[WorkspaceSettings] Error deleting space:', error);
      alert('Failed to delete workspace');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Workspace Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Workspace description"
              rows={3}
            />
          </div>
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h4>
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Workspace
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={isLoading || !name.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
