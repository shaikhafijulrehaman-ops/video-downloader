import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from './icons/SocialIcons';

export default function PlatformShowcase() {
  const platforms = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      gradient: 'from-purple-500 via-pink-500 to-amber-500',
      badge: 'bg-pink-50 text-pink-700 border-pink-200',
      description: 'Supports Instagram Reels, Posts, and Videos from public profiles.',
      supportedTypes: ['Instagram Reels', 'Single Video Posts', 'Carousel Previews', 'IGTV'],
      complianceNote: 'Only public Instagram posts are supported. Private accounts cannot be processed.'
    },
    {
      name: 'YouTube',
      icon: YoutubeIcon,
      gradient: 'from-red-600 to-red-500',
      badge: 'bg-red-50 text-red-700 border-red-200',
      description: 'Supports YouTube Shorts and regular videos with high-definition thumbnails.',
      supportedTypes: ['YouTube Shorts', 'Standard Videos', 'HD Thumbnails', 'Official Metadata'],
      complianceNote: 'Direct video streams are protected by YouTube policy. HD thumbnail downloads and direct links are provided.'
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      gradient: 'from-blue-600 to-blue-500',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Supports Facebook Watch, Public Reels, and Video posts.',
      supportedTypes: ['Facebook Reels', 'Facebook Watch', 'Public Group Videos', 'Page Videos'],
      complianceNote: 'Content must be set to public on Facebook to allow preview generation.'
    }
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 bg-slate-50/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Supported Platforms
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Preview and process media seamlessly across the top social networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((plat, idx) => {
            const Icon = plat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${plat.gradient} flex items-center justify-center text-white shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{plat.name}</h3>
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${plat.badge}`}>
                        Public Media
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4">
                    {plat.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {plat.supportedTypes.map((type, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{plat.complianceNote}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
