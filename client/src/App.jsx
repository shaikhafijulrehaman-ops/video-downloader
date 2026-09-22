import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import SupportedPlatformsPage from './pages/SupportedPlatformsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'how-it-works':
        return <HowItWorksPage setActivePage={setActivePage} />;
      case 'supported-platforms':
        return <SupportedPlatformsPage setActivePage={setActivePage} />;
      case 'privacy':
        return <PrivacyPage setActivePage={setActivePage} />;
      case 'terms':
        return <TermsPage setActivePage={setActivePage} />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Dynamic View */}
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
