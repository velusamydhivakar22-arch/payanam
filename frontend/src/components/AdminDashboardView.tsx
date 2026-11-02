import React, { useState } from 'react';
import {
  Activity,
  RefreshCw
} from 'lucide-react';
import type { Language, Reservation } from '../types/railway';
import { railwayService } from '../services/railwayService';

interface AdminDashboardViewProps {
  language: Language;
  onNavigateToOperations: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  language,
  onNavigateToOperations
}) => {
  const [reservations, setReservations] = useState<Reservation[]>(railwayService.getReservations());
  const trains = railwayService.getTrains();

  const totalBookings = reservations.length;
  const confirmedBookings = reservations.filter((r) => r.status === 'CONFIRMED').length;
  const waitlistBookings = reservations.filter((r) => r.status === 'WAITING_LIST').length;

  const emergencyBookings = reservations.filter((r) => r.bookingMode === 'EMERGENCY').length;
  const connectingBookings = reservations.filter((r) => r.bookingMode === 'CONNECTING').length;

  const handleRefresh = () => {
    setReservations(railwayService.getReservations());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 border border-rose-200">
              RESTRICTED ACCESS • RAILWAY ADMIN CONSOLE
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display mt-1">
            {language === 'ta' ? 'ரயில்வே நிர்வாகக் கட்டுப்பாட்டகம்' : 'Central Railway Operations Command'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ta'
              ? 'முன்னுரிமை ஒதுக்கீடுகள், காத்திருப்போர் வரிசை, நடைமேடை நிலவரம் மற்றும் தணிக்கைப் பதிவு.'
              : 'Real-time overview of quota utilization, waiting-list priority promotion, and platform scheduling.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNavigateToOperations}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-railway-600 hover:bg-railway-700 text-white shadow-md flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Platform Console</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Reservations</span>
          <p className="text-3xl font-black text-navy-900 mt-1">{totalBookings}</p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Confirmed: {confirmedBookings}</span>
            <span className="text-emerald-600 font-bold">● Active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Waiting List (Priority)</span>
          <p className="text-3xl font-black text-amber-600 mt-1">{waitlistBookings}</p>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Pending seats</span>
            <span className="text-amber-600 font-bold">Auto-promotion ready</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Priority 1 (Emergency)</span>
          <p className="text-3xl font-black text-rose-600 mt-1">{emergencyBookings}</p>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Critical medical / defense quota</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-bold text-slate-400 uppercase">Priority 2 (Connecting)</span>
          <p className="text-3xl font-black text-amber-500 mt-1">{connectingBookings}</p>
          <div className="mt-2 text-[11px] text-slate-500">
            <span>Atomic dual-leg itineraries</span>
          </div>
        </div>
      </div>

      {/* Train Fleet Capacity Limits */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-navy-900">
              Active Express Fleet & 100-Seat Capacity Enforcement
            </h3>
            <p className="text-xs text-slate-500">
              Configured strict 100-seat trip limit per travel class across all Southern Railway divisions.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            Capacity Guard Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Train #</th>
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Classes</th>
                <th className="py-2.5 px-3 text-right">Max Limit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trains.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-mono font-bold text-navy-900">{t.number}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{t.name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{t.sourceCode} ➔ {t.destinationCode}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono">{t.trainLengthMeters}m</td>
                  <td className="py-2.5 px-3">
                    <span className="flex gap-1">
                      {t.classes.map((c) => (
                        <span key={c.classType} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                          {c.classType}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-railway-700">100 / Class</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Recent Reservations Audit */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-left">
        <h3 className="font-extrabold text-base text-navy-900 border-b border-slate-100 pb-3">
          Recent System Bookings & Waitlist Promotion Log
        </h3>

        <div className="space-y-3">
          {reservations.slice(0, 6).map((res) => (
            <div
              key={res.pnr}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-navy-900 px-2 py-1 rounded bg-white border border-slate-200">
                  {res.pnr}
                </span>
                <div>
                  <p className="font-bold text-navy-900">
                    {res.trainNumber} ({res.sourceCode} ➔ {res.destinationCode}) • {res.travelDate}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Passengers: {res.passengers.length} • Mode: <span className="font-bold">{res.bookingMode}</span> • Fare: ₹{res.totalFare}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase ${
                    res.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : res.status === 'WAITING_LIST'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {res.status === 'CONFIRMED' ? 'CONFIRMED' : `WL-${res.waitingListNumber || 1}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
