import Link from 'next/link'
import { ArrowRight, Megaphone, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">Outpost</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 py-24 text-center sm:py-32">
          <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-6xl">
            Announce things <span className="text-primary">to the world.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            The modern announcement platform for companies. Share updates, news, and product launches with your audience in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors flex items-center gap-2"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                Powerful announcements made simple
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-white p-2 shadow-sm ring-1 ring-gray-200">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <dt className="mt-4 font-semibold text-black">Lightning Fast</dt>
                  <dd className="mt-2 leading-7 text-gray-600">
                    Deploy your announcement page in minutes. No complex setup required.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-white p-2 shadow-sm ring-1 ring-gray-200">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <dt className="mt-4 font-semibold text-black">Secure by Default</dt>
                  <dd className="mt-2 leading-7 text-gray-600">
                    Enterprise-grade security powered by Supabase and Cloudflare.
                  </dd>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-md bg-white p-2 shadow-sm ring-1 ring-gray-200">
                    <Megaphone className="h-6 w-6 text-primary" />
                  </div>
                  <dt className="mt-4 font-semibold text-black">Email Notifications</dt>
                  <dd className="mt-2 leading-7 text-gray-600">
                    Keep your subscribers engaged with beautiful emails powered by Resend.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Outpost. Built with precision.
        </div>
      </footer>
    </div>
  )
}
