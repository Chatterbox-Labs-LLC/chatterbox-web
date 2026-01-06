"use client";
export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Rocket, Globe, Lock, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const createSpaceSchema = z.object({
  name: z.string().min(2, "Space name must be at least 2 characters").max(50, "Space name is too long"),
  slug: z.string()
    .min(2, "URL slug must be at least 2 characters")
    .max(50, "URL slug is too long")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
  description: z.string().max(200, "Description is too long").optional(),
});

type CreateSpaceFormValues = z.infer<typeof createSpaceSchema>;

export default function CreateSpacePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Ensure user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/create-space");
      }
    };
    checkUser();
  }, [supabase, router]);

  const form = useForm<CreateSpaceFormValues>({
    resolver: zodResolver(createSpaceSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Auto-generate slug from name
  const name = form.watch("name");
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [name, form]);

  const onSubmit = async (data: CreateSpaceFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("You must be logged in to create a space");

      // Generate a random 8-character invite code
      const generateInviteCode = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const { data: newSpace, error: insertError } = await supabase
        .from("spaces")
        .insert([
          {
            name: data.name,
            slug: data.slug,
            description: data.description,
            owner_id: user.id,
            invite_code: generateInviteCode(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          setError("This URL slug is already taken. Please try another one.");
        } else {
          throw insertError;
        }
        return;
      }

      // Redirect to the newly created space
      router.push(`/spaces/${newSpace.slug}`);
    } catch (err: any) {
      setError(err.message || "An error occurred while creating your space");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/dashboard" className="flex items-center gap-2 justify-center mb-4 transition-opacity hover:opacity-80">
          <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#a9d6f3] fill-[#a9d6f3]">
            <path d="M7.5 0L15 15H0L7.5 0Z" fill="currentColor" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-black dark:text-white">
            Chatterbox Teams
          </span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create a new space</h1>
        <p className="text-muted-foreground mt-2">Spaces are where your team communicates and collaborates.</p>
      </div>

      <Card className="w-full max-w-xl shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Space Details</CardTitle>
          <CardDescription>
            You can always change these settings later in your space settings.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">Space Name</Label>
              <Input
                id="name"
                placeholder="Acme Corp"
                className={cn(
                  "h-11 bg-white dark:bg-zinc-900 transition-all",
                  form.formState.errors.name && "border-destructive focus-visible:ring-destructive"
                )}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs font-medium text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug" className="text-sm font-medium">Space URL</Label>
              <div className="flex items-center group">
                <div className="flex items-center h-11 px-3 rounded-l-md border border-r-0 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-muted-foreground text-sm font-medium transition-colors group-focus-within:border-primary">
                  chatterbox.com/
                </div>
                <Input
                  id="slug"
                  placeholder="acme-corp"
                  className={cn(
                    "h-11 rounded-l-none bg-white dark:bg-zinc-900 transition-all",
                    form.formState.errors.slug && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...form.register("slug")}
                />
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5 ml-1">
                <Globe className="h-3 w-3" />
                This is your space's unique address.
              </p>
              {form.formState.errors.slug && (
                <p className="text-xs font-medium text-destructive">{form.formState.errors.slug.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description <span className="text-xs font-normal text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="description"
                placeholder="What is this space for?"
                className="min-h-[100px] bg-white dark:bg-zinc-900 transition-all resize-none"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-xs font-medium text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-3 animate-in fade-in zoom-in-95">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium leading-tight">{error}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 gap-4">
            <div className="flex items-center gap-3 w-full text-xs text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Lock className="h-4 w-4" />
              </div>
              <p>Your space is private by default. You can invite team members after it's created.</p>
            </div>
            
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1 h-12" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button 
                className="flex-[2] h-12 font-bold shadow-lg shadow-[#a9d6f3]/20 bg-[#a9d6f3] hover:bg-[#a9d6f3]/90 text-zinc-950 group" 
                type="submit"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Space...
                  </>
                ) : (
                  <>
                    Launch Space
                    <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-12 max-w-4xl w-full px-4" />
    </div>
  );
}
