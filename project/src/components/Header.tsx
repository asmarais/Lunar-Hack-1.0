import React from 'react';
import { Lightbulb } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">Smart Campus</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-200">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-200">Services</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors duration-200">About</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;