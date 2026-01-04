'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setSettings(data);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      theme: formData.get('theme'),
      emailNotifications: formData.get('emailNotifications') === 'on',
      desktopNotifications: formData.get('desktopNotifications') === 'on',
      compactMode: formData.get('compactMode') === 'on',
      language: formData.get('language'),
      timezone: formData.get('timezone'),
    };

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">App Settings</h2>
          <p className="text-muted-foreground text-lg">Customize your Chatterbox Teams experience.</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4" />
            Saved successfully
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl">Notifications</CardTitle>
            <CardDescription>Configure how you receive updates and alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your spaces via email.</p>
              </div>
              <input 
                type="checkbox" 
                name="emailNotifications"
                className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" 
                defaultChecked={settings?.email_notifications ?? true} 
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <Label className="text-base">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show alerts on your desktop for new messages.</p>
              </div>
              <input 
                type="checkbox" 
                name="desktopNotifications"
                className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" 
                defaultChecked={settings?.desktop_notifications ?? true} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl">Appearance</CardTitle>
            <CardDescription>Change the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              <Label className="text-base">Theme</Label>
              <select 
                name="theme"
                className="flex h-11 w-full sm:w-[240px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950" 
                defaultValue={settings?.theme || 'system'}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Preference</option>
              </select>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <Label className="text-base">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Show more messages at once by reducing spacing.</p>
              </div>
              <input 
                type="checkbox" 
                name="compactMode"
                className="h-5 w-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" 
                defaultChecked={settings?.compact_mode ?? false} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl">Language & Region</CardTitle>
            <CardDescription>Set your preferred language and time zone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label className="text-base">Language</Label>
                <select 
                  name="language"
                  className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950" 
                  defaultValue={settings?.language || 'en'}
                >
                  <option value="en">English (US)</option>
                  <option value="en-gb">English (UK)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
              <div className="grid gap-3">
                <Label className="text-base">Timezone</Label>
                <select 
                  name="timezone"
                  className="flex h-11 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950" 
                  defaultValue={settings?.timezone || 'UTC'}
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Paris (CET/CEST)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="outline" className="px-8 h-11">Reset to Defaults</Button>
          <Button type="submit" disabled={saving} className="px-8 h-11 bg-blue-600 hover:bg-blue-700">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Settings
          </Button>
        </div>
      </div>
    </form>
  );
}
