import { useState, useEffect } from 'react'
import { getPlayerStats, hasCheckedInToday, checkIn } from '../lib/supabase'

const ENCOURAGEMENTS = [
  "You're crushing it! 💪",
  "Keep up the great work! 🌟",
  "Future superstar! ⭐",
  "Amazing dedication! 🔥",
  "You're on fire! 🔥",
  "Champion in the making! 🏆",
  "Skills getting sharper! ⚡",
  "Great hustle! 💨"
]

function PlayerStats({ player, onLogout }) {
  const [stats, setStats] = useState({ totalDays: 0, streak: 0 })
  const [checkedIn, setCheckedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [justCheckedIn, setJustCheckedIn] = useState(false)

  useEffect(() => {
    loadStats()
  }, [player.id])

  const loadStats = async () => {
    try {
      const [playerStats, alreadyCheckedIn] = await Promise.all([
        getPlayerStats(player.id),
        hasCheckedInToday(player.id)
      ])
      setStats(playerStats)
      setCheckedIn(alreadyCheckedIn)
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    setCheckingIn(true)
    try {
      await checkIn(player.id)
      setCheckedIn(true)
      setJustCheckedIn(true)
      // Refresh stats
      const newStats = await getPlayerStats(player.id)
      setStats(newStats)
    } catch (err) {
      if (err.message === 'already_checked_in') {
        setCheckedIn(true)
      } else {
        console.error('Check-in error:', err)
      }
    } finally {
      setCheckingIn(false)
    }
  }

  const encouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-4 animate-pulse">
        <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs mb-4">
      {/* Player Welcome Card */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-white font-bold text-lg">
              Hey, {player.name}! 👋
            </h2>
            {player.team_age_group && (
              <p className="text-ecfc-blue-200 text-sm">{player.team_age_group}</p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="text-ecfc-blue-200 text-sm underline hover:text-white"
          >
            Log Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-3xl font-bold text-white">{stats.totalDays}</div>
            <div className="text-ecfc-blue-200 text-xs">Total Days</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-3xl font-bold text-ecfc-green-400 flex items-center justify-center gap-1">
              {stats.streak}
              {stats.streak >= 3 && <span>🔥</span>}
            </div>
            <div className="text-ecfc-blue-200 text-xs">Day Streak</div>
          </div>
        </div>

        {/* Encouragement */}
        <p className="text-ecfc-green-300 text-center text-sm font-medium">
          {stats.totalDays === 0
            ? "Ready to start your journey? Check in below! 🚀"
            : stats.streak >= 7
            ? "INCREDIBLE! 7+ day streak! 🏆🔥"
            : stats.streak >= 3
            ? `${stats.streak} day streak! ${encouragement}`
            : encouragement}
        </p>
      </div>

      {/* Check-in Button */}
      {checkedIn ? (
        <div className={`w-full bg-ecfc-green-500/20 border-2 border-ecfc-green-400
                        text-ecfc-green-300 font-bold py-3 px-6 rounded-xl
                        flex items-center justify-center gap-2 text-base
                        ${justCheckedIn ? 'animate-pulse' : ''}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {justCheckedIn ? "You're checked in! Great job! 🎉" : "Already checked in today ✓"}
        </div>
      ) : (
        <button
          onClick={handleCheckIn}
          disabled={checkingIn}
          className="w-full bg-gradient-to-r from-ecfc-green-500 to-ecfc-green-400
                     text-white font-bold py-3 px-6 rounded-xl
                     active:scale-95 transition-all duration-150 shadow-lg
                     flex items-center justify-center gap-2 text-base
                     disabled:opacity-50 animate-pulse hover:animate-none"
        >
          {checkingIn ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking in...
            </span>
          ) : (
            <>
              <span className="text-xl">⚽</span>
              Check In Today!
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default PlayerStats
