import React from 'react';
import { TagIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto p-4 flex items-center gap-3">
        <TagIcon className="w-8 h-8 text-brand-secondary"/>
        <h1 className="text-xl font-bold text-gray-100">Resale Value Finder</h1>
      </div>
    </header>
  );
};