import React, { useState, useRef } from 'react';
import { 
  Clipboard, 
  X, 
  Search, 
  Loader2, 
  AlertCircle, 
  Sparkles,
  Check
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from './icons/SocialIcons';
import { detectPlatformClient, validateUrlClient, PLATFORM_INFO } from '../utils/urlHelper';

export default function HeroDownloader({ 
  onProcess, 
  isLoading, 
  error, 
  clearError 
}) {
  const [url, setUrl] = useState('');
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const inputRef = useRef(null);

  const detectedPlatform = detectPlatformClient(url);

  const supportedPlatforms = [
    { label: 'Instagram Reels', icon: InstagramIcon, color: 'text-slate-800' },
    { label: 'YouTube Shorts', icon: YoutubeIcon, color: 'text-slate-800' },
    { label: 'Facebook Videos', icon: FacebookIcon, color: 'text-slate-800' },
  ];

  const handlePaste = async () => {
    clearError();
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
          inputRef.current?.focus();
        }
      } else {
        inputRef.current?.focus();
      }
    } catch (err) {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setUrl('');
    clearError();
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (isLoading) return;

    clearError();
    const validation = validateUrlClient(url);
    if (!validation.valid) {
      onProcess(null, validation.error);
      return;
    }

    onProcess(url.trim());
  };

  const handleSampleClick = (sampleUrl) => {
    setUrl(sampleUrl);
    clearError();
    onProcess(sampleUrl);
  };

  return (
    <section className="w-full pt-8 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fast, Free & Clean Video Utility</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Download Your Video
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal">
          Paste a supported video link and get a clean preview.
        </p>

        {/* Supported Platforms (Static Display) */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {supportedPlatforms.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-slate-800 border border-slate-200/90 shadow-2xs select-none"
              >
                <Icon className="w-4 h-4 text-slate-700" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Main Input Card */}
        <div className="mt-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-glass border border-slate-200/80 p-2.5 sm:p-3 transition-shadow hover:shadow-card-hover">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            {/* Input field wrapper */}
            <div className="relative flex-1 flex items-center min-w-0 bg-slate-50/80 rounded-xl border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:bg-white transition-all">
              {/* Platform icon indicator */}
              <div className="pl-3.5 pr-2 text-slate-400 flex-shrink-0 flex items-center justify-center">
                {detectedPlatform === 'youtube' && <YoutubeIcon className="w-5 h-5 text-red-600 animate-in fade-in" />}
                {detectedPlatform === 'instagram' && <InstagramIcon className="w-5 h-5 text-pink-600 animate-in fade-in" />}
                {detectedPlatform === 'facebook' && <FacebookIcon className="w-5 h-5 text-blue-600 animate-in fade-in" />}
                {!detectedPlatform && <Search className="w-5 h-5 text-slate-400" />}
              </div>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) clearError();
                }}
                placeholder="Paste video URL here..."
                className="w-full py-3.5 pr-20 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                aria-label="Video URL input"
                disabled={isLoading}
              />

              {/* Action buttons inside input bar */}
              <div className="absolute right-2 flex items-center gap-1">
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear input"
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                    aria-label="Clear video URL"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg shadow-2xs transition-all active:scale-95"
                  aria-label="Paste URL from clipboard"
                >
                  {pasteSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Pasted</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full sm:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 flex-shrink-0"
              aria-label="Get Video"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" strokeWidth={2.5} />
                  <span>Get Video</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Processing Indicator */}
        {isLoading && (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-brand-600 font-medium animate-pulse" aria-live="polite">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing video...</span>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div 
            className="mt-4 max-w-2xl mx-auto p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 text-left animate-in fade-in slide-in-from-top-2 duration-200"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
            </div>
            <button 
              onClick={clearError}
              className="text-red-500 hover:text-red-700 p-1"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Sample Links Chips */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="font-medium">Quick Test:</span>
          <button
            type="button"
            onClick={() => handleSampleClick(sampleUrls.instagram)}
            className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 transition-colors"
          >
            Sample Reel
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick(sampleUrls.youtube)}
            className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
          >
            Sample YouTube
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick(sampleUrls.facebook)}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            Sample Facebook
          </button>
        </div>
      </div>
    </section>
  );
}
