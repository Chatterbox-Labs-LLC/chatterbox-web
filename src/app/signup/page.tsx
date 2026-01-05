"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Sparkles, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tempCredentials, setTempCredentials] = useState<SignupFormValues | null>(null);
  
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

      const result = await response.json();

      if (!response.ok) {
        console.error("Signup API Error:", result);
        throw new Error(result.error || "Failed to sign up");
      }

      // If we got a success but there was an email error, we should still proceed
      // but maybe show a message on the verify page.
      router.push(`/verify?email=${encodeURIComponent(tempCredentials.email)}${result.data?.emailError ? '&emailError=true' : ''}`);
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
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/welcome`,
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-4">
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
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      {...signupForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </motion.div>
                )}
                <Button className="w-full" type="submit" disabled={!signupForm.formState.isValid || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Continue"
                  )}
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

              <Button variant="outline" className="w-full" onClick={handleGithubLogin}>
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...profileForm.register("firstName")}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{profileForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...profileForm.register("lastName")}
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{profileForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
              <Button className="w-full" type="submit" disabled={loading || !profileForm.formState.isValid}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Complete Signup"
                )}
              </Button>
            </CardContent>
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
