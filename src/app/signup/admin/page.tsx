import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminSignupPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-zinc-200 rounded-sm overflow-hidden shadow-xl">
        {/* Left Side: Info */}
        <div className="bg-primary p-12 text-white flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm mb-8">
              <span className="text-primary font-bold text-xl">K</span>
            </div>
            <h1 className="text-3xl font-bold mb-6">Start your 14-day free trial</h1>
            <p className="text-primary-foreground/80 mb-8">
              Join 500+ organizations building better internal cultures with Keystone.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-white" />
                Unlimited workspace members
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-white" />
                Advanced roles & permissions
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={18} className="text-white" />
                Custom request workflows
              </li>
            </ul>
          </div>
          
          <div className="text-xs text-primary-foreground/60">
            Trusted by teams at Acme Corp, GlobalTech, and more.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Admin Registration</h2>
            <p className="text-zinc-500 text-sm">Create your personal administrator account.</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">First Name</label>
                <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm" placeholder="John" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Last Name</label>
                <input type="text" className="w-full px-3 py-2 border border-zinc-200 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Work Email</label>
              <input type="email" className="w-full px-3 py-2 border border-zinc-200 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm" placeholder="john@company.com" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Password</label>
              <input type="password" className="w-full px-3 py-2 border border-zinc-200 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm" placeholder="••••••••" />
            </div>

            <div className="pt-2">
              <button className="w-full bg-primary text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                Continue to Company Setup <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
