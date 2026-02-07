import React, { useState } from 'react';
import Header from './components/Header';
import ImageAnalyzer from './components/ImageAnalyzer';
import Chatbot from './components/Chatbot';

export type Page = 'analyzer' | 'chatbot';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('analyzer');

  return (
    <div className="min-h-screen text-gray-800 font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'analyzer' && <ImageAnalyzer />}
          {currentPage === 'chatbot' && <Chatbot />}
        </div>
      </main>
    </div>
  );
};

export default App;