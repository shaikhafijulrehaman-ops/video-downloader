import React from 'react';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function TermsPage({ setActivePage }) {
  const terms = [
    {
      title: '1. Acceptance of Terms',
      desc: 'By accessing or using DownloadHub, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue using the application.'
    },
    {
      title: '2. Permitted Personal & Fair Use',
      desc: 'DownloadHub is provided exclusively for personal, non-commercial, and fair-use viewing and archival of publicly accessible media. You may not use this tool to infringe upon copyrights, distribute unauthorized copies, or exploit creators’ work for commercial gain.'
    },
    {
      title: '3. Platform Terms & Access Restrictions',
      desc: 'Users must adhere to the terms of service of the respective third-party platforms (Instagram, YouTube, and Facebook). DownloadHub does not provide mechanisms to circumvent Digital Rights Management (DRM), paywalls, authentication tokens, or private account protections.'
    },
    {
      title: '4. Intellectual Property & Trademarks',
      desc: 'YouTube is a trademark of Google LLC. Instagram and Facebook are trademarks of Meta Platforms, Inc. DownloadHub is an independent software application and is not associated with, sponsored by, or endorsed by any of these entities.'
    },
    {
      title: '5. Limitation of Liability',
      desc: 'DownloadHub is provided "as is" without warranty of any kind, either express or implied. Under no circumstances shall the operators of DownloadHub be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this service.'
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last revised: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {terms.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
