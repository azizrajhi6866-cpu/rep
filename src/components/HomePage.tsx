import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8">
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                Best Highlights Of
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
                  The Latest
                </span>
              </h1>

              <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                Join the ultimate esports community. Create your team, compete in tournaments,
                and rise to the top of the leaderboards.
              </p>

              <button
                onClick={() => onNavigate('teams')}
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-lg font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-pink-500/30 p-12 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-white opacity-80">
                    <path
                      fill="currentColor"
                      d="M100 20c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80zm0 140c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60z"
                    />
                    <circle cx="70" cy="80" r="8" fill="currentColor" />
                    <circle cx="130" cy="80" r="8" fill="currentColor" />
                    <circle cx="70" cy="120" r="8" fill="currentColor" />
                    <circle cx="130" cy="120" r="8" fill="currentColor" />
                    <rect x="90" y="50" width="20" height="40" rx="4" fill="currentColor" />
                    <rect x="50" y="90" width="40" height="20" rx="4" fill="currentColor" />
                    <rect x="110" y="90" width="40" height="20" rx="4" fill="currentColor" />
                    <circle cx="160" cy="60" r="12" fill="currentColor" opacity="0.6" />
                    <circle cx="160" cy="140" r="12" fill="currentColor" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}
