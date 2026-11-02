import React from 'react';
import { Mail } from 'lucide-react';
import type { Language, Reservation } from '../types/railway';

interface UserProfileViewProps {
  user: { name: string; email: string } | null;
  reservations: Reservation[];
  language: Language;
  onViewBookings: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  reservations,
  language,
  onViewBookings
}) => {
  const confirmedCount = reservations.filter((r) => r.status === 'CONFIRMED').length;
  const waitlistCount = reservations.filter((r) => r.status === 'WAITING_LIST').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-railway-700 to-railway-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-railway-600/30">
          {user ? user.name.charAt(0).toUpperCase() : 'P'}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-navy-900 font-display">
              {user ? user.name : 'Passenger Profile'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Verified Account
            </span>
          </div>

          <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{user ? user.email : 'guest@railconnect.in'}</span>
          </p>

          <p className="text-xs text-slate-400">
            Southern Railway Zone • IRCTC Linked Passenger
          </p>
        </div>

        <div className="flex sm:flex-col gap-3">
          <button
            type="button"
            onClick={onViewBookings}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-railway-600 hover:bg-railway-700 text-white shadow-md transition-all"
          >
            {language === 'ta' ? 'என் டிக்கெட்டுகள்' : 'My Bookings'}
          </button>
        </div>
      </div>

      {/* Account Highlights */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Confirmed Trips</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{confirmedCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active railway journeys</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Waitlist Requests</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{waitlistCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Under priority queue</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Loyalty Tier</span>
          <p className="text-2xl font-black text-navy-900 mt-1">Silver Plus</p>
          <p className="text-[11px] text-slate-500 mt-0.5">RailConnect Commuter</p>
        </div>
      </div>

      {/* Passenger Details & Preferences */}
      <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left">
        <h3 className="text-base font-extrabold text-navy-900 border-b border-slate-100 pb-3">
          {language === 'ta' ? 'பயண விருப்பங்கள் & தகவல்' : 'Passenger Information & Preferences'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Preferred Travel Class</span>
            <p className="font-bold text-navy-900 text-sm mt-0.5">AC 2 Tier (2A) / Executive Chair (EC)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Berth Preference</span>
            <p className="font-bold text-navy-900 text-sm mt-0.5">Lower Berth / Window Seat</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Food Preference</span>
            <p className="font-bold text-navy-900 text-sm mt-0.5">South Indian Vegetarian (IRCTC Catering)</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Emergency Contact</span>
            <p className="font-bold text-navy-900 text-sm mt-0.5">+91 98765 43210 (Kin Contact)</p>
          </div>
        </div>
      </div>

    </div>
  );
};
