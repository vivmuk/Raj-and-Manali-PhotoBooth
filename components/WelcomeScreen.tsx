import React, { useRef } from 'react';
import FrameOverlay from './FrameOverlay';

interface WelcomeScreenProps {
  onStart: () => void;
  onPhotoUpload: (image: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onPhotoUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onPhotoUpload(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-yellow-300/50">
      <FrameOverlay interactive={false} />
      <div className="z-10 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
          Baby Shower
        </h1>
        <p className="text-2xl md:text-3xl font-script text-blue-600 mb-6">
          AI Photo Booth
        </p>
        <p className="text-lg text-blue-700 mb-8">
          Snap or upload a moment for Manali & Raj!
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
            <button
            onClick={onStart}
            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
            Take a Photo! 🎉
            </button>
            <button
            onClick={handleUploadClick}
            className="bg-white text-blue-600 border-2 border-blue-600 font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
            Upload Photo 📂
            </button>
        </div>
        <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,image/heic,image/heif"
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;