import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Zap } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  const [showWakeUpMessage, setShowWakeUpMessage] = useState(false);
  const [dots, setDots] = useState('');

  // Show "waking up" message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWakeUpMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full"
      />
      
      <p className="mt-4 text-midnight-500 font-medium">{message}</p>
      
      {showWakeUpMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-md text-center"
        >
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
            <Coffee className="w-5 h-5" />
            <span className="font-semibold">Service is waking up{dots}</span>
          </div>
          <p className="text-sm text-midnight-400">
            Our free-tier servers sleep after inactivity. 
            <br />
            Please wait ~30 seconds for the first request.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-midnight-400">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Subsequent requests will be instant!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
