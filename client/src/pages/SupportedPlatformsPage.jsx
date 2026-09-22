import React from 'react';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from '../components/icons/SocialIcons';

export default function SupportedPlatformsPage({ setActivePage }) {
  const platforms = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'Support for Instagram Reels, Posts, and Videos from public profiles.',
      urlFormats: [
        'https://www.instagram.com/reel/C8k_jR9PABC/',
        'https://www.instagram.com/p/DFxyz123abc/',
        'https://instagram.com/tv/C123456789/'
      ],
      capabilities: [
        'Automatic Reel & Post detection',
        'High-resolution cover thumbnail preview',
        'Direct link to original creator',
        'One-click original content opening'
      ],
      limitations: 'Private Instagram profiles and expired 24-hour Stories without public tokens are not accessible.'
    },
    {
      name: 'YouTube & YouTube Shorts',
      icon: YoutubeIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Support for YouTube Shorts, standard videos, and youtu.be shortlinks.',
      urlFormats: [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ'
      ],
      capabilities: [
        'Official oEmbed metadata integration',
        'High-definition thumbnail resolution (1080p/720p)',
        'Full creator channel attribution',
        'Instant YouTube Shorts detection'
      ],
      limitations: 'Direct MP4 stream downloading is restricted under YouTube Terms of Service and DRM. DownloadHub provides clean previews, HD thumbnails, and direct playback links.'
    },
    {
      name: 'Facebook Videos & Reels',
      icon: FacebookIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Support for Facebook Watch, Public Reels, and page video posts.',
      urlFormats: [
        'https://www.facebook.com/watch/?v=123456789012345',
        'https://www.facebook.com/reel/987654321098765',
        'https://fb.watch/abCdEf123/'
      ],
      capabilities: [
        'Facebook Watch and Reels normalization',
        'Support for fb.watch mobile shortlinks',
        'Preview card with original video launcher'
      ],
      limitations: 'Private groups, friends-only posts, and geo-restricted live broadcasts cannot be processed.'
    }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Supported Platforms & Formats
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
          Clear documentation on supported URL formats, feature capabilities, and platform-specific access terms.
        </p>
      </div>

      <div className="space-y-8">
        {platforms.map((plat, idx) => {
          const Icon = plat.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${plat.bgColor} ${plat.borderColor} ${plat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{plat.name}</h2>
                  <p className="text-xs text-slate-500">{plat.description}</p>
                </div>
              </div>

              {/* URL Patterns */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recognized URL Patterns
                </h3>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1 font-mono text-xs text-slate-700">
                  {plat.urlFormats.map((url, uIdx) => (
                    <div key={uIdx} className="truncate">
                      {url}
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plat.capabilities.map((cap, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              {/* Policy note */}
              <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-700">Policy & Restrictions: </span>
                  <span>{plat.limitations}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
        >
          <span>Back to Downloader</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
