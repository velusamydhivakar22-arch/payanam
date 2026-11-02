import React from 'react';
import { Train, Globe, Shield, Ticket, LayoutDashboard, MapPin, HelpCircle } from 'lucide-react';
import type { Language } from '../types/railway';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeBookingsCount: number;
  onOpenAuth: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  activeBookingsCount,
  onOpenAuth,
  user,
  onLogout
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top micro banner for emergency & safety announcement */}
      <div className="bg-navy-900 text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-navy-800">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-railway-500 text-white">
            OFFICIAL
          </span>
          <span className="hidden sm:inline font-medium text-slate-300">
            {language === 'ta' ? 'இந்திய ரயில்வே கூட்டாண்மை போர்டல்' : 'Indian Railways Partner Portal — Southern Rail Zone'}
          </span>
          <span className="sm:hidden text-slate-300">RailConnect</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-amber-300">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden md:inline">
              {language === 'ta' ? 'அவசர உதவி: 139 (ரயில்மதத்)' : 'RailMadad Helpline: 139'}
            </span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-navy-800 rounded px-2 py-0.5 border border-slate-700">
            <Globe className="w-3 h-3 text-railway-400" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`text-[11px] px-1 font-semibold transition-colors ${
                language === 'en' ? 'text-white underline decoration-railway-400 decoration-2' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`text-[11px] px-1 font-semibold transition-colors ${
                language === 'ta' ? 'text-white underline decoration-railway-400 decoration-2' : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-railway-700 via-railway-600 to-railway-400 flex items-center justify-center text-white shadow-md shadow-railway-500/20 group-hover:scale-105 transition-transform duration-200">
              <Train className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight font-display">
                  {t.brandName}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md uppercase bg-railway-100 text-railway-700 border border-railway-200">
                  {t.subBrand}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'home'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => onSelectTab('search')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'search'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              {t.navBookTicket}
            </button>

            <button
              onClick={() => onSelectTab('bookings')}
              className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'bookings'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <Ticket className="w-4 h-4" />
                <span>{t.navMyBookings}</span>
                {activeBookingsCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-railway-600 rounded-full">
                    {activeBookingsCount}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('operations')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'operations'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-railway-500" />
              <span>{t.navOperations}</span>
            </button>

            <button
              onClick={() => onSelectTab('stations')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'stations'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t.navNearbyStations}</span>
            </button>

            <button
              onClick={() => onSelectTab('help')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'help'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t.navHelp}</span>
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'admin'
                  ? 'text-railway-700 bg-railway-50 border border-railway-200 shadow-sm'
                  : 'text-slate-700 hover:text-railway-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-500" />
              <span>{language === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
            </button>
          </nav>

          {/* User Section / Login */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-full py-1.5 px-3">
                <div
                  onClick={() => onSelectTab('profile')}
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  title="View Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-railway-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold text-navy-900 leading-tight">{user.name}</p>
                    <p className="text-slate-500 leading-tight">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-1"
                >
                  {language === 'ta' ? 'வெளியேறு' : 'Logout'}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-sm font-semibold text-railway-700 hover:text-railway-800 hover:bg-railway-50 rounded-lg transition-colors"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-railway-600 to-railway-700 hover:from-railway-700 hover:to-railway-800 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  {t.navSignUp}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentTab === 'home' ? 'bg-railway-600 text-white' : 'text-slate-700 bg-slate-100'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => onSelectTab('search')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentTab === 'search' ? 'bg-railway-600 text-white' : 'text-slate-700 bg-slate-100'
            }`}
          >
            {t.navBookTicket}
          </button>
          <button
            onClick={() => onSelectTab('bookings')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentTab === 'bookings' ? 'bg-railway-600 text-white' : 'text-slate-700 bg-slate-100'
            }`}
          >
            {t.navMyBookings} {activeBookingsCount > 0 ? `(${activeBookingsCount})` : ''}
          </button>
          <button
            onClick={() => onSelectTab('operations')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentTab === 'operations' ? 'bg-railway-600 text-white' : 'text-slate-700 bg-slate-100'
            }`}
          >
            {t.navOperations}
          </button>
          <button
            onClick={() => onSelectTab('stations')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentTab === 'stations' ? 'bg-railway-600 text-white' : 'text-slate-700 bg-slate-100'
            }`}
          >
            {t.navNearbyStations}
          </button>
          <button
            onClick={() => onSelectTab('help')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentTab === 'help' ? 'bg-railway-600 text-white' : 'text-slate-700 bg-slate-100'
            }`}
          >
            {t.navHelp}
          </button>
        </div>
      </div>
    </header>
  );
};
