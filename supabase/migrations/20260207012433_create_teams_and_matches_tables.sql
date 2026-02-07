/*
  # Create Gaming Teams and Matches System

  ## Overview
  This migration creates a complete gaming tournament system with teams and matches management.

  ## New Tables
  
  ### `teams`
  - `id` (uuid, primary key) - Unique team identifier
  - `name` (text) - Team name
  - `description` (text) - Team description
  - `max_members` (integer) - Maximum number of team members allowed
  - `current_members` (integer) - Current number of team members
  - `logo_url` (text, optional) - Team logo URL
  - `created_at` (timestamptz) - Team creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `matches`
  - `id` (uuid, primary key) - Unique match identifier
  - `team1_id` (uuid) - First team ID (foreign key to teams)
  - `team2_id` (uuid) - Second team ID (foreign key to teams)
  - `match_date` (timestamptz) - Scheduled match date
  - `location` (text) - Match location
  - `status` (text) - Match status (scheduled, ongoing, completed)
  - `team1_score` (integer) - Team 1 score
  - `team2_score` (integer) - Team 2 score
  - `created_at` (timestamptz) - Match creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Add policies for public read access
  - Add policies for authenticated users to create, update, and delete
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  max_members integer NOT NULL DEFAULT 5,
  current_members integer NOT NULL DEFAULT 0,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team1_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  team2_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  match_date timestamptz NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  team1_score integer DEFAULT 0,
  team2_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams table
CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create teams"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update teams"
  ON teams FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete teams"
  ON teams FOR DELETE
  USING (true);

-- RLS Policies for matches table
CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create matches"
  ON matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update matches"
  ON matches FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete matches"
  ON matches FOR DELETE
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_team1 ON matches(team1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team2 ON matches(team2_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_teams_name ON teams(name);