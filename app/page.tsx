import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-500 py-20 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Build Your Professional Deck.
            <br />
            Showcase Your Skills.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Easily create a stunning online profile, share your proof of work, and get discovered by employers.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/auth?mode=signup"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            >
              Get Started - It's Free
            </Link>
            <Link
              href="/profiles"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg border border-blue-400 hover:bg-blue-700 transition-colors"
            >
              Explore Profiles
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Create Your Profile</h3>
              <p className="text-gray-600 px-4">
                SkillDeck is the easiest way to showcase your skills and proof of work. It&apos;s your dynamic, verificable portfolio.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Share Your Deck</h3>
              <p className="text-gray-600 px-4">
                Get a public, SEO-friendly URL to easily share your profile with potential employers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Get Discovered</h3>
              <p className="text-gray-600 px-4">
                Connect with opportunities as recruiters browse and find top talent on SkillDeck.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Featured Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden relative">
                {/* Placeholder for user image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xl">A</div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Alice Chen</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Product Manager</p>
              <p className="text-sm text-gray-600 mb-6">User Product Manager | AI & SaaS Specialist</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Product Management</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">AI Strategy</span>
              </div>
            </div>

            {/* Profile Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xl">D</div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">David Miller</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Full Stack Developer</p>
              <p className="text-sm text-gray-600 mb-6">Full Stack Developer | React & Node.js Expert</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">React</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Node.js</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">TypeScript</span>
              </div>
            </div>

            {/* Profile Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-300 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xl">S</div>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sophia Lee</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">UX Designer</p>
              <p className="text-sm text-gray-600 mb-6">UX Designer | User-Centered Experiences</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">UI Design</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Figma</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">User Research</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
