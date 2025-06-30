import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Mic, MicOff, Play, Pause, Settings, Volume2 } from 'lucide-react';
import Avatar from './components/Avatar';
import InputPanel from './components/InputPanel';
import ControlPanel from './components/ControlPanel';
import SignLibrary from './components/SignLibrary';
import { useSpeechToText } from './hooks/useSpeechToText';
import { useSignLanguage } from './hooks/useSignLanguage';

function App() {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSign, setCurrentSign] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [avatarAnimation, setAvatarAnimation] = useState('idle');

  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening,
    isSupported 
  } = useSpeechToText();

  const {
    processText,
    currentGloss,
    playSignSequence,
    isProcessing
  } = useSignLanguage();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleRecord = () => {
    if (isListening) {
      stopListening();
      setIsRecording(false);
    } else {
      startListening();
      setIsRecording(true);
    }
  };

  const handlePlaySigns = () => {
    if (inputText.trim()) {
      setIsPlaying(true);
      playSignSequence(inputText, setAvatarAnimation).then(() => {
        setIsPlaying(false);
        setAvatarAnimation('idle');
      });
    }
  };

  const handleTestSign = (sign: string) => {
    setCurrentSign(sign);
    setAvatarAnimation(sign);
    setTimeout(() => {
      setAvatarAnimation('idle');
      setCurrentSign('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Sign Language
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              {' '}Avatar
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform text and speech into beautiful sign language animations with our AI-powered 3D avatar
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Avatar Viewport */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">3D Avatar</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    {isPlaying ? 'Signing...' : currentSign || 'Ready'}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${
                    isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                </div>
              </div>
              
              <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100">
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <ambientLight intensity={0.6} />
                  <directionalLight 
                    position={[5, 5, 5]} 
                    intensity={0.8} 
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                  />
                  <Avatar animation={avatarAnimation} />
                  <OrbitControls 
                    enablePan={false} 
                    maxDistance={10} 
                    minDistance={3}
                    maxPolarAngle={Math.PI / 2}
                  />
                  <Environment preset="studio" />
                </Canvas>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <InputPanel
              inputText={inputText}
              setInputText={setInputText}
              isRecording={isRecording}
              isListening={isListening}
              isSupported={isSupported}
              onRecord={handleRecord}
              onPlay={handlePlaySigns}
              isPlaying={isPlaying}
              currentGloss={currentGloss}
            />

            <ControlPanel
              onShowLibrary={() => setShowLibrary(true)}
              onTestSign={handleTestSign}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Sign Library Modal */}
        {showLibrary && (
          <SignLibrary
            onClose={() => setShowLibrary(false)}
            onTestSign={handleTestSign}
          />
        )}
      </div>
    </div>
  );
}

export default App;