import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import type { Train, TravelClass, BookingMode, Language } from '../types/railway';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  train: Train;
  travelClass: TravelClass;
  bookingMode: BookingMode;
  passengerCount: number;
  totalFare: number;
  language: Language;
  onPaymentSuccess: (paymentId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  train,
  travelClass,
  bookingMode,
  passengerCount,
  totalFare,
  language,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'RAILPAY'>('UPI');
  const [upiId, setUpiId] = useState<string>('passenger@okaxis');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'DONE'>('SELECT');

  if (!isOpen) return null;

  // Fare calculations
  const gst = Math.round(totalFare * 0.05);
  const serviceCharge = 15;
  const finalPayable = totalFare + gst + serviceCharge;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setStep('PROCESSING');

    setTimeout(() => {
      setStep('DONE');
      setTimeout(() => {
        setIsProcessing(false);
        const paymentId = `PAY-${Date.now().toString().slice(-8)}`;
        onPaymentSuccess(paymentId);
      }, 900);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-railway-800 to-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold">
              {language === 'ta' ? 'பாதுகாப்பான கட்டண முறை' : 'Simulated RailConnect Checkout'}
            </h3>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {step === 'PROCESSING' ? (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="w-16 h-16 text-railway-600 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-navy-900">
              Processing Payment of ₹{finalPayable}...
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Authorizing transaction with simulated banking gateway & reserving confirmed seats on {train.number} ({travelClass} - {bookingMode} Mode)...
            </p>
          </div>
        ) : step === 'DONE' ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-navy-900">
              Payment Successful!
            </h4>
            <p className="text-xs text-slate-500">
              Generating your PNR and E-Ticket...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            
            {/* Fare Breakdown Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Base Fare ({passengerCount} x ₹{totalFare / passengerCount})</span>
                <span className="font-semibold text-navy-900">₹{totalFare}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Railway GST (5%)</span>
                <span className="font-semibold text-navy-900">₹{gst}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>IRCTC Convenience Fee</span>
                <span className="font-semibold text-navy-900">₹{serviceCharge}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-navy-900">Total Payable Amount</span>
                <span className="text-xl font-extrabold text-railway-700">₹{finalPayable}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Payment Mode (Simulated)
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-railway-600 bg-railway-50 text-railway-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-railway-600" />
                  <span className="text-xs">UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-railway-600 bg-railway-50 text-railway-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-railway-600" />
                  <span className="text-xs">Debit / Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                    paymentMethod === 'NETBANKING'
                      ? 'border-railway-600 bg-railway-50 text-railway-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-railway-600" />
                  <span className="text-xs">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('RAILPAY')}
                  className={`p-3 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                    paymentMethod === 'RAILPAY'
                      ? 'border-railway-600 bg-railway-50 text-railway-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-railway-600" />
                  <span className="text-xs">RailPay Wallet</span>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Virtual Payment Address (VPA) / UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  />
                  <p className="text-[11px] text-slate-400">
                    Supports Google Pay, PhonePe, Paytm, BHIM UPI
                  </p>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-railway-600 hover:bg-railway-700 shadow-lg shadow-railway-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>Pay & Confirm Ticket (₹{finalPayable})</span>
            </button>

            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated Payment Gateway — No actual charge applied</span>
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
