import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RefreshIcon, SparklesIcon, DownloadIcon, UploadIcon } from './Icons';
import { AIStyle, AspectRatio } from '../types';
import { applyAIStyle } from '../services/geminiService';
import { GOOGLE_PHOTOS_ALBUM_URL, COUPLE_STICKER_BASE64 } from '../constants';

interface PreviewScreenProps {
  imageSrc: string;
  onRetake: () => void;
  onDone: () => void;
  aspectRatio: AspectRatio;
}

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-40">
        <div className="w-16 h-16 border-4 border-t-4 border-t-blue-400 border-gray-200 rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-lg">Applying AI magic...</p>
    </div>
);

const PreviewScreen: React.FC<PreviewScreenProps> = ({ imageSrc, onRetake, onDone, aspectRatio }) => {
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Reset the current image if the original source changes (e.g., on retake)
  useEffect(() => setCurrentImage(imageSrc), [imageSrc]);

  const drawImageWithFrame = useCallback(async (canvas: HTMLCanvasElement | null, imageToDrawSrc: string) => {
    return new Promise<void>((resolve, reject) => {
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return reject('Canvas not ready');
      
      const mainImage = new Image();
      mainImage.src = imageToDrawSrc;

      const mainImagePromise = new Promise<void>((res, rej) => {
          mainImage.onload = () => res();
          mainImage.onerror = () => rej(new Error('Failed to load main image.'));
      });

      const promises: Promise<void>[] = [mainImagePromise];
      
      let stickerImage: HTMLImageElement | null = null;
      if (COUPLE_STICKER_BASE64) {
        stickerImage = new Image();
        stickerImage.src = COUPLE_STICKER_BASE64;
        const stickerImagePromise = new Promise<void>((res) => {
            if (!stickerImage) return res();
            stickerImage.onload = () => res();
            stickerImage.onerror = () => {
                console.warn('Failed to load sticker image, proceeding without it.');
                stickerImage = null; // Ensure it's not drawn
                res(); // Resolve instead of reject so saving can continue
            };
        });
        promises.push(stickerImagePromise);
      }

      Promise.all(promises).then(() => {
          canvas.width = mainImage.naturalWidth;
          canvas.height = mainImage.naturalHeight;

          // 1. Draw the photo
          ctx.drawImage(mainImage, 0, 0);

          // 2. Draw Emojis
          const emojis = [
            { char: '🧸', x: 0.1, y: 0.25, size: 0.1, rotation: -12, alpha: 0.8 },
            { char: '🍼', x: 0.9, y: 0.33, size: 0.12, rotation: 15, alpha: 0.8 },
            { char: '👣', x: 0.12, y: 0.5, size: 0.1, rotation: 10, alpha: 0.8 },
            { char: '👶', x: 0.9, y: 0.6, size: 0.08, rotation: -15, alpha: 0.8 },
          ];

          emojis.forEach(emoji => {
            ctx.save();
            ctx.font = `${canvas.width * emoji.size}px sans-serif`;
            ctx.globalAlpha = emoji.alpha;
            const textMetrics = ctx.measureText(emoji.char);
            const tx = canvas.width * emoji.x - textMetrics.width / 2;
            const ty = canvas.height * emoji.y;
            ctx.translate(tx, ty);
            ctx.rotate(emoji.rotation * Math.PI / 180);
            ctx.fillText(emoji.char, 0, 0);
            ctx.restore();
          });

          // 3. Draw the couple sticker if it loaded
          if (stickerImage && stickerImage.complete && stickerImage.naturalWidth !== 0) {
            const stickerSize = canvas.width * 0.18;
            const stickerX = canvas.width / 2 - stickerSize / 2;
            const stickerY = canvas.height - (canvas.height * 0.22);
            
            ctx.save();
            ctx.beginPath();
            ctx.arc(stickerX + stickerSize / 2, stickerY + stickerSize / 2, stickerSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(stickerImage, stickerX, stickerY, stickerSize, stickerSize);
            ctx.restore();
            
            ctx.beginPath();
            ctx.arc(stickerX + stickerSize / 2, stickerY + stickerSize / 2, stickerSize / 2, 0, Math.PI * 2, true);
            ctx.lineWidth = canvas.width * 0.01;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            ctx.closePath();
          }

          // 4. Draw the frame text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const bottomPadding = canvas.height * 0.04;
          const titleSize = canvas.width * 0.07;
          const dateSize = canvas.width * 0.045;

          ctx.shadowColor = 'rgba(49, 130, 206, 0.7)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillStyle = 'white';

          ctx.font = `bold ${titleSize}px 'Pacifico', cursive`;
          ctx.fillText('Manali & Raj Baby Shower', canvas.width / 2, canvas.height - bottomPadding - dateSize * 1.5);

          ctx.font = `${dateSize}px 'Pacifico', cursive`;
          ctx.fillText('11.23.2025', canvas.width / 2, canvas.height - bottomPadding);
          
          ctx.shadowColor = 'transparent'; // Reset shadow

          resolve();
      }).catch(error => reject(error));
    });
  }, []);

  // Effect to draw the image and frame onto the canvas whenever the source image changes.
  useEffect(() => {
    drawImageWithFrame(canvasRef.current, currentImage);
  }, [currentImage, drawImageWithFrame]);


  const handleApplyStyle = useCallback(async (style: AIStyle) => {
    setIsLoading(true);
    try {
      const styledImage = await applyAIStyle(imageSrc, style); // Always style the original
      setCurrentImage(styledImage);
    } catch (error) {
      alert("Sorry, we couldn't apply the style. Please try another one or save the original.");
    } finally {
      setIsLoading(false);
    }
  }, [imageSrc]);
  

  const handleSaveAndShare = async () => {
    setIsLoading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not ready");

      // Redraw one last time to ensure highest quality before saving
      await drawImageWithFrame(canvas, currentImage);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const filename = `Manali_Raj_Baby_Shower_${new Date().getTime()}.jpg`;

      // Trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowSavedMessage(true);
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Could not save the image. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col bg-gray-900">
      {isLoading && <LoadingSpinner />}
      
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-2">
         <div className={`w-full max-w-full max-h-full relative shadow-2xl ${aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-[9/16]'}`}>
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
         </div>
      </div>

      {showSavedMessage ? (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 z-30 flex flex-col items-center">
            <p className="text-xl font-semibold text-blue-800 mb-3 text-center">Photo Saved to your Device!</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <a href={GOOGLE_PHOTOS_ALBUM_URL} target="_blank" rel="noopener noreferrer"
                   className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors text-center">
                    <UploadIcon className="w-6 h-6" />
                    <span>Add to Album</span>
                </a>
                <button onClick={onDone} className="flex-1 bg-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors">
                    Done
                </button>
            </div>
             <p className="text-sm text-gray-600 mt-3 text-center">Now, please upload your saved photo to the album!</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm p-3 z-30">
          <div className="flex items-center justify-center gap-2 mb-3">
            <SparklesIcon className="w-6 h-6 text-purple-500" />
            <h3 className="text-center font-semibold text-blue-800">Add an AI Style</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(Object.values(AIStyle)).map(style => (
              <button key={style} onClick={() => handleApplyStyle(style)} className="bg-blue-100 text-blue-800 text-xs font-semibold p-2 rounded-lg hover:bg-blue-200 transition-colors text-center shadow-sm">
                {style}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onRetake} className="flex-1 bg-yellow-400 text-yellow-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors">
              <RefreshIcon className="w-6 h-6" />
              <span>Retake</span>
            </button>
            <button onClick={handleSaveAndShare} className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-center">
              <DownloadIcon className="w-6 h-6 flex-shrink-0" />
              <span className="leading-tight">Save and share with Raj and Manali</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewScreen;