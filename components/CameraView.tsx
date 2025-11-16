import React, { useRef, useEffect, useState, useCallback } from 'react';
import FrameOverlay from './FrameOverlay';
import { AspectRatio } from '../types';

interface CameraViewProps {
  onPhotoCapture: (image: string) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onPhotoCapture, onAspectRatioChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Please check permissions in your browser settings.");
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  useEffect(() => {
    const handleOrientationChange = () => {
      // Use a small timeout to allow the viewport dimensions to stabilize
      setTimeout(() => {
        const portrait = window.innerHeight > window.innerWidth;
        setIsPortrait(portrait);
        onAspectRatioChange(portrait ? '9:16' : '16:9');
      }, 100);
    };

    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange(); // Initial check

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [onAspectRatioChange]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const canvas = document.createElement('canvas');
      
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      let sx = 0, sy = 0, sWidth = 0, sHeight = 0;
      const targetAspectRatio = isPortrait ? 9 / 16 : 16 / 9;
      const videoRatio = videoWidth / videoHeight;

      if (videoRatio > targetAspectRatio) {
        // Video is wider than target, crop sides
        sHeight = videoHeight;
        sWidth = sHeight * targetAspectRatio;
        sx = (videoWidth - sWidth) / 2;
        sy = 0;
      } else {
        // Video is taller than target, crop top/bottom
        sWidth = videoWidth;
        sHeight = sWidth / targetAspectRatio;
        sx = 0;
        sy = (videoHeight - sHeight) / 2;
      }

      canvas.width = sWidth;
      canvas.height = sHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onPhotoCapture(dataUrl);
      }
    }
  }, [onPhotoCapture, isPortrait]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Camera Error</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex bg-black overflow-hidden ${isPortrait ? 'flex-col' : 'flex-row'}`}>
      {/* Camera Preview Area */}
      <div className="relative flex-grow overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <FrameOverlay />
      </div>

      {/* Control Bar */}
      <div className={`flex-shrink-0 bg-black/30 backdrop-blur-sm flex items-center justify-center ${isPortrait ? 'w-full h-40' : 'h-full w-40'}`}>
        <button
          onClick={handleCapture}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-90 transition-transform ring-4 ring-white/30"
          aria-label="Take Photo"
        >
          <div className="w-20 h-20 bg-white rounded-full border-4 border-blue-500"></div>
        </button>
      </div>
    </div>
  );
};

export default CameraView;