import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full"
      />
      <p className="mt-4 text-midnight-500 font-medium">{message}</p>
    </div>
  );
}

