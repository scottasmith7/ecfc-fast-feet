import { useState, useEffect } from 'react'
import VideoCard from './components/VideoCard'
import VideoModal from './components/VideoModal'
import LoginScreen from './components/LoginScreen'
import PlayerStats from './components/PlayerStats'
import Leaderboard from './components/Leaderboard'

// =====================================================
// VIDEO CONFIGURATION
// YouTube Shorts use vertical format
// =====================================================
const INTRO_VIDEO_ID = "-TwdL8AX8nY"

const skills = [
  { id: 1, name: "#1 Iniesta", youtubeId: "HTr_G-MCey0" },
  { id: 2, name: "#2 CR7 Chop", youtubeId: "yAdRAAFgjvc" },
  { id: 3, name: "#3 Roll Stop", youtubeId: "HIWE0C-4sAI" },
  { id: 4, name: "#4 Matthews Scissors", youtubeId: "A5InjmC-j6Q" },
  { id: 5, name: "#5 Fake Pass", youtubeId: "BwFJUCxGev0" },
  { id: 6, name: "#6 Stop-turn", youtubeId: "bp9uCwgXcIo" },
  { id: 7, name: "#7 Step-over", youtubeId: "ZrYxksC7juo" },
  { id: 8, name: "#8 Drag Back", youtubeId: "K575SsiXfW0" },
  { id: 9, name: "#9 Cruyff Turn", youtubeId: "FOgibHJTN84" },
  { id: 10, name: "#10 Flick Behind", youtubeId: "fuM9Uikh5f0" },
  { id: 11, name: "#11 Zidane", youtubeId: "oXUai_etCvI" },
  { id: 12, name: "#12 Matthews", youtubeId: "Dzl672h-k5o" },
  { id: 13, name: "Freestyle 4,9,3", youtubeId: "-0AR8Z6wlIA" },
  // =====================================================
  // ADD MORE SKILLS HERE:
  // { id: 14, name: "#13 Skill Name", youtubeId: "video-id" },
  // =====================================================
]

function App() {
  const [screen, setScreen] = useState('welcome') // 'welcome', 'training', 'leaderboard'
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isIntro, setIsIntro] = useState(false)
  const [player, setPlayer] = useState(null)
  const [loadingPlayer, setLoadingPlayer] = useState(true)

  // Check for saved player on mount
  useEffect(() => {
    const savedPlayer = localStorage.getItem('fastfeet_player')
    console.log('[App] Loading saved player from localStorage:', savedPlayer)
    if (savedPlayer) {
      try {
        const parsed = JSON.parse(savedPlayer)
        console.log('[App] Parsed player:', parsed)
        console.log('[App] Player ID:', parsed?.id)
        setPlayer(parsed)
      } catch (e) {
        console.error('[App] Failed to parse saved player:', e)
        localStorage.removeItem('fastfeet_player')
      }
    }
    setLoadingPlayer(false)
  }, [])

  const handleLogin = (playerData) => {
    console.log('[App] Player logged in:', playerData)
    console.log('[App] Player ID:', playerData?.id)
    setPlayer(playerData)
  }

  const handleLogout = () => {
    localStorage.removeItem('fastfeet_player')
    setPlayer(null)
    setScreen('welcome')
  }

  const handleVideoClick = (skill) => {
    setSelectedVideo(skill)
    setIsIntro(false)
  }

  const handleIntroClick = () => {
    setSelectedVideo({ name: "Welcome to Fast Feet", youtubeId: INTRO_VIDEO_ID })
    setIsIntro(true)
  }

  const closeModal = () => {
    setSelectedVideo(null)
    setIsIntro(false)
  }

  // Show loading while checking for saved player
  if (loadingPlayer) {
    return (
      <div className="min-h-screen bg-ecfc-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Show login screen if no player
  if (!player) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Show leaderboard
  if (screen === 'leaderboard') {
    return <Leaderboard player={player} onClose={() => setScreen('welcome')} />
  }

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-ecfc-blue-600 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
          {/* Logo */}
          <img
            src="/ecfc-logo.png"
            alt="ECFC Logo"
            className="h-16 w-16 object-contain mb-2"
          />

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center drop-shadow-lg mb-1">
            Fast Feet Training
          </h1>
          <p className="text-ecfc-blue-100 text-base text-center mb-3">
            Practice these skills at home! ⚽
          </p>

          {/* Player Stats & Check-in */}
          <PlayerStats player={player} onLogout={handleLogout} />

          {/* Welcome Video */}
          <div className="w-full max-w-xs mb-4">
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/T_2Pw8C_yK4?autoplay=1&mute=1&loop=1&playlist=T_2Pw8C_yK4&playsinline=1"
                title="Welcome Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={handleIntroClick}
              className="w-full bg-white text-ecfc-blue-600 font-bold py-3 px-6 rounded-xl
                         active:scale-95 transition-all duration-150 shadow-lg
                         flex items-center justify-center gap-2 text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Intro Video
            </button>

            <button
              onClick={() => setScreen('training')}
              className="w-full bg-ecfc-green-500 text-white font-bold py-3 px-6 rounded-xl
                         active:scale-95 transition-all duration-150 shadow-lg
                         flex items-center justify-center gap-2 text-base
                         hover:bg-ecfc-green-400"
            >
              <span className="text-xl">🚀</span>
              Start Training
            </button>

            <button
              onClick={() => setScreen('leaderboard')}
              className="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl
                         active:scale-95 transition-all duration-150 shadow-lg
                         flex items-center justify-center gap-2 text-base
                         hover:bg-yellow-400"
            >
              <span className="text-xl">🏆</span>
              Leaderboard
            </button>

            <a
              href="/14-day-challenge.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-ecfc-blue-500 text-white font-bold py-3 px-6 rounded-xl
                         active:scale-95 transition-all duration-150 shadow-lg
                         flex items-center justify-center gap-2 text-base
                         hover:bg-ecfc-blue-400"
            >
              <span className="text-xl">📋</span>
              14 Day Challenge
            </a>
          </div>
        </div>

        {/* Video Modal for Intro */}
        {selectedVideo && (
          <VideoModal
            skill={selectedVideo}
            onClose={closeModal}
            isShort={!isIntro}
          />
        )}
      </div>
    )
  }

  // Training Screen
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-ecfc-blue-600 text-white py-4 px-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => setScreen('welcome')}
            className="p-2 hover:bg-ecfc-blue-500 rounded-full transition-colors"
            aria-label="Back to welcome"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src="/ecfc-logo.png"
            alt="ECFC Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-bold">Fast Feet Training</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 mt-6">
        {/* Video Skills Section */}
        <section>
          <h2 className="text-xl font-bold text-ecfc-blue-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎥</span> Training Videos
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill) => (
              <VideoCard
                key={skill.id}
                skill={skill}
                onClick={() => handleVideoClick(skill)}
                hasVideo={!!skill.youtubeId}
              />
            ))}
          </div>
        </section>

        {/* PDF Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-ecfc-blue-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📄</span> Skills Guide
          </h2>

          <a
            href="/skills-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View Skills Guide (PDF)
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-ecfc-blue-600 text-sm">
          <p>Keep practicing! 💪⚽</p>
          <p className="mt-1 text-ecfc-blue-400">ECFC Fast Feet Training</p>
        </footer>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          skill={selectedVideo}
          onClose={closeModal}
          isShort={true}
        />
      )}
    </div>
  )
}

export default App
