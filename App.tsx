
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Music, Lightbulb, Sparkles, Cake as CakeIcon, Gift, ArrowRight } from 'lucide-react';
import { AppState, Message } from './types';
import HeartParticles from './components/HeartParticles';
import ReplySection from './components/ReplySection';

const App: React.FC = () => {
  const [step, setStep] = useState<AppState>(AppState.INTRO);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [firecrackers, setFirecrackers] = useState<{ id: number; x: number; y: number }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const firecrackerIdRef = useRef(0);

  // Handle No button playfulness
  const handleNoHover = () => {
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const nextStep = (next: AppState) => {
    setStep(next);
  };

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed", e));
      setIsMusicPlaying(true);
    }
    nextStep(AppState.LIGHT_ON);
  };

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    
    nextStep(AppState.FIREWORK);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    nextStep(AppState.DECORATE);
  };

  const handleSendReply = (text: string) => {
    // Store in localStorage for persistence
    localStorage.setItem('purvaReply', text);
  };

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-1000 overflow-hidden ${
      [AppState.INTRO, AppState.INTERACT_CONFIRM, AppState.MUSIC_PLAY].includes(step) ? 'bg-black' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100'
    }`}>
      {/* Decorative Background Elements */}
      {![AppState.INTRO, AppState.INTERACT_CONFIRM, AppState.MUSIC_PLAY].includes(step) && (
        <>
          <div className="absolute top-10 left-10 text-5xl opacity-20 animate-pulse">💕</div>
          <div className="absolute top-20 right-20 text-4xl opacity-20 animate-bounce">✨</div>
          <div className="absolute bottom-20 left-1/4 text-5xl opacity-20 animate-pulse">🌸</div>
          <div className="absolute bottom-10 right-1/3 text-5xl opacity-20 animate-bounce">💐</div>
          <div className="absolute top-1/2 left-5 text-4xl opacity-15 animate-pulse">💖</div>
        </>
      )}
      
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        src="/music/ishq_wala_love.mp3"
        loop 
      />

      {/* Heart Rain: Active only in early stages */}
      {[AppState.INTRO, AppState.INTERACT_CONFIRM, AppState.MUSIC_PLAY].includes(step) && (
        <HeartParticles count={20} />
      )}

      {/* Main Container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Opening Screen Intro */}
          {step === AppState.INTRO && (
            <IntroSequence onFinish={() => setStep(AppState.INTERACT_CONFIRM)} />
          )}

          {/* STEP 2: Yes/No Question */}
          {step === AppState.INTERACT_CONFIRM && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-8"
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">💕</motion.div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Do you wanna see what I made??
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => nextStep(AppState.MUSIC_PLAY)}
                  className="px-10 py-4 bg-pink-500 text-white rounded-full font-bold text-xl glow-pink hover:bg-pink-600 transition-all active:scale-95 flex items-center gap-2"
                >
                  YES <Heart className="fill-current" />
                </button>
                <motion.button
                  animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                  onMouseEnter={handleNoHover}
                  className="px-10 py-4 bg-gray-500 text-white rounded-full font-bold text-xl hover:bg-gray-600 transition-colors"
                >
                  NO
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Music Play */}
          {step === AppState.MUSIC_PLAY && (
            <motion.div
              key="music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">💖</motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white romantic-font">Play Music 🎵</h2>
              <button
                onClick={startMusic}
                className="p-8 bg-pink-500 rounded-full text-white shadow-xl hover:scale-110 transition-transform active:scale-90"
              >
                <Music size={48} />
              </button>
            </motion.div>
          )}

          {/* STEP 4: Light On */}
          {step === AppState.LIGHT_ON && (
            <motion.div
              key="light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl">✨</motion.div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent romantic-font">Light On 💡</h2>
              <button
                onClick={() => nextStep(AppState.PHOTO_REVEAL)}
                className="p-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-white shadow-xl hover:scale-110 transition-transform active:scale-90"
              >
                <Lightbulb size={48} />
              </button>
            </motion.div>
          )}

          {/* STEP 5: Photo Reveal */}
          {step === AppState.PHOTO_REVEAL && (
            <DreamyPhotoSection onConfetti={triggerConfetti} />
          )}

          {/* STEP 6: Decorate */}
          {step === AppState.DECORATE && (
            <motion.div
              key="decorate"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-10"
            >
              <motion.div className="flex gap-4 text-5xl justify-center" animate={{ y: [0, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <span>💕</span><span>✨</span><span>💕</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent romantic-font drop-shadow-md px-4">
                💐 Wish You A Very Happy Birthday Purva 💐
              </h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  triggerFireworks();
                  // Trigger multiple firecrackers
                  for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                      const id = firecrackerIdRef.current++;
                      const x = Math.random() * 80 + 10;
                      const y = Math.random() * 60 + 20;
                      setFirecrackers(prev => [...prev, { id, x, y }]);
                      setTimeout(() => {
                        setFirecrackers(prev => prev.filter(fc => fc.id !== id));
                      }, 1500);
                    }, i * 150);
                  }
                }}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-xl shadow-lg flex items-center gap-3 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
              >
                Fly the Firecrack 🎆 <Sparkles />
              </motion.button>

              {/* Firecrackers Animation */}
              {firecrackers.map(firecracker => (
                <Firecracker key={firecracker.id} x={firecracker.x} y={firecracker.y} />
              ))}
            </motion.div>
          )}

          {/* STEP 7: Firework (Transition to Cake) */}
          {step === AppState.FIREWORK && (
            <motion.div
              key="firework"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-12"
            >
              {/* Impressive Sticker - Rainbow Hearts */}
              <motion.div
                className="relative w-64 h-64 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {/* Orbiting Hearts */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute text-5xl"
                    animate={{
                      x: Math.cos((i / 5) * Math.PI * 2) * 100,
                      y: Math.sin((i / 5) * Math.PI * 2) * 100,
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    {['💕', '💖', '💗', '💝', '💓'][i]}
                  </motion.div>
                ))}

                {/* Center Star */}
                <motion.div
                  className="text-8xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    scale: { duration: 2, repeat: Infinity },
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  }}
                >
                  ✨
                </motion.div>
              </motion.div>

              {/* Elegant Text */}
              <motion.h2
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Ready for the Sweetness?
              </motion.h2>

              {/* Sparkle Button */}
              <motion.button
                onClick={() => nextStep(AppState.CAKE)}
                className="relative px-12 py-4 font-bold text-xl text-white rounded-full overflow-hidden shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 50%, #FF69B4 100%)',
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 40px rgba(255, 105, 180, 0.8)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Sparkles Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: [-400, 400] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center gap-2">
                  Let's Cut the Cake 🎂
                </span>
              </motion.button>

              {/* Bottom Falling Stars */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="fixed text-3xl pointer-events-none"
                  style={{
                    left: `${20 + i * 15}%`,
                    bottom: '10%',
                  }}
                  animate={{
                    y: [0, -400],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ⭐
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* STEP 8: Cake Section */}
          {step === AppState.CAKE && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-8"
            >
              <CakeVisual />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => nextStep(AppState.MESSAGE)}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-xl shadow-lg flex items-center gap-2 hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]"
              >
                Well, I Have a Message for You ❤️
              </motion.button>
            </motion.div>
          )}

          {/* STEP 9: Final Message */}
          {step === AppState.MESSAGE && (
            <FinalMessageSection onReply={() => nextStep(AppState.REPLY)} />
          )}

          {/* STEP 10: Reply Section */}
          {(step === AppState.REPLY || step === AppState.CHAT) && (
            <ReplySection 
              onSendReply={handleSendReply}
            />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

// Firecracker Component
const Firecracker: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 1, scale: 0 }}
      animate={{
        opacity: [1, 0.8, 0],
        scale: [0, 1, 0],
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="text-3xl animate-bounce">🎆</div>
      
      {/* Light Burst */}
      <motion.div
        className="absolute inset-0 -m-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-full blur-xl"
        initial={{ opacity: 0.8, scale: 0 }}
        animate={{ opacity: 0, scale: 3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {/* Spark Particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          initial={{ x: 0, y: 0 }}
          animate={{
            x: Math.cos((i / 6) * Math.PI * 2) * 50,
            y: Math.sin((i / 6) * Math.PI * 2) * 50,
            opacity: [1, 0],
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </motion.div>
  );
};

const IntroSequence: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [index, setIndex] = useState(0);
  const texts = [
    "It's your special Day 💐",
    "I have made something special for someone who is special to me",
    "" // Trigger finish
  ];

  useEffect(() => {
    if (index === texts.length - 1) {
      onFinish();
      return;
    }
    // Increase timing for the longer text (index 1)
    const displayDuration = index === 1 ? 6500 : 4000;
    const timer = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, displayDuration);
    return () => clearTimeout(timer);
  }, [index, onFinish]);

  return (
    <AnimatePresence mode="wait">
      {texts[index] && (
        <motion.h2
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.5 }}
          className="text-3xl md:text-5xl font-medium text-white max-w-2xl px-6 romantic-font leading-relaxed"
        >
          {texts[index]}
        </motion.h2>
      )}
    </AnimatePresence>
  );
};

const PhotoFrame: React.FC = () => {
  return (
    <motion.div
      className="relative w-80 md:w-96 h-[480px] md:h-[540px] bg-white rounded-xl p-4 shadow-2xl"
      initial={{ opacity: 0, scale: 0.6, rotateY: 90 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        y: [0, -20, 0],
        rotateZ: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 1.2, 
        type: "spring", 
        stiffness: 80,
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotateZ: { duration: 5, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{ perspective: '1000px' }}
    >
      {/* Glow Effect Background */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-xl blur-2xl opacity-30 -z-10"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [0.95, 1.05, 0.95],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Decorative Pink Tape on Top Corner */}
      <motion.div
        className="absolute -top-4 left-10 w-24 h-10 bg-gradient-to-r from-pink-300 to-pink-200 rounded-sm shadow-lg transform -rotate-6 z-10"
        animate={{ 
          rotateZ: [-6, -2, -6],
          y: [0, -3, 0],
          x: [0, 2, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-full h-full flex items-center justify-center text-pink-100 text-sm font-bold">✨ ✨</div>
      </motion.div>

      {/* Photo Container with Shadow */}
      <motion.div 
        className="relative w-full h-full bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg overflow-hidden shadow-inner border-2 border-white"
        animate={{
          boxShadow: [
            '0 25px 50px -12px rgba(236, 72, 153, 0.3)',
            '0 35px 70px -12px rgba(236, 72, 153, 0.5)',
            '0 25px 50px -12px rgba(236, 72, 153, 0.3)',
          ],
          scale: [1, 1.01, 1]
        }}
        transition={{ 
          boxShadow: { duration: 3, repeat: Infinity },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <motion.img 
          src="/Gemini_Generated_Image_l37x9zl37x9zl37x.png" 
          alt="Purva"
          className="w-full h-full object-cover"
          initial={{ scale: 1.3 }}
          animate={{ 
            scale: 1,
            filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
          }}
          transition={{ 
            scale: { duration: 2.5, ease: "easeOut" },
            filter: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          whileHover={{ scale: 1.05 }}
        />
        
        {/* Blinds Reveal Effect */}
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-b from-black/60 via-black/30 to-transparent"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 1.2, ease: "easeInOut" }}
              style={{ originX: 0 }}
            />
          ))}
        </div>

        {/* Glass Reflection Overlay - Diagonal */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20"
          animate={{ 
            opacity: [0.1, 0.35, 0.1],
            x: [-300, 300, -300],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />

        {/* Additional Light Flare */}
        <motion.div
          className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl opacity-0"
          animate={{ 
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />

        {/* Pulsing Inner Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            opacity: [0, 0.2, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>

      {/* Bottom White Border (Polaroid style) */}
      <motion.div 
        className="mt-4 text-center"
        animate={{ 
          opacity: [0.6, 1, 0.6],
          scale: [0.95, 1, 0.95]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-rose-300 text-sm font-light tracking-wider">✦ ~ ✦ ~ ✦</div>
      </motion.div>
    </motion.div>
  );
};

// Floating Particle Component
const FloatingParticle: React.FC<{ delay: number; duration: number; left: string; size: string }> = ({ delay, duration, left, size }) => {
  return (
    <motion.div
      className={`absolute ${size} bg-yellow-300 rounded-full opacity-60 blur-sm`}
      style={{ left }}
      animate={{
        y: [0, -300, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

// Floating Butterfly Component
const FloatingButterfly: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      className="absolute text-3xl"
      animate={{
        y: [0, -100, 0],
        x: [0, 50, 0],
        rotate: [0, 20, -20, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      🦋
    </motion.div>
  );
};

// Floating Flower Component
const FloatingFlower: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      className="absolute text-4xl opacity-70"
      animate={{
        y: [0, -150, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      🌼
    </motion.div>
  );
};

// Main Dreamy Photo Section
const DreamyPhotoSection: React.FC<{ onConfetti: () => void }> = ({ onConfetti }) => {
  return (
    <motion.div
      key="dreamy-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.6) 0%, rgba(255, 218, 224, 0.5) 25%, rgba(250, 235, 215, 0.4) 50%, rgba(255, 240, 245, 0.5) 75%, rgba(255, 182, 193, 0.6) 100%)',
      }}
    >
      {/* Soft Golden Particles */}
      <FloatingParticle delay={0} duration={6} left="10%" size="w-3 h-3" />
      <FloatingParticle delay={1} duration={7} left="20%" size="w-2 h-2" />
      <FloatingParticle delay={2} duration={8} left="30%" size="w-4 h-4" />
      <FloatingParticle delay={0.5} duration={7.5} left="70%" size="w-2.5 h-2.5" />
      <FloatingParticle delay={1.5} duration={8.5} left="80%" size="w-3 h-3" />
      <FloatingParticle delay={2.5} duration={6.5} left="90%" size="w-2 h-2" />

      {/* Floating Butterflies */}
      <div className="absolute top-20 left-10" style={{ width: '30px', height: '30px' }}>
        <FloatingButterfly delay={0} />
      </div>
      <div className="absolute top-40 right-20" style={{ width: '30px', height: '30px' }}>
        <FloatingButterfly delay={1.5} />
      </div>
      <div className="absolute bottom-40 left-20" style={{ width: '30px', height: '30px' }}>
        <FloatingButterfly delay={3} />
      </div>

      {/* Floating Flowers */}
      <div className="absolute top-10 right-10" style={{ width: '40px', height: '40px' }}>
        <FloatingFlower delay={0} />
      </div>
      <div className="absolute bottom-20 right-32" style={{ width: '40px', height: '40px' }}>
        <FloatingFlower delay={2} />
      </div>
      <div className="absolute bottom-32 left-10" style={{ width: '40px', height: '40px' }}>
        <FloatingFlower delay={4} />
      </div>

      {/* Photo Content Container */}
      <motion.div
        className="flex flex-col items-center gap-8 z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: [0, -10, 0],
          opacity: 1
        }}
        transition={{ 
          delay: 0.5, 
          duration: 1,
          y: { delay: 1.5, duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Polaroid Photo Card */}
        <PhotoFrame />

        {/* Elegant Text Below Photo */}
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-4xl font-serif italic text-rose-400 font-light"
          style={{ fontFamily: 'cursive', letterSpacing: '0.05em' }}
        >
          Hayee.... ❤️
        </motion.h3>

        {/* Coral Pink Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(255, 127, 80, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfetti}
          className="px-10 py-3 bg-gradient-to-r from-coral-400 to-coral-300 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #FF7F50 0%, #FF69B4 100%)',
            color: 'white',
          }}
        >
          <span>Decorate </span>
          <span>🦋</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const CakeVisual: React.FC = () => {
  const [cut, setCut] = useState(false);
  
  return (
    <motion.div 
      className="relative cursor-pointer p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-2xl border-4 border-pink-300 overflow-visible" 
      onClick={() => setCut(true)}
      whileHover={!cut ? { scale: 1.05 } : {}}
      animate={{
        boxShadow: [
          '0 20px 40px rgba(236, 72, 153, 0.4)',
          '0 30px 60px rgba(236, 72, 153, 0.6)',
          '0 20px 40px rgba(236, 72, 153, 0.4)',
        ]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Glow Background */}
      <motion.div
        className="absolute -inset-6 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-3xl blur-xl opacity-20 -z-10"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="w-72 h-80 md:w-96 md:h-96 relative flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-inner">
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-4 left-4 text-3xl z-20"
          animate={!cut ? { 
            rotate: [0, 5, -5, 0],
            y: [0, -5, 0]
          } : { rotate: 0, y: 0 }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          💖
        </motion.div>
        <motion.div 
          className="absolute top-4 right-4 text-3xl z-20"
          animate={!cut ? {
            rotate: [0, -5, 5, 0],
            y: [0, -5, 0]
          } : { rotate: 0, y: 0 }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          ✨
        </motion.div>
        <motion.div 
          className="absolute bottom-4 left-4 text-3xl z-20"
          animate={!cut ? {
            rotate: [0, -5, 5, 0],
            y: [0, 5, 0]
          } : { rotate: 0, y: 0 }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          🌹
        </motion.div>
        <motion.div 
          className="absolute bottom-4 right-4 text-3xl z-20"
          animate={!cut ? {
            rotate: [0, 5, -5, 0],
            y: [0, 5, 0]
          } : { rotate: 0, y: 0 }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        >
          💕
        </motion.div>
        
        {/* Left Cake Half */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          animate={cut ? { x: -60 } : { x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop"
            alt="Cake Left"
            className="w-full h-full object-cover"
            style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
          />
        </motion.div>

        {/* Right Cake Half */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          animate={cut ? { x: 60 } : { x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop"
            alt="Cake Right"
            className="w-full h-full object-cover"
            style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
          />
        </motion.div>

        {/* Knife Animation */}
        {cut && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 w-1 h-32 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full shadow-lg"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 120, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
          />
        )}

        {/* Slash Effect */}
        {cut && (
          <motion.svg
            className="absolute inset-0 w-full h-full z-40"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewBox="0 0 100 100"
          >
            <motion.line
              x1="0"
              y1="40"
              x2="100"
              y2="60"
              stroke="rgba(255, 200, 100, 0.8)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.svg>
        )}

        {/* Spark Particles */}
        {cut && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            initial={{ x: 0, y: '50%', opacity: 1 }}
            animate={{
              x: Math.cos((i / 8) * Math.PI * 2) * 100,
              y: '50%',
              opacity: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Light Reflection */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20"
          animate={!cut ? {
            opacity: [0.1, 0.35, 0.1],
            x: [-300, 300, -300],
          } : { opacity: 0, x: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />
      </div>

      {/* Click to Cut Text */}
      {!cut && (
        <motion.div 
          className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg z-30"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
           🔪 Click to Cut
        </motion.div>
      )}

      {/* Celebration on Cut */}
      {cut && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-5xl font-bold z-30 bg-white/10 backdrop-blur-sm rounded-2xl"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🎉
          </motion.div>
          <motion.div
            className="text-3xl text-pink-600 mt-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            Sliced! 🍰
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          >
            🎉
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

const FinalMessageSection: React.FC<{ onReply?: () => void }> = ({ onReply }) => {
  return (
    <motion.div
      key="message"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://t3.ftcdn.net/jpg/08/32/80/46/360_F_832804688_vH1TeJJgiNF1aHeJVC1e5dMi5EWsZDQE.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 80 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="text-red-500 mx-auto mb-8 fill-current drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" size={64} />
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-serif font-thin italic mb-6 text-white drop-shadow-[0_0_5px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,1),0_0_20px_rgba(0,0,0,0.9),0_4px_12px_rgba(0,0,0,0.8)] leading-tight" style={{ fontStyle: 'italic', fontVariant: 'normal' }}>
          Dear Purva,
        </h2>
        
        <p className="text-lg md:text-xl leading-loose font-serif italic font-extralight text-white drop-shadow-[0_0_5px_rgba(0,0,0,1),0_0_12px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.9),0_3px_8px_rgba(0,0,0,0.8)] mb-10 px-4">
          "Is khoobsurat din par main bas tumhe yeh batana chahta hoon ki tum mere liye kitni special ho.
Shayad tumhe khud bhi ehsaas na ho, lekin dheere dheere tum meri duniya ka sabse important hissa ban gayi ho.

Tumhari smile sab kuch halka aur khushnuma bana deti hai, aur tumhari presence mujhe ek aisa sukoon deti hai jo mujhe pehle kabhi mehsoos nahi hua. Tumhare saath rehna ghar jaisa feel hota hai, aur tumhari khushi mere liye shabdon se zyada maayne rakhti hai.

Pata hi nahi chala kab, lekin tum sirf ek care karne wali insaan se badhkar meri life ke un logon me shamil ho gayi ho jinke saath main apne sabse khush pal imagine karta hoon. Mujhe nahi pata future kya lekar aayega, lekin itna zaroor jaanta hoon ki agar mujhe kabhi mauka mila, to main yeh safar tumhare saath chalna chahunga… sirf kuch waqt ke liye nahi, balki hamesha ke liye. ❤️
        </p>
        
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-white text-3xl md:text-4xl drop-shadow-[0_0_5px_rgba(0,0,0,1),0_0_12px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.9),0_3px_8px_rgba(0,0,0,0.8)] font-serif italic font-thin"
        >
          Forever Yours... 💍
        </motion.div>

        {onReply && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReply}
            className="mt-10 px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full font-serif italic text-lg shadow-lg transition-all"
          >
            Reply to me 💕
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default App;
