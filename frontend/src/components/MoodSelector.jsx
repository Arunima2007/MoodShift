import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, HelpCircle, Sliders, ChevronDown } from 'lucide-react';

const MOODS = [
  { id: 'happy', label: 'Happy', desc: 'Joyful & energetic', color: 'from-amber-500 to-yellow-400 bg-amber-500/10 border-amber-500/30 text-amber-400 glow-happy' },
  { id: 'calm', label: 'Calm', desc: 'Peaceful & relaxing', color: 'from-cyan-500 to-blue-400 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 glow-calm' },
  { id: 'energetic', label: 'Energetic', desc: 'Pumped & active', color: 'from-lime-500 to-emerald-400 bg-lime-500/10 border-lime-500/30 text-lime-400 glow-energetic' },
  { id: 'neutral', label: 'Neutral', desc: 'Balanced & centered', color: 'from-emerald-500 to-teal-400 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-neutral' },
  { id: 'sad', label: 'Sad', desc: 'Emotional & reflective', color: 'from-blue-600 to-indigo-500 bg-blue-600/10 border-blue-600/30 text-blue-400 glow-sad' },
  { id: 'angry', label: 'Angry', desc: 'Intense & fiery', color: 'from-red-650 to-orange-500 bg-red-600/10 border-red-650/30 text-red-400 glow-angry' }
];

const POPULAR_GENRES = [
  { label: 'Pop', value: 'pop' },
  { label: 'Rock', value: 'rock' },
  { label: 'EDM', value: 'edm' },
  { label: 'Bollywood', value: 'indian' },
  { label: 'Lo-Fi', value: 'chill' },
  { label: 'Hip-Hop', value: 'hip-hop' }
];

export default function MoodSelector({ currentEmotion, onGenerate, loading }) {
  const [targetEmotion, setTargetEmotion] = useState('happy');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [steps, setSteps] = useState(5);
  
  const [genresList, setGenresList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch unique genres on load
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/genres');
        if (response.data && response.data.genres) {
          setGenresList(response.data.genres);
        }
      } catch (err) {
        console.error('Error fetching genres list:', err);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreSearch = (e) => {
    setSearchQuery(e.target.value);
    setDropdownOpen(true);
  };

  const filteredGenres = genresList.filter(g =>
    g.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectGenre = (genre) => {
    setSelectedGenre(genre);
    setSearchQuery('');
    setDropdownOpen(false);
  };

  const triggerGenerate = () => {
    onGenerate({
      current_emotion: currentEmotion || 'neutral',
      target_emotion: targetEmotion,
      genre: selectedGenre,
      steps: steps
    });
  };

  return (
    <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 md:p-8 animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-spotify-green" />
        Configure Your Shift
      </h2>

      {/* Starting Mood Check */}
      <div className="mb-6 pb-6 border-b border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">Starting Emotion</span>
          <span className="text-lg font-bold text-white capitalize">{currentEmotion || 'Not Detected (Defaults to Neutral)'}</span>
        </div>
        <div className="text-xs text-gray-400 max-w-xs text-right">
          Analyzed from your photo. This is the starting point of the music transition.
        </div>
      </div>

      {/* 1. Target Mood Grid */}
      <div className="mb-6">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-3">
          1. Choose Your Target Mood
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MOODS.map(mood => {
            const isSelected = targetEmotion === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setTargetEmotion(mood.id)}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-br ${mood.color} scale-[1.02] border-opacity-70 shadow-lg`
                    : 'bg-[#0F1319]/40 border-gray-800 hover:border-gray-700 hover:bg-[#0F1319]/80 text-gray-400'
                }`}
              >
                <span className={`text-base font-bold transition-colors ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {mood.label}
                </span>
                <span className="text-xs text-gray-500 mt-1">{mood.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Genre Selection */}
      <div className="mb-6 relative">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-3">
          2. Select Music Genre
        </label>
        
        {/* Popular Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {POPULAR_GENRES.map(g => (
            <button
              key={g.value}
              onClick={() => {
                setSelectedGenre(g.value);
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                selectedGenre === g.value
                  ? 'bg-spotify-green text-black border-spotify-green hover:scale-105'
                  : 'bg-transparent border-gray-800 hover:border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Searchable input */}
        <div className="relative">
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-full px-4 py-3 bg-[#0F1319]/80 border border-gray-800 rounded-xl cursor-pointer hover:border-gray-700 transition"
          >
            <span className="text-sm text-white capitalize font-medium">
              Selected: <strong className="text-spotify-green">{selectedGenre}</strong>
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121620] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-30 flex flex-col max-h-60">
              <input
                type="text"
                placeholder="Search 114+ Spotify genres..."
                value={searchQuery}
                onChange={handleGenreSearch}
                className="w-full px-4 py-2.5 bg-[#0F1319] border-b border-gray-800 text-sm focus:outline-none focus:border-spotify-green text-white"
                autoFocus
              />
              <div className="overflow-y-auto flex-1">
                {filteredGenres.length > 0 ? (
                  filteredGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => selectGenre(genre)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-spotify-green hover:text-black hover:font-semibold transition capitalize"
                    >
                      {genre}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-gray-500 text-center">No genres found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Steps Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-gray-400" />
            3. Playlist Transition Steps
          </label>
          <span className="text-sm font-bold text-spotify-green bg-spotify-green/10 px-2 py-0.5 rounded">
            {steps} Tracks
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="7"
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value))}
          className="w-full accent-spotify-green cursor-pointer h-1.5 bg-gray-800 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 px-1">
          <span>3 (Fast)</span>
          <span>5 (Gradual)</span>
          <span>7 (Slow & Smooth)</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={triggerGenerate}
        disabled={loading}
        className="w-full py-4 bg-spotify-green hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-extrabold text-base rounded-full shadow-lg shadow-spotify-green/25 hover:shadow-spotify-green/45 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Generating recommendations...
          </>
        ) : (
          <>
            🎵 Generate Transition Playlist
          </>
        )}
      </button>
    </div>
  );
}
