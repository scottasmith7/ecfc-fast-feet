import { useEffect } from 'react'

function VideoModal({ skill, onClose, isShort = false }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-2xl ${
          isShort ? 'w-full max-w-sm' : 'w-full max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ecfc-blue-600 text-white p-3 flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2 truncate">
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{skill.name}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ecfc-blue-500 rounded-full transition-colors flex-shrink-0"
            aria-label="Close video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Video Container - Vertical for Shorts, Horizontal for regular */}
        <div
          className="relative bg-black"
          style={{
            paddingTop: isShort ? '177.78%' : '56.25%' // 9:16 for shorts, 16:9 for regular
          }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${skill.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${skill.name} training video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer with YouTube link */}
        <div className="p-3 bg-ecfc-blue-50">
          <a
            href={isShort
              ? `https://www.youtube.com/shorts/${skill.youtubeId}`
              : `https://www.youtube.com/watch?v=${skill.youtubeId}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-base py-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Open in YouTube
          </a>
        </div>
      </div>
    </div>
  )
}

export default VideoModal
