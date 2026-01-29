import { useState, useEffect } from 'react'
import { getLeaderboard } from '../lib/supabase'

function Leaderboard({ player, onClose }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('totalDays') // 'totalDays' or 'streak'

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard()
      setLeaderboard(data)
    } catch (err) {
      console.error('Error loading leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortBy === 'streak') {
      if (b.streak !== a.streak) return b.streak - a.streak
      return b.totalDays - a.totalDays
    }
    if (b.totalDays !== a.totalDays) return b.totalDays - a.totalDays
    return b.streak - a.streak
  })

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const playerRank = sortedLeaderboard.findIndex(p => p.id === player?.id) + 1

  return (
    <div className="min-h-screen bg-ecfc-blue-600 flex flex-col">
      {/* Header */}
      <header className="bg-ecfc-blue-700 text-white py-4 px-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-ecfc-blue-500 rounded-full transition-colors"
            aria-label="Back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>🏆</span> Leaderboard
          </h1>
        </div>
      </header>

      {/* Player's Rank Summary */}
      {player && playerRank > 0 && (
        <div className="bg-ecfc-blue-500 px-4 py-3">
          <div className="max-w-md mx-auto text-center text-white">
            <span className="text-ecfc-blue-200">Your rank: </span>
            <span className="font-bold text-lg">{getRankEmoji(playerRank)}</span>
            {playerRank <= 10 && (
              <span className="ml-2 text-ecfc-green-300">
                {playerRank === 1 ? "You're #1! 👑" : "Top 10! Keep going! 🔥"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort Toggle */}
      <div className="px-4 py-3 bg-ecfc-blue-600">
        <div className="max-w-md mx-auto flex gap-2">
          <button
            onClick={() => setSortBy('totalDays')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all
                       ${sortBy === 'totalDays'
                         ? 'bg-white text-ecfc-blue-600'
                         : 'bg-ecfc-blue-500 text-white'}`}
          >
            📅 Total Days
          </button>
          <button
            onClick={() => setSortBy('streak')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all
                       ${sortBy === 'streak'
                         ? 'bg-white text-ecfc-blue-600'
                         : 'bg-ecfc-blue-500 text-white'}`}
          >
            🔥 Current Streak
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="max-w-md mx-auto space-y-2">
          {loading ? (
            // Loading skeletons
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : sortedLeaderboard.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏟️</div>
              <p className="text-white font-medium">No players yet!</p>
              <p className="text-ecfc-blue-200 text-sm">Be the first to check in!</p>
            </div>
          ) : (
            sortedLeaderboard.map((p, index) => {
              const rank = index + 1
              const isCurrentPlayer = p.id === player?.id

              return (
                <div
                  key={p.id}
                  className={`rounded-xl p-4 transition-all ${
                    isCurrentPlayer
                      ? 'bg-ecfc-green-500 text-white ring-2 ring-ecfc-green-300'
                      : rank <= 3
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                    ${rank <= 3 ? 'bg-white/30' : 'bg-white/10'}`}>
                      {getRankEmoji(rank)}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate flex items-center gap-2">
                        {p.name}
                        {isCurrentPlayer && <span className="text-xs">(You)</span>}
                        {rank === 1 && <span>👑</span>}
                      </div>
                      {p.team_age_group && (
                        <div className={`text-xs ${isCurrentPlayer ? 'text-ecfc-green-100' : 'text-ecfc-blue-200'}`}>
                          {p.team_age_group}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold">
                        {sortBy === 'totalDays' ? p.totalDays : p.streak}
                        {sortBy === 'streak' && p.streak >= 3 && ' 🔥'}
                      </div>
                      <div className={`text-xs ${isCurrentPlayer ? 'text-ecfc-green-100' : 'text-ecfc-blue-200'}`}>
                        {sortBy === 'totalDays' ? 'days' : 'streak'}
                      </div>
                    </div>
                  </div>

                  {/* Secondary stat */}
                  <div className={`mt-2 pt-2 border-t flex justify-between text-xs
                                  ${isCurrentPlayer ? 'border-ecfc-green-400/30' : 'border-white/10'}`}>
                    <span className={isCurrentPlayer ? 'text-ecfc-green-100' : 'text-ecfc-blue-200'}>
                      {sortBy === 'totalDays' ? `🔥 ${p.streak} day streak` : `📅 ${p.totalDays} total days`}
                    </span>
                    {p.streak >= 7 && (
                      <span className="text-yellow-300">Week warrior! 🏆</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="bg-ecfc-blue-700 px-4 py-4 text-center">
        <p className="text-ecfc-blue-200 text-sm max-w-md mx-auto">
          {sortBy === 'totalDays'
            ? "Every check-in counts! Keep training to climb the ranks! 🚀"
            : "Consistency is key! Don't break your streak! 💪"}
        </p>
      </div>
    </div>
  )
}

export default Leaderboard
