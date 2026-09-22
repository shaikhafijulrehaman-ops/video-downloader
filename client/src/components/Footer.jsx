import React from 'react';
import { ArrowDownToLine, ShieldCheck } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handlePageClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-xs sm:text-sm border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-800">
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ArrowDownToLine className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Download<span className="text-brand-400">Hub</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm">
              Free, modern, mobile-first utility for previewing and downloading permitted social media videos.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
            <button 
              onClick={() => handlePageClick('home')} 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handlePageClick('how-it-works')} 
              className="text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => handlePageClick('supported-platforms')} 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Supported Platforms
            </button>
            <button 
              onClick={() => handlePageClick('privacy')} 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handlePageClick('terms')} 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Compliance */}
        <div className="pt-8 space-y-3 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-400">Disclaimer:</strong> DownloadHub is an independent utility and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with YouTube, Instagram, Facebook, Meta, or Google Inc. All product and company names are trademarks or registered trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
          </p>
          <p>
            DownloadHub does not host or store copyrighted media on its servers. All media previews are generated directly from public sources or officially provided platform endpoints.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <span>© {new Date().getFullYear()} DownloadHub. All rights reserved.</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Ad-Free • Privacy-First • No Database
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
