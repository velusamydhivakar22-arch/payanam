import React from 'react';
import { MapPin, Wifi, Coffee, Accessibility } from 'lucide-react';
import { DEMO_STATIONS } from '../data/stations';
import type { Language } from '../types/railway';

interface NearbyStationsViewProps {
  language: Language;
  onSelectStationAsSource: (stationCode: string) => void;
}

export const NearbyStationsView: React.FC<NearbyStationsViewProps> = ({
  language,
  onSelectStationAsSource
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-8 border-b border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center space-x-2">
          <MapPin className="w-7 h-7 text-railway-600" />
          <span>{language === 'ta' ? 'அருகிலுள்ள முக்கிய ரயில் நிலையங்கள்' : 'Major Junctions & Station Directory'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'ta'
            ? 'தெற்கு ரயில்வே மண்டலத்தின் முக்கிய சந்திப்புகள் மற்றும் பயண வசதிகள்.'
            : 'Explore key terminals across Southern Railway zone with live platform counts and amenities.'}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_STATIONS.map((stn) => (
          <div
            key={stn.code}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-lg text-navy-900">
                    {language === 'ta' ? stn.nameTamil : stn.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-xs font-black bg-railway-100 text-railway-700">
                    {stn.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {stn.state} • {stn.junctionType}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-railway-700">{stn.platformsCount}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Platforms</p>
              </div>
            </div>

            {/* Amenities badges */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100">
                <Wifi className="w-3.5 h-3.5 text-railway-600" />
                <span>RailWire High-Speed Wi-Fi</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100">
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>Executive AC Lounge</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100">
                <Accessibility className="w-3.5 h-3.5 text-emerald-600" />
                <span>Divyangjan Friendly Ramp & Lift</span>
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectStationAsSource(stn.code)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-railway-50 hover:bg-railway-100 text-railway-700 border border-railway-200 transition-colors"
              >
                {language === 'ta' ? 'புறப்படும் நிலையமாக அமைக்க' : 'Select as Departure Station'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
