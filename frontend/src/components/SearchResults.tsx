import React, { useState, useMemo, useEffect } from 'react';
import {
  Train as TrainIcon,
  Clock,
  Info,
  Check,
  ChevronRight,
  ArrowUpDown,
  Filter,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import type { Train, TravelClass, BookingMode, Language, ConnectingItinerary } from '../types/railway';
import { railwayService } from '../services/railwayService';
import { TRANSLATIONS } from '../data/translations';

interface SearchResultsProps {
  trains: Train[];
  connectingRoutes?: ConnectingItinerary[];
  selectedMode: BookingMode;
  travelDate: string;
  sourceCode: string;
  destinationCode: string;
  passengerCount: number;
  language: Language;
  onSelectTrainClass: (train: Train, travelClass: TravelClass) => void;
  onSelectConnectingItinerary?: (itinerary: ConnectingItinerary, travelClass: TravelClass) => void;
}

type SortOption = 'DEPARTURE_ASC' | 'DEPARTURE_DESC' | 'DURATION_ASC' | 'FARE_ASC' | 'FARE_DESC';

export const SearchResults: React.FC<SearchResultsProps> = ({
  trains,
  connectingRoutes,
  selectedMode,
  travelDate,
  sourceCode,
  destinationCode,
  passengerCount,
  language,
  onSelectTrainClass,
  onSelectConnectingItinerary
}) => {
  const t = TRANSLATIONS[language];

  // Sorting & Filtering state
  const [sortBy, setSortBy] = useState<SortOption>('DEPARTURE_ASC');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Connecting itineraries (Backend provided or local calculation fallback)
  const connectingItineraries = useMemo(() => {
    if (connectingRoutes && connectingRoutes.length > 0) {
      return connectingRoutes;
    }
    return railwayService.searchConnectingItineraries(sourceCode, destinationCode);
  }, [connectingRoutes, sourceCode, destinationCode]);

  // Tab: Direct Trains vs Connecting Journeys (Journey Type Selection)
  const [activeTab, setActiveTab] = useState<'direct' | 'connecting'>(() => {
    return trains.length > 0 ? 'direct' : 'connecting';
  });

  // Re-sync activeTab when search results or search params update
  useEffect(() => {
    if (trains.length > 0) {
      setActiveTab('direct');
    } else if (connectingItineraries.length > 0) {
      setActiveTab('connecting');
    }
  }, [trains.length, sourceCode, destinationCode, selectedMode]);

  // Selected class for direct trains
  const [selectedClassMap, setSelectedClassMap] = useState<Record<string, TravelClass>>({});

  // Selected class for connecting itineraries
  const [connectingClassMap, setConnectingClassMap] = useState<Record<string, TravelClass>>({});

  const handleClassClick = (trainId: string, classType: TravelClass) => {
    setSelectedClassMap((prev) => ({
      ...prev,
      [trainId]: classType
    }));
  };

  const handleConnectingClassClick = (itineraryId: string, classType: TravelClass) => {
    setConnectingClassMap((prev) => ({
      ...prev,
      [itineraryId]: classType
    }));
  };

  // Helper parsing for sort
  const parseMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const parseDurationMinutes = (durStr: string) => {
    const hMatch = durStr.match(/(\d+)\s*h/);
    const mMatch = durStr.match(/(\d+)\s*m/);
    const h = hMatch ? parseInt(hMatch[1], 10) : 0;
    const m = mMatch ? parseInt(mMatch[1], 10) : 0;
    return h * 60 + m;
  };

  const getMinFare = (train: Train) => {
    if (train.classes.length === 0) return 0;
    return Math.min(...train.classes.map((c) => c.fare));
  };

  // Filtered & Sorted Trains
  const processedTrains = useMemo(() => {
    let list = [...trains];

    // Filter by travel class
    if (selectedClassFilter !== 'ALL') {
      list = list.filter((tr) => tr.classes.some((c) => c.classType === selectedClassFilter));
    }

    // Filter by availability
    if (availableOnly) {
      list = list.filter((tr) => tr.classes.some((c) => c.availableSeats > 0));
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'DEPARTURE_ASC':
          return parseMinutes(a.departureTime) - parseMinutes(b.departureTime);
        case 'DEPARTURE_DESC':
          return parseMinutes(b.departureTime) - parseMinutes(a.departureTime);
        case 'DURATION_ASC':
          return parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration);
        case 'FARE_ASC':
          return getMinFare(a) - getMinFare(b);
        case 'FARE_DESC':
          return getMinFare(b) - getMinFare(a);
        default:
          return 0;
      }
    });

    return list;
  }, [trains, selectedClassFilter, availableOnly, sortBy]);

  const getModeBadge = (mode: BookingMode) => {
    switch (mode) {
      case 'EMERGENCY':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          text: language === 'ta' ? 'அவசர முன்னுரிமை 1' : 'Emergency Priority 1',
          badgeText: 'PRIORITY 1'
        };
      case 'CONNECTING':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          text: language === 'ta' ? 'இணைப்பு முன்னுரிமை 2' : 'Connecting Priority 2',
          badgeText: 'PRIORITY 2'
        };
      case 'NORMAL':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
          text: language === 'ta' ? 'சாதாரண ஒதுக்கீடு (முன்னுரிமை 3)' : 'Normal Quota (Priority 3)',
          badgeText: 'PRIORITY 3'
        };
    }
  };

  const modeBadge = getModeBadge(selectedMode);
  const classOptions = ['ALL', '1A', '2A', '3A', 'CC', 'EC', 'SL'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Demonstration Data Banner as specified in prompt */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-railway-50 via-sky-50 to-blue-50 border border-railway-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-railway-600 text-white flex-shrink-0 shadow-sm">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-navy-900">
              {t.demoDataNotice}
            </p>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">
              {language === 'ta'
                ? `செயலில் உள்ள பாதை: ${sourceCode} ➔ ${destinationCode} | பயணத் தேதி: ${travelDate} | பயணிகள்: ${passengerCount}`
                : `Active Journey: ${sourceCode} ➔ ${destinationCode} | Date: ${travelDate} | Passengers: ${passengerCount}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-xs ${modeBadge.bg}`}>
            <span className={`w-2 h-2 rounded-full ${modeBadge.dot}`}></span>
            <span>{modeBadge.text}</span>
          </span>
        </div>
      </div>

      {/* Header and Route Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 gap-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2 text-railway-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ta' ? 'ரயில் அட்டவணை' : 'Train Timetable & Booking Engine'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display">
            {t.resultsTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'ta'
              ? `${sourceCode} முதல் ${destinationCode} வரை கிடைக்கும் ரயில்கள்`
              : `Showing services connecting ${sourceCode} and ${destinationCode}`}
          </p>
        </div>

        {/* Tab Switcher: Direct Trains vs Connecting Routes */}
        <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('direct')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'direct'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <TrainIcon className="w-4 h-4 text-railway-600" />
            <span>{language === 'ta' ? 'நேரடி ரயில்கள்' : 'Direct Trains'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-black">
              {trains.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('connecting')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'connecting'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <GitFork className="w-4 h-4 text-amber-600" />
            <span>{language === 'ta' ? 'இணைப்பு வழிகள்' : 'Connecting Routes'}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-black">
              {connectingItineraries.length}
            </span>
          </button>
        </div>
      </div>

      {/* DIRECT TRAINS VIEW */}
      {activeTab === 'direct' && (
        <div className="mt-6 space-y-6">
          
          {/* FILTERING & SORTING TOOLBAR */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Class Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-railway-600" />
                <span>{language === 'ta' ? 'வகுப்பு:' : 'Class:'}</span>
              </span>

              {classOptions.map((cls) => {
                const isActive = selectedClassFilter === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClassFilter(cls)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-railway-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy-900'
                    }`}
                  >
                    {cls === 'ALL' ? (language === 'ta' ? 'அனைத்தும்' : 'All') : cls}
                  </button>
                );
              })}
            </div>

            {/* Availability Filter & Sort Control */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Available Only Toggle */}
              <button
                type="button"
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                  availableOnly
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${availableOnly ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>{language === 'ta' ? 'உறுதியான இருக்கைகள் மட்டும்' : 'Available Only'}</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-railway-600" />
                  <span className="hidden sm:inline">{language === 'ta' ? 'வரிசைப்படுத்து:' : 'Sort:'}</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-slate-50 border border-slate-200 text-navy-900 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-railway-500"
                >
                  <option value="DEPARTURE_ASC">
                    {language === 'ta' ? 'புறப்பாடு: முதலில் இருந்து' : 'Departure: Earliest First'}
                  </option>
                  <option value="DEPARTURE_DESC">
                    {language === 'ta' ? 'புறப்பாடு: கடைசியில் இருந்து' : 'Departure: Latest First'}
                  </option>
                  <option value="DURATION_ASC">
                    {language === 'ta' ? 'பயண நேரம்: அதிவேகம்' : 'Duration: Shortest First'}
                  </option>
                  <option value="FARE_ASC">
                    {language === 'ta' ? 'கட்டணம்: குறைவு முதல்' : 'Fare: Low to High'}
                  </option>
                  <option value="FARE_DESC">
                    {language === 'ta' ? 'கட்டணம்: அதிகம் முதல்' : 'Fare: High to Low'}
                  </option>
                </select>
              </div>

            </div>

          </div>

          {/* No matching trains */}
          {processedTrains.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <TrainIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-navy-900">
                {language === 'ta' ? 'பொருந்தும் ரயில்கள் இல்லை' : 'No Direct Trains Found for Selected Filters'}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                {connectingItineraries.length > 0 ? (
                  language === 'ta'
                    ? `நேரடி ரயில்கள் இல்லை, ஆனால் ${connectingItineraries.length} இணைப்பு வழிகள் கிடைக்கின்றன!`
                    : `No direct service, but ${connectingItineraries.length} connecting route(s) are available!`
                ) : (
                  language === 'ta'
                    ? 'வடிப்பான்களை நீக்கவும் அல்லது MAS - SBC, MDU - MS, MAS - CBE போன்ற வழிகளை முயற்சிக்கவும்.'
                    : 'Clear filters or try popular junctions such as Chennai Central (MAS), Bengaluru (SBC), Madurai (MDU), or Coimbatore (CBE).'
                )}
              </p>

              {connectingItineraries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('connecting')}
                  className="mt-5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2"
                >
                  <GitFork className="w-4 h-4" />
                  <span>{language === 'ta' ? 'இணைப்பு வழிகளைப் பார்க்கவும்' : 'View Connecting Routes'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {processedTrains.map((train) => {
                const currentSelectedClass =
                  selectedClassMap[train.id] || train.classes[0]?.classType;

                const selectedClassInfo = train.classes.find(
                  (c) => c.classType === currentSelectedClass
                );

                return (
                  <div
                    key={train.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    
                    {/* Train Card Header */}
                    <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-railway-600 text-white flex items-center justify-center font-bold shadow-sm">
                          <TrainIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-base sm:text-lg text-navy-900">
                              {train.number} - {language === 'ta' ? train.nameTamil : train.name}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                              DAILY
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {language === 'ta' ? 'இயங்கும் நாட்கள்:' : 'Runs On:'}{' '}
                            {(train.runsOn || ['Daily', 'All Days']).join(', ')} • {train.trainLengthMeters || 300}m Length
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${modeBadge.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${modeBadge.dot}`}></span>
                          <span>{modeBadge.text}</span>
                        </span>
                      </div>
                    </div>

                    {/* Train Schedule Timings */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-100 pb-6">
                        
                        {/* Departure */}
                        <div className="md:col-span-4 text-left">
                          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-mono">
                            {train.departureTime}
                          </p>
                          <p className="font-bold text-sm text-slate-800 mt-0.5">
                            {train.sourceCode}
                          </p>
                          <p className="text-xs text-slate-500">
                            {language === 'ta' ? 'புறப்படும் நிலையம்' : 'Departure Station'}
                          </p>
                        </div>

                        {/* Duration Graphic */}
                        <div className="md:col-span-4 flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-500 mb-1 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-railway-600" />
                            <span>{train.duration}</span>
                          </span>
                          <div className="w-full flex items-center space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-railway-600 bg-white"></div>
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-railway-400 via-railway-600 to-railway-700 relative">
                              <TrainIcon className="w-4 h-4 text-railway-700 absolute -top-2 left-1/2 -translate-x-1/2" />
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-railway-600"></div>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            Direct Service
                          </span>
                        </div>

                        {/* Arrival */}
                        <div className="md:col-span-4 text-right">
                          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-mono">
                            {train.arrivalTime}
                          </p>
                          <p className="font-bold text-sm text-slate-800 mt-0.5">
                            {train.destinationCode}
                          </p>
                          <p className="text-xs text-slate-500">
                            {language === 'ta' ? 'சேரும் நிலையம்' : 'Arrival Station'}
                          </p>
                        </div>

                      </div>

                      {/* Available Travel Classes Chips */}
                      <div className="pt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                          {language === 'ta' ? 'பயண வகுப்பு & இருக்கை நிலை (தேர்ந்தெடுக்கவும்)' : 'Select Travel Class & Availability'}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                          {train.classes.map((cls) => {
                            const isSelected = currentSelectedClass === cls.classType;
                            const isAvailable = cls.availableSeats > 0;

                            return (
                              <button
                                key={cls.classType}
                                type="button"
                                onClick={() => handleClassClick(train.id, cls.classType)}
                                className={`p-3 rounded-2xl border-2 text-left transition-all relative ${
                                  isSelected
                                    ? 'border-railway-600 bg-railway-50/70 shadow-md ring-2 ring-railway-500/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-extrabold text-sm text-navy-900">
                                    {cls.classType}
                                  </span>
                                  <span className="font-black text-sm text-navy-900">
                                    ₹{cls.fare}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-500 font-medium truncate">
                                  {language === 'ta' ? cls.classNameTamil : cls.className}
                                </p>

                                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                  <span
                                    className={`text-[11px] font-bold ${
                                      isAvailable ? 'text-emerald-700' : 'text-amber-700'
                                    }`}
                                  >
                                    {isAvailable
                                      ? `AVL ${cls.availableSeats}`
                                      : `WL ${cls.waitingListCount}`}
                                  </span>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-railway-600 stroke-[3]" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Booking Action Footer */}
                      {selectedClassInfo && (
                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-navy-900">
                                {selectedClassInfo.className} ({selectedClassInfo.classType})
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-xs text-slate-600 font-medium">
                                ₹{selectedClassInfo.fare} x {passengerCount} = <strong className="text-navy-900 text-sm">₹{selectedClassInfo.fare * passengerCount}</strong>
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {selectedClassInfo.availableSeats > 0 ? (
                                <span className="text-emerald-700 font-semibold">
                                  ● {selectedClassInfo.availableSeats} Confirmed Seats Available for {selectedMode} mode
                                </span>
                              ) : (
                                <span className="text-amber-700 font-semibold">
                                  ● Capacity Reached (100 seats). Booking will enter Priority Waiting List (Position WL-{selectedClassInfo.waitingListCount + 1})
                                </span>
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onSelectTrainClass(train, selectedClassInfo.classType)
                            }
                            className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-railway-600 hover:bg-railway-700 shadow-lg shadow-railway-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                          >
                            <span>{t.selectTrainBtn}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* CONNECTING ITINERARIES VIEW */}
      {activeTab === 'connecting' && (
        <div className="mt-6 space-y-6">
          
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start space-x-3 text-amber-900">
            <GitFork className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">
                {language === 'ta' ? 'இணைப்பு ரயில் உறுதிப்பாடு:' : 'Guaranteed Connecting Journey Guarantee:'}
              </span>{' '}
              {language === 'ta'
                ? `தேர்ந்தெடுக்கப்பட்ட ${modeBadge.text} ஒதுக்கீட்டின் கீழ் இரண்டு பயணங்களும் ஒரே நேரத்தில் உறுதி செய்யப்படுகின்றன. பகுதி உறுதிப்படுத்தல் தவிர்க்கப்படுகிறது.`
                : `Both legs are reserved atomically under your selected ${modeBadge.text} quota. If seats are available, both are confirmed together, preventing partially stranded itineraries.`}
            </div>
          </div>

          {connectingItineraries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <GitFork className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-navy-900">
                {language === 'ta' ? 'இணைப்பு வழிகள் எதுவும் இல்லை' : 'No Connecting Itineraries Found for this Pair'}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                {language === 'ta'
                  ? 'தெற்கு ரயில்வே மைய நிலையங்களான சென்னை (MAS/MS), மதுரை (MDU), கோயம்புத்தூர் (CBE), திருச்சி (TPJ) ஆகியவற்றைத் தேர்ந்தெடுக்கவும்.'
                  : 'Try selecting major junction hubs such as Chennai (MAS/MS), Madurai (MDU), Coimbatore (CBE), or Tiruchchirappalli (TPJ).'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {connectingItineraries.map((itinerary) => {
                const currentClass = connectingClassMap[itinerary.id] || itinerary.availableClasses[0] || '2A';

                return (
                  <div
                    key={itinerary.id}
                    className="bg-white rounded-3xl border-2 border-amber-200/70 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    
                    {/* Header */}
                    <div className="bg-amber-50/70 px-6 py-4 border-b border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                          <GitFork className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-base text-navy-900">
                              {language === 'ta' ? itinerary.junctionNameTamil : itinerary.junctionName} ({itinerary.junctionCode}) {language === 'ta' ? 'வழியாக இணைப்பு' : 'Connecting Route'}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {language === 'ta' ? '2-படி இணைப்புப் பாதை' : '2-Leg Connecting'}
                            </span>
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${modeBadge.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${modeBadge.dot}`}></span>
                              <span>{modeBadge.text}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {itinerary.layoverDuration} • {itinerary.totalDuration}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">{language === 'ta' ? 'ஒருங்கிணைந்த கட்டணம்' : 'Combined Fare'}</p>
                        <p className="text-xl font-black text-navy-900">₹{itinerary.combinedFare}</p>
                      </div>
                    </div>

                    {/* Connecting Timeline Visual */}
                    <div className="p-6 space-y-6">
                      
                      {/* Leg 1 */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                          <span className="flex items-center space-x-1.5 text-railway-700">
                            <TrainIcon className="w-4 h-4" />
                            <span>LEG 1: {itinerary.leg1.number} - {language === 'ta' ? itinerary.leg1.nameTamil : itinerary.leg1.name}</span>
                          </span>
                          <span>{itinerary.leg1.duration}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <div>
                            <p className="text-lg font-bold text-navy-900 font-mono">{itinerary.leg1.departureTime}</p>
                            <p className="text-xs text-slate-600">{itinerary.leg1.sourceCode} (Origin)</p>
                          </div>
                          <div className="flex items-center justify-center text-slate-400">
                            <ArrowRight className="w-5 h-5 text-railway-600" />
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-navy-900 font-mono">{itinerary.leg1.arrivalTime}</p>
                            <p className="text-xs text-slate-600">{itinerary.junctionCode} (Transfer Hub)</p>
                          </div>
                        </div>
                      </div>

                      {/* Transfer Layover Pill */}
                      <div className="flex items-center justify-center">
                        <div className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          <span>{itinerary.layoverDuration} at {itinerary.junctionName} ({itinerary.junctionCode})</span>
                        </div>
                      </div>

                      {/* Leg 2 */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                          <span className="flex items-center space-x-1.5 text-railway-700">
                            <TrainIcon className="w-4 h-4" />
                            <span>LEG 2: {itinerary.leg2.number} - {language === 'ta' ? itinerary.leg2.nameTamil : itinerary.leg2.name}</span>
                          </span>
                          <span>{itinerary.leg2.duration}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <div>
                            <p className="text-lg font-bold text-navy-900 font-mono">{itinerary.leg2.departureTime}</p>
                            <p className="text-xs text-slate-600">{itinerary.junctionCode} (Departure Hub)</p>
                          </div>
                          <div className="flex items-center justify-center text-slate-400">
                            <ArrowRight className="w-5 h-5 text-railway-600" />
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-navy-900 font-mono">{itinerary.leg2.arrivalTime}</p>
                            <p className="text-xs text-slate-600">{itinerary.leg2.destinationCode} (Final Destination)</p>
                          </div>
                        </div>
                      </div>

                      {/* Class Selection & Atomic Booking */}
                      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-slate-500 uppercase">Select Class:</span>
                          <div className="flex space-x-2">
                            {itinerary.availableClasses.map((cls) => (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => handleConnectingClassClick(itinerary.id, cls)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                  currentClass === cls
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {cls}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectConnectingItinerary) {
                              onSelectConnectingItinerary(itinerary, currentClass);
                            } else {
                              onSelectTrainClass(itinerary.leg1, currentClass);
                            }
                          }}
                          className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>
                            {language === 'ta'
                              ? `இணைப்புப் பயணத்தை முன்பதிவு செய்க (${modeBadge.badgeText})`
                              : `Book Connecting Journey (${modeBadge.text})`}
                          </span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
