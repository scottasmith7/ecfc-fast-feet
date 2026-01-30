import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ulapzyvarwwzktwgswfg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYXB6eXZhcnd3emt0d2dzd2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjU4NzcsImV4cCI6MjA4NTMwMTg3N30.zZwj2AKgqo3Ru7ja7nBV7ZQlYc4Uv0KhZUGS3AXA9kY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =====================================================
// PLAYER FUNCTIONS
// =====================================================

// Register a new player
export async function registerPlayer(name, pin, teamAgeGroup = null) {
  const normalizedName = name.trim().toLowerCase()

  // Check if player already exists
  const { data: existing } = await supabase
    .from('players')
    .select('id')
    .eq('name_normalized', normalizedName)
    .single()

  if (existing) {
    throw new Error('A player with this name already exists. Try logging in instead!')
  }

  const { data, error } = await supabase
    .from('players')
    .insert([{
      name: name.trim(),
      name_normalized: normalizedName,
      pin: pin,
      team_age_group: teamAgeGroup
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Login an existing player
export async function loginPlayer(name, pin) {
  const normalizedName = name.trim().toLowerCase()

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('name_normalized', normalizedName)
    .eq('pin', pin)
    .single()

  if (error || !data) {
    throw new Error('Name or PIN is incorrect. Please try again!')
  }

  return data
}

// Get player by ID
export async function getPlayer(playerId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single()

  if (error) throw error
  return data
}

// =====================================================
// CHECK-IN FUNCTIONS
// =====================================================

// Check in for today
export async function checkIn(playerId) {
  const today = new Date().toISOString().split('T')[0]

  // First check if already checked in today
  const alreadyCheckedIn = await hasCheckedInToday(playerId)
  if (alreadyCheckedIn) {
    throw new Error('already_checked_in')
  }

  const { data, error } = await supabase
    .from('checkins')
    .insert([{
      player_id: playerId,
      checkin_date: today
    }])
    .select()
    .single()

  // Handle unique constraint violation (race condition protection)
  if (error) {
    if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
      throw new Error('already_checked_in')
    }
    throw error
  }
  return data
}

// Check if already checked in today
export async function hasCheckedInToday(playerId) {
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('checkins')
    .select('id')
    .eq('player_id', playerId)
    .eq('checkin_date', today)
    .single()

  return !!data
}

// =====================================================
// STATS FUNCTIONS
// =====================================================

// Get player stats (total days and current streak)
export async function getPlayerStats(playerId) {
  // Get all check-ins for the player
  const { data: checkIns, error } = await supabase
    .from('checkins')
    .select('checkin_date')
    .eq('player_id', playerId)
    .order('checkin_date', { ascending: false })

  if (error) throw error

  const totalDays = checkIns?.length || 0

  // Calculate streak
  let streak = 0
  if (checkIns && checkIns.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if the most recent check-in is today or yesterday
    const mostRecentDate = new Date(checkIns[0].checkin_date + 'T00:00:00')

    if (mostRecentDate >= yesterday) {
      streak = 1
      let expectedDate = new Date(mostRecentDate)
      expectedDate.setDate(expectedDate.getDate() - 1)

      for (let i = 1; i < checkIns.length; i++) {
        const checkInDate = new Date(checkIns[i].checkin_date + 'T00:00:00')
        if (checkInDate.getTime() === expectedDate.getTime()) {
          streak++
          expectedDate.setDate(expectedDate.getDate() - 1)
        } else {
          break
        }
      }
    }
  }

  return { totalDays, streak }
}

// =====================================================
// LEADERBOARD FUNCTIONS
// =====================================================

// Get leaderboard with all players ranked
export async function getLeaderboard() {
  // Get all players
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, name, team_age_group')

  if (playersError) throw playersError

  // Get all check-ins
  const { data: allCheckIns, error: checkInsError } = await supabase
    .from('checkins')
    .select('player_id, checkin_date')
    .order('checkin_date', { ascending: false })

  if (checkInsError) throw checkInsError

  // Calculate stats for each player
  const leaderboard = players.map(player => {
    const playerCheckIns = allCheckIns
      .filter(c => c.player_id === player.id)
      .map(c => c.checkin_date)
      .sort((a, b) => new Date(b) - new Date(a))

    const totalDays = playerCheckIns.length

    // Calculate streak
    let streak = 0
    if (playerCheckIns.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const mostRecentDate = new Date(playerCheckIns[0] + 'T00:00:00')

      if (mostRecentDate >= yesterday) {
        streak = 1
        let expectedDate = new Date(mostRecentDate)
        expectedDate.setDate(expectedDate.getDate() - 1)

        for (let i = 1; i < playerCheckIns.length; i++) {
          const checkInDate = new Date(playerCheckIns[i] + 'T00:00:00')
          if (checkInDate.getTime() === expectedDate.getTime()) {
            streak++
            expectedDate.setDate(expectedDate.getDate() - 1)
          } else {
            break
          }
        }
      }
    }

    return {
      ...player,
      totalDays,
      streak
    }
  })

  // Sort by total days (primary) and streak (secondary)
  leaderboard.sort((a, b) => {
    if (b.totalDays !== a.totalDays) return b.totalDays - a.totalDays
    return b.streak - a.streak
  })

  return leaderboard
}
