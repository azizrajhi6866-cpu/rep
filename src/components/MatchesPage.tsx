import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Match, Team } from '../types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    match_date: '',
    location: '',
    status: 'scheduled' as 'scheduled' | 'ongoing' | 'completed',
    team1_score: 0,
    team2_score: 0,
  });

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select(
        `
        *,
        team1:team1_id(id, name, logo_url),
        team2:team2_id(id, name, logo_url)
      `
      )
      .order('match_date', { ascending: false });

    if (!error && data) {
      setMatches(data as Match[]);
    }
    setLoading(false);
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*');

    if (!error && data) {
      setTeams(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingMatch) {
      const { error } = await supabase
        .from('matches')
        .update({
          team1_id: formData.team1_id,
          team2_id: formData.team2_id,
          match_date: formData.match_date,
          location: formData.location,
          status: formData.status,
          team1_score: formData.team1_score,
          team2_score: formData.team2_score,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingMatch.id);

      if (!error) {
        alert('Match updated successfully!');
        resetForm();
        fetchMatches();
      } else {
        alert('Error updating match');
      }
    } else {
      const { error } = await supabase.from('matches').insert([
        {
          team1_id: formData.team1_id,
          team2_id: formData.team2_id,
          match_date: formData.match_date,
          location: formData.location,
          status: formData.status,
          team1_score: formData.team1_score,
          team2_score: formData.team2_score,
        },
      ]);

      if (!error) {
        alert('Match created successfully!');
        resetForm();
        fetchMatches();
      } else {
        alert('Error creating match');
      }
    }
    setLoading(false);
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      team1_id: match.team1_id,
      team2_id: match.team2_id,
      match_date: new Date(match.match_date).toISOString().slice(0, 16),
      location: match.location,
      status: match.status,
      team1_score: match.team1_score,
      team2_score: match.team2_score,
    });
    setShowModal(true);
  };

  const handleDelete = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;

    setLoading(true);
    const { error } = await supabase.from('matches').delete().eq('id', matchId);

    if (!error) {
      fetchMatches();
      alert('Match deleted successfully!');
    } else {
      alert('Error deleting match');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      team1_id: '',
      team2_id: '',
      match_date: '',
      location: '',
      status: 'scheduled',
      team1_score: 0,
      team2_score: 0,
    });
    setEditingMatch(null);
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ongoing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-white">
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">
              Matches
            </span>
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-all hover:shadow-xl hover:shadow-pink-500/50"
          >
            <Plus className="w-5 h-5" />
            <span>Create Match</span>
          </button>
        </div>

        {loading && matches.length === 0 ? (
          <div className="text-center text-white text-xl py-12">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-center text-gray-400 text-xl py-12">
            No matches scheduled. Create your first match!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-pink-500/50 transition-all hover:shadow-xl hover:shadow-pink-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      match.status
                    )}`}
                  >
                    {match.status.toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(match)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      title="Edit Match"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      title="Delete Match"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {match.team1?.name || 'Team 1'}
                    </h3>
                    <p className="text-3xl font-bold text-pink-400">{match.team1_score}</p>
                  </div>

                  <div className="px-6">
                    <div className="text-2xl font-bold text-gray-600">VS</div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {match.team2?.name || 'Team 2'}
                    </h3>
                    <p className="text-3xl font-bold text-blue-400">{match.team2_score}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(match.match_date).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {match.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-pink-500/30 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {editingMatch ? 'Edit Match' : 'Create New Match'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team 1
                    </label>
                    <select
                      required
                      value={formData.team1_id}
                      onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    >
                      <option value="">Select Team 1</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team 2
                    </label>
                    <select
                      required
                      value={formData.team2_id}
                      onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    >
                      <option value="">Select Team 2</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Match Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.match_date}
                    onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Enter match location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'scheduled' | 'ongoing' | 'completed',
                      })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team 1 Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.team1_score}
                      onChange={(e) =>
                        setFormData({ ...formData, team1_score: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team 2 Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.team2_score}
                      onChange={(e) =>
                        setFormData({ ...formData, team2_score: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-pink-500/50"
                  >
                    {loading
                      ? 'Saving...'
                      : editingMatch
                      ? 'Update Match'
                      : 'Create Match'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
