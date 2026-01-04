'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AuthCodeError() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleAuthHash = async () => {
      // Give the client a moment to parse the hash if it's still doing so
      await new Promise(resolve => setTimeout(resolve, 500));

      // Supabase sometimes puts the session in the URL hash (#access_token=...)
      // instead of query parameters. This happens with certain email link configurations.
      const hash = window.location.hash;
      console.log('[AuthCodeError] Hash detected:', hash);

      if (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) {
        try {
          console.log('[AuthCodeError] Attempting to get session from hash...');
          const { data, error } = await supabase.auth.getSession();
          let session = data.session;
          
          if (error) {
            console.error('[AuthCodeError] getSession error:', error);
          }
          
          // Manual hash parsing if getSession failed
          if (!session && hash.includes('access_token=')) {
            console.log('[AuthCodeError] No session from getSession, trying manual hash parse...');
            const params = new URLSearchParams(hash.substring(1)); // remove #
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            
            if (accessToken && refreshToken) {
              console.log('[AuthCodeError] Found tokens in hash, setting session manually...');
              const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (setSessionError) {
                console.error('[AuthCodeError] Manual setSession error:', setSessionError);
              } else {
                session = setSessionData.session;
                console.log('[AuthCodeError] Manual setSession successful');
              }
            }
          }
          
          if (session) {
            const isRecovery = hash.includes('type=recovery') || window.location.href.includes('type=recovery');
            console.log('[AuthCodeError] Session found!', { 
              user: session.user.email,
              isRecovery 
            });
            
            if (isRecovery) {
              console.log('[AuthCodeError] Redirecting to /reset-password');
              router.replace('/reset-password');
            } else {
              console.log('[AuthCodeError] Redirecting to /dashboard/welcome');
              router.replace('/dashboard/welcome');
            }
            return;
          } else {
            console.warn('[AuthCodeError] No session found in hash after getSession call.');
          }
        } catch (err: any) {
          console.error('[AuthCodeError] Hash verification unexpected error:', err);
          setError(err.message || 'Failed to verify session from URL.');
        }
      } else {
        console.warn('[AuthCodeError] No access_token or recovery type found in hash.');
        setError('The verification link is invalid or has expired.');
      }
      setIsVerifying(false);
    };

    handleAuthHash();
  }, [router, supabase.auth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-black p-2 rounded-xl">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-black">
            Chatterbox Teams
          </span>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="h-2 bg-destructive w-full" />
        <CardHeader className="space-y-4 pt-8 pb-6 text-center">
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-4 rounded-full">
              {isVerifying ? (
                <Loader2 className="h-10 w-10 text-destructive animate-spin" />
              ) : (
                <AlertCircle className="h-10 w-10 text-destructive" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isVerifying ? 'Verifying your session...' : 'Verification Error'}
            </CardTitle>
            <CardDescription className="text-base px-2 leading-relaxed">
              {isVerifying 
                ? 'Please wait while we check your credentials.' 
                : error}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {!isVerifying && (
            <div className="space-y-3">
              <Button className="w-full h-12 font-semibold shadow-sm group" asChild>
                <Link href="/signup">
                  Try Signing Up Again
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          )}
          
          {isVerifying && (
            <p className="text-center text-sm text-muted-foreground animate-pulse">
              Checking for valid session tokens...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
