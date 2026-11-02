import React from 'react';
import { Train, Phone } from 'lucide-react';
import type { Language } from '../types/railway';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-navy-950 text-white pt-16 pb-12 border-t border-navy-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-railway-700 to-railway-500 flex items-center justify-center text-white">
                <Train className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white font-display">
                  {t.brandName}
                </span>
                <span className="block text-[10px] font-bold text-railway-400 tracking-wider">
                  {t.subBrand}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.footerDesc}
            </p>
            <p className="text-xs font-semibold text-slate-300">
              "{t.tagline}"
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Railway Services
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li><a href="#search" className="hover:text-white transition-colors">Book Train Tickets</a></li>
              <li><a href="#pnr" className="hover:text-white transition-colors">PNR Status Enquiry</a></li>
              <li><a href="#ops" className="hover:text-white transition-colors">Platform Allocation Engine</a></li>
              <li><a href="#schedule" className="hover:text-white transition-colors">Southern Railway Timetables</a></li>
            </ul>
          </div>

          {/* Quota Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Priority Quotas
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>Emergency Priority (Rank 1)</li>
              <li>Connecting Journey Quota (Rank 2)</li>
              <li>General FIFO Normal Booking (Rank 3)</li>
              <li>Automatic Waitlist Reallocation</li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Passenger Safety
            </h4>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <Phone className="w-4 h-4" />
                <span>RailMadad: 139</span>
              </div>
              <p className="text-[11px] text-slate-400">
                24/7 National Grievance and Medical Assistance hotline.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-navy-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            © 2026 Payanam Junction — RailConnect. {t.allRightsReserved}
          </p>
          <div className="flex items-center space-x-4">
            <span>Powered by Smart Priority Quota & Platform Dispatch</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
