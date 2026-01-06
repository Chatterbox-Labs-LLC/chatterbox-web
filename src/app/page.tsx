import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased overflow-hidden">
      <header className="px-6 lg:px-12 h-16 flex items-center justify-between border-b border-zinc-100 bg-white z-50">
        <Link className="flex items-center group" href="/">
          <div className="flex items-center font-bold text-xl tracking-tight">
            <span className="text-zinc-950 mr-1.5">chatter</span>
            <div className="bg-zinc-950 text-white px-2.5 py-1 rounded-lg">
              box teams
            </div>
          </div>
        </Link>
        <div className="flex gap-6 items-center">
          <Link className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" href="/login">
            Log In
          </Link>
          <Link className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors" href="/signup">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-zinc-950 mb-6">
            Chat for teams.
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl mb-10 font-normal">
            The simplest way to communicate. Fast, secure, and clear.
          </p>
          
          <div className="flex gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-medium rounded-md bg-zinc-950 hover:bg-zinc-800 text-white transition-all active:scale-[0.98]" asChild>
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="h-16 px-6 flex items-center justify-center border-t border-zinc-100">
        <p className="text-zinc-400 text-xs font-normal">
          &copy; {new Date().getFullYear()} Chatterbox Teams.
        </p>
      </footer>
    </div>
  );
}
