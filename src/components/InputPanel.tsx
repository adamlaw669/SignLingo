import React from 'react';
import { Mic, MicOff, Play, Pause, Volume2 } from 'lucide-react';

interface InputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  isRecording: boolean;
  isListening: boolean;
  isSupported: boolean;
  onRecord: () => void;
  onPlay: () => void;
  isPlaying: boolean;
  currentGloss: string;
}

const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  setInputText,
  isRecording,
  isListening,
  isSupported,
  onRecord,
  onPlay,
  isPlaying,
  currentGloss
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
      <h3 className="text-xl font-semibold text-white mb-4">Input</h3>
      
      {/* Text Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter text to translate
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message here..."
          className="w-full h-24 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
          rows={3}
        />
      </div>

      {/* Speech Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">
            Voice Input
          </label>
          {!isSupported && (
            <span className="text-xs text-yellow-400">
              Not supported in this browser
            </span>
          )}
        </div>
        
        <button
          onClick={onRecord}
          disabled={!isSupported}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed'
          }`}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          <span>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </span>
          {isListening && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>
      </div>

      {/* Sign Gloss Preview */}
      {currentGloss && (
        <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sign Gloss
          </label>
          <p className="text-blue-300 text-sm font-mono">{currentGloss}</p>
        </div>
      )}

      {/* Play Controls */}
      <div className="flex space-x-3">
        <button
          onClick={onPlay}
          disabled={!inputText.trim() || isPlaying}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? 'Signing...' : 'Sign It'}</span>
        </button>
        
        <button className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20">
          <Volume2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default InputPanel;