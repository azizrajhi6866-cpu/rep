export interface Team {
  id: string;
  name: string;
  description: string;
  max_members: number;
  current_members: number;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  team1_id: string;
  team2_id: string;
  match_date: string;
  location: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  team1_score: number;
  team2_score: number;
  created_at: string;
  updated_at: string;
  team1?: Team;
  team2?: Team;
}

export type Page = 'home' | 'teams' | 'matches' | 'team-detail';
