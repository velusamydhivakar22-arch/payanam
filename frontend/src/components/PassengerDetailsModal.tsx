import React, { useState } from 'react';
import { X, User, ShieldAlert, Train, AlertCircle } from 'lucide-react';
import type { Passenger, BookingMode, TravelClass, Train as TrainType, Language } from '../types/railway';

interface PassengerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: TrainType;
  travelClass: TravelClass;
  bookingMode: BookingMode;
  passengerCount: number;
  initialBerths: Array<{ berth: any; label: string }>;
  language: Language;
  onSubmit: (passengers: Passenger[], contactInfo: { phone: string; email: string }) => void;
}

export const PassengerDetailsModal: React.FC<PassengerDetailsModalProps> = ({
  isOpen,
  onClose,
  train,
  travelClass,
  bookingMode,
  passengerCount,
  initialBerths,
  language,
  onSubmit
}) => {
  // Initialize passenger rows
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array.from({ length: passengerCount }, (_, i) => ({
      id: `p-${i + 1}`,
      name: '',
      age: 28,
      gender: 'Male',
      berthPreference: initialBerths[i]?.berth || 'LOWER',
      emergencyReason: bookingMode === 'EMERGENCY' ? 'Medical Emergency' : undefined,
      emergencyId: bookingMode === 'EMERGENCY' ? '' : undefined,
      connectingPnr: bookingMode === 'CONNECTING' ? '' : undefined
    }))
  );

  const [phone, setPhone] = useState<string>('9840123456');
  const [email, setEmail] = useState<string>('passenger@railconnect.in');
  const [error, setError] = useState<string | null>(null);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate names
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setError(`Please enter the passenger name for Passenger #${i + 1}.`);
        return;
      }
      if (passengers[i].age < 1 || passengers[i].age > 120) {
        setError(`Please enter a valid age for Passenger #${i + 1}.`);
        return;
      }
      if (bookingMode === 'EMERGENCY' && !passengers[i].emergencyId?.trim()) {
        setError(`Emergency booking requires a Medical/Hospital Reference or ID for Passenger #${i + 1}.`);
        return;
      }
      if (bookingMode === 'CONNECTING' && !passengers[i].connectingPnr?.trim()) {
        setError(`Connecting booking requires incoming Train/Flight PNR for Passenger #${i + 1}.`);
        return;
      }
    }

    if (!phone.trim() || phone.length < 10) {
      setError('Please provide a valid 10-digit mobile number for ticket notifications.');
      return;
    }

    onSubmit(passengers, { phone, email });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-navy-900 to-railway-800 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {language === 'ta' ? 'பயணிகள் விவரங்கள்' : 'Passenger Details & Quota Verification'}
            </h3>
            <p className="text-xs text-slate-300">
              {train.name} ({train.number}) • Class: {travelClass} • Mode: {bookingMode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Emergency Notice if Emergency Mode */}
          {bookingMode === 'EMERGENCY' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Emergency Quota Priority 1 Verification</span>
              </div>
              <p className="text-rose-700">
                Tickets booked under Emergency quota are reviewed by Railway Commercial Control. Please provide valid hospital reference or government ID.
              </p>
            </div>
          )}

          {/* Connecting Notice */}
          {bookingMode === 'CONNECTING' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center space-x-2 font-bold text-amber-800">
                <Train className="w-4 h-4 text-amber-600" />
                <span>Connecting Journey Priority 2 Verification</span>
              </div>
              <p className="text-amber-700">
                Enter your incoming train or flight PNR to link the booking for connection protection buffer.
              </p>
            </div>
          )}

          {/* Passenger Rows */}
          {passengers.map((p, index) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                  <User className="w-4 h-4 text-railway-600" />
                  <span>Passenger #{index + 1}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-railway-100 text-railway-700 font-semibold">
                  {initialBerths[index]?.label || 'Preferred Berth'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name as on ID"
                    value={p.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-railway-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={p.age}
                    onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-railway-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={p.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-railway-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                  </select>
                </div>
              </div>

              {/* Emergency fields */}
              {bookingMode === 'EMERGENCY' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-rose-800 mb-1">
                      Emergency Reason <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={p.emergencyReason}
                      onChange={(e) => handlePassengerChange(index, 'emergencyReason', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white"
                    >
                      <option value="Medical Emergency">Medical Emergency Consultation</option>
                      <option value="Critical Official Duty">Official Government Duty</option>
                      <option value="Bereavement">Family Bereavement</option>
                      <option value="Transit Exam">Urgent Competitive Examination</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-800 mb-1">
                      Hospital / Doctor ID Reference <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MED-REF-2026-9810"
                      value={p.emergencyId || ''}
                      onChange={(e) => handlePassengerChange(index, 'emergencyId', e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Connecting fields */}
              {bookingMode === 'CONNECTING' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-amber-800 mb-1">
                    Incoming Train / Flight PNR Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IR-2948102938 or 6E-9841"
                    value={p.connectingPnr || ''}
                    onChange={(e) => handlePassengerChange(index, 'connectingPnr', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Contact Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              E-Ticket & SMS Notification Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (For PNR SMS) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-railway-500 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-railway-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-railway-600 hover:bg-railway-700 shadow-md"
            >
              Proceed to Simulated Payment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
