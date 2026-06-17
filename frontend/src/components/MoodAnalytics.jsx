import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  Legend,
  CartesianGrid
} from 'recharts';
import { BarChart2, TrendingUp, Sparkles } from 'lucide-react';

const EMOTION_COLORS = {
  happy: '#F59E0B',    // Amber
  sad: '#3B82F6',      // Blue
  angry: '#EF4444',    // Red
  fear: '#8B5CF6',     // Purple
  surprise: '#EC4899', // Pink
  neutral: '#10B981',  // Emerald
};

export default function MoodAnalytics({ emotionScores, playlist, genre }) {
  // 1. Format emotion scores for the bar chart
  const emotionData = emotionScores
    ? Object.keys(emotionScores).map(key => ({
        name: key.toUpperCase(),
        confidence: Number((emotionScores[key] * 100).toFixed(1)),
        color: EMOTION_COLORS[key] || '#9CA3AF'
      })).sort((a, b) => b.confidence - a.confidence)
    : [];

  // 2. Format playlist data for the valence/energy transition chart
  const transitionData = playlist
    ? playlist.map(track => ({
        name: track.track_name.length > 15 ? `${track.track_name.substring(0, 15)}...` : track.track_name,
        valence: track.valence,
        energy: track.energy,
        danceability: track.danceability,
        step: `Track ${track.step}`
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121620] border border-gray-800 p-3 rounded-lg text-xs shadow-2xl">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    };
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121620] border border-gray-800 p-3 rounded-lg text-xs shadow-2xl">
          <p className="font-bold text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-6 mb-1">
              <span style={{ color: entry.color }} className="font-semibold">{entry.name.toUpperCase()}:</span>
              <span className="text-white font-bold">{entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
      
      {/* Chart 1: Emotion Confidence Breakdown */}
      {emotionData.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[380px]">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-spotify-green" />
            Detected Emotion Profile (%)
          </h4>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={emotionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  tickLine={false} 
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="confidence" radius={[4, 4, 0, 0]}>
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 2: Transition Path (Valence / Energy Line Chart) */}
      {transitionData.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[380px]">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-spotify-green" />
            Valence & Energy Shift Journey
          </h4>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={transitionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="step" 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  fontSize={10} 
                  tickLine={false} 
                  domain={[0, 1]}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconSize={10} 
                  tick={{ fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="valence"
                  name="Valence (Happiness)"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Energy (Activity)"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Analytics Insights Banner */}
      {playlist && playlist.length > 0 && (
        <div className="col-span-1 md:col-span-2 glass-panel rounded-2xl p-5 flex items-center gap-4 bg-spotify-green/5 border border-spotify-green/10">
          <div className="w-10 h-10 rounded-full bg-spotify-green/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-spotify-green" />
          </div>
          <div className="text-xs md:text-sm text-gray-300">
            <strong>Transition Insight:</strong> The playlist gradually guides you using features mapped in 4D space. 
            Valence starts matching your current mood of <strong className="text-spotify-green capitalize">{playlist[0].explanation.split(' ')[5]}</strong> and 
            progresses smoothly to match <strong className="text-spotify-green capitalize">{playlist[playlist.length-1].explanation.split(' ')[6]}</strong>. 
            Overall transition is completed over <strong>{playlist.length} stages</strong> in the <strong>{playlist[0].fallback_used ? 'all-genres' : genre}</strong> library.
          </div>
        </div>
      )}
    </div>
  );
}
