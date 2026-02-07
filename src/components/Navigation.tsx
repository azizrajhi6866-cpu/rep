import { Gamepad2, Users, Trophy } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Gamepad2 className="w-8 h-8 text-pink-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              G4R ESPORTS
            </span>
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('teams')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'teams'
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Teams</span>
            </button>

            <button
              onClick={() => onNavigate('matches')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'matches'
                  ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span>Matches</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
