import React from 'react';

const generateColors = (seed) => {
  const hash = seed.toLowerCase().slice(2, 10);
  const hue = parseInt(hash, 16) % 360;
  return {
    primary: `hsl(${hue}, 90%, 65%)`,
    secondary: `hsl(${(hue + 40) % 360}, 85%, 60%)`,
    accent: `hsl(${(hue + 180) % 360}, 80%, 65%)`,
    highlight: `hsl(${(hue + 150) % 360}, 85%, 75%)`,
    background: '#22232b'
  };
};

const MessageAvatar = ({ address, size = 32 }) => {
  const colors = generateColors(address);
  
  // Create more varied patterns based on address
  const patterns = Array.from({ length: 6 }, (_, i) => 
    parseInt(address.slice(2 + i * 2, 4 + i * 2), 16)
  );

  // Create unique shapes based on the address
  const createShape = (index) => {
    const angle = (patterns[0] % 360) * (Math.PI / 180);
    const radius = 15 + (patterns[1] % 10);
    const x = 40 + Math.cos(angle + index) * radius;
    const y = 40 + Math.sin(angle + index) * radius;
    return { x, y };
  };

  // Generate multiple points for the pattern
  const points = Array.from({ length: 6 }, (_, i) => createShape(i * Math.PI / 3));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <circle cx="40" cy="40" r="40" fill={colors.background} />
      
      {/* Complex geometric pattern */}
      <path
        d={`
          M ${points[0].x} ${points[0].y}
          C ${points[1].x} ${points[1].y},
            ${points[2].x} ${points[2].y},
            ${points[3].x} ${points[3].y}
          S ${points[4].x} ${points[4].y},
            ${points[5].x} ${points[5].y}
          Z
        `}
        fill={colors.primary}
        opacity="0.7"
      />

      {/* Decorative circles */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={3 + (patterns[i] % 4)}
          fill={i % 2 ? colors.secondary : colors.accent}
          opacity="0.9"
        />
      ))}

      {/* Central pattern */}
      <path
        d={`
          M ${40 - patterns[2] % 15} ${40 - patterns[3] % 15}
          Q ${40} ${40 - patterns[4] % 20},
            ${40 + patterns[5] % 15} ${40 + patterns[0] % 15}
        `}
        stroke={colors.highlight}
        strokeWidth="3"
        fill="none"
      />

      {/* Additional decorative elements */}
      <circle
        cx="40"
        cy="40"
        r={5 + (patterns[1] % 5)}
        fill={colors.secondary}
        opacity="0.8"
      />
      
      {/* Dynamic lines */}
      {Array.from({ length: 3 }).map((_, i) => (
        <line
          key={i}
          x1={40 + Math.cos(patterns[i] * Math.PI / 12) * 20}
          y1={40 + Math.sin(patterns[i] * Math.PI / 12) * 20}
          x2={40 + Math.cos((patterns[i] + 2) * Math.PI / 12) * 25}
          y2={40 + Math.sin((patterns[i] + 2) * Math.PI / 12) * 25}
          stroke={colors.accent}
          strokeWidth="1.5"
          opacity="0.6"
        />
      ))}
    </svg>
  );
};

export default MessageAvatar; 