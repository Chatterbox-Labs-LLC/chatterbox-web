import Link from "next/link";
import { ArrowRight, Shield, Users, Zap, Layout } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Navigation */}
      <nav className="border-b border-zinc-100 py-4 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">Keystone</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign In</Link>
          <Link href="/signup/admin" className="bg-primary text-white px-4 py-2 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="py-24 px-8 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            The Operating System for <span className="text-primary">Modern Teams</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Centralize your people, resources, and requests in one secure workspace. 
            Built for organizations that value speed, security, and simplicity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup/admin" className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-sm text-lg font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-primary/20">
              Create Your Workspace <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="w-full sm:w-auto border border-zinc-200 px-8 py-4 rounded-sm text-lg font-bold hover:bg-zinc-50 transition-all">
              View Demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-zinc-50 border-y border-zinc-100">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Shield className="text-primary" size={24} />}
              title="Secure RBAC"
              description="Granular control over who sees what with enterprise-grade roles and permissions."
            />
            <FeatureCard 
              icon={<Users className="text-primary" size={24} />}
              title="People Directory"
              description="A centralized hub for your team. Profiles, departments, and reporting lines made easy."
            />
            <FeatureCard 
              icon={<Zap className="text-primary" size={24} />}
              title="Request Workflows"
              description="Automate approvals for IT, HR, and Finance. No more lost emails or manual follow-ups."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 text-center max-w-4xl mx-auto">
          <div className="bg-primary p-12 rounded-sm text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to unify your organization?</h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join teams worldwide using Keystone to power their internal operations.
            </p>
            <Link href="/signup/admin" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-sm font-bold hover:bg-zinc-100 transition-colors">
              Start Free Trial <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-zinc-900 flex items-center justify-center rounded-sm">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <span className="font-bold text-sm tracking-tight">Keystone</span>
          </div>
          <div className="text-zinc-400 text-sm">
            © 2026 Keystone. Powered by Chatterbox.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-white border border-zinc-200 rounded-sm flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}
