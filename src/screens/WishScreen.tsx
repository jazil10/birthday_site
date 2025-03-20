import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface WishScreenProps {
  onNext: () => void;
}

const WishScreen: React.FC<WishScreenProps> = ({ onNext }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center"
      >
        <Heart className="w-16 h-16 text-white mx-auto mb-8 animate-pulse" />
        
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-pink-500 mb-6">
            Dear ZZZZ
          </h2>
          
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
           Stay blessed and happy always. May all your dreams come true. May you get all your heels, gaari, bracelets, rings and everything. You are amazing, never look down on yourself. Super Proud of you for everything you've done and achieved🎉
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="bg-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-pink-600 transition-colors"
          >
            There's More! 🎁
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WishScreen;