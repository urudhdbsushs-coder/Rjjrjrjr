
import React from 'react';
import { Language } from '../types';

interface LanguageModalProps {
  onSelect: (lang: Language) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[100]">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center fade-in mx-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Choose Your Language</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => onSelect('en')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
          >
            English
          </button>
          <button 
            onClick={() => onSelect('hi')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
          >
            हिन्दी
          </button>
          <button 
            onClick={() => onSelect('bn')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
          >
            বাংলা
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
