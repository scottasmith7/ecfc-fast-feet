-- =====================================================
-- ECFC Fast Feet Training - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- 1. Create the players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_normalized TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL CHECK (LENGTH(pin) = 4),
  team_age_group TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, check_in_date)
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_name_normalized ON players(name_normalized);
CREATE INDEX IF NOT EXISTS idx_check_ins_player_id ON check_ins(player_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(check_in_date);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- 5. Create policies to allow public access (since we're using anon key with PIN auth)
-- Players table policies
CREATE POLICY "Allow public to read players" ON players
  FOR SELECT USING (true);

CREATE POLICY "Allow public to insert players" ON players
  FOR INSERT WITH CHECK (true);

-- Check-ins table policies
CREATE POLICY "Allow public to read check_ins" ON check_ins
  FOR SELECT USING (true);

CREATE POLICY "Allow public to insert check_ins" ON check_ins
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- DONE! Your database is ready for the Fast Feet app.
-- =====================================================
