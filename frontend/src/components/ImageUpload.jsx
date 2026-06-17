import React, { useState, useRef } from 'react';
import { Upload, X, FileImage } from 'lucide-react';

export default function ImageUpload({ onUpload, onReset }) {
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, JPG, or PNG).');
      return;
    }

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      onUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    if (onReset) onReset();
  };

  return (
    <div className="w-full max-w-lg">
      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-spotify-green bg-spotify-green/5 scale-[1.01]'
              : 'border-gray-800 hover:border-gray-700 bg-[#0F1319]/50 hover:bg-[#0F1319]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 bg-spotify-green/10 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-spotify-green" />
            </div>
            <p className="text-sm text-gray-300 font-semibold mb-1">
              Drag & drop your face photo here
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Supports JPEG, JPG, and PNG files
            </p>
            <button
              type="button"
              className="px-4 py-1.5 bg-gray-850 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-xs font-semibold rounded-lg text-white transition"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-800 shadow-lg group">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={clearImage}
              className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg transform hover:scale-105 active:scale-95 transition"
              title="Remove image"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={clearImage}
            className="absolute top-3 right-3 p-1.5 bg-black/70 hover:bg-black text-gray-300 rounded-full md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
