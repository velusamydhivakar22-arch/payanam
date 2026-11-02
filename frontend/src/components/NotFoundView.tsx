import React from 'react';
import { Train, Home } from 'lucide-react';
import type { Language } from '../types/railway';

interface NotFoundViewProps {
  language: Language;
  onGoHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ language, onGoHome }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-railway-50 text-railway-600 border border-railway-200 flex items-center justify-center mx-auto shadow-sm">
        <Train className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-railway-600 uppercase tracking-widest">
          ERROR 404 • TRACK NOT FOUND
        </span>
        <h2 className="text-3xl font-extrabold text-navy-900 font-display">
          {language === 'ta' ? 'நிலையத்தை அடைய முடியவில்லை' : 'Platform or Route Not Found'}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {language === 'ta'
            ? 'நீங்கள் தேடும் பக்கம் அல்லது ரயில் சேவை மாற்றப்பட்டிருக்கலாம்.'
            : 'The page or train service timetable you requested has moved or does not exist.'}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={onGoHome}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-railway-600 hover:bg-railway-700 text-white shadow-md inline-flex items-center space-x-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{language === 'ta' ? 'முகப்புக்குத் திரும்பு' : 'Return to Home Station'}</span>
        </button>
      </div>
    </div>
  );
};
