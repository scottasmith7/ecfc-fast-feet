import { useState } from 'react'
import { registerPlayer, loginPlayer } from '../lib/supabase'

const TEAM_AGE_GROUPS = [
  'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18'
]

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('choice') // 'choice', 'login', 'register'
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [teamAgeGroup, setTeamAgeGroup] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits')
      return
    }

    setLoading(true)
    try {
      const player = await loginPlayer(name, pin)
      // Store in localStorage
      localStorage.setItem('fastfeet_player', JSON.stringify(player))
      onLogin(player)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits')
      return
    }

    setLoading(true)
    try {
      const player = await registerPlayer(name, pin, teamAgeGroup || null)
      // Store in localStorage
      localStorage.setItem('fastfeet_player', JSON.stringify(player))
      onLogin(player)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(value)
  }

  // Choice screen
  if (mode === 'choice') {
    return (
      <div className="min-h-screen bg-ecfc-blue-600 flex flex-col items-center justify-center px-4">
        <img
          src="/ecfc-logo.png"
          alt="ECFC Logo"
          className="h-24 w-24 object-contain mb-4"
        />
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Fast Feet Training
        </h1>
        <p className="text-ecfc-blue-100 text-center mb-8">
          Track your training journey!
        </p>

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={() => setMode('register')}
            className="w-full bg-ecfc-green-500 text-white font-bold py-4 px-6 rounded-xl
                       active:scale-95 transition-all duration-150 shadow-lg text-lg"
          >
            <span className="mr-2">🌟</span>
            I'm New Here!
          </button>

          <button
            onClick={() => setMode('login')}
            className="w-full bg-white text-ecfc-blue-600 font-bold py-4 px-6 rounded-xl
                       active:scale-95 transition-all duration-150 shadow-lg text-lg"
          >
            <span className="mr-2">👋</span>
            Welcome Back!
          </button>
        </div>
      </div>
    )
  }

  // Login/Register form
  const isRegister = mode === 'register'

  return (
    <div className="min-h-screen bg-ecfc-blue-600 flex flex-col items-center px-4 py-8">
      <button
        onClick={() => { setMode('choice'); setError(''); setName(''); setPin(''); }}
        className="self-start text-white mb-4 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <img
        src="/ecfc-logo.png"
        alt="ECFC Logo"
        className="h-20 w-20 object-contain mb-4"
      />

      <h1 className="text-2xl font-bold text-white text-center mb-6">
        {isRegister ? '🌟 Join the Team!' : '👋 Welcome Back!'}
      </h1>

      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        className="w-full max-w-xs space-y-4"
      >
        {/* Name Input */}
        <div>
          <label className="block text-white text-sm font-medium mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border-2 border-transparent
                       focus:border-ecfc-green-400 focus:outline-none text-lg"
            autoComplete="name"
          />
        </div>

        {/* PIN Input */}
        <div>
          <label className="block text-white text-sm font-medium mb-1">
            {isRegister ? 'Choose a 4-digit PIN' : 'Your 4-digit PIN'}
          </label>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={handlePinChange}
            placeholder="••••"
            maxLength={4}
            className="w-full px-4 py-3 rounded-xl border-2 border-transparent
                       focus:border-ecfc-green-400 focus:outline-none text-lg text-center
                       tracking-widest"
          />
          {isRegister && (
            <p className="text-ecfc-blue-200 text-xs mt-1">
              Remember this PIN to log back in!
            </p>
          )}
        </div>

        {/* Team/Age Group (Register only) */}
        {isRegister && (
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Team / Age Group (optional)
            </label>
            <select
              value={teamAgeGroup}
              onChange={(e) => setTeamAgeGroup(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-transparent
                         focus:border-ecfc-green-400 focus:outline-none text-lg bg-white"
            >
              <option value="">Select your team...</option>
              {TEAM_AGE_GROUPS.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ecfc-green-500 text-white font-bold py-4 px-6 rounded-xl
                     active:scale-95 transition-all duration-150 shadow-lg text-lg
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </span>
          ) : (
            isRegister ? "Let's Go!" : "Log In"
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginScreen
