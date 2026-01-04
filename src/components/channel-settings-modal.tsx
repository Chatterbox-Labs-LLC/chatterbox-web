'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ChannelSettingsModalProps {
  channel: {
    id: string;
    name: string;
    description: string | null;
  };
  onChannelUpdated?: () => void;
  onChannelDeleted?: () => void;
}

export default function ChannelSettingsModal({ channel, onChannelUpdated, onChannelDeleted }: ChannelSettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setName(channel.name);
      setDescription(channel.description || '');
      setShowDeleteConfirm(false);
    }
  }, [open, channel]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    try {
      const { error } = await supabase
        .from('channels')
        .update({
          name: name.trim(),
          slug,
          description: description.trim(),
        })
        .eq('id', channel.id);

      if (error) throw error;

      setOpen(false);
      if (onChannelUpdated) onChannelUpdated();
      router.refresh();
    } catch (error) {
      console.error('[UpdateChannel] Error:', error);
      alert('Failed to update channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channel.id);

      if (error) throw error;

      setOpen(false);
      if (onChannelDeleted) onChannelDeleted();
      router.refresh();
    } catch (error) {
      console.error('[DeleteChannel] Error:', error);
      alert('Failed to delete channel. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Channel Settings</DialogTitle>
          <DialogDescription>
            Update channel details or delete the channel.
          </DialogDescription>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Channel Name</Label>
              <Input 
                id="edit-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                placeholder="What is this channel about?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center pt-4">
              <Button 
                type="button" 
                variant="destructive" 
                className="gap-2"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Channel
              </Button>
              <DialogFooter>
                <Button type="submit" disabled={isLoading || !name.trim() || (name === channel.name && description === (channel.description || ''))}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </div>
          </form>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">
                This action is permanent and will delete all messages in this channel.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Permanently Delete'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
