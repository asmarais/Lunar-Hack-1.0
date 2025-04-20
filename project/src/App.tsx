import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot/ChatBot';
import FindFiles from './components/FindFiles/ChatBot';

import LostAndFound from './components/LostAndFound/LostAndFound';
import { AlertCircle, MessageSquare } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'lost-found' | 'find-files'>('chat');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Find your location
          </button>
          <button
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
              activeTab === 'lost-found'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('lost-found')}
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Lost & Found
          </button>
          <button
            className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
              activeTab === 'find-files'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('find-files')}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Find the files
          </button>
        </div>

        {/* Content Area */}
        <div className="transition-opacity duration-300 ease-in-out">
        {activeTab === 'chat' && <ChatBot />}
        {activeTab === 'lost-found' && <LostAndFound />}
        {activeTab === 'find-files' && <FindFiles />}
      </div>

      </div>
      
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
}

export default App;