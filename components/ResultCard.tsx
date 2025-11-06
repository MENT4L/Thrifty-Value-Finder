import React from 'react';
import type { ItemValuation } from '../types';

interface ResultCardProps {
  item: ItemValuation;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/20">
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
            <div>
                <h3 className="text-lg font-bold text-gray-100">{item.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            </div>
            <div className="flex-shrink-0 text-right">
                 <p className="text-sm font-medium text-gray-400">Value</p>
                 <p className="text-lg font-bold text-green-400 whitespace-nowrap">{item.estimatedValue}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
