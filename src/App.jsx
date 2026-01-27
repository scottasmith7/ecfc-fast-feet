import { useState } from 'react'
import VideoCard from './components/VideoCard'
import VideoModal from './components/VideoModal'

// =====================================================
// VIDEO CONFIGURATION
// YouTube Shorts use vertical format
// =====================================================
const INTRO_VIDEO_ID = "-TwdL8AX8nY"

const skills = [
  { id: 1, name: "#1 Iniesta", youtubeId: "LR5-YxNWtqY" },
  { id: 2, name: "#2 CR7 Chop", youtubeId: "F9OwMz2d_Vs" },
  { id: 3, name: "#3 Roll Chop", youtubeId: "OWYWoLEtTro" },
  { id: 4, name: "#4 Matthews-Scissors", youtubeId: "QwEBVPQ1Hos" },
  { id: 5, name: "#5 Fake Pass", youtubeId: "3SPNTpPt8KY" },
  { id: 6, name: "#6 Stop-Turn", youtubeId: "hg0cL6HFOyE" },
  { id: 7, name: "#7 Step-over", youtubeId: "oJIjCqQFDlw" },
  { id: 8, name: "#8 Drag-back", youtubeId: "eSTIiRr6nZk" },
  { id: 9, name: "#9 Cruyff Turn", youtubeId: "mMYMRzLP3uY" },
  { id: 10, name: "#10 Flick Behind", youtubeId: "tsI1s805nec" },
  { id: 11, name: "#11 Zidane", youtubeId: "CbS13Y5EVdM" },
  { id: 12, name: "#12 Matthews", youtubeId: "tcGAbP0GbSA" },
  { id: 13, name: "Freestyle 4,9,3", youtubeId: "c2llFv4U0vw" },
  // =====================================================
  // ADD MORE SKILLS HERE:
  // { id: 14, name: "#13 Skill Name", youtubeId: "video-id" },
  // =====================================================
]

function App() {
  const [screen, setScreen] = useState('welcome') // 'welcome' or 'training'
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isIntro, setIsIntro] = useState(false)

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

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-ecfc-blue-600 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          {/* Logo */}
          <img
            src="/ecfc-logo.png"
            alt="ECFC Logo"
            className="h-32 w-32 object-contain mb-6"
          />

          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg mb-2">
            Fast Feet Training
          </h1>
          <p className="text-ecfc-blue-100 text-xl text-center mb-10">
            Practice these skills at home! ⚽
          </p>

          {/* Buttons */}
          <div className="w-full max-w-xs space-y-4">
            <button
              onClick={handleIntroClick}
              className="w-full bg-white text-ecfc-blue-600 font-bold py-4 px-8 rounded-xl
                         active:scale-95 transition-all duration-150 shadow-lg
                         flex items-center justify-center gap-3 text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Intro Video
            </button>

            <button
              onClick={() => setScreen('training')}
              className="w-full bg-ecfc-green-500 text-white font-bold py-4 px-8 rounded-xl
                         active:scale-95 transition-all duration-150 shadow-lg
                         flex items-center justify-center gap-3 text-lg
                         hover:bg-ecfc-green-400"
            >
              <span className="text-2xl">🚀</span>
              Start Training
            </button>
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
