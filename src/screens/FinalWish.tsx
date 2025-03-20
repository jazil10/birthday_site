import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Heart, Star, Sparkles, Gift } from 'lucide-react';

interface FinalWishProps {
  selectedGift: string | null;
}

const FinalWish: React.FC<FinalWishProps> = ({ selectedGift }) => {
  const [showContent, setShowContent] = useState(true);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-500 flex items-center justify-center p-4 overflow-hidden">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        colors={['#f0abfc', '#e879f9', '#f472b6', '#fff']}
        recycle={true}
      />

      <AnimatePresence mode="wait">
        {showContent && !showGoodbye && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full text-center relative px-4"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center space-x-4 mb-6"
              >
                <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
                <Sparkles className="w-8 h-8 text-fuchsia-400 animate-pulse" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl font-bold text-fuchsia-600 mb-6"
              >
                Your Wish Has Been Granted! ✨
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl md:text-2xl text-gray-700 mb-6"
              >
                You've chosen: <span className="font-bold text-fuchsia-500">{selectedGift}</span>
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="space-y-4 text-base md:text-lg text-gray-600"
              >
                <p className="leading-relaxed">
                  Thank you for selecting the gift, we will try to make sure to get you your gift and make you happy. Here's to
                  to an amazing birthday! 🎉
                </p>
                <p className="leading-relaxed">
                  May this year bring you endless joy, countless reasons to smile, and all the happiness 
                  you deserve. Remember, you're amazing just the way you are! 💖
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowContent(false);
                  setTimeout(() => setShowGoodbye(true), 500);
                }}
                className="mt-8 bg-fuchsia-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-fuchsia-600 transition-colors shadow-lg"
              >
                Say Goodbye 👋
              </motion.button>
            </div>
          </motion.div>
        )}

        {showGoodbye && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl w-full text-center px-4"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl">
              <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold text-fuchsia-600 mb-6">
                Happy Birthday Once Again! 🎂
              </h2>
              <p className="text-xl text-gray-700 mb-4">
                Have a very good day and have fun and rest and TAKE CARE.
              </p>
              <p className="text-lg text-gray-600">
                Stay happy, keep smiling, and remember that you're amazing! 💝
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalWish;