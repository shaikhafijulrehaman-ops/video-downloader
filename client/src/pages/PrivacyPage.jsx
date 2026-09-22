import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, ArrowLeft } from 'lucide-react';

export default function PrivacyPage({ setActivePage }) {
  const points = [
    {
      title: 'No User Accounts or Logins',
      desc: 'You do not need to register, provide an email address, or connect any social media account to use DownloadHub. We never ask for or store passwords.',
      icon: Lock
    },
    {
      title: 'Stateless On-the-Fly Processing',
      desc: 'Submitted video URLs are processed in memory only for the duration of the request to generate the preview card and resolve permitted media. Once your request completes, the data is not retained.',
      icon: Server
    },
    {
      title: 'Zero Permanent Media Storage',
      desc: 'DownloadHub does not host, cache, or permanently store user-requested video files. We have no media database or video archive.',
      icon: HardDrive
    },
    {
      title: 'No Tracking Cookies or Ad Networks',
      desc: 'We do not run ad networks, tracking beacons, cross-site trackers, or marketing analytics scripts. Your activity remains completely private and anonymous.',
      icon: EyeOff
    }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 max-w-3xl mx-auto">
      <button
        onClick={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Downloader</span>
      </button>

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy Guaranteed</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">{pt.title}</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          );
        })}

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Server Logs & Rate Limiting</h3>
          <p>
            To prevent automated abuse, denial-of-service attacks, and server scraping, our backend maintains a temporary, rotating in-memory rate-limiter based on IP addresses (20 requests per 10-minute window). These temporary entries are stored solely in transient memory and automatically expire.
          </p>
          <p>
            If you have questions regarding this privacy policy or wish to report a concern, please contact our administrative team via GitHub.
          </p>
        </div>
      </div>
    </div>
  );
}
