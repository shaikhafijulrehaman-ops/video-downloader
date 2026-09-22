import React from 'react';
import { Copy, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HowItWorksPage({ setActivePage }) {
  const detailedSteps = [
    {
      title: 'Step 1: Copy Video Link from the Social App',
      description: 'Find any publicly shared video, reel, or short on Instagram, YouTube, or Facebook. Tap the "Share" button and choose "Copy Link", or copy the URL directly from your web browser\'s address bar.',
      tips: [
        'Ensure the post or video is public (not from a private account or secret group).',
        'Works with desktop web, mobile web, and native mobile apps.'
      ]
    },
    {
      title: 'Step 2: Paste the URL into DownloadHub',
      description: 'Visit DownloadHub on any device. Tap the convenient "Paste" button to insert the link straight from your clipboard, or manually paste it into the search input.',
      tips: [
        'Our system automatically detects whether the URL is from YouTube, Instagram, or Facebook.',
        'URL normalization strips away redundant tracking parameters before validation.'
      ]
    },
    {
      title: 'Step 3: Platform Validation & Preview Generation',
      description: 'Our backend validates that the link is safe, structured correctly, and points to supported media. It extracts the official title, author information, and high-definition thumbnail without logging your IP or storing private data.',
      tips: [
        'Protected by server-side SSRF guards to block internal or malicious network requests.',
        'No stack traces, internal errors, or tracking scripts are ever served.'
      ]
    },
    {
      title: 'Step 4: Download or Open Original Media',
      description: 'Where permitted by the content creator and platform terms, you can download the media directly. If a video is subject to platform DRM or strict access controls, DownloadHub clearly indicates this and gives you a one-click button to open and watch the original content.',
      tips: [
        'Downloads are processed in real-time with zero permanent server storage.',
        'No fake download buttons, ads, or secondary redirect loops.'
      ]
    }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How DownloadHub Works
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
          A transparent, ad-free guide to how our media preview and download utility operates.
        </p>
      </div>

      <div className="space-y-8">
        {detailedSteps.map((step, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                {idx + 1}
              </div>
              <div className="space-y-3 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {step.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {step.description}
                </p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1.5">
                  {step.tips.map((tip, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Box */}
      <div className="mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-200 text-amber-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm space-y-1.5">
            <h3 className="font-bold">Compliance and Respect for Creators</h3>
            <p className="text-amber-800 leading-relaxed">
              DownloadHub is strictly designed for personal, fair-use archival and preview of publicly accessible videos. We do not bypass platform authentication, DRM protections, or privacy settings. Please always respect intellectual property rights and creator ownership.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
        >
          <span>Try It Now on Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
