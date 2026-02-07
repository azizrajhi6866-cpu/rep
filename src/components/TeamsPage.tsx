import { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, X, Trash2, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Team } from '../types';

interface TeamsPageProps {
  onViewTeam: (teamId: string) => void;
}

export default function TeamsPage({ onViewTeam }: TeamsPageProps) {
  const [view, setView] = useState<'choice' | 'create' | 'join'>('choice');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_members: 5,
  });

  useEffect(() => {
    if (view === 'join') {
      fetchTeams();
    }
  }, [view]);

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTeams(data);
    }
    setLoading(false);
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          name: formData.name,
          description: formData.description,
          max_members: formData.max_members,
          current_members: 0,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setFormData({ name: '', description: '', max_members: 5 });
      setView('choice');
      alert('Team created successfully!');
    } else {
      alert('Error creating team');
    }
    setLoading(false);
  };

  const handleJoinTeam = async (team: Team) => {
    if (team.current_members >= team.max_members) {
      alert('This team is full!');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('teams')
      .update({ current_members: team.current_members + 1 })
      .eq('id', team.id);

    if (!error) {
      alert('Successfully joined the team!');
      fetchTeams();
    } else {
      alert('Error joining team');
    }
    setLoading(false);
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    setLoading(true);
    const { error } = await supabase.from('teams').delete().eq('id', teamId);

    if (!error) {
      fetchTeams();
      alert('Team deleted successfully!');
    } else {
      alert('Error deleting team');
    }
    setLoading(false);
  };

  if (view === 'choice') {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-12 text-center">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              Teams Management
            </span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <button
              onClick={() => setView('create')}
              className="group relative bg-gradient-to-br from-pink-900/50 to-pink-700/50 hover:from-pink-800/50 hover:to-pink-600/50 rounded-2xl p-12 border border-pink-500/30 hover:border-pink-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Create Team</h2>
                  <p className="text-gray-300">Start your own esports team</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setView('join')}
              className="group relative bg-gradient-to-br from-blue-900/50 to-blue-700/50 hover:from-blue-800/50 hover:to-blue-600/50 rounded-2xl p-12 border border-blue-500/30 hover:border-blue-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Join Team</h2>
                  <p className="text-gray-300">Browse and join existing teams</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
                Create New Team
              </span>
            </h1>
            <button
              onClick={() => setView('choice')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleCreateTeam} className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-pink-500/30">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Enter team name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors h-32 resize-none"
                    placeholder="Describe your team"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Members
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.max_members}
                    onChange={(e) =>
                      setFormData({ ...formData, max_members: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-pink-500/50"
              >
                {loading ? 'Creating...' : 'Create Team'}
              </button>
              <button
                type="button"
                onClick={() => setView('choice')}
                className="px-6 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              Available Teams
            </span>
          </h1>
          <button
            onClick={() => setView('choice')}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading teams...</div>
        ) : teams.length === 0 ? (
          <div className="text-center text-gray-400 text-xl py-12">
            No teams available. Create the first team!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-pink-500/50 transition-all hover:shadow-xl hover:shadow-pink-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewTeam(team.id)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{team.description}</p>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Members</span>
                    <span
                      className={`font-semibold ${
                        team.current_members >= team.max_members
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {team.current_members}/{team.max_members}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        team.current_members >= team.max_members
                          ? 'bg-red-500'
                          : 'bg-gradient-to-r from-pink-500 to-blue-500'
                      }`}
                      style={{
                        width: `${(team.current_members / team.max_members) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleJoinTeam(team)}
                  disabled={loading || team.current_members >= team.max_members}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                    team.current_members >= team.max_members
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50'
                  }`}
                >
                  {team.current_members >= team.max_members ? 'Team Full' : 'Join Team'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
