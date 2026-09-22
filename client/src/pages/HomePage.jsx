import React, { useState, useRef } from 'react';
import HeroDownloader from '../components/HeroDownloader';
import ResultCard from '../components/ResultCard';
import HowToSteps from '../components/HowToSteps';
import FeaturesGrid from '../components/FeaturesGrid';
import PlatformShowcase from '../components/PlatformShowcase';
import FaqSection from '../components/FaqSection';
import { processVideoUrl } from '../services/api';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const resultRef = useRef(null);

  const handleProcess = async (url, validationError = null) => {
    if (validationError) {
      setError(validationError);
      setVideoData(null);
      return;
    }

    if (!url) return;

    setIsLoading(true);
    setError(null);
    setVideoData(null);

    const result = await processVideoUrl(url);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "We couldn't process this video right now. Please verify the URL.");
      setVideoData(null);
    } else {
      setVideoData(result.data);
      // Smooth scroll to result card on mobile and desktop
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleReset = () => {
    setVideoData(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Hero Downloader Section */}
      <HeroDownloader
        onProcess={handleProcess}
        isLoading={isLoading}
        error={error}
        clearError={() => setError(null)}
      />

      {/* Result Card Section */}
      <div ref={resultRef}>
        {videoData && (
          <ResultCard
            videoData={videoData}
            onReset={handleReset}
          />
        )}
      </div>

      {/* How To Steps */}
      <HowToSteps />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Supported Platforms Info */}
      <PlatformShowcase />

      {/* Interactive FAQ */}
      <FaqSection />
    </div>
  );
}
