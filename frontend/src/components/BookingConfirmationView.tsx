import React from 'react';
import {
  CheckCircle,
  Printer,
  Calendar,
  Train
} from 'lucide-react';
import type { Reservation, Language } from '../types/railway';

interface BookingConfirmationViewProps {
  reservation: Reservation;
  language: Language;
  onBookAnother: () => void;
  onViewMyBookings: () => void;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  reservation,
  language,
  onBookAnother,
  onViewMyBookings
}) => {
  const isConfirmed = reservation.status === 'CONFIRMED';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-extrabold text-navy-900 font-display">
          {isConfirmed
            ? (language === 'ta' ? 'முன்பதிவு வெற்றிகரமாக உறுதி செய்யப்பட்டது!' : 'Booking Confirmed Successfully!')
            : (language === 'ta' ? 'காத்திருப்போர் பட்டியலில் சேர்க்கப்பட்டது' : 'Booking Added to Priority Waiting List')}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {language === 'ta'
            ? `உங்கள் PNR எண்: ${reservation.pnr}. பயணத்திற்கான மின்-டிக்கெட் கீழே உள்ளது.`
            : `PNR: ${reservation.pnr}. Your official electronic reservation slip is generated below.`}
        </p>
      </div>

      {/* Printable E-Ticket Card */}
      <div
        id="printable-ticket"
        className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden"
      >
        
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-railway-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-railway-600 flex items-center justify-center text-white">
              <Train className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black font-display tracking-tight">
                  PAYANAM JUNCTION
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-railway-500 uppercase">
                  RailConnect E-Ticket
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ministry of Railways • Southern Railway Zone
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">PNR NUMBER</p>
            <p className="text-2xl font-black tracking-widest text-railway-300 font-mono">
              {reservation.pnr}
            </p>
            <span
              className={`inline-block px-2.5 py-0.5 mt-1 rounded text-xs font-black uppercase ${
                isConfirmed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {isConfirmed ? 'STATUS: CONFIRMED' : `STATUS: WAITING LIST (WL-${reservation.waitingListNumber})`}
            </span>
          </div>
        </div>

        {/* Train & Journey Route */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-5 text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                DEPARTURE STATION
              </span>
              <p className="text-2xl font-black text-navy-900 mt-1">
                {reservation.sourceName} ({reservation.sourceCode})
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-0.5 flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-railway-600" />
                <span>Date: {reservation.travelDate}</span>
              </p>
            </div>

            <div className="md:col-span-2 flex flex-col items-center">
              <span className="text-xs font-bold text-railway-700 bg-railway-100 px-2 py-0.5 rounded-full mb-1">
                {reservation.bookingMode} MODE
              </span>
              <div className="w-full flex items-center justify-center space-x-1">
                <div className="h-0.5 w-12 bg-slate-300"></div>
                <Train className="w-5 h-5 text-railway-600" />
                <div className="h-0.5 w-12 bg-slate-300"></div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 mt-1">
                Class: {reservation.travelClass}
              </span>
            </div>

            <div className="md:col-span-5 text-left md:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                DESTINATION STATION
              </span>
              <p className="text-2xl font-black text-navy-900 mt-1">
                {reservation.destinationName} ({reservation.destinationCode})
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                Train: {reservation.trainNumber} - {reservation.trainName}
              </p>
            </div>

          </div>
        </div>

        {/* Passenger List & Seat Table */}
        <div className="p-6 sm:p-8">
          {reservation.connectingLegInfo && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">Connecting Route Service</p>
                <p className="text-amber-900">{reservation.connectingLegInfo}</p>
              </div>
            </div>
          )}

          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">
            PASSENGER & BERTH ALLOCATION DETAILS
          </h4>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Passenger Name</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Quota / Mode</th>
                  <th className="py-3 px-4 text-right">Status / Berth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservation.passengers.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-navy-900">{p.name}</td>
                    <td className="py-3 px-4 text-slate-600">{p.age} yrs / {p.gender}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                        {reservation.bookingMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isConfirmed ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold bg-emerald-100 text-emerald-800">
                          {p.seatAssigned || 'Confirmed (Berth Assigned)'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold bg-amber-100 text-amber-800">
                          WL-{reservation.waitingListNumber} (Waitlisted)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* QR Code and Payment Details */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Simulated Dynamic QR Code */}
            <div className="sm:col-span-4 flex items-center space-x-3">
              <div className="p-2 border-2 border-slate-300 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <svg className="w-20 h-20" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="#0b1727" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#0b1727" />
                  <rect x="65" y="10" width="25" height="25" fill="#0b1727" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#0b1727" />
                  <rect x="10" y="65" width="25" height="25" fill="#0b1727" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#0b1727" />
                  <rect x="42" y="15" width="12" height="6" fill="#0b1727" />
                  <rect x="45" y="30" width="8" height="18" fill="#0b1727" />
                  <rect x="60" y="45" width="18" height="8" fill="#0b1727" />
                  <rect x="45" y="70" width="15" height="15" fill="#0b1727" />
                  <rect x="70" y="65" width="18" height="22" fill="#0b1727" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">Digital TTE Scan Code</p>
                <p className="text-[11px] text-slate-500">
                  Scan onboard to verify ticket authenticity & identity.
                </p>
              </div>
            </div>

            {/* Fare and Transaction Information */}
            <div className="sm:col-span-8 text-right space-y-1">
              <p className="text-xs text-slate-500">
                Transaction ID: <span className="font-mono font-bold text-navy-900">{reservation.paymentId}</span>
              </p>
              <p className="text-xs text-slate-500">
                Booked On: {new Date(reservation.bookingTimestamp).toLocaleString()}
              </p>
              <p className="text-xl font-black text-railway-800">
                Total Paid: ₹{reservation.totalFare}
              </p>
            </div>

          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Valid with original government photo identity proof (Aadhaar/Voter ID/Passport).</span>
            <span className="font-semibold text-railway-700">Payanam Junction RailConnect</span>
          </div>

        </div>

      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 shadow-sm flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-railway-600" />
            <span>{language === 'ta' ? 'டிக்கெட்டை அச்சிடுக' : 'Print / Save PDF'}</span>
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBookAnother}
            className="px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-navy-900"
          >
            {language === 'ta' ? 'மற்றொரு டிக்கெட் முன்பதிவு' : 'Book Another Train'}
          </button>
          <button
            type="button"
            onClick={onViewMyBookings}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-railway-600 hover:bg-railway-700 text-white shadow-md"
          >
            {language === 'ta' ? 'என் பயணங்களைப் பார்க்கவும்' : 'View in My Bookings'}
          </button>
        </div>
      </div>

    </div>
  );
};
