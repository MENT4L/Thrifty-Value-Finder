import React from 'react';
import { SparklesIcon } from './icons/Icons';

export const Loader: React.FC = () => {
    const messages = [
        "Analyzing your finds...",
        "Consulting with expert appraisers...",
        "Identifying hidden gems...",
        "Estimating resale values...",
        "Almost there..."
    ];

    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div className="text-center p-8">
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 border-4 border-t-brand-secondary border-gray-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-12 h-12 text-brand-secondary animate-pulse"/>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-300 transition-opacity duration-500">{message}</p>
    </div>
  );
};
