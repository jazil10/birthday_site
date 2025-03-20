import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, ShoppingBag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Diamond as Ring } from 'lucide-react';

interface GiftSelectionProps {
  onSelect: (gift: string) => void;
}

const GiftSelection: React.FC<GiftSelectionProps> = ({ onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = useRef(null);

  const gifts = [
    {
      title: "Sweet Treats",
      icon: Cake,
      description: "A box of delicious donuts or a special cake just for you!",
      color: "from-rose-400 to-red-600",
      iconColor: "text-rose-100"
    },
    {
      title: "All-time Favs, Jewelry",
      icon: Ring,
      description: "A beautiful ring or bracelet to make your special day shine!",
      color: "from-amber-400 to-yellow-600",
      iconColor: "text-amber-100"
    },
    {
      title: "Dream Heels",
      icon: ShoppingBag,
      description: "Help getting those crazy expensive heels you've been eyeing!",
      color: "from-fuchsia-400 to-pink-600",
      iconColor: "text-fuchsia-100"
    }
  ];

  const nextGift = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gifts.length);
  };

  const prevGift = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gifts.length) % gifts.length);
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) > 50;
    
    if (swipe) {
      if (offset.x > 0) {
        prevGift();
      } else {
        nextGift();
      }
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-violet-400 via-fuchsia-500 to-pink-500 flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 w-full"
      >
        <Heart className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl md:text-4xl font-bold text-white filter drop-shadow-lg mb-2">
          Choose Your Special Gift!
        </h2>
        <p className="text-white/90 text-base md:text-lg">
          Pick the perfect gift that makes your heart smile ✨
        </p>
      </motion.div>

      {/* Desktop view - show all gifts in a row */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 w-full max-w-4xl">
        {gifts.map((gift, index) => (
          <motion.div
            key={gift.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="cursor-pointer"
            onClick={() => onSelect(gift.title)}
          >
            <div className={`bg-gradient-to-br ${gift.color} rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full`}>
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <gift.icon className={`w-20 h-20 ${gift.iconColor} mx-auto mb-6`} />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">{gift.title}</h3>
              <p className="text-white/90 text-lg leading-relaxed">{gift.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile view - carousel/slider */}
      <div className="md:hidden w-full max-w-sm relative flex flex-col items-center" ref={constraintsRef}>
        <div className="w-full overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="w-full"
            >
              <div 
                className={`bg-gradient-to-br ${gifts[currentIndex].color} rounded-2xl p-6 text-center shadow-xl min-h-64 flex flex-col items-center justify-center`}
                onClick={() => onSelect(gifts[currentIndex].title)}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -5, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {React.createElement(gifts[currentIndex].icon, { className: `w-16 h-16 ${gifts[currentIndex].iconColor} mx-auto mb-4` })}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">{gifts[currentIndex].title}</h3>
                <p className="text-white/90 text-base leading-relaxed">{gifts[currentIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-between w-full mt-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-white/30 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
            onClick={prevGift}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          {/* Indicator dots */}
          <div className="flex gap-2 items-center">
            {gifts.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                animate={{ scale: index === currentIndex ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-white/30 hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
            onClick={nextGift}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300"
          onClick={() => onSelect(gifts[currentIndex].title)}
        >
          Choose This Gift
        </motion.div>
      </div>
    </div>
  );
};

export default GiftSelection;