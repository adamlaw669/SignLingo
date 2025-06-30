import React from 'react';
import { Settings, Library, TestTube, Hand } from 'lucide-react';

interface ControlPanelProps {
  onShowLibrary: () => void;
  onTestSign: (sign: string) => void;
  isProcessing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onShowLibrary,
  onTestSign,
  isProcessing
}) => {
  const quickSigns = [
    { name: 'Hello', key: 'hello' },
    { name: 'Thank You', key: 'thank_you' },
    { name: 'Please', key: 'please' },
    { name: 'Yes', key: 'yes' },
    { name: 'No', key: 'no' },
    { name: 'Goodbye', key: 'goodbye' }
  ];

  // Full alphabet for fingerspelling
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Hand className="mr-2" size={20} />
        Controls
      </h3>
      
      {/* Quick Test Signs */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Quick Test Signs
        </label>
        <div className="grid grid-cols-2 gap-2">
          {quickSigns.map((sign) => (
            <button
              key={sign.key}
              onClick={() => onTestSign(sign.key)}
              disabled={isProcessing}
              className="px-3 py-2 bg-white/5 hover:bg-white/15 text-white text-sm rounded-lg transition-all duration-200 border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {sign.name}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Fingerspelling Alphabet */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Complete Fingerspelling Alphabet
        </label>
        <div className="grid grid-cols-6 gap-1.5 max-h-32 overflow-y-auto">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => onTestSign(`fingerspell_${letter.toLowerCase()}`)}
              disabled={isProcessing}
              className="aspect-square flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 text-white text-sm font-bold rounded-lg transition-all duration-200 border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-lg"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Numbers 0-9 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Numbers (0-9)
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[0,1,2,3,4,5,6,7,8,9].map((number) => (
            <button
              key={number}
              onClick={() => onTestSign(`fingerspell_${number}`)}
              disabled={isProcessing}
              className="aspect-square flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-green-500/20 hover:from-teal-500/40 hover:to-green-500/40 text-white text-sm font-bold rounded-lg transition-all duration-200 border border-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 shadow-lg"
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Sign Library */}
      <div className="mb-6">
        <button
          onClick={onShowLibrary}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          <Library size={20} />
          <span>Open Sign Library</span>
        </button>
      </div>

      {/* Settings */}
      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 hover:bg-white/15 text-white font-medium rounded-xl transition-all duration-200 border border-white/20 hover:border-white/40 transform hover:scale-105 active:scale-95">
        <Settings size={20} />
        <span>Settings</span>
      </button>
    </div>
  );
};

export default ControlPanel;