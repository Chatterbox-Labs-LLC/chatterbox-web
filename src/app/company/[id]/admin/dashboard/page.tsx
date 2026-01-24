import { 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  ArrowUpRight, 
  Bell, 
  Search,
  ChevronRight,
  ShieldCheck,
  Mail,
  CreditCard
} from "lucide-react";

export default function CompanyAdminDashboard({ params }: { params: { id: string } }) {
  const companyId = params.id;

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-zinc-400 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 text-white border-b border-zinc-800">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
            <span className="font-bold">K</span>
          </div>
          <span className="font-bold tracking-tight">Keystone</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem icon={<LayoutGrid size={18} />} label="Overview" active />
          <SidebarItem icon={<Users size={18} />} label="Members" />
          <SidebarItem icon={<Building2 size={18} />} label="Teams" />
          <SidebarItem icon={<FileText size={18} />} label="Resources" />
          <SidebarItem icon={<ShieldCheck size={18} />} label="Permissions" />
          <SidebarItem icon={<CreditCard size={18} />} label="Billing" />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 bg-zinc-100 px-3 py-1.5 rounded-sm w-96">
            <Search size={16} className="text-zinc-400" />
            <input type="text" placeholder="Search members, resources..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Admin Console</h1>
                <p className="text-zinc-500 text-sm">Workspace ID: <code className="bg-zinc-100 px-1 rounded text-primary">{companyId}</code></p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-zinc-200 rounded-sm text-sm font-bold hover:bg-zinc-50 transition-colors flex items-center gap-2">
                  <Mail size={16} /> Invite Member
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-sm text-sm font-bold hover:opacity-90 transition-opacity">
                  Workspace Settings
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatBox label="Total Members" value="48" change="+4" />
              <StatBox label="Pending Approvals" value="12" highlight />
              <StatBox label="Storage Used" value="2.4GB" />
              <StatBox label="Plan Status" value="Pro Trial" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                  <h2 className="font-bold">Member Activity</h2>
                  <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                    View All <ChevronRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-zinc-50">
                  <ActivityRow user="Sarah Jenkins" action="joined the Engineering team" time="12 mins ago" />
                  <ActivityRow user="Mike Ross" action="updated their profile" time="2 hours ago" />
                  <ActivityRow user="Admin" action="changed workspace settings" time="5 hours ago" />
                  <ActivityRow user="Emma Wood" action="requested access to HR folder" time="Yesterday" />
                </div>
              </div>

              {/* Quick Actions / Billing */}
              <div className="space-y-6">
                <div className="bg-white border border-zinc-200 rounded-sm p-6">
                  <h2 className="font-bold mb-4">Billing Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Current Plan</span>
                      <span className="font-bold">Business Pro</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Next Invoice</span>
                      <span className="font-bold">Feb 24, 2026</span>
                    </div>
                    <div className="pt-4">
                      <button className="w-full py-2 bg-zinc-900 text-white text-xs font-bold rounded-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                        Manage in Stripe <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-sm p-6">
                  <h2 className="font-bold text-primary mb-2">Invite your team</h2>
                  <p className="text-xs text-primary/70 mb-4">Add members to your workspace to start collaborating on resources.</p>
                  <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity">
                    Send Invites
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${active ? 'bg-primary text-white' : 'hover:bg-zinc-800 hover:text-white'}`}>
      {icon}
      {label}
    </a>
  );
}

function StatBox({ label, value, change, highlight = false }: { label: string, value: string, change?: string, highlight?: boolean }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-sm p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-zinc-900'}`}>{value}</span>
        {change && <span className="text-xs text-emerald-500 font-bold">{change}</span>}
      </div>
    </div>
  );
}

function ActivityRow({ user, action, time }: { user: string, action: string, time: string }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">
          {user.charAt(0)}
        </div>
        <div>
          <p className="text-sm">
            <span className="font-bold text-zinc-900">{user}</span>
            <span className="text-zinc-500"> {action}</span>
          </p>
          <p className="text-[10px] text-zinc-400 font-medium uppercase">{time}</p>
        </div>
      </div>
      <button className="p-1 hover:bg-zinc-50 rounded">
        <ChevronRight size={14} className="text-zinc-300" />
      </button>
    </div>
  );
}

function LayoutGrid(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
