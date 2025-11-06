import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CameraIcon, SparklesIcon } from './components/icons/Icons';
import { estimateValueFromMedia } from './services/geminiService';
import type { ItemValuation } from './types';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [results, setResults] = useState<ItemValuation[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const { base64, mimeType } = await fileToBase64(file);
      setMediaPreview(`data:${mimeType};base64,${base64}`);
      
      const valuationResults = await estimateValueFromMedia(base64, mimeType);
      setResults(valuationResults);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setResults(null);
    setError(null);
    setMediaPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        {!mediaPreview && !isLoading && (
          <div className="text-center">
            <SparklesIcon className="w-16 h-16 mx-auto text-brand-secondary mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">Unlock the Value of Your Finds</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Use your camera to snap a photo of thrift store items and get an instant resale value estimate.
            </p>
          </div>
        )}

        {isLoading && <Loader />}
        
        {error && <div className="text-center p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="font-semibold text-red-300">Analysis Failed</p>
            <p className="text-red-400">{error}</p>
            <button onClick={resetState} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors">Try Again</button>
        </div>}

        {!isLoading && !error && results && mediaPreview && (
          <ResultsDisplay results={results} mediaPreview={mediaPreview} />
        )}
      </main>

      <footer className="sticky bottom-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 p-4">
        <div className="container mx-auto flex justify-center">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={results || isLoading || error ? resetState : handleButtonClick}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-brand-secondary hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-wait text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <CameraIcon className="w-6 h-6" />
            <span>{results || isLoading || error ? 'Start New Scan' : 'Scan Items'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;