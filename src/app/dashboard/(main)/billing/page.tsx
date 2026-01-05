'use client';

export const runtime = 'edge';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Users, MessageSquare, Shield, HardDrive, Headphones, Video, Sparkles, Key, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';


export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'history' | 'payment'>('plans');

  const invoiceHistory: any[] = [];

  const handleUpgrade = async (_planName: string) => {
    // Disabled for Coming Soon
    alert('Billing is coming soon!');
  };

  const handleManageBilling = async () => {
    // Disabled for Coming Soon
    alert('Billing is coming soon!');
  };

  const plans = [
    {
      name: "FREE",
      price: "$0",
      description: "Up to 10 users per workspace",
      features: [
        { icon: Users, text: "Up to 10 users per workspace" },
        { icon: MessageSquare, text: "Text channels and direct messages" },
        { icon: Shield, text: "Basic permissions and moderation" },
        { icon: HardDrive, text: "Limited file uploads" },
        { icon: MessageSquare, text: "Standard message history" },
        { icon: Headphones, text: "Community support" },
      ],
      buttonText: "Current Plan",
      variant: "outline" as const,
      active: true,
    },
    {
      name: "PRO",
      price: "$5",
      subtext: "per active user / month",
      description: "Billed monthly per workspace",
      features: [
        { icon: Users, text: "Unlimited users" },
        { icon: MessageSquare, text: "Unlimited channels" },
        { icon: Video, text: "Voice and Video rooms" },
        { icon: Video, text: "Screen sharing" },
        { icon: Sparkles, text: "AI summaries and assist features" },
        { icon: Shield, text: "Advanced roles and moderation" },
        { icon: MessageSquare, text: "Unlimited message history" },
        { icon: Headphones, text: "Priority support" },
      ],
      buttonText: "Upgrade to Pro",
      variant: "default" as const,
      popular: true,
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      description: "For large scale organizations",
      features: [
        { icon: Sparkles, text: "Volume discounts" },
        { icon: FileText, text: "Annual invoicing" },
        { icon: Key, text: "Single sign-on (SSO)" },
        { icon: FileText, text: "Audit logs" },
        { icon: HardDrive, text: "Data retention controls" },
        { icon: Headphones, text: "Dedicated support" },
      ],
      buttonText: "Contact Sales",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full relative overflow-hidden">
      {/* Coming Soon Overlay Banner */}
      <div className="absolute top-10 -right-16 bg-blue-600 text-white px-20 py-2 rotate-45 z-50 shadow-lg font-bold text-sm tracking-widest uppercase">
        Coming Soon
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Billing & Plans</h2>
          <p className="text-muted-foreground text-lg">Manage your workspace subscription and billing history.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'plans' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Plans
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Invoices
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'payment' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Payment
          </button>
        </div>
      </div>

      {activeTab === 'plans' && (
        <div className="space-y-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-none shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Current Plan: FREE</CardTitle>
                  <CardDescription className="text-blue-100 mt-1 text-base">
                    Your workspace is currently on the Free tier.
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    Active
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    onClick={handleManageBilling}
                    disabled={loading === 'manage'}
                  >
                    {loading === 'manage' && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mt-2">
                <div className="space-y-1">
                  <p className="text-blue-100 text-sm">Active Users</p>
                  <p className="text-2xl font-bold">8 / 10</p>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[80%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-blue-100 text-sm">File Storage</p>
                  <p className="text-2xl font-bold">1.2 GB / 5 GB</p>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[24%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-blue-100 text-sm">Next Reset</p>
                  <p className="text-2xl font-bold">Feb 1, 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative flex flex-col transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.subtext && <span className="text-muted-foreground text-sm">{plan.subtext}</span>}
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <feature.icon className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full h-11" 
                    variant={plan.variant}
                    disabled={plan.active || loading === plan.name}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {loading === plan.name && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <Info className="h-5 w-5 text-blue-500" />
                  Billing Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• One subscription per workspace</li>
                  <li className="flex items-center gap-2">• Workspace owner manages billing</li>
                  <li className="flex items-center gap-2">• Cancel anytime</li>
                  <li className="flex items-center gap-2">• Downgrade to Free at the end of the billing period</li>
                  <li className="flex items-center gap-2">• No charges for messages, channels, or reactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <Users className="h-5 w-5 text-blue-500" />
                  What is an "Active User"?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  An active user is defined as any user who has logged in to your workspace within the last 30 days.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    You only pay for who uses the app. We'll automatically adjust your bill each month.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>View and download your past invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Invoice ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {invoiceHistory.length > 0 ? invoiceHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{invoice.id}</td>
                      <td className="px-4 py-3 text-zinc-500">{invoice.date}</td>
                      <td className="px-4 py-3">{invoice.amount}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">Download</Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                        No billing history available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'payment' && (
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>The primary card used for your workspace subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="h-10 w-12 bg-white dark:bg-zinc-700 rounded border flex items-center justify-center font-bold text-xs">VISA</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Visa ending in 4242</p>
                  <p className="text-xs text-zinc-500">Expires 12/2026</p>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              <Button variant="outline" className="w-full">Add Backup Method</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Email</CardTitle>
              <CardDescription>Where we send your receipts and billing alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 border rounded-lg text-sm">
                <FileText className="h-4 w-4 text-zinc-400" />
                <span>admin@chatterbox.com</span>
              </div>
              <Button variant="outline" className="w-full">Update Email</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
