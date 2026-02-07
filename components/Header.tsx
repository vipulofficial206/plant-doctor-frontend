import React from 'react';
import type { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--primary-accent)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--secondary-accent)', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <path stroke="url(#logoGradient)" strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528l.21-1.05a2.25 2.25 0 00-1.583-2.583l-1.05-.21a2.25 2.25 0 00-2.583 1.583l-.21 1.05a2.25 2.25 0 001.583 2.583l1.05.21a2.25 2.25 0 002.583-1.583z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const navItemClasses = "relative px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/50";
  const activeClasses = "text-[var(--primary-accent)] font-semibold";
  const inactiveClasses = "text-gray-500 hover:text-[var(--primary-accent)]";

  return (
    <header className="sticky top-0 z-50 bg-[var(--card-color)] backdrop-blur-lg border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <LogoIcon />
            <h1 className="text-xl font-bold text-gray-800 ml-3">Plant Doctor AI</h1>
          </div>
          <nav className="flex items-center space-x-2 bg-black/5 p-1 rounded-lg border border-[var(--border-color)]">
            <button
              onClick={() => setCurrentPage('analyzer')}
              className={`${navItemClasses} ${currentPage === 'analyzer' ? activeClasses : inactiveClasses}`}
            >
              Image Analyzer
              {currentPage === 'analyzer' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] rounded-full"></span>}
            </button>
            <button
              onClick={() => setCurrentPage('chatbot')}
              className={`${navItemClasses} ${currentPage === 'chatbot' ? activeClasses : inactiveClasses}`}
            >
              Chatbot
               {currentPage === 'chatbot' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] rounded-full"></span>}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;