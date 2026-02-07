import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Edit, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Team } from '../types';

interface TeamDetailProps {
  teamId: string;
  onBack: () => void;
}

export default function TeamDetail({ teamId, onBack }: TeamDetailProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_members: 5,
  });

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  const fetchTeam = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (!error && data) {
      setTeam(data);
      setFormData({
        name: data.name,
        description: data.description,
        max_members: data.max_members,
      });
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('teams')
      .update({
        name: formData.name,
        description: formData.description,
        max_members: formData.max_members,
        updated_at: new Date().toISOString(),
      })
      .eq('id', teamId);

    if (!error) {
      await fetchTeam();
      setEditing(false);
      alert('Team updated successfully!');
    } else {
      alert('Error updating team');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center text-white text-xl py-12">
          Loading team details...
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-xl py-12">
          Team not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Teams</span>
        </button>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-pink-500/30">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Edit Team</h1>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Members
                </label>
                <input
                  type="number"
                  required
                  min={team.current_members}
                  max="20"
                  value={formData.max_members}
                  onChange={(e) =>
                    setFormData({ ...formData, max_members: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-4 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{team.name}</h1>
                    <p className="text-gray-400 text-sm">
                      Created {new Date(team.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                  <p className="text-white text-lg">{team.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Current Members</h3>
                    <p className="text-3xl font-bold text-white">{team.current_members}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Max Members</h3>
                    <p className="text-3xl font-bold text-white">{team.max_members}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Team Capacity</span>
                    <span
                      className={`font-semibold ${
                        team.current_members >= team.max_members
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {Math.round((team.current_members / team.max_members) * 100)}% Full
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
