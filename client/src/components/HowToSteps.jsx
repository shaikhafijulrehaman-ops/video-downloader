import React from 'react';
import { Copy, ClipboardCheck, ArrowDownCircle } from 'lucide-react';

export default function HowToSteps() {
  const steps = [
    {
      num: '01',
      title: 'Copy Link',
      desc: 'Open Instagram, YouTube, or Facebook and copy the URL or share link of the video.',
      icon: Copy,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      num: '02',
      title: 'Paste Into DownloadHub',
      desc: 'Paste the copied URL into the box above. Our platform instantly detects the source.',
      icon: ClipboardCheck,
      color: 'bg-pink-50 text-pink-600 border-pink-200'
    },
    {
      num: '03',
      title: 'Preview & Download',
      desc: 'Get your clean preview and download your media or open the original video.',
      icon: ArrowDownCircle,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    }
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 bg-white/60 border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Download your favorite social media videos in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
