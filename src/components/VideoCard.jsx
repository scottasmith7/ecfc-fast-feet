function VideoCard({ skill, onClick, hasVideo }) {
  // Extract number from skill name (e.g., "#1 Iniesta" -> "1")
  const numberMatch = skill.name.match(/^#(\d+)/)
  const skillNumber = numberMatch ? numberMatch[1] : null
  const skillName = skill.name.replace(/^#\d+\s*/, '')

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-xl shadow-md overflow-hidden
                  active:scale-[0.98] transition-all duration-150 cursor-pointer
                  border border-ecfc-blue-100 hover:border-ecfc-green-500
                  hover:shadow-lg min-h-[100px]
                  ${!hasVideo ? 'opacity-60' : ''}`}
      aria-label={`Watch ${skill.name} video`}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-ecfc-blue-600 to-ecfc-green-500
                      group-hover:from-ecfc-green-500 group-hover:to-ecfc-blue-600
                      transition-all duration-300" />

      <div className="p-4 flex flex-col items-center justify-center gap-1">
        {/* Skill number */}
        {skillNumber && (
          <div className="text-3xl font-black text-ecfc-blue-600 leading-none">
            #{skillNumber}
          </div>
        )}

        {/* Skill name */}
        <div className="text-ecfc-blue-800 font-semibold text-sm text-center leading-tight mt-1">
          {skillName}
        </div>

        {/* Play indicator */}
        {hasVideo && (
          <div className="flex items-center gap-1 mt-2 text-ecfc-green-600 text-xs font-medium
                          group-hover:text-ecfc-green-500 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>WATCH</span>
          </div>
        )}
      </div>
    </button>
  )
}

export default VideoCard
