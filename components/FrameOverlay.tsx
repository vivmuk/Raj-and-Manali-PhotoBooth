
import React from 'react';

interface FrameOverlayProps {
  interactive?: boolean;
}

const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`absolute w-8 h-8 text-yellow-300 drop-shadow-md ${className}`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Cloud: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`absolute w-24 h-24 text-white/90 drop-shadow-lg ${className}`} viewBox="0 0 100 60" fill="currentColor">
    <path d="M83.4,26.6C82.5,16.9,74.5,9.2,64.4,9.2c-4.6,0-8.9,1.7-12.2,4.6c-2.3-5-7.3-8.4-13-8.4c-8.1,0-14.7,6.6-14.7,14.7 c0,0.9,0.1,1.8,0.3,2.6C12.3,24.1,0,36,0,50.6C0,61.2,8.8,70,19.4,70h61.1c11.3,0,20.5-9.2,20.5-20.5 C101,38.8,93.5,30.3,83.4,26.6z" transform="translate(0, -15)"/>
  </svg>
);


const FrameOverlay: React.FC<FrameOverlayProps> = ({ interactive = true }) => {
  return (
    <div className={`absolute inset-0 z-10 ${interactive ? 'pointer-events-none' : ''}`}>
      {/* Decorative Elements */}
      <Cloud className="top-4 left-4 opacity-80" />
      <Cloud className="bottom-20 right-2 opacity-70 scale-x-[-1]" />
      <Star className="top-24 left-10 transform rotate-12" />
      <Star className="top-10 right-10 transform -rotate-12" />
      <Star className="bottom-28 left-8 transform rotate-6 scale-75" />
      <Star className="bottom-40 right-12 transform -rotate-6 scale-90" />
      
      {/* New Emojis */}
      <div className="absolute top-1/4 left-4 text-4xl transform -rotate-12 opacity-80">🧸</div>
      <div className="absolute top-1/3 right-5 text-5xl transform rotate-15 opacity-80">🍼</div>
      <div className="absolute bottom-1/2 left-5 text-4xl transform rotate-10 opacity-80">👣</div>
      <div className="absolute bottom-[40%] right-4 text-3xl transform -rotate-15 opacity-80">👶</div>


      {/* Frame Text Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-28 md:pb-24 bg-gradient-to-t from-blue-200/50 to-transparent">
        <div className="text-center text-white">
          <h1 className="font-script text-3xl md:text-4xl" style={{ textShadow: '2px 2px 4px rgba(49, 130, 206, 0.7)' }}>
            Manali & Raj Baby Shower
          </h1>
          <p className="font-script text-2xl md:text-3xl" style={{ textShadow: '1px 1px 3px rgba(49, 130, 206, 0.7)' }}>
            11.23.2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default FrameOverlay;