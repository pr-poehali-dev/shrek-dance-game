import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dancers, setDancers] = useState<Array<{ id: number; x: number; y: number; dancing: boolean }>>([]);
  const [audio] = useState(() => new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'));

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && dancers.length < 8) {
        const newDancer = {
          id: Date.now(),
          x: Math.random() * 80 + 5,
          y: Math.random() * 60 + 10,
          dancing: false
        };
        setDancers(prev => [...prev, newDancer]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, dancers.length]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setScore(0);
    setDancers([]);
    audio.loop = true;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const handleStopGame = () => {
    setIsPlaying(false);
    audio.pause();
    audio.currentTime = 0;
  };

  const handleDancerClick = (id: number) => {
    if (!isPlaying) return;
    
    setDancers(prev => prev.map(d => 
      d.id === id ? { ...d, dancing: true } : d
    ));
    
    setScore(prev => prev + 10);
    
    setTimeout(() => {
      setDancers(prev => prev.filter(d => d.id !== id));
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl mb-4 animate-bounce-in">
            🚽 Скибиди Туалеты 🚽
          </h1>
          <p className="text-2xl md:text-3xl text-white drop-shadow-lg">
            Опа Гангнам Стайл!
          </p>
        </div>

        <Card className="max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-purple-600">
              Счёт: {score}
            </div>
            <Icon name="Music" size={32} className="text-secondary" />
          </div>
          
          <div className="flex gap-4">
            {!isPlaying ? (
              <Button 
                onClick={handleStartGame}
                className="flex-1 text-xl py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Icon name="Play" size={24} className="mr-2" />
                Начать игру
              </Button>
            ) : (
              <Button 
                onClick={handleStopGame}
                variant="destructive"
                className="flex-1 text-xl py-6"
              >
                <Icon name="Square" size={24} className="mr-2" />
                Стоп
              </Button>
            )}
          </div>

          {isPlaying && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Кликай по танцующим туалетам! 🎯
            </div>
          )}
        </Card>

        <div className="relative w-full h-[60vh] rounded-3xl bg-gradient-to-b from-sky-200 to-green-200 shadow-2xl overflow-hidden border-8 border-white/50">
          {dancers.map((dancer) => (
            <button
              key={dancer.id}
              onClick={() => handleDancerClick(dancer.id)}
              className={`absolute cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                dancer.dancing ? 'animate-dance' : 'animate-bounce-in'
              }`}
              style={{
                left: `${dancer.x}%`,
                top: `${dancer.y}%`,
              }}
            >
              <div className="relative">
                {dancer.dancing && (
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-pulse-ring"></div>
                )}
                <div className="text-7xl drop-shadow-2xl">
                  🚽
                </div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-4xl">
                  🟢
                </div>
              </div>
            </button>
          ))}

          {!isPlaying && dancers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-pulse">🎮</div>
                <p className="text-3xl font-bold text-gray-700">
                  Нажми "Начать игру"!
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Card className="inline-block p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-purple-600 mb-2">Правила игры</h3>
            <ul className="text-left space-y-2 text-lg">
              <li>✨ Кликай по появляющимся скибиди туалетам</li>
              <li>🎵 Танцуй под музыку вместе с ними</li>
              <li>⭐ Каждый клик = +10 очков</li>
              <li>🏆 Набери максимум очков!</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
