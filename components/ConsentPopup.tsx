
import React from 'react';
import { GOOGLE_PHOTOS_ALBUM_URL } from '../constants';

interface ConsentPopupProps {
  onConsent: (agreed: boolean) => void;
}

const ConsentPopup: React.FC<ConsentPopupProps> = ({ onConsent }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-3">Quick Note!</h2>
        <p className="text-gray-600 mb-4">
          To get started, this photo booth needs access to your camera. Your photos will be saved to your device for you to share.
        </p>
        <p className="text-xs text-gray-500 mb-6">
          You can view the shared album <a href={GOOGLE_PHOTOS_ALBUM_URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">here</a>.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onConsent(false)}
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConsent(true)}
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentPopup;
