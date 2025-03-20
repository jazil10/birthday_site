import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
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
    <div className="relative w-full h-full bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-500 flex flex-col items-center justify-center overflow-hidden p-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={windowSize.width < 768 ? 100 : 200}
        recycle={true}
        colors={['#f0abfc', '#e879f9', '#f472b6', '#fff']}
      />
      
      {/* Background floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(windowSize.width < 768 ? 10 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              scale: 0
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              scale: [1, 0],
              opacity: [0.8, 0]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 2
            }}
          >
            {i % 3 === 0 ? <Star className="w-4 h-4 text-yellow-200" /> :
             i % 3 === 1 ? <Heart className="w-4 h-4 text-pink-200" /> :
             <Sparkles className="w-4 h-4 text-white" />}
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          bounce: 0.4
        }}
        className="text-center relative z-10 max-w-full"
      >
        <motion.div
          animate={{ 
            rotate: [0, -2, 2, -2, 0],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block mb-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white filter drop-shadow-lg break-words">
            HAPPY BIRTHDAY ZZZ !🎉 
          </h1>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="bg-white/90 backdrop-blur-sm text-fuchsia-600 px-6 sm:px-10 py-3 sm:py-5 rounded-full text-lg sm:text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white hover:text-fuchsia-500"
        >
          Begin Your Special Journey ✨
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;