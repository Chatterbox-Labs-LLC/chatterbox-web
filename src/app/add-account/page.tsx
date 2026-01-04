"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Loader2, Mail, ArrowLeft, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const addAccountSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type AddAccountFormValues = z.infer<typeof addAccountSchema>;

export const runtime = "edge";

export default function AddAccountPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AddAccountFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Sign in with the new account
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="bg-blue-500 p-2 rounded-xl">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="w-8" /> {/* Spacer */}
          </div>
          <div className="text-center space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">Add an Account</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              Sign in with another account to switch between them
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500 font-medium">{form.formState.errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Account...
                </>
              ) : (
                "Add Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline font-medium">
              Create one
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
