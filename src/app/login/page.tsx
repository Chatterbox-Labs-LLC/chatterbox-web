export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-zinc-200 rounded-sm p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm mb-4">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Welcome to Keystone</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to your organization portal</p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@company.com"
              className="w-full px-3 py-2 border border-zinc-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-zinc-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-sm font-medium hover:opacity-90 transition-opacity text-sm mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
          <p className="text-xs text-zinc-500">
            Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Contact your administrator</a>
          </p>
        </div>
      </div>
    </div>
  );
}
