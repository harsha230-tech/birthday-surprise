
import React, { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { HeartProps } from '../types';

interface Props {
  count?: number;
}

const HeartParticles: React.FC<Props> = ({ count = 20 }) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`,
      size: `${15 + Math.random() * 25}px`,
      delay: `${-Math.random() * 20}s`,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart-particle text-red-500/30"
          style={{
            left: heart.left,
            bottom: '-50px',
            width: heart.size,
            height: heart.size,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
          }}
        >
          <Heart fill="currentColor" size="100%" />
        </div>
      ))}
    </div>
  );
};

export default HeartParticles;
