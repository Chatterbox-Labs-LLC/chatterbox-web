import { signup } from '@/app/actions/auth';
import Link from 'next/link';

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 font-sans">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-sm p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm mb-4 mx-auto">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Join Keystone and start building your organization portal.
          </p>
        </div>

        {searchParams?.error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-sm">
            {searchParams.error}
          </div>
        )}

        <form action={signup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
              Work Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" name="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-zinc-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-sm font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-100 text-center text-xs text-zinc-500">
          Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
