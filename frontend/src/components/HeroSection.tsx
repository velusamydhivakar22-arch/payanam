import React from 'react';
import { ShieldCheck, Zap, Clock, ArrowRight } from 'lucide-react';
import type { Language } from '../types/railway';
import { TRANSLATIONS } from '../data/translations';

interface HeroSectionProps {
  language: Language;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language, onExploreClick }) => {
  const t = TRANSLATIONS[language];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-railway-900 via-navy-900 to-navy-950 text-white pt-10 pb-20">
      {/* Background railway track pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rail-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="10" y1="20" x2="50" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="40" x2="50" y2="40" stroke="currentColor" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rail-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Tagline & Features */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-railway-500/20 border border-railway-400/30 text-railway-300 text-xs font-semibold backdrop-blur-sm animate-pulse">
              <Zap className="w-4 h-4 text-railway-400" />
              <span>{language === 'ta' ? 'அதிநவீன 3 அடுக்கு முன்னுரிமை ஒதுக்கீட்டு அமைப்பு' : '3-Tier Intelligent Priority Railway Quota'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight text-white">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Quick 3-Mode Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 mb-1.5 shadow-sm shadow-rose-500/50"></span>
                <p className="text-xs font-bold text-white">
                  {language === 'ta' ? '1. அவசர முறை' : '1. Emergency'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'ta' ? 'மருத்துவ அவசரம் & உடனடி' : 'Top priority override'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mb-1.5 shadow-sm shadow-amber-500/50"></span>
                <p className="text-xs font-bold text-white">
                  {language === 'ta' ? '2. இணைப்பு முறை' : '2. Connecting'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'ta' ? 'இணைப்பு ரயில்/விமானம்' : 'Inbound connection'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-railway-400 mb-1.5 shadow-sm shadow-railway-400/50"></span>
                <p className="text-xs font-bold text-white">
                  {language === 'ta' ? '3. சாதாரண முறை' : '3. Normal'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'ta' ? 'நிலையான FIFO முறை' : 'Standard FIFO booking'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-railway-500 to-railway-600 hover:from-railway-600 hover:to-railway-700 text-white shadow-lg shadow-railway-500/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>{language === 'ta' ? 'இப்போதே டிக்கெட் தேடுங்கள்' : 'Search Trains Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-4 text-xs text-slate-300 font-medium pl-2">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ta' ? '100% பாதுகாப்பான கட்டணம்' : '100% Safe Payments'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{language === 'ta' ? 'நிகழ்நேர நடைமேடை மேலாண்மை' : '5-Min Platform Buffer'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D High Speed Train Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glow backdrop effect */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-railway-500 via-sky-400 to-rose-500 opacity-30 blur-2xl"></div>

              {/* Card Container with Realistic Train Image */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-navy-900/90 shadow-2xl backdrop-blur-md">
                
                {/* Train Photography Image */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
                  <img
                    src="/hero_train.jpg"
                    alt="Payanam Junction High-Speed Train"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  
                  {/* Subtle Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>

                  {/* High Speed Badge */}
                  <div className="absolute top-4 left-4 bg-navy-950/80 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold text-white flex items-center space-x-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{language === 'ta' ? 'வந்தே பாரத் & சூப்பர்பாஸ்ட் நெட்வொர்க்' : 'High-Speed Express Rail'}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white text-sm">
                          {language === 'ta' ? 'வந்தே பாரத் அதிவிரைவு வண்டி' : 'Vande Bharat Express'}
                        </p>
                        <p className="text-slate-300 text-[11px]">
                          {language === 'ta' ? 'சென்னை சென்ட்ரல் ➔ பெங்களூரு (4ம 30நி)' : 'Chennai Central ➔ Bengaluru (4h 30m)'}
                        </p>
                      </div>
                      <span className="bg-emerald-500/90 text-white font-bold text-[10px] px-2 py-1 rounded">
                        160 KM/H
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Stats */}
                <div className="p-4 grid grid-cols-3 gap-2 bg-navy-950/95 border-t border-white/10 text-center">
                  <div>
                    <p className="text-xl font-extrabold text-railway-400">99.8%</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {language === 'ta' ? 'சரியான நேரம்' : 'On-Time'}
                    </p>
                  </div>
                  <div className="border-x border-white/10">
                    <p className="text-xl font-extrabold text-emerald-400">100/100</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {language === 'ta' ? 'இருக்கை ஒதுக்கீடு' : 'Seats/Trip'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-amber-400">5 MIN</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {language === 'ta' ? 'நடைமேடை இடைவெளி' : 'Buffer Release'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
