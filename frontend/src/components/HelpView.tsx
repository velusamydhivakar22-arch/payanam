import React from 'react';
import { HelpCircle, Phone } from 'lucide-react';
import type { Language } from '../types/railway';

interface HelpViewProps {
  language: Language;
}

export const HelpView: React.FC<HelpViewProps> = ({ language }) => {
  const faqs = [
    {
      q: 'How does Priority Quota Allocation work in Payanam Junction?',
      qTa: 'பயணம் ஜங்ஷனில் முன்னுரிமை ஒதுக்கீடு எவ்வாறு செயல்படுகிறது?',
      a: 'The system uses a 3-tier priority routing algorithm: Emergency (Priority 1: Medical/urgent duty) > Connecting (Priority 2: Incoming flight/train link) > Normal (Priority 3: General commuter). Confirmed passengers are NEVER displaced. When a confirmed ticket is cancelled, the released seat is instantly promoted to the highest waiting list passenger according to priority tier and FIFO order.',
      aTa: 'அவசர முறை (முன்னுரிமை 1) > இணைப்பு முறை (முன்னுரிமை 2) > சாதாரண முறை (முன்னுரிமை 3). உறுதி செய்யப்பட்ட பயணிகள் ஒருபோதும் மாற்றப்பட மாட்டார்கள். ரத்து செய்யப்படும் போது, வெளியிடப்பட்ட இருக்கை தானாகவே முன்னுரிமை வரிசைப்படி காத்திருப்போர் பட்டியல் பயணிக்கு ஒதுக்கப்படுகிறது.'
    },
    {
      q: 'What is the platform clearance buffer rule?',
      qTa: 'நடைமேடை இடைவெளி விதிமுறை என்ன?',
      a: 'Every platform allocation enforces a strict 5-minute clearance buffer after train departure before the platform is marked available for subsequent train arrivals. This eliminates track congestion and ensures passenger safety.',
      aTa: 'ரயில் புறப்பட்ட பிறகு அடுத்த ரயிலுக்கு நடைமேடை ஒதுக்கப்படுவதற்கு முன் 5 நிமிட கால இடைவெளி கட்டாயமாகப் பராமரிக்கப்படுகிறது. இது நெரிசலைத் தவிர்க்கிறது.'
    },
    {
      q: 'What is the cancellation refund policy?',
      qTa: 'டிக்கெட் ரத்து மற்றும் திரும்பப்பெறும் கொள்கை என்ன?',
      a: 'Confirmed tickets cancelled more than 48 hours before scheduled departure incur a flat ₹60 clerkage charge per passenger. Waiting list tickets receive 100% full refund with zero cancellation fee upon auto-cancellation after chart preparation.',
      aTa: 'புறப்படுவதற்கு 48 மணி நேரத்திற்கு முன் ரத்து செய்தால் பயணிக்கு ₹60 மட்டுமே பிடித்தம் செய்யப்படும். காத்திருப்போர் பட்டியல் டிக்கெட்டுகளுக்கு முழுத் தொகையும் உடனடியாகத் திருப்பியளிக்கப்படும்.'
    },
    {
      q: 'How do I contact Railway Emergency Assistance?',
      qTa: 'ரயில்வே அவசர உதவியை எவ்வாறு தொடர்பு கொள்வது?',
      a: 'Dial 139 from any mobile or landline across India for 24/7 RailMadad assistance, medical emergencies, security, and onboard catering complaints.',
      aTa: 'அனைத்து இந்திய ரயில்வே அவசர உதவிகள், பாதுகாப்பு மற்றும் மருத்துவ அவசரங்களுக்கு 139 என்ற கட்டணமில்லா எண்ணை அழைக்கவும்.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-8 border-b border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display flex items-center space-x-2">
          <HelpCircle className="w-7 h-7 text-railway-600" />
          <span>{language === 'ta' ? 'உதவி மையம் & அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Help Center & Passenger Guidelines'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {language === 'ta'
            ? 'ரயில்வே முன்பதிவு விதிகள், அவசர ஒதுக்கீடு மற்றும் உதவி எண்கள்.'
            : 'Find answers on priority allocation, platform safety protocols, and passenger helpline.'}
        </p>
      </div>

      {/* Emergency Hotline Card */}
      <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-navy-900 to-railway-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              RailMadad National Helpline: 139
            </h3>
            <p className="text-xs text-slate-300">
              One-stop helpline for security, medical emergency, catering & enquiry.
            </p>
          </div>
        </div>

        <a
          href="tel:139"
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white text-navy-950 hover:bg-slate-100 shadow flex items-center space-x-2"
        >
          <span>Call 139</span>
        </a>
      </div>

      {/* FAQs */}
      <div className="mt-10 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2 text-left"
          >
            <h4 className="font-extrabold text-base text-navy-900">
              {language === 'ta' ? faq.qTa : faq.q}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ta' ? faq.aTa : faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
