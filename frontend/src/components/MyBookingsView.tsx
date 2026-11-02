import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { Reservation, Language } from '../types/railway';
import { railwayService } from '../services/railwayService';
import type { PromotionResult } from '../services/railwayService';

interface MyBookingsViewProps {
  reservations: Reservation[];
  language: Language;
  onRefresh: () => void;
  onSelectReservationForPrint: (res: Reservation) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  reservations,
  language,
  onRefresh,
  onSelectReservationForPrint
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'WAITING_LIST' | 'CANCELLED'>('ALL');
  const [pnrSearch, setPnrSearch] = useState<string>('');
  const [cancelModalPnr, setCancelModalPnr] = useState<string | null>(null);
  const [promotionNotice, setPromotionNotice] = useState<PromotionResult | null>(null);

  // Filter reservations
  const filtered = reservations.filter((r) => {
    if (pnrSearch.trim()) {
      return r.pnr.toLowerCase().includes(pnrSearch.toLowerCase().trim());
    }
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const handleConfirmCancel = (pnr: string) => {
    const result = railwayService.cancelReservation(pnr);
    setCancelModalPnr(null);
    setPromotionNotice(result);
    onRefresh();

    // Auto dismiss notification after 8 seconds
    setTimeout(() => {
      setPromotionNotice(null);
    }, 8000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Real-time Dynamic Promotion Alert */}
      {promotionNotice && (
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-railway-700 text-white shadow-xl flex items-start justify-between gap-4 animate-scale-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base">
                {language === 'ta' ? 'தானியங்கி இருக்கை மறுஒதுக்கீடு வெற்றி!' : 'Automatic Waitlist Promotion & Reallocation Executed!'}
              </p>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                {promotionNotice.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setPromotionNotice(null)}
            className="text-white/80 hover:text-white font-bold text-xs px-2 py-1 bg-white/10 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header and PNR Tracker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 gap-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center space-x-2">
            <Ticket className="w-7 h-7 text-railway-600" />
            <span>{language === 'ta' ? 'என் பயணங்கள் & டிக்கெட் மேலாண்மை' : 'My Bookings & PNR Tracker'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'ta'
              ? 'உங்கள் முன்பதிவுகள், இருக்கை ஒதுக்கீடுகள் மற்றும் ரத்துசெய்தல் மேலாண்மை.'
              : 'Track confirmed bookings, live waiting list positions, and priority seat reallocations.'}
          </p>
        </div>

        {/* Quick PNR Search Input */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={language === 'ta' ? 'PNR தேடல் (எ.கா. PJ-4819)' : 'Search by PNR...'}
            value={pnrSearch}
            onChange={(e) => setPnrSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-railway-500 bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 pt-6 pb-6 overflow-x-auto">
        {(['ALL', 'CONFIRMED', 'WAITING_LIST', 'CANCELLED'] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => {
              setFilter(st);
              setPnrSearch('');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              filter === st && !pnrSearch
                ? 'bg-railway-600 text-white shadow-md shadow-railway-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL'
              ? (language === 'ta' ? 'அனைத்து டிக்கெட்டுகள்' : 'All Bookings')
              : st === 'CONFIRMED'
              ? (language === 'ta' ? 'உறுதி செய்யப்பட்டது' : 'Confirmed')
              : st === 'WAITING_LIST'
              ? (language === 'ta' ? 'காத்திருப்போர் பட்டியல்' : 'Waiting List')
              : (language === 'ta' ? 'ரத்து செய்யப்பட்டது' : 'Cancelled')}
          </button>
        ))}
      </div>

      {/* List of Bookings */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-900">
            {language === 'ta' ? 'முன்பதிவுகள் எதுவும் இல்லை' : 'No Bookings Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {language === 'ta'
              ? 'உங்கள் வடிகட்டலுக்கு ஏற்ப எந்த டிக்கெட்டும் கிடைக்கவில்லை.'
              : 'No reservations match this filter. Use the search form to book a train ticket.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((res) => {
            const isConfirmed = res.status === 'CONFIRMED';
            const isWaiting = res.status === 'WAITING_LIST';
            const isCancelled = res.status === 'CANCELLED';

            return (
              <div
                key={res.pnr}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                
                {/* Header Strip */}
                <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-sm text-navy-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      PNR: {res.pnr}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {res.trainNumber} - {language === 'ta' ? res.trainNameTamil : res.trainName}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {res.bookingMode} MODE
                    </span>

                    {isConfirmed && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>CONFIRMED</span>
                      </span>
                    )}

                    {isWaiting && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>WAITING LIST (WL-{res.waitingListNumber})</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>CANCELLED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Journey & Passenger Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Route Details */}
                    <div className="md:col-span-4 space-y-1">
                      <div className="flex items-center space-x-2 text-sm font-bold text-navy-900">
                        <span>{res.sourceName}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span>{res.destinationName}</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-railway-600" />
                        <span>Date: {res.travelDate}</span>
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Class: <strong className="text-navy-900">{res.travelClass}</strong> • {res.passengers.length} Passenger(s)
                      </p>
                    </div>

                    {/* Passenger and Seat Summary */}
                    <div className="md:col-span-5 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-xs font-bold text-slate-700">Passenger(s):</p>
                      {res.passengers.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-navy-900">{p.name} ({p.age}y, {p.gender})</span>
                          <span className="font-bold text-railway-700">
                            {isConfirmed ? (p.seatAssigned || 'Berth Assigned') : isWaiting ? `WL-${res.waitingListNumber}` : 'Cancelled'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="md:col-span-3 flex flex-col sm:items-end justify-center space-y-2">
                      <p className="text-sm font-black text-navy-900">
                        Fare: ₹{res.totalFare}
                      </p>

                      <div className="flex items-center space-x-2">
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => onSelectReservationForPrint(res)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-railway-50 hover:bg-railway-100 text-railway-700 border border-railway-200 transition-colors"
                          >
                            View Ticket
                          </button>
                        )}

                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => setCancelModalPnr(res.pnr)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                          >
                            Cancel Ticket
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalPnr && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-navy-900">
                Cancel Ticket ({cancelModalPnr})?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel this reservation? The released seat will be automatically promoted to the highest-priority waiting list passenger.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Cancellation Charge:</span>
                <span className="font-bold text-navy-900">₹60.00 (Standard)</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Refund Initiation:</span>
                <span>Instant to Source Account</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalPnr(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => handleConfirmCancel(cancelModalPnr)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
