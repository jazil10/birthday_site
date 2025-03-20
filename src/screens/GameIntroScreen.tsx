import React from 'react';
import { motion } from 'framer-motion';
import { Gift, GamepadIcon } from 'lucide-react';

interface GameIntroScreenProps {
  onNext: () => void;
}

const GameIntroScreen: React.FC<GameIntroScreenProps> = ({ onNext }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Gift className="w-24 h-24 text-white mx-auto mb-8" />
        </motion.div>

        <h2 className="text-4xl font-bold text-white mb-6">
          Ready for Your Gift?
        </h2>

        <div className="bg-white rounded-2xl p-6 mb-8 max-w-lg mx-auto">
          <GamepadIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700 mb-4">
            But first, let's have some fun! Complete this mini-game to unlock your special surprise (I know you hate this I'm sorry).
          </p>
          <p className="text-lg text-gray-600">
            Use arrow keys to move and space to jump!
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          className="bg-white text-purple-500 px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          Let's Play! 🎮
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GameIntroScreen;