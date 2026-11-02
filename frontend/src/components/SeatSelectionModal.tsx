import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Train, TravelClass, Language } from '../types/railway';

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: Train;
  travelClass: TravelClass;
  passengerCount: number;
  language: Language;
  onConfirmSeats: (selectedBerths: Array<{ berth: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'WINDOW' | 'NO_PREF'; label: string }>) => void;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  isOpen,
  onClose,
  train,
  travelClass,
  passengerCount,
  language,
  onConfirmSeats
}) => {
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([1]);

  // Demo coach seat layout with 16 visual seats for this bay
  const berthsList: Array<{
    seatNum: number;
    berthType: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'WINDOW' | 'NO_PREF';
    label: string;
    isOccupied: boolean;
  }> = [
    { seatNum: 1, berthType: 'LOWER', label: '1 - Lower', isOccupied: false },
    { seatNum: 2, berthType: 'MIDDLE', label: '2 - Middle', isOccupied: false },
    { seatNum: 3, berthType: 'UPPER', label: '3 - Upper', isOccupied: true },
    { seatNum: 4, berthType: 'LOWER', label: '4 - Lower', isOccupied: false },
    { seatNum: 5, berthType: 'MIDDLE', label: '5 - Middle', isOccupied: true },
    { seatNum: 6, berthType: 'UPPER', label: '6 - Upper', isOccupied: false },
    { seatNum: 7, berthType: 'SIDE_LOWER', label: '7 - Side Lower', isOccupied: false },
    { seatNum: 8, berthType: 'SIDE_UPPER', label: '8 - Side Upper', isOccupied: true },
    { seatNum: 9, berthType: 'LOWER', label: '9 - Lower', isOccupied: false },
    { seatNum: 10, berthType: 'MIDDLE', label: '10 - Middle', isOccupied: false },
    { seatNum: 11, berthType: 'UPPER', label: '11 - Upper', isOccupied: false },
    { seatNum: 12, berthType: 'LOWER', label: '12 - Lower', isOccupied: true },
    { seatNum: 13, berthType: 'MIDDLE', label: '13 - Middle', isOccupied: false },
    { seatNum: 14, berthType: 'UPPER', label: '14 - Upper', isOccupied: false },
    { seatNum: 15, berthType: 'SIDE_LOWER', label: '15 - Side Lower', isOccupied: false },
    { seatNum: 16, berthType: 'SIDE_UPPER', label: '16 - Side Upper', isOccupied: false },
  ];

  if (!isOpen) return null;

  const handleSeatClick = (seat: typeof berthsList[0]) => {
    if (seat.isOccupied) return;

    if (selectedSeatNumbers.includes(seat.seatNum)) {
      setSelectedSeatNumbers(selectedSeatNumbers.filter((s) => s !== seat.seatNum));
    } else {
      if (selectedSeatNumbers.length < passengerCount) {
        setSelectedSeatNumbers([...selectedSeatNumbers, seat.seatNum]);
      } else {
        setSelectedSeatNumbers([...selectedSeatNumbers.slice(1), seat.seatNum]);
      }
    }
  };

  const handleProceed = () => {
    const chosen = selectedSeatNumbers.map((sn) => {
      const match = berthsList.find((b) => b.seatNum === sn);
      return {
        berth: match ? match.berthType : 'LOWER',
        label: match ? match.label : `${sn} - Standard`
      };
    });
    onConfirmSeats(chosen);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-railway-800 to-navy-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {language === 'ta' ? 'இருக்கை & பெர்த் தேர்வு' : 'Interactive Coach Seat Selection'}
            </h3>
            <p className="text-xs text-slate-300">
              {train.name} ({train.number}) • Class {travelClass} • {passengerCount} Passenger(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-md border border-slate-300 bg-white"></span>
              <span className="text-slate-600">{language === 'ta' ? 'கிடைக்கும்' : 'Available'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-md bg-railway-600"></span>
              <span className="text-slate-600">{language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-md bg-slate-200 text-slate-400"></span>
              <span className="text-slate-600">{language === 'ta' ? 'முன்பதிவு செய்யப்பட்டது' : 'Booked'}</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs text-sky-900">
            <span>
              {language === 'ta'
                ? `தேர்ந்தெடுத்த இருக்கைகள்: ${selectedSeatNumbers.length} / ${passengerCount}`
                : `Selected ${selectedSeatNumbers.length} of ${passengerCount} seats`}
            </span>
            <span className="font-bold">
              Coach: {travelClass === '1A' ? 'H1' : travelClass === '2A' ? 'A1' : travelClass === '3A' ? 'B1' : 'C1'}
            </span>
          </div>

          {/* Coach Grid Visual */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-center text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-3">
              BAY 1 - COACH LAYOUT
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
              {berthsList.map((seat) => {
                const isSelected = selectedSeatNumbers.includes(seat.seatNum);

                return (
                  <button
                    key={seat.seatNum}
                    type="button"
                    disabled={seat.isOccupied}
                    onClick={() => handleSeatClick(seat)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      seat.isOccupied
                        ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-railway-600 border-railway-700 text-white shadow-md ring-2 ring-railway-500/30'
                        : 'bg-white border-slate-300 text-navy-900 hover:border-railway-400 hover:bg-railway-50'
                    }`}
                  >
                    <p className="font-bold text-sm">{seat.seatNum}</p>
                    <p className={`text-[10px] font-medium leading-tight mt-0.5 ${
                      isSelected ? 'text-white' : 'text-slate-500'
                    }`}>
                      {seat.berthType.replace('_', ' ')}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {language === 'ta' ? 'ரத்து' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleProceed}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-railway-600 hover:bg-railway-700 shadow-md"
            >
              {language === 'ta' ? 'பயணிகள் விவரங்களுக்குச் செல்' : 'Continue to Passenger Details'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
