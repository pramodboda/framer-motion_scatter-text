import React, { useState, useEffect, useRef } from 'react';

interface CharacterPosition {
  char: string;
  originalX: number;
  originalY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  opacity: number;
  isHovered: boolean;
}

interface InteractiveScatterTextProps {
  text: string;
  scatterDistance?: number;
  animationDuration?: number;
  resetDuration?: number;
  initialDelay?: number;
}

const InteractiveScatterText: React.FC<InteractiveScatterTextProps> = ({
  text,
  scatterDistance = 100,
  animationDuration = 50,
  resetDuration = 20,
  initialDelay = 1000 // 1 seconds default delay
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<CharacterPosition[]>([]);
  const [resetFlag, setResetFlag] = useState(false);
  const animationFrameId = useRef<number>();

  // Initialize character positions
  useEffect(() => {
    const initialPositions: CharacterPosition[] = text.split('').map((char) => ({
      char,
      originalX: 0,
      originalY: 0,
      currentX: 0,
      currentY: 0,
      targetX: 0, // Start at original position
      targetY: 0,
      opacity: 1,
      isHovered: false
    }));
    
    setPositions(initialPositions);

    // After initial delay, set random target positions
    const scatterTimeout = setTimeout(() => {
      setPositions(prev => 
        prev.map(pos => ({
          ...pos,
          targetX: (Math.random() - 0.5) * scatterDistance,
          targetY: (Math.random() - 0.5) * scatterDistance
        }))
      );

      // Animate to scattered positions
      const timers = initialPositions.map((_, i) => {
        return setTimeout(() => {
          setPositions(prev => {
            const newPositions = [...prev];
            newPositions[i] = { 
              ...newPositions[i], 
              currentX: newPositions[i].targetX,
              currentY: newPositions[i].targetY
            };
            return newPositions;
          });
        }, i * animationDuration);
      });

      return () => timers.forEach(timer => clearTimeout(timer));
    }, initialDelay);

    return () => clearTimeout(scatterTimeout);
  }, [text, scatterDistance, animationDuration, initialDelay]);

  // Handle reset button click
  const handleReset = () => {
    setResetFlag(prev => !prev);
  };

  // Reset all characters to original positions
  useEffect(() => {
    if (positions.length === 0) return;
    
    setPositions(prev => 
      prev.map(pos => ({
        ...pos,
        targetX: 0,
        targetY: 0,
        isHovered: false
      }))
    );

    // Animate back to original positions
    const timers = positions.map((_, i) => {
      return setTimeout(() => {
        setPositions(prev => {
          const newPositions = [...prev];
          newPositions[i] = { 
            ...newPositions[i], 
            currentX: 0,
            currentY: 0
          };
          return newPositions;
        });
      }, i * resetDuration);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [resetFlag, positions.length, resetDuration]);

  // Handle character hover
  const handleHover = (index: number) => {
    setPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = { 
        ...newPositions[index], 
        isHovered: true,
        // targetX: (Math.random() - 0.5) * scatterDistance,
        // targetY: (Math.random() - 0.5) * scatterDistance

        targetX: (Math.random() - 1) * scatterDistance,
        targetY: (Math.random() - 1) * scatterDistance
      };
      return newPositions;
    });
  };

  // Handle character unhover
  const handleUnhover = (index: number) => {
    setPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = { 
        ...newPositions[index], 
        isHovered: false,
        targetX: resetFlag ? 0 : newPositions[index].targetX
      };
      return newPositions;
    });
  };

  // Animation frame for smooth movement
  useEffect(() => {
    const animate = () => {
      setPositions(prev => 
        prev.map(pos => ({
          ...pos,
          currentX: pos.currentX + (pos.targetX - pos.currentX) * 0.2,
          currentY: pos.currentY + (pos.targetY - pos.currentY) * 0.2
        }))
      );
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <div 
        ref={containerRef}
        style={{ 
          display: 'inline-block',
          position: 'relative',
          margin: '2rem 0',
          fontSize: '2rem',
          lineHeight: '1.5'
        }}
      >
        {positions.map((pos, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              position: 'relative',
              opacity: pos.opacity,
              transform: `translate(${pos.currentX}px, ${pos.currentY}px)`,
              transition: 'transform 0.1s ease-out, opacity 0.5s ease-out',
              cursor: 'pointer',
              zIndex: pos.isHovered ? 10 : 1
            }}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleUnhover(index)}
          >
            {pos.char === ' ' ? '\u00A0' : pos.char}
          </span>
        ))}
      </div>
      
      <button
        onClick={handleReset}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        We fix your problems
      </button>
    </div>
  );
};

export default InteractiveScatterText;