import React from 'react';
import type { ItemValuation } from '../types';
import { ResultCard } from './ResultCard';

interface ResultsDisplayProps {
  results: ItemValuation[];
  mediaPreview: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, mediaPreview }) => {
  return (
    <div className="w-full max-w-2xl animate-fade-in">
        <div className="mb-6">
            <img src={mediaPreview} alt="Scanned item" className="rounded-xl shadow-lg mx-auto max-h-64 object-contain" />
        </div>
      
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((item, index) => <ResultCard key={index} item={item} />)
        ) : (
          <div className="text-center p-6 bg-gray-800 rounded-lg">
            <p className="font-semibold text-gray-300">No items could be identified for valuation.</p>
            <p className="text-gray-400">Try taking a clearer picture from a different angle.</p>
          </div>
        )}
      </div>
    </div>
  );
};
