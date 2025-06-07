import React, { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, Star, PartyPopper, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

type Screen = 'nameInput' | 'wishes' | 'giftPrompt' | 'finalWishes' | 'celebration';
type WishMessage = {
  id: number;
  message: string;
  visible: boolean;
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('nameInput');
  const [userName, setUserName] = useState('Alhamdulillah');
  const [inputName, setInputName] = useState('Alhamdulillah');
  const [wishMessages, setWishMessages] = useState<WishMessage[]>([]);
  const [showingWishes, setShowingWishes] = useState(false);

  const wishTexts = [
    `Dear ${userName}, may Allah shower your special day with boundless love and divine joy! 🥰`,
    `Wishing you, ${userName}, a year overflowing with Allah's mercy and radiant moments! 🌟`,
    `With gratitude to Allah, we honor your beautiful soul and presence, ${userName}! 🎉`,
    `May Allah guide your path with wisdom and bless you with eternal peace, ${userName}! 🙏`
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ff69b4', '#00ced1', '#98fb98', '#dda0dd']
    });
  };

  const triggerSpecialConfetti = () => {
    // Multiple bursts of confetti
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleStartCelebration = () => {
    const name = inputName.trim() || 'Alhamdulillah';
    setUserName(name);
    setCurrentScreen('wishes');
    triggerConfetti();
    showWishSequence();
  };

  const showWishSequence = () => {
    setShowingWishes(true);
    const messages = wishTexts.map((text, index) => ({
      id: index,
      message: text,
      visible: false
    }));
    setWishMessages(messages);

    let delay = 1000;
    messages.forEach((_, index) => {
      setTimeout(() => {
        setWishMessages(prev => 
          prev.map((msg, i) => 
            i === index ? { ...msg, visible: true } : msg
          )
        );
        triggerConfetti();
        
        setTimeout(() => {
          setWishMessages(prev => 
            prev.map((msg, i) => 
              i === index ? { ...msg, visible: false } : msg
            )
          );
        }, 3000);
      }, delay);
      delay += 4000;
    });

    setTimeout(() => {
      setShowingWishes(false);
      setCurrentScreen('giftPrompt');
    }, delay);
  };

  const handleShowFinalWishes = () => {
    setCurrentScreen('finalWishes');
    triggerConfetti();
  };

  const handleShowCelebration = () => {
    setCurrentScreen('celebration');
    triggerSpecialConfetti();
  };

  useEffect(() => {
    triggerConfetti();
  }, []);

  const renderWishOverlay = () => {
    if (!showingWishes) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        {wishMessages.map((wish) => (
          wish.visible && (
            <div
              key={wish.id}
              className="animate-in zoom-in-50 duration-500 max-w-md mx-4 p-8 bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 rounded-2xl shadow-2xl transform"
            >
              <p className="text-xl font-semibold text-purple-900 text-center leading-relaxed">
                {wish.message}
              </p>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-400 to-cyan-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-bounce">
          <Star className="w-8 h-8 text-yellow-200 opacity-60" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse">
          <Heart className="w-6 h-6 text-pink-200 opacity-60" />
        </div>
        <div className="absolute bottom-20 left-20 animate-spin">
          <Sparkles className="w-10 h-10 text-cyan-200 opacity-60" />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce delay-300">
          <PartyPopper className="w-8 h-8 text-purple-200 opacity-60" />
        </div>
      </div>

      {renderWishOverlay()}

      {/* Name Input Screen */}
      {currentScreen === 'nameInput' && (
        <div className="max-w-lg w-full p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl text-center animate-in fade-in-50 zoom-in-95 duration-1000">
          <div className="mb-8">
            <Crown className="w-16 h-16 text-yellow-200 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-4 text-shadow-lg">
              🎉 Who's Celebrating Today? 🎂
            </h1>
          </div>
          
          <div className="space-y-6">
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Enter name"
              className="w-full max-w-xs px-6 py-4 text-xl text-center rounded-2xl border-0 bg-yellow-50 text-purple-900 placeholder-purple-400 shadow-lg focus:ring-4 focus:ring-yellow-300 focus:outline-none transition-all duration-300"
            />
            <button
              onClick={handleStartCelebration}
              className="px-8 py-4 text-xl font-semibold bg-yellow-400 hover:bg-yellow-300 text-purple-900 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Celebrate! 🎈
            </button>
          </div>
        </div>
      )}

      {/* Gift Prompt Screen */}
      {currentScreen === 'giftPrompt' && (
        <div className="max-w-lg w-full p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl text-center animate-in fade-in-50 zoom-in-95 duration-1000">
          <div className="mb-8">
            <Gift className="w-16 h-16 text-pink-200 mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-6 text-shadow-lg">
              🎁 A Special Gift Awaits! 🎉
            </h1>
            <p className="text-xl text-yellow-200 leading-relaxed">
              Click below to reveal your special birthday surprise, <span className="font-semibold text-pink-200">{userName}</span>!
            </p>
          </div>
          
          <button
            onClick={handleShowFinalWishes}
            className="px-8 py-4 text-xl font-semibold bg-pink-400 hover:bg-pink-300 text-purple-900 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
          >
            Check Your Gift! 🎀
          </button>
        </div>
      )}

      {/* Final Wishes Screen */}
      {currentScreen === 'finalWishes' && (
        <div className="max-w-2xl w-full p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl text-center animate-in fade-in-50 zoom-in-95 duration-1000">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-2 mb-6">
              <PartyPopper className="w-12 h-12 text-yellow-200 animate-spin" />
              <h1 className="text-4xl md:text-5xl font-bold text-yellow-100 text-shadow-lg">
                Happy Birthday, <span className="text-pink-200">{userName}</span>! 🎂
              </h1>
              <PartyPopper className="w-12 h-12 text-yellow-200 animate-spin" />
            </div>
          </div>
          
          <div className="space-y-6 mb-8">
            <p className="text-lg md:text-xl text-yellow-200 leading-relaxed">
              With all our heart, we pray Allah fills your day with boundless joy and cherished moments! 🥳
            </p>
            <p className="text-lg md:text-xl text-pink-200 leading-relaxed">
              May Allah adorn this new year of your life with peace, prosperity, and endless blessings! ✨
            </p>
            <p className="text-lg md:text-xl text-cyan-200 leading-relaxed">
              We humbly celebrate you and all the light you bring to the world, by Allah's grace! 🎈
            </p>
          </div>
          
          <button
            onClick={handleShowCelebration}
            className="px-8 py-4 text-xl font-semibold bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-300 hover:to-pink-300 text-purple-900 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
          >
            More Confetti! 🎊
          </button>
        </div>
      )}

      {/* New Celebration Screen */}
      {currentScreen === 'celebration' && (
        <div className="max-w-3xl w-full p-8 bg-white bg-opacity-25 backdrop-blur-lg rounded-3xl shadow-2xl text-center animate-in fade-in-50 zoom-in-95 duration-1000">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Crown className="w-16 h-16 text-yellow-200 animate-pulse" />
              <Sparkles className="w-20 h-20 text-pink-300 animate-spin" />
              <Crown className="w-16 h-16 text-yellow-200 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200 mb-6 animate-pulse">
              🌟 Ultimate Celebration! 🌟
            </h1>
          </div>
          
          <div className="space-y-8 mb-10">
            <div className="p-6 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-2xl shadow-lg">
              <p className="text-2xl font-bold text-purple-900 leading-relaxed">
                🎊 {userName}, you are absolutely AMAZING! 🎊
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-2xl shadow-lg">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4 animate-bounce" />
                <p className="text-lg font-semibold text-purple-900">
                  May this year bring you endless happiness and divine blessings! 💖
                </p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl shadow-lg">
                <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-semibold text-purple-900">
                  You shine brighter than all the stars combined! Keep glowing! ⭐
                </p>
              </div>
            </div>
            
            <div className="p-8 bg-gradient-to-r from-green-300 via-yellow-300 to-pink-300 rounded-3xl shadow-xl">
              <p className="text-xl font-bold text-purple-900 leading-relaxed">
                🌈 May Allah grant you 100 years of health, happiness, and success! 
                <br />
                Your journey is just beginning, and it's going to be SPECTACULAR! 🚀
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={triggerSpecialConfetti}
              className="px-8 py-4 text-xl font-semibold bg-gradient-to-r from-rainbow-start to-rainbow-end hover:shadow-2xl text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
            >
              🎆 MEGA CONFETTI! 🎆
            </button>
            <button
              onClick={() => setCurrentScreen('nameInput')}
              className="px-8 py-4 text-xl font-semibold bg-white bg-opacity-90 hover:bg-opacity-100 text-purple-900 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 active:scale-95"
            >
              🔄 Celebrate Someone Else!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;