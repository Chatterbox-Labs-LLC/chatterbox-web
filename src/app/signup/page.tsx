"use client";

export const runtime = 'edge';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2, Check, X, ShieldCheck, Mail, User, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
});

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short").max(50, "First name is too long"),
  lastName: z.string().min(2, "Last name is too short").max(50, "Last name is too long"),
});

type SignupFormValues = z.infer<typeof signupSchema>;
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tempCredentials, setTempCredentials] = useState<SignupFormValues | null>(null);
  
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [mounted, setMounted] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSignupSubmit = async (data: SignupFormValues) => {
    setTempCredentials(data);
    setStep(2);
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!tempCredentials) {
      setError("Signup data missing. Please start over.");
      setStep(1);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: tempCredentials.email,
          password: tempCredentials.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON response:", text);
        throw new Error("The server returned an invalid response. Please try again later.");
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Github login failed");
    }
  };

  const handleResendEmail = async () => {
    if (!tempCredentials?.email) return;
    
    setResending(true);
    setResendStatus("idle");
    
    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempCredentials.email }),
      });
      
      if (!response.ok) throw new Error("Failed to resend");
      
      setResendStatus("success");
    } catch (err) {
      setResendStatus("error");
    } finally {
      setResending(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (success) {
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
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="space-y-4 pt-8 pb-6">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full ring-8 ring-primary/5 animate-pulse">
                <Mail className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
              <CardDescription className="text-base px-2 leading-relaxed">
                We've sent a verification link to<br />
                <span className="text-foreground font-semibold bg-muted px-1.5 py-0.5 rounded">{tempCredentials?.email}</span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800 text-sm text-muted-foreground shadow-inner">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Click the link in the email to verify your account</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>Check your <b>spam folder</b> if you don't see it</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span>The link will expire in 24 hours</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-12 text-sm font-medium transition-all hover:bg-zinc-50" 
                onClick={handleResendEmail}
                disabled={resending || resendStatus === "success"}
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending new link...
                  </>
                ) : resendStatus === "success" ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                    Verification email resent!
                  </>
                ) : (
                  "Didn't receive an email? Resend"
                )}
              </Button>
              
              {resendStatus === "error" && (
                <p className="text-xs text-destructive text-center font-medium animate-in fade-in slide-in-from-top-1">
                  Failed to resend email. Please try again in a few minutes.
                </p>
              )}

              <Button className="w-full h-12 font-semibold shadow-sm" variant="secondary" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="bg-black p-2 rounded-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-black">
                Chatterbox Teams
              </span>
            </Link>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {step === 1 ? "Create an account" : "Complete your profile"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 
                ? "Enter your details to join the community" 
                : "Tell us a bit more about yourself"}
            </CardDescription>
          </div>
        </CardHeader>

        {step === 1 ? (
          <>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={cn(
                        "pl-10 h-11 bg-white dark:bg-zinc-900 transition-all",
                        signupForm.formState.errors.email && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...signupForm.register("email")}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" title="Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character." className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className={cn(
                        "pl-10 h-11 bg-white dark:bg-zinc-900 transition-all",
                        signupForm.formState.errors.password && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...signupForm.register("password")}
                    />
                  </div>
                  
                  {signupForm.formState.errors.password && (
                    <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button 
                  className="w-full h-11 mt-4 font-semibold group" 
                  type="submit"
                  disabled={!signupForm.formState.isValid}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </form>

            <div className="px-6 pb-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-11 bg-white hover:bg-zinc-50 text-black border-zinc-200 transition-colors shadow-sm" 
                onClick={handleGithubLogin}
              >
                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                Continue with GitHub
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="John"
                      className={cn(
                        "pl-10 h-11 bg-white dark:bg-zinc-900 transition-all",
                        profileForm.formState.errors.firstName && "border-destructive focus-visible:ring-destructive"
                      )}
                      {...profileForm.register("firstName")}
                    />
                  </div>
                  {profileForm.formState.errors.firstName && (
                    <p className="text-xs font-medium text-destructive">{profileForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className={cn(
                      "h-11 bg-white dark:bg-zinc-900 transition-all",
                      profileForm.formState.errors.lastName && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...profileForm.register("lastName")}
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-xs font-medium text-destructive">{profileForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in zoom-in-95">
                  <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive font-medium leading-tight">{error}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button 
                className="w-full h-11 font-semibold" 
                type="submit"
                disabled={loading || !profileForm.formState.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Complete Sign Up"
                )}
              </Button>
              <Button variant="ghost" className="w-full h-11 text-muted-foreground hover:text-foreground" onClick={() => setStep(1)} disabled={loading}>
                Back to step 1
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <p className="mt-8 px-8 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms-of-service"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
