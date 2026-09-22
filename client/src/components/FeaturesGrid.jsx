import React from 'react';
import { Zap, ShieldOff, Lock, Smartphone } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Lightning Fast',
      desc: 'Instant URL validation and clean metadata processing without waiting in queues.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: '100% Ad-Free',
      desc: 'Clean experience with zero ads, zero popups, and no deceptive download buttons.',
      icon: ShieldOff,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Private & Anonymous',
      desc: 'No login required, no tracking cookies, and no media stored permanently on our servers.',
      icon: Lock,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: 'Mobile First',
      desc: 'Designed specifically for iPhone, Android, and tablets with seamless clipboard integration.',
      icon: Smartphone,
      color: 'bg-sky-50 text-sky-600 border-sky-200'
    }
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Why Use DownloadHub?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A utility built around speed, simplicity, and your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all text-center flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
