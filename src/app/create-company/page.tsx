import { ArrowRight, Building2, Globe, Users } from "lucide-react";
import { createCompany } from "@/app/actions/company";

export default function CreateCompanyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white border border-zinc-200 rounded-sm shadow-xl p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center rounded-sm mx-auto mb-6">
            <Building2 size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Create Your Workspace</h1>
          <p className="text-zinc-500 mt-2">Set up your organization's digital home on Keystone.</p>
        </div>

        <form action={createCompany} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
              <Building2 size={14} /> Company Name
            </label>
            <input 
              name="name"
              type="text" 
              required
              className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-base" 
              placeholder="Acme Industries" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
              <Globe size={14} /> Workspace URL
            </label>
            <div className="flex">
              <input 
                name="slug"
                type="text" 
                required
                className="flex-1 px-4 py-3 border border-zinc-200 rounded-l-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-base" 
                placeholder="acme" 
              />
              <span className="bg-zinc-50 border border-l-0 border-zinc-200 px-4 py-3 text-zinc-400 rounded-r-sm font-medium">
                .chatterboxteams.com
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
              <Users size={14} /> Company Size
            </label>
            <select name="companySize" className="w-full px-4 py-3 border border-zinc-200 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-base bg-white appearance-none">
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-primary text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-lg shadow-lg shadow-primary/10">
              Create Workspace <ArrowRight size={20} />
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-400 leading-relaxed">
          By creating a workspace, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
