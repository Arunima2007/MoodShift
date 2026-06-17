import React from 'react';
import { Music, AlertCircle, Sparkles, Disc, Radio } from 'lucide-react';

export default function PlaylistView({ playlist, currentEmotion, targetEmotion, genre }) {
  if (!playlist || playlist.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mt-8 animate-slide-up">
      {/* Visual Transition Path Timeline */}
      <div className="glass-panel rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-spotify-green animate-pulse" />
          Transition Path: {currentEmotion.toUpperCase()} → {targetEmotion.toUpperCase()}
        </h3>
        
        {/* Timeline Path Nodes */}
        <div className="relative flex items-center justify-between w-full px-4 py-3">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-800 -translate-y-1/2 z-0" />
          
          {playlist.map((track, idx) => {
            const isStart = idx === 0;
            const isEnd = idx === playlist.length - 1;
            
            return (
              <div key={track.track_id} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300 ${
                  isStart 
                    ? 'bg-blue-650 border-blue-400 text-white shadow-glow-sad'
                    : isEnd
                    ? 'bg-amber-500 border-amber-400 text-black shadow-glow-happy'
                    : 'bg-spotify-card border-gray-600 text-gray-300'
                }`}>
                  {track.step}
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 font-semibold capitalize mt-2 absolute top-8 whitespace-nowrap bg-[#0A0C10] px-1.5 py-0.5 rounded border border-gray-900">
                  {isStart ? currentEmotion : isEnd ? targetEmotion : `Step ${idx}`}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-6" /> {/* Spacer for timeline text clearance */}
      </div>

      {/* Playlist Grid / Cards */}
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Music className="w-5 h-5 text-spotify-green" />
        Recommended Transition Tracks ({playlist.length} Songs)
      </h3>

      <div className="space-y-6">
        {playlist.map((track, idx) => {
          const isFallback = track.fallback_used;
          
          return (
            <div
              key={track.track_id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden p-5 flex flex-col md:flex-row gap-5 relative"
            >
              {/* Highlight badge for start/destination states */}
              <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-transparent via-spotify-green/20 to-transparent" />
              
              {/* Section 1: Track Details & Album Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px] font-bold tracking-wider uppercase">
                    {track.stage}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-spotify-green/10 border border-spotify-green/20 text-spotify-green text-[10px] font-extrabold tracking-wider">
                    {track.similarity_score}% MATCH
                  </span>
                  {isFallback && (
                    <span className="px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Custom Genre Filter Fallback
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-bold text-white truncate mb-0.5">{track.track_name}</h4>
                <p className="text-sm text-spotify-textMuted font-semibold truncate mb-3">{track.artists}</p>

                {/* Section 2: Audio Feature Sliders / Indicators */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 bg-black/20 rounded-xl p-3 text-xs border border-gray-900">
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1 text-[10px]">
                      <span>VALENCE (Cheerfulness)</span>
                      <span className="font-bold text-white">{track.valence.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${track.valence * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1 text-[10px]">
                      <span>ENERGY (Activity)</span>
                      <span className="font-bold text-white">{track.energy.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-400 h-full rounded-full" style={{ width: `${track.energy * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1 text-[10px]">
                      <span>DANCEABILITY (Rhythm)</span>
                      <span className="font-bold text-white">{track.danceability.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-spotify-green h-full rounded-full" style={{ width: `${track.danceability * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1 text-[10px]">
                      <span>ACOUSTICNESS (Organic)</span>
                      <span className="font-bold text-white">{track.acousticness.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: `${track.acousticness * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-xs text-gray-300 italic flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-spotify-green mt-0.5 shrink-0" />
                  <span>{track.explanation}</span>
                </p>
              </div>

              {/* Section 3: Interactive Spotify Embed Iframe Widget */}
              <div className="w-full md:w-80 flex items-center justify-center shrink-0 border-t md:border-t-0 md:border-l border-gray-800/80 pt-4 md:pt-0 md:pl-5">
                <iframe
                  src={`https://open.spotify.com/embed/track/${track.track_id}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  className="rounded-xl shadow-lg border border-gray-900 bg-spotify-card"
                  title={`Spotify Play Widget - ${track.track_name}`}
                ></iframe>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
