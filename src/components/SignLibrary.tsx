import React, { useState } from 'react';
import { X, Search, Play, Hand, Hash } from 'lucide-react';

interface SignLibraryProps {
  onClose: () => void;
  onTestSign: (sign: string) => void;
}

const SignLibrary: React.FC<SignLibraryProps> = ({ onClose, onTestSign }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const signLibrary = [
    { name: 'Hello', key: 'hello', category: 'Greetings', description: 'Basic greeting sign' },
    { name: 'Goodbye', key: 'goodbye', category: 'Greetings', description: 'Farewell sign' },
    { name: 'Thank You', key: 'thank_you', category: 'Courtesy', description: 'Expression of gratitude' },
    { name: 'Please', key: 'please', category: 'Courtesy', description: 'Polite request' },
    { name: 'Yes', key: 'yes', category: 'Basic', description: 'Affirmative response' },
    { name: 'No', key: 'no', category: 'Basic', description: 'Negative response' },
    // Add all alphabet letters
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
      name: letter,
      key: `fingerspell_${letter.toLowerCase()}`,
      category: 'Fingerspelling',
      description: `Letter ${letter} in ASL fingerspelling`
    })),
    // Add numbers
    ...[0,1,2,3,4,5,6,7,8,9].map(number => ({
      name: number.toString(),
      key: `fingerspell_${number}`,
      category: 'Numbers',
      description: `Number ${number} in ASL`
    }))
  ];

  const filteredSigns = signLibrary.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sign.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || sign.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(signLibrary.map(sign => sign.category))];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fingerspelling': return <Hand size={16} />;
      case 'Numbers': return <Hash size={16} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-6xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Library className="mr-3" size={28} />
            Complete Sign Library
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Categories */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search signs, categories, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
                <span className="text-xs opacity-75">
                  ({signLibrary.filter(s => category === 'All' || s.category === category).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeCategory === 'All' ? (
            // Show by categories when "All" is selected
            categories.slice(1).map(category => {
              const categorySigns = filteredSigns.filter(sign => sign.category === category);
              if (categorySigns.length === 0) return null;

              return (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                    <span className="ml-2 text-sm text-gray-400">({categorySigns.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {categorySigns.map(sign => (
                      <SignCard key={sign.key} sign={sign} onTestSign={onTestSign} onClose={onClose} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Show filtered signs for specific category
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredSigns.map(sign => (
                <SignCard key={sign.key} sign={sign} onTestSign={onTestSign} onClose={onClose} />
              ))}
            </div>
          )}

          {filteredSigns.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤟</div>
              <p className="text-gray-400 text-lg">No signs found matching your search.</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignCard: React.FC<{
  sign: any;
  onTestSign: (key: string) => void;
  onClose: () => void;
}> = ({ sign, onTestSign, onClose }) => (
  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10 group">
    <div className="flex items-start justify-between mb-2">
      <div className="flex-1">
        <h4 className="text-white font-medium text-lg">{sign.name}</h4>
        <p className="text-gray-400 text-xs mt-1">{sign.description}</p>
      </div>
      <button
        onClick={() => {
          onTestSign(sign.key);
          onClose();
        }}
        className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 opacity-80 group-hover:opacity-100"
        title={`Test sign: ${sign.name}`}
      >
        <Play size={16} />
      </button>
    </div>
    <div className="text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded-full inline-block">
      {sign.category}
    </div>
  </div>
);

export default SignLibrary;