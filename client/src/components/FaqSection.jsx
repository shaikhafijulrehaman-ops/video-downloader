import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Is DownloadHub completely free to use?',
      a: 'Yes, DownloadHub is 100% free with no subscriptions, no credit card requirements, and absolutely no ads or popups.'
    },
    {
      q: 'Do I need to create an account or log in?',
      a: 'No. DownloadHub is completely stateless. You do not need to register, provide an email address, or sign into any social media accounts.'
    },
    {
      q: 'Where are downloaded videos and media saved on my phone or computer?',
      a: 'Downloaded files are saved directly to your device’s default Downloads folder (or Files app on iPhone / iPad, and Gallery/Downloads on Android).'
    },
    {
      q: 'Why do some videos show "Download unavailable"?',
      a: 'Some platforms or creators enforce technical access controls, digital rights management (DRM), or authentication restrictions. In compliance with platform terms and copyright laws, DownloadHub displays a full preview and provides an "Open Original" button instead of attempting to bypass platform protections.'
    },
    {
      q: 'Does DownloadHub store my videos or download history in a database?',
      a: 'No. DownloadHub has NO database, NO user tracking, and NO permanent video storage. URLs are processed dynamically on-the-fly and immediately discarded.'
    },
    {
      q: 'Can I download private Instagram or Facebook videos?',
      a: 'No. DownloadHub strictly respects privacy boundaries. Private accounts, private groups, and password-protected videos cannot and will not be retrieved.'
    }
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 bg-white border-t border-slate-200/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Everything you need to know about using DownloadHub.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`} 
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
