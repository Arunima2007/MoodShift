import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Video, VideoOff, Check } from 'lucide-react';

export default function CameraCapture({ onCapture, onReset }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Bind the camera stream to the video element once it is mounted in the DOM
  useEffect(() => {
    if (videoRef.current && stream && cameraActive && !capturedImage) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraActive, capturedImage]);

  const startCamera = async () => {
    setError(null);
    setLoading(true);
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      setStream(mediaStream);
      setCameraActive(true);
      setCapturedImage(null);
      if (onReset) onReset();
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access camera. Please check permissions or upload an image instead.');
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Draw current video frame onto canvas
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get base64 data URL
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
      onCapture(dataUrl);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (onReset) onReset();
    startCamera();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full aspect-video max-w-lg bg-[#0F1319] rounded-xl overflow-hidden border border-gray-800 shadow-inner flex flex-col justify-center items-center">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0F1319]/90 z-10">
            <VideoOff className="w-12 h-12 text-red-500 mb-3" />
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={startCamera}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Live Camera View */}
        {cameraActive && !capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        )}

        {/* Captured Snapshot Preview */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured face"
            className="w-full h-full object-cover transform -scale-x-100"
          />
        )}

        {/* Initial Prompt / Inactive State */}
        {!cameraActive && !capturedImage && !error && (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-spotify-green/10 rounded-full flex items-center justify-center mb-4 animate-pulse-slow">
              <Camera className="w-8 h-8 text-spotify-green" />
            </div>
            <p className="text-gray-300 font-semibold mb-1">Use Your Webcam</p>
            <p className="text-xs text-gray-500 max-w-xs mb-4">
              Capture a photo of your face directly in the browser to analyze your expression.
            </p>
            <button
              onClick={startCamera}
              disabled={loading}
              className="px-6 py-2.5 bg-spotify-green hover:bg-green-500 text-black font-semibold text-sm rounded-full shadow-lg shadow-spotify-green/20 hover:scale-105 active:scale-95 transition"
            >
              {loading ? 'Starting Camera...' : 'Open Camera'}
            </button>
          </div>
        )}

        {/* Scanning Overlay Grid Effect */}
        {cameraActive && !capturedImage && (
          <div className="absolute inset-0 pointer-events-none border-2 border-spotify-green/30 animate-pulse">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-spotify-green to-transparent absolute top-0 left-0 animate-[scan_2.5s_linear_infinite]" />
          </div>
        )}
      </div>

      {/* Hidden canvas for snapshot rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Control Buttons */}
      <div className="flex gap-4 mt-4">
        {cameraActive && !capturedImage && (
          <>
            <button
              onClick={capturePhoto}
              className="flex items-center gap-2 px-5 py-2.5 bg-spotify-green hover:bg-green-500 text-black font-semibold rounded-full shadow-md transition"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition"
            >
              Cancel
            </button>
          </>
        )}

        {capturedImage && (
          <>
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full transition"
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium rounded-full">
              <Check className="w-4 h-4" /> Photo Selected
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
