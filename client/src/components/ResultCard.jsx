import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Info, 
  Image as ImageIcon,
  Share2,
  Check
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from './icons/SocialIcons';
import { PLATFORM_INFO } from '../utils/urlHelper';

export default function ResultCard({ videoData, onReset }) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!videoData) return null;

  const {
    platform,
    platformLabel,
    mediaType,
    mediaId,
    title,
    author,
    authorUrl,
    thumbnail,
    thumbnailFallback,
    originalUrl,
    downloadAvailable,
    downloadUrl,
    downloadOptions = [],
    message
  } = videoData;

  const platformConfig = PLATFORM_INFO[platform] || {
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(originalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="w-full py-6 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-glass border border-slate-200/90 overflow-hidden">
        
        {/* Top Status Bar */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${platformConfig.badgeClass}`}>
              {platformLabel || 'Social Video'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {mediaType || 'Media'}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Video ready</span>
          </div>
        </div>

        {/* Video Thumbnail Preview */}
        <div className="relative aspect-video w-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 overflow-hidden group flex items-center justify-center">
          {!imageError && thumbnail ? (
            <img
              src={thumbnail}
              alt={title || 'Video thumbnail preview'}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              onError={() => {
                if (thumbnailFallback && thumbnail !== thumbnailFallback) {
                  setImageError(false);
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 p-6 text-center bg-radial from-slate-800 to-slate-900">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
                <ImageIcon className="w-7 h-7 text-white/80" />
              </div>
              <p className="text-sm font-semibold text-white tracking-wide">{title}</p>
              <p className="text-xs text-slate-400 mt-1">Direct public media preview</p>
            </div>
          )}

          {/* Platform Watermark Overlay */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 shadow-sm">
            {platform === 'youtube' && <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />}
            {platform === 'instagram' && <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />}
            {platform === 'facebook' && <FacebookIcon className="w-3.5 h-3.5 text-blue-400" />}
            <span>{mediaType}</span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
              {title || 'Social Media Video'}
            </h2>
            {author && (
              <p className="mt-1 text-sm text-slate-500">
                Created by{' '}
                <a 
                  href={authorUrl || originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-slate-700 hover:text-brand-600 transition-colors"
                >
                  {author}
                </a>
              </p>
            )}
          </div>

          {/* Compliance & Availability Notice */}
          {!downloadAvailable && (
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Direct download isn't available for this content.</p>
                <p className="text-amber-800 text-xs mt-0.5">
                  {message || "You can open the original video on the platform."}
                </p>
              </div>
            </div>
          )}

          {/* Additional Permitted Media Formats (e.g. HD Cover/Thumbnail) */}
          {downloadOptions && downloadOptions.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Available Resources
              </p>
              <div className="flex flex-wrap gap-2">
                {downloadOptions.map((opt, idx) => (
                  <a
                    key={idx}
                    href={opt.url}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {opt.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {downloadAvailable && downloadUrl ? (
              <a
                href={downloadUrl}
                download
                className="flex-1 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-center"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </a>
            ) : (
              <div className="flex-1 py-3 px-4 bg-slate-100 text-slate-500 text-xs sm:text-sm font-medium rounded-xl flex items-center justify-center gap-1.5 text-center cursor-default">
                <span>Download unavailable</span>
              </div>
            )}

            {/* Open Original Button */}
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
              title="Open video on original social platform"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Original</span>
            </a>

            {/* Copy Link button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-3 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center"
              title="Copy video link"
              aria-label="Copy video link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
