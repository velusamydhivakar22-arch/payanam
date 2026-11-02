import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRightLeft,
  Calendar,
  Users,
  Search,
  Train,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass
} from 'lucide-react';
import type { Station, BookingMode, SearchParams, Language } from '../types/railway';
import { TRANSLATIONS } from '../data/translations';
import { railwayService } from '../services/railwayService';

interface SearchFormProps {
  stations: Station[];
  language: Language;
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
  initialMode?: BookingMode;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  stations,
  language,
  onSearch,
  isLoading = false,
  initialMode
}) => {
  const t = TRANSLATIONS[language];

  // User input states
  const [sourceCode, setSourceCode] = useState<string>('');
  const [destinationCode, setDestinationCode] = useState<string>('');
  
  // Format default dates cleanly
  const [todayStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [tomorrowStr] = useState<string>(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  
  const [date, setDate] = useState<string>(todayStr);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [bookingMode, setBookingMode] = useState<BookingMode | null>(initialMode || null);

  // Sync booking mode when initialMode changes
  useEffect(() => {
    if (initialMode) {
      setBookingMode(initialMode);
    }
  }, [initialMode]);

  // Searchable dropdown state
  const [sourceSearch, setSourceSearch] = useState<string>('');
  const [destSearch, setDestSearch] = useState<string>('');
  const [isSourceOpen, setIsSourceOpen] = useState<boolean>(false);
  const [isDestOpen, setIsDestOpen] = useState<boolean>(false);

  // Validation & helper alerts
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [swapRotating, setSwapRotating] = useState<boolean>(false);

  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setIsSourceOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setIsDestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered station lists
  const filteredSourceStations = stations.filter((s) => {
    const q = sourceSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.nameTamil.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
    );
  });

  const filteredDestStations = stations.filter((s) => {
    const q = destSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.nameTamil.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
    );
  });

  // Handle station selection
  const handleSelectSource = (station: Station) => {
    setSourceCode(station.code);
    setSourceSearch(`${station.code} - ${language === 'ta' ? station.nameTamil : station.name}`);
    setIsSourceOpen(false);
    setErrorMessage(null);
  };

  const handleSelectDest = (station: Station) => {
    setDestinationCode(station.code);
    setDestSearch(`${station.code} - ${language === 'ta' ? station.nameTamil : station.name}`);
    setIsDestOpen(false);
    setErrorMessage(null);
  };

  // Explicit, user-requested location discovery (Never automatic)
  const handleExplicitLocationDiscovery = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationNotice('Requesting location with your explicit consent...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = railwayService.getNearestStation(latitude, longitude);
        setIsLocating(false);
        if (nearest) {
          handleSelectSource(nearest);
          setLocationNotice(
            `Nearest station detected: ${nearest.code} - ${nearest.name} (based on your coordinates).`
          );
          setTimeout(() => setLocationNotice(null), 6000);
        }
      },
      (_err) => {
        setIsLocating(false);
        // Graceful fallback with clear explanation
        setLocationNotice('Location permission denied or unavailable. Please select source station manually.');
        setTimeout(() => setLocationNotice(null), 5000);
      },
      { timeout: 7000 }
    );
  };

  // Swap stations
  const handleSwapStations = () => {
    setSwapRotating(true);
    setTimeout(() => setSwapRotating(false), 300);

    const tempCode = sourceCode;
    const tempSearch = sourceSearch;

    setSourceCode(destinationCode);
    setSourceSearch(destSearch);

    setDestinationCode(tempCode);
    setDestSearch(tempSearch);

    setErrorMessage(null);
  };

  // Submit and validate
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory manual selection of source
    if (!sourceCode) {
      setErrorMessage(t.errMissingSource);
      return;
    }

    // 2. Mandatory manual selection of destination
    if (!destinationCode) {
      setErrorMessage(t.errMissingDest);
      return;
    }

    // 3. Prevent identical source and destination
    if (sourceCode === destinationCode) {
      setErrorMessage(t.errSameStation);
      return;
    }

    // 4. Mandatory booking mode selection
    if (!bookingMode) {
      setErrorMessage(t.errMissingMode);
      return;
    }

    // 5. Date validation
    if (!date || date < todayStr) {
      setErrorMessage(t.errPastDate);
      return;
    }

    // Clear error and proceed with search
    setErrorMessage(null);
    onSearch({
      source: sourceCode,
      destination: destinationCode,
      date,
      passengerCount,
      bookingMode
    });
  };

  return (
    <div className="relative -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-30">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8 backdrop-blur-xl">
        
        {/* Header / Mode Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 font-display flex items-center space-x-2">
              <Train className="w-6 h-6 text-railway-600" />
              <span>{t.searchCardTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ta'
                ? 'புறப்படும் இடம், சேரும் இடம் மற்றும் முன்பதிவு முறையைத் தேர்ந்தெடுக்கவும்'
                : 'Select source, destination station and mandatory booking mode.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Optional explicit location detector (never automatic on load) */}
            <button
              type="button"
              onClick={handleExplicitLocationDiscovery}
              disabled={isLocating}
              className="text-xs font-bold text-railway-700 bg-railway-50 hover:bg-railway-100 px-3 py-1.5 rounded-xl border border-railway-200 flex items-center space-x-1.5 transition-colors"
              title="Only runs upon explicit user click"
            >
              <Compass className={`w-3.5 h-3.5 text-railway-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{language === 'ta' ? 'அருகிலுள்ள நிலையத்தைக் கண்டறி' : 'Find Nearest Station'}</span>
            </button>

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-railway-500 animate-pulse"></span>
              <span>{language === 'ta' ? 'IRCTC நேரடி இணைப்பு நெறிமுறை' : 'RailConnect IRCTC Protocol'}</span>
            </div>
          </div>
        </div>

        {/* Location Notice (if user clicked Detect Nearest) */}
        {locationNotice && (
          <div className="mt-4 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-medium flex items-center space-x-2 animate-fade-in">
            <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>{locationNotice}</span>
          </div>
        )}

        {/* Validation Alert Box */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-semibold">
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Row 1: Source, Swap, Destination */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Source Station Dropdown */}
            <div className="md:col-span-5 relative" ref={sourceRef}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.sourceLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.sourcePlaceholder}
                  value={sourceSearch}
                  onChange={(e) => {
                    setSourceSearch(e.target.value);
                    setSourceCode('');
                    setIsSourceOpen(true);
                  }}
                  onFocus={() => setIsSourceOpen(true)}
                  className={`w-full px-4 py-3 text-sm rounded-xl border font-medium focus:outline-none focus:ring-2 transition-all ${
                    sourceCode
                      ? 'border-railway-300 bg-railway-50/40 text-navy-900 focus:ring-railway-500'
                      : 'border-slate-300 bg-white text-slate-900 focus:ring-railway-500'
                  }`}
                />
                {sourceCode && (
                  <span className="absolute right-3 top-3 px-2 py-0.5 text-xs font-bold rounded bg-railway-600 text-white">
                    {sourceCode}
                  </span>
                )}
              </div>

              {/* Source Stations Menu */}
              {isSourceOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-1 divide-y divide-slate-100">
                  {filteredSourceStations.length > 0 ? (
                    filteredSourceStations.map((stn) => (
                      <button
                        key={stn.code}
                        type="button"
                        onClick={() => handleSelectSource(stn)}
                        className="w-full text-left px-4 py-2.5 hover:bg-railway-50 flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-navy-900 group-hover:text-railway-700">
                              {language === 'ta' ? stn.nameTamil : stn.name}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 font-bold bg-slate-100 group-hover:bg-railway-100 text-slate-700 rounded">
                              {stn.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {stn.state} • {stn.platformsCount} Platforms
                          </p>
                        </div>
                        {sourceCode === stn.code && (
                          <CheckCircle2 className="w-4 h-4 text-railway-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">
                      {language === 'ta' ? 'நிலையங்கள் எதுவும் கிடைக்கவில்லை' : 'No stations found'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="button"
                onClick={handleSwapStations}
                title={t.swapTooltip}
                className="w-12 h-12 rounded-full border-2 border-slate-200 bg-white hover:bg-railway-50 hover:border-railway-300 text-slate-600 hover:text-railway-600 flex items-center justify-center shadow-sm hover:shadow transition-all group"
              >
                <ArrowRightLeft
                  className={`w-5 h-5 transition-transform duration-300 ${
                    swapRotating ? 'rotate-180 scale-110' : 'group-hover:rotate-180'
                  }`}
                />
              </button>
            </div>

            {/* Destination Station Dropdown */}
            <div className="md:col-span-5 relative" ref={destRef}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.destLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.destPlaceholder}
                  value={destSearch}
                  onChange={(e) => {
                    setDestSearch(e.target.value);
                    setDestinationCode('');
                    setIsDestOpen(true);
                  }}
                  onFocus={() => setIsDestOpen(true)}
                  className={`w-full px-4 py-3 text-sm rounded-xl border font-medium focus:outline-none focus:ring-2 transition-all ${
                    destinationCode
                      ? 'border-railway-300 bg-railway-50/40 text-navy-900 focus:ring-railway-500'
                      : 'border-slate-300 bg-white text-slate-900 focus:ring-railway-500'
                  }`}
                />
                {destinationCode && (
                  <span className="absolute right-3 top-3 px-2 py-0.5 text-xs font-bold rounded bg-railway-600 text-white">
                    {destinationCode}
                  </span>
                )}
              </div>

              {/* Destination Stations Menu */}
              {isDestOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 py-1 divide-y divide-slate-100">
                  {filteredDestStations.length > 0 ? (
                    filteredDestStations.map((stn) => (
                      <button
                        key={stn.code}
                        type="button"
                        onClick={() => handleSelectDest(stn)}
                        className="w-full text-left px-4 py-2.5 hover:bg-railway-50 flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-navy-900 group-hover:text-railway-700">
                              {language === 'ta' ? stn.nameTamil : stn.name}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 font-bold bg-slate-100 group-hover:bg-railway-100 text-slate-700 rounded">
                              {stn.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {stn.state} • {stn.platformsCount} Platforms
                          </p>
                        </div>
                        {destinationCode === stn.code && (
                          <CheckCircle2 className="w-4 h-4 text-railway-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 text-center">
                      {language === 'ta' ? 'நிலையங்கள் எதுவும் கிடைக்கவில்லை' : 'No stations found'}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Row 2: Date Picker & Passenger Count */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Date of Journey with quick shortcuts */}
            <div className="md:col-span-8">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.dateLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setDate(todayStr)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                      date === todayStr ? 'bg-railway-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'ta' ? 'இன்று' : 'Today'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate(tomorrowStr)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                      date === tomorrowStr ? 'bg-railway-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'ta' ? 'நாளை' : 'Tomorrow'}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-railway-500 bg-white"
                />
              </div>
            </div>

            {/* Passenger Count (1 to 6) */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.passengersLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(parseInt(e.target.value, 10))}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-railway-500 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Row 3: Mandatory Three Booking Modes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.bookingModeLabel} <span className="text-rose-500">* (Select one)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {language === 'ta' ? 'முன்னுரிமை விதி: அவசரம் > இணைப்பு > சாதாரண' : 'Priority Rule: Emergency > Connecting > Normal'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Emergency Mode (Priority 1) */}
              <button
                type="button"
                onClick={() => {
                  setBookingMode('EMERGENCY');
                  setErrorMessage(null);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  bookingMode === 'EMERGENCY'
                    ? 'border-rose-500 bg-rose-50/80 shadow-md shadow-rose-500/10'
                    : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-600 text-white tracking-wider">
                    PRIORITY 1
                  </span>
                  {bookingMode === 'EMERGENCY' && (
                    <CheckCircle2 className="w-5 h-5 text-rose-600" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-navy-900">{t.modeEmergency}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{t.modeEmergencyDesc}</p>
              </button>

              {/* Connecting Mode (Priority 2) */}
              <button
                type="button"
                onClick={() => {
                  setBookingMode('CONNECTING');
                  setErrorMessage(null);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  bookingMode === 'CONNECTING'
                    ? 'border-amber-500 bg-amber-50/80 shadow-md shadow-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500 text-white tracking-wider">
                    PRIORITY 2
                  </span>
                  {bookingMode === 'CONNECTING' && (
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-navy-900">{t.modeConnecting}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{t.modeConnectingDesc}</p>
              </button>

              {/* Normal Mode (Priority 3) */}
              <button
                type="button"
                onClick={() => {
                  setBookingMode('NORMAL');
                  setErrorMessage(null);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                  bookingMode === 'NORMAL'
                    ? 'border-railway-600 bg-railway-50/80 shadow-md shadow-railway-600/10'
                    : 'border-slate-200 bg-white hover:border-railway-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-railway-700 text-white tracking-wider">
                    PRIORITY 3
                  </span>
                  {bookingMode === 'NORMAL' && (
                    <CheckCircle2 className="w-5 h-5 text-railway-700" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-navy-900">{t.modeNormal}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-snug">{t.modeNormalDesc}</p>
              </button>

            </div>
          </div>

          {/* Submit Search Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-railway-600 via-railway-700 to-navy-900 hover:from-railway-700 hover:to-navy-950 shadow-lg shadow-railway-600/25 flex items-center justify-center space-x-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
              <span>{isLoading ? 'Searching Schedules...' : t.searchButton}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
