import React, { useState } from 'react';
import axios from 'axios';
import {
  Camera,
  Upload,
  Sparkles,
  Music,
  ChevronRight,
  RotateCcw,
  Volume2,
  Sliders,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

import CameraCapture from './components/CameraCapture';
import ImageUpload from './components/ImageUpload';
import MoodSelector from './components/MoodSelector';
import PlaylistView from './components/PlaylistView';
import MoodAnalytics from './components/MoodAnalytics';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing', 'detect', 'select', 'results'
  const [detectionMethod, setDetectionMethod] = useState('upload'); // 'upload' or 'camera'
  const [fileImage, setFileImage] = useState(null); // File object
  const [webcamImage, setWebcamImage] = useState(null); // base64 string
  
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState(null);
  
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [emotionScores, setEmotionScores] = useState(null);
  
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  
  const [selectedParams, setSelectedParams] = useState({
    current_emotion: 'neutral',
    target_emotion: 'happy',
    genre: 'pop',
    steps: 5
  });

  const resetAll = () => {
    setView('landing');
    setFileImage(null);
    setWebcamImage(null);
    setDominantEmotion(null);
    setEmotionScores(null);
    setPlaylist([]);
    setDetectError(null);
    setPlaylistError(null);
  };

  const handleStart = () => {
    setView('detect');
  };

  const analyzeEmotion = async () => {
    if (detectionMethod === 'upload' && !fileImage) {
      setDetectError('Please select or drag a file to upload first.');
      return;
    }
    if (detectionMethod === 'camera' && !webcamImage) {
      setDetectError('Please capture a photo first.');
      return;
    }

    setDetecting(true);
    setDetectError(null);

    try {
      let response;
      if (detectionMethod === 'upload') {
        const formData = new FormData();
        formData.append('file', fileImage);
        response = await axios.post('/api/detect-emotion', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post('/api/detect-emotion-base64', {
          image: webcamImage
        });
      }

      if (response.data && response.data.status === 'success') {
        setDominantEmotion(response.data.dominant_emotion);
        setEmotionScores(response.data.emotion_scores);
        setSelectedParams(prev => ({
          ...prev,
          current_emotion: response.data.dominant_emotion
        }));
        setView('select');
      } else {
        setDetectError(response.data.message || 'Error occurred during classification.');
      }
    } catch (err) {
      console.error(err);
      setDetectError('Failed to communicate with emotion detection backend.');
    } finally {
      setDetecting(false);
    }
  };

  const generatePlaylist = async (params) => {
    setPlaylistLoading(true);
    setPlaylistError(null);
    setSelectedParams(params);

    try {
      const response = await axios.get('/api/recommend', {
        params: {
          current_emotion: params.current_emotion,
          target_emotion: params.target_emotion,
          genre: params.genre,
          steps: params.steps
        }
      });

      if (response.data && response.data.status === 'success') {
        setPlaylist(response.data.playlist);
        setView('results');
      } else {
        setPlaylistError(response.data.message || 'Error creating playlist.');
      }
    } catch (err) {
      console.error(err);
      setPlaylistError('Failed to reach playlist recommendation service.');
    } finally {
      setPlaylistLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col z-10 select-none">
      
      {/* Decorative ambient glowing grids */}
      <div className="ambient-glow top-[15%] left-[5%]" />
      <div className="ambient-glow-purple bottom-[15%] right-[5%]" />

      {/* Header Bar */}
      <header className="w-full py-5 px-6 md:px-12 border-b border-gray-900 bg-[#0A0C10]/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={resetAll}>
          <div className="w-9 h-9 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-glow">
            <Volume2 className="w-5 h-5 fill-current" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Mood<span className="text-spotify-green">Shift</span>
          </span>
        </div>
        
        {view !== 'landing' && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start Over
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-10 max-w-7xl mx-auto w-full z-10">
        
        {/* ==================== VIEW 1: LANDING ==================== */}
        {view === 'landing' && (
          <div className="text-center max-w-3xl flex flex-col items-center animate-fade-in py-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-spotify-green/10 text-spotify-green text-xs font-extrabold rounded-full mb-6 border border-spotify-green/20 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Emotion-Transition Recommender
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Transition your mind,<br />
              <span className="bg-gradient-to-r from-spotify-green to-emerald-400 bg-clip-text text-transparent">
                one track at a time.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-spotify-textMuted max-w-xl mb-10 leading-relaxed">
              MoodShift doesn't just match your current emotion. Upload a photo or use your webcam to detect your starting mood, choose a target state, and let AI interpolate a sequence of Spotify tracks that guide you there gradually.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-spotify-green hover:bg-green-500 text-black font-extrabold text-base rounded-full shadow-lg shadow-spotify-green/20 hover:scale-105 transition flex items-center justify-center gap-2"
              >
                Scan Your Emotion
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== VIEW 2: EMOTION DETECTION ==================== */}
        {view === 'detect' && (
          <div className="w-full max-w-2xl flex flex-col items-center animate-fade-in">
            <div className="w-full flex items-center mb-6">
              <button
                onClick={() => setView('landing')}
                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition mr-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <h2 className="text-xl font-bold text-white mx-auto">1. Scan Current Mood</h2>
              <div className="w-16" /> {/* Balance spacer */}
            </div>

            {/* Toggle tabs for file upload vs webcam */}
            <div className="flex bg-[#0F1319]/80 border border-gray-800 rounded-xl p-1 mb-6 w-full max-w-xs">
              <button
                onClick={() => { setDetectionMethod('upload'); setDetectError(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition ${
                  detectionMethod === 'upload'
                    ? 'bg-spotify-green text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Image
              </button>
              <button
                onClick={() => { setDetectionMethod('camera'); setDetectError(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition ${
                  detectionMethod === 'camera'
                    ? 'bg-spotify-green text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Live Webcam
              </button>
            </div>

            {/* Render Upload component */}
            {detectionMethod === 'upload' ? (
              <ImageUpload
                onUpload={(file) => { setFileImage(file); setDetectError(null); }}
                onReset={() => setFileImage(null)}
              />
            ) : (
              <CameraCapture
                onCapture={(base64) => { setWebcamImage(base64); setDetectError(null); }}
                onReset={() => setWebcamImage(null)}
              />
            )}

            {/* Error notifications */}
            {detectError && (
              <div className="mt-4 p-3.5 bg-red-900/20 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 max-w-lg w-full">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{detectError}</span>
              </div>
            )}

            {/* Analyze Trigger */}
            <button
              onClick={analyzeEmotion}
              disabled={detecting || (detectionMethod === 'upload' && !fileImage) || (detectionMethod === 'camera' && !webcamImage)}
              className="mt-6 px-10 py-4 bg-spotify-green hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-extrabold text-sm rounded-full shadow-lg shadow-spotify-green/20 hover:scale-105 active:scale-95 disabled:scale-100 transition-all flex items-center gap-2"
            >
              {detecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Analyzing Facial Expressions...
                </>
              ) : (
                'Analyze Emotion'
              )}
            </button>
          </div>
        )}

        {/* ==================== VIEW 3: SETTINGS SELECTION ==================== */}
        {view === 'select' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl flex items-center mb-6">
              <button
                onClick={() => setView('detect')}
                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition mr-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Re-scan
              </button>
              <h2 className="text-xl font-bold text-white mx-auto">2. Target Configuration</h2>
              <div className="w-16" /> {/* Balance spacer */}
            </div>

            <MoodSelector
              currentEmotion={dominantEmotion}
              onGenerate={generatePlaylist}
              loading={playlistLoading}
            />

            {playlistError && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2 max-w-2xl w-full">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{playlistError}</span>
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW 4: RESULTS & ANALYTICS ==================== */}
        {view === 'results' && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            {/* Header controls */}
            <div className="w-full max-w-4xl flex items-center mb-4">
              <button
                onClick={() => setView('select')}
                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition mr-auto"
              >
                <ChevronLeft className="w-4 h-4" /> Settings
              </button>
              <h2 className="text-xl font-extrabold text-white mx-auto">Your Shift Journey Playlist</h2>
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 text-xs font-bold text-spotify-green hover:text-green-400 uppercase tracking-wider transition ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* Split layout: Analytics and Playlist */}
            <MoodAnalytics
              emotionScores={emotionScores}
              playlist={playlist}
              genre={selectedParams.genre}
            />

            <PlaylistView
              playlist={playlist}
              currentEmotion={selectedParams.current_emotion}
              targetEmotion={selectedParams.target_emotion}
              genre={selectedParams.genre}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-gray-900 bg-[#0A0C10]/40 text-center text-xs text-gray-600 z-10 mt-auto">
        &copy; {new Date().getFullYear()} MoodShift. Built using React, Tailwind CSS, Recharts, and FastAPI.
      </footer>
    </div>
  );
}
