import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ArrowRight, ArrowUp, X, Cake } from 'lucide-react';

interface PlatformerGameProps {
  onComplete: () => void;
}

const PlatformerGame: React.FC<PlatformerGameProps> = ({ onComplete }) => {
  // Game canvas size
  const [gameSize, setGameSize] = useState({
    width: Math.min(window.innerWidth, 800),
    height: Math.min(window.innerHeight - 120, 600)
  });

  // Game state
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Birthday elements
  const [confetti, setConfetti] = useState<Array<{
    x: number;
    y: number;
    color: string;
    size: number;
    speedX: number;
    speedY: number;
  }>>([]);

  // Game objects
  const [player, setPlayer] = useState({
    x: 50,
    y: 0,
    width: 30,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    color: '#f472b6'
  });

  const [gift, setGift] = useState({
    x: 0,
    y: 0,
    radius: 20,
    color: '#f472b6',
    collected: false,
    floatOffset: 0
  });

  const [platforms, setPlatforms] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    hasCake?: boolean;
  }>>([]);

  // Input handling
  const [keys, setKeys] = useState({
    left: false,
    right: false,
    up: false
  });

  // Initialize game
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth, 800);
      const height = Math.min(window.innerHeight - 120, 600);
      
      setGameSize({ width, height });
      
      // Recalculate platform positions based on new dimensions
      initGameObjects(width, height);
    };

    window.addEventListener('resize', handleResize);
    
    // Canvas setup
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext('2d');
      initGameObjects(gameSize.width, gameSize.height);
      generateConfetti(20); // Generate initial confetti
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  // Generate confetti for birthday theme
  const generateConfetti = (count: number) => {
    const colors = ['#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d'];
    const newConfetti = [];
    
    for (let i = 0; i < count; i++) {
      newConfetti.push({
        x: Math.random() * gameSize.width,
        y: Math.random() * gameSize.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 1 + 0.5
      });
    }
    
    setConfetti(newConfetti);
  };

  // Initialize game objects based on screen size
  const initGameObjects = (width: number, height: number) => {
    // Set player starting position
    setPlayer(prev => ({
      ...prev,
      x: 50,
      y: height - 100,
      velocityX: 0,
      velocityY: 0
    }));

    // Position gift near the top-right
    setGift(prev => ({
      ...prev,
      x: width * 0.8,
      y: height * 0.15,
      collected: false,
      floatOffset: 0
    }));

    // Create platforms
    const platformHeight = 20;
    const platformWidth = width * 0.2;
    const groundWidth = width;
    
    setPlatforms([
      // Ground
      {
        x: width / 2,
        y: height - 20,
        width: groundWidth,
        height: platformHeight * 2,
        color: '#818cf8',
        hasCake: true
      },
      // Left lower platform
      {
        x: width * 0.25,
        y: height * 0.75,
        width: platformWidth,
        height: platformHeight,
        color: '#818cf8'
      },
      // Middle-left platform
      {
        x: width * 0.45,
        y: height * 0.55,
        width: platformWidth,
        height: platformHeight,
        color: '#c084fc',
        hasCake: true
      },
      // Middle-right platform
      {
        x: width * 0.65,
        y: height * 0.4,
        width: platformWidth,
        height: platformHeight,
        color: '#818cf8'
      },
      // Top right platform (for gift)
      {
        x: width * 0.8,
        y: height * 0.25,
        width: platformWidth * 0.8,
        height: platformHeight,
        color: '#c084fc'
      },
      // Bonus small platform
      {
        x: width * 0.15,
        y: height * 0.4,
        width: platformWidth * 0.6,
        height: platformHeight,
        color: '#c084fc',
        hasCake: true
      }
    ]);
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setKeys(prev => ({ ...prev, left: true }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setKeys(prev => ({ ...prev, right: true }));
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        setKeys(prev => ({ ...prev, up: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setKeys(prev => ({ ...prev, left: false }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setKeys(prev => ({ ...prev, right: false }));
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        setKeys(prev => ({ ...prev, up: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || !ctxRef.current) return;

    let lastTimestamp = 0;
    const gravity = 0.5;
    const friction = 0.8;
    const jumpPower = -15; // Increased jump power
    const moveSpeed = 5;

    // Main game loop
    const gameLoop = (timestamp: number) => {
      if (!ctxRef.current) return;
      const ctx = ctxRef.current;
      
      // Calculate delta time for smooth animations
      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16 : 1;
      lastTimestamp = timestamp;

      // Clear canvas
      ctx.fillStyle = '#c7d2fe';
      ctx.fillRect(0, 0, gameSize.width, gameSize.height);

      // Draw confetti
      updateAndDrawConfetti(ctx, deltaTime);

      // Update player position and check collisions
      updatePlayer(deltaTime, gravity, friction, jumpPower, moveSpeed);
      
      // Check gift collection
      if (!gift.collected && checkCollision(
        player.x, player.y, player.width, player.height,
        gift.x - gift.radius, gift.y - gift.radius, gift.radius * 2, gift.radius * 2
      )) {
        setGift(prev => ({ ...prev, collected: true }));
        
        // Celebrate with more confetti
        generateConfetti(100);
        
        // Complete the game after celebration
        setTimeout(() => onComplete(), 1000);
      }

      // Animate gift floating
      setGift(prev => ({
        ...prev,
        floatOffset: (prev.floatOffset + 0.05) % (Math.PI * 2),
        y: !prev.collected ? 
          gameSize.height * 0.15 + Math.sin(prev.floatOffset) * 10 : 
          prev.y - 5 // When collected, make it float upward
      }));

      // Draw game elements
      drawGame(ctx);

      // Continue game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, player, platforms, gift, gameSize, keys, confetti, onComplete]);

  // Update and draw confetti
  const updateAndDrawConfetti = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
    setConfetti(prevConfetti => 
      prevConfetti.map(particle => {
        // Update position
        const x = particle.x + particle.speedX * deltaTime;
        const y = particle.y + particle.speedY * deltaTime;
        
        // Draw confetti
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Wrap around if out of bounds
        return {
          ...particle,
          x: x < 0 ? gameSize.width : x > gameSize.width ? 0 : x,
          y: y > gameSize.height ? 0 : y
        };
      })
    );
  };

  // Update player position and apply physics
  const updatePlayer = (
    deltaTime: number,
    gravity: number,
    friction: number,
    jumpPower: number,
    moveSpeed: number
  ) => {
    setPlayer(prev => {
      // Apply horizontal movement based on input
      let velocityX = prev.velocityX;
      if (keys.left) velocityX = -moveSpeed;
      if (keys.right) velocityX = moveSpeed;
      if (!keys.left && !keys.right) velocityX *= friction;

      // Apply gravity
      let velocityY = prev.velocityY + gravity * deltaTime;
      
      // Calculate new position
      let newX = prev.x + velocityX * deltaTime;
      let newY = prev.y + velocityY * deltaTime;

      // Keep player within canvas bounds
      if (newX < 0) newX = 0;
      if (newX + prev.width > gameSize.width) newX = gameSize.width - prev.width;

      // Check platform collisions
      let onGround = false;
      let isJumping = prev.isJumping;

      for (const platform of platforms) {
        // Check if player is on or near a platform
        if (checkCollision(
          newX, newY, prev.width, prev.height,
          platform.x - platform.width / 2, 
          platform.y - platform.height / 2,
          platform.width, 
          platform.height
        )) {
          // Player is above the platform and falling
          if (prev.y + prev.height <= platform.y - platform.height / 2 + 10 && velocityY > 0) {
            newY = platform.y - platform.height / 2 - prev.height;
            velocityY = 0;
            onGround = true;
          }
          // Player hits platform from below
          else if (prev.y >= platform.y + platform.height / 2 && velocityY < 0) {
            newY = platform.y + platform.height / 2;
            velocityY = 0;
          }
          // Left collision
          else if (prev.x + prev.width >= platform.x - platform.width / 2 && 
                   prev.x < platform.x - platform.width / 2) {
            newX = platform.x - platform.width / 2 - prev.width;
          }
          // Right collision
          else if (prev.x <= platform.x + platform.width / 2 && 
                   prev.x + prev.width > platform.x + platform.width / 2) {
            newX = platform.x + platform.width / 2;
          }
        }
      }

      // Handle jumping
      if (keys.up && onGround && !isJumping) {
        velocityY = jumpPower;
        isJumping = true;
      }

      if (onGround) {
        isJumping = false;
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        velocityX,
        velocityY,
        isJumping
      };
    });
  };

  // Draw game elements
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Draw platforms
    platforms.forEach(platform => {
      // Draw platform
      ctx.fillStyle = platform.color;
      ctx.fillRect(
        platform.x - platform.width / 2,
        platform.y - platform.height / 2,
        platform.width,
        platform.height
      );
      
      // Draw cake on some platforms
      // if (platform.hasCake) {
      //   const cakeSize = platform.width * 0.15;
      //   drawCake(
      //     ctx, 
      //     platform.x, 
      //     platform.y - platform.height / 2 - cakeSize * 0.7, 
      //     cakeSize
      //   );
      // }
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw a party hat on the player
    const hatHeight = player.width * 0.8;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y - hatHeight);
    ctx.lineTo(player.x + player.width * 0.2, player.y);
    ctx.lineTo(player.x + player.width * 0.8, player.y);
    ctx.fill();
    
    // Draw dot on hat
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y - hatHeight * 0.7, player.width * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Draw gift if not collected
    if (!gift.collected) {
      drawGift(ctx, gift.x, gift.y, gift.radius);
    }
  };
  
  // Draw birthday cake
  // const drawCake = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  //   // Cake base
  //   ctx.fillStyle = '#fef3c7';
  //   ctx.fillRect(x - size, y, size * 2, size);
    
  //   // Cake frosting
  //   ctx.fillStyle = '#f472b6';
  //   ctx.fillRect(x - size, y, size * 2, size * 0.3);
    
  //   // Candle
  //   ctx.fillStyle = '#f87171';
  //   ctx.fillRect(x - size * 0.1, y - size * 0.5, size * 0.2, size * 0.5);
    
  //   // Flame
  //   ctx.fillStyle = '#fcd34d';
  //   ctx.beginPath();
  //   ctx.ellipse(x, y - size * 0.6, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
  //   ctx.fill();
  // };
  
  // Draw gift icon
  const drawGift = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    // Gift box
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
    
    // Gift box top part
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(x - size, y - size, size * 2, size * 0.5);
    
    // Vertical ribbon
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - size * 0.2, y - size, size * 0.4, size * 2);
    
    // Horizontal ribbon
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - size, y - size * 0.2, size * 2, size * 0.4);
    
    // Bow
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x, y - size * 0.6, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner part of bow for 3D effect
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(x, y - size * 0.6, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  };

  // Collision detection helper
  const checkCollision = (
    x1: number, y1: number, width1: number, height1: number,
    x2: number, y2: number, width2: number, height2: number
  ): boolean => {
    return (
      x1 < x2 + width2 &&
      x1 + width1 > x2 &&
      y1 < y2 + height2 &&
      y1 + height1 > y2
    );
  };

  // Touch handlers for mobile controls
  const handleTouchStart = (direction: 'left' | 'right' | 'jump') => {
    if (direction === 'left') setKeys(prev => ({ ...prev, left: true }));
    if (direction === 'right') setKeys(prev => ({ ...prev, right: true }));
    if (direction === 'jump') setKeys(prev => ({ ...prev, up: true }));
  };

  const handleTouchEnd = (direction: 'left' | 'right' | 'jump') => {
    if (direction === 'left') setKeys(prev => ({ ...prev, left: false }));
    if (direction === 'right') setKeys(prev => ({ ...prev, right: false }));
    if (direction === 'jump') setKeys(prev => ({ ...prev, up: false }));
  };

  // Start the game
  const startGame = () => {
    setShowInstructions(false);
    setGameStarted(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-indigo-100">
      <div className="relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={gameSize.width} 
          height={gameSize.height} 
          className="max-w-full"
        />
      </div>
      
      {/* Skip button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg flex items-center gap-2 text-pink-500 font-medium hover:bg-white transition-colors z-20"
      >
        <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Skip to Gift</span>
        <span className="sm:hidden">Skip</span>
      </motion.button>
      
      {/* Instructions button */}
      {!showInstructions && gameStarted && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInstructions(true)}
          className="fixed top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg z-20"
        >
          <span className="sr-only">Show Instructions</span>
          <span className="text-gray-700 text-xl font-bold">?</span>
        </motion.button>
      )}
      
      {/* Mobile controls */}
      {gameStarted && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-4 md:hidden z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm active:bg-white/70"
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart('left')}
            onMouseUp={() => handleTouchEnd('left')}
            onMouseLeave={() => handleTouchEnd('left')}
          >
            <ArrowLeft className="w-8 h-8 text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm active:bg-white/70"
            onTouchStart={() => handleTouchStart('jump')}
            onTouchEnd={() => handleTouchEnd('jump')}
            onMouseDown={() => handleTouchStart('jump')}
            onMouseUp={() => handleTouchEnd('jump')}
            onMouseLeave={() => handleTouchEnd('jump')}
          >
            <ArrowUp className="w-10 h-10 text-gray-700" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm active:bg-white/70"
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart('right')}
            onMouseUp={() => handleTouchEnd('right')}
            onMouseLeave={() => handleTouchEnd('right')}
          >
            <ArrowRight className="w-8 h-8 text-gray-700" />
          </motion.button>
        </div>
      )}

      {/* Instructions overlay */}
      {showInstructions && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-30"
          onClick={() => gameStarted && setShowInstructions(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">How to Play</h2>
              {gameStarted && (
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Desktop Controls:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Arrow Keys or WASD to move</li>
                  <li>• Space or Up Arrow to jump</li>
                </ul>
              </div>
              
              <div className="bg-pink-100 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Mobile Controls:</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Tap the left/right buttons to move</li>
                  <li>• Tap the up button to jump</li>
                </ul>
              </div>
              
              <div className="text-gray-700">
                <p>Jump your way to the gift at the top!</p>
              </div>
            </div>
            
            {!gameStarted && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startGame}
                className="mt-5 w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-lg font-semibold shadow-md"
              >
                Start Game
              </motion.button>
            )}
            
            {gameStarted && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowInstructions(false)}
                className="mt-5 w-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white py-3 rounded-lg font-semibold shadow-md"
              >
                Continue Playing
              </motion.button>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PlatformerGame;