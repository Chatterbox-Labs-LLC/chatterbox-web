'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateChannelModalProps {
  spaceId: string;
  onChannelCreated?: () => void;
}

export default function CreateChannelModal({ spaceId, onChannelCreated }: CreateChannelModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    try {
      const { error } = await supabase
        .from('channels')
        .insert({
          name: name.trim(),
          slug,
          description: description.trim(),
          space_id: spaceId,
        });

      if (error) throw error;

      setName('');
      setDescription('');
      setOpen(false);
      if (onChannelCreated) onChannelCreated();
      router.refresh();
    } catch (error) {
      console.error('[CreateChannel] Error:', error);
      alert('Failed to create channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4 text-zinc-400 hover:text-zinc-900">
          <Plus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. marketing" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              placeholder="What is this channel about?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? 'Creating...' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
