"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  MapPin, 
  Globe, 
  Building2, 
  GraduationCap, 
  Calendar,
  ArrowLeft,
  Mail,
  User
} from 'lucide-react';
import { format } from 'date-fns';


export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const fullname = decodeURIComponent(params.fullname as string);
  
  const [profile, setProfile] = useState<any>(null);
  const [space, setSpace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        // 1. Fetch Space info
        const { data: spaceData } = await supabase
          .from('spaces')
          .select('*')
          .eq('slug', slug)
          .single();
        setSpace(spaceData);

        // 2. Fetch Profile by full_name
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('full_name', fullname)
          .single();

        if (error) throw error;
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug && fullname) {
      loadProfile();
    }
  }, [slug, fullname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#a9d6f3]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground mb-4">We couldn't find a user with the name "{fullname}" in this space.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {space?.name || 'Space'}
        </Button>

        <Card className="overflow-hidden border-none shadow-lg">
          <div className="h-32 bg-gradient-to-r from-[#a9d6f3] to-[#a9d6f3]/80" />
          <CardContent className="relative pt-0 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 px-2">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-zinc-950 shadow-xl">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="text-4xl bg-zinc-100 text-zinc-600">
                  {profile.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">{profile.full_name}</h1>
                  {profile.status_emoji && (
                    <span className="text-2xl" title={profile.status_text}>{profile.status_emoji}</span>
                  )}
                </div>
                {profile.status_text && (
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    {profile.status_text}
                  </p>
                )}
              </div>
              <div className="flex gap-2 mb-2">
                <Button className="rounded-full px-6 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">About</h3>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {profile.bio || "No biography provided."}
                  </p>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.organization && (
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <Building2 className="h-5 w-5 text-zinc-400" />
                      <span>{profile.organization}</span>
                    </div>
                  )}
                  {profile.school && (
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <GraduationCap className="h-5 w-5 text-zinc-400" />
                      <span>{profile.school}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <MapPin className="h-5 w-5 text-zinc-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.country && (
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                      <Globe className="h-5 w-5 text-zinc-400" />
                      <span>{profile.country}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {profile.website && (
                      <a 
                        href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#a9d6f3] hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="text-sm truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">Member Since</h3>
                  <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {profile.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'Unknown'}
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
