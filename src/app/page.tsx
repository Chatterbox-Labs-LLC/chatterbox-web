import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-zinc-200 selection:text-black font-sans antialiased">
      <header className="px-12 h-24 flex items-center justify-between">
        <Link className="flex items-center group" href="/">
          <div className="flex items-center font-bold text-xl tracking-tight">
            <span className="text-zinc-950 mr-1.5">chatter</span>
            <div className="bg-[#a9d6f3] text-white px-2.5 py-1 rounded-lg text-sm shadow-sm">
              box teams
            </div>
          </div>
        </Link>
        <nav className="flex gap-8 items-center">
          <Link className="text-sm font-medium text-zinc-400 hover:text-zinc-950 transition-colors" href="/login">
            Log In
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-zinc-950 transition-colors" href="/signup">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl space-y-4 mb-12">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-950">
            Chat for teams.
          </h1>
          <p className="text-zinc-500 text-xl font-medium">
            The simplest way to communicate. Fast, secure, and clear.
          </p>
          <div className="pt-8">
            <Button size="lg" className="h-12 px-8 text-base font-medium rounded-lg bg-zinc-950 hover:bg-zinc-900 text-white transition-all" asChild>
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="h-24 px-12 flex items-center justify-center">
        <p className="text-zinc-400 text-xs font-medium">
          &copy; 2026 Chatterbox Teams.
        </p>
      </footer>
    </div>
  );
}
