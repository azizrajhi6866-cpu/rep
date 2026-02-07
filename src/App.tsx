import { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import TeamsPage from './components/TeamsPage';
import TeamDetail from './components/TeamDetail';
import MatchesPage from './components/MatchesPage';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== 'team-detail') {
      setSelectedTeamId(null);
    }
  };

  const handleViewTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setCurrentPage('team-detail');
  };

  const handleBackToTeams = () => {
    setSelectedTeamId(null);
    setCurrentPage('teams');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'teams' && <TeamsPage onViewTeam={handleViewTeam} />}
      {currentPage === 'team-detail' && selectedTeamId && (
        <TeamDetail teamId={selectedTeamId} onBack={handleBackToTeams} />
      )}
      {currentPage === 'matches' && <MatchesPage />}
    </div>
  );
}

export default App;
