import React from "react";

interface LegacyGuardLogoProps {
  className?: string;
}

export function LegacyGuardLogo({ className = "w-8 h-8" }: LegacyGuardLogoProps) {
  return (
    <div className={className}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield background */}
        <path
          d="M16 2L7 6V15.5C7 22.5 11.5 28.5 16 30C20.5 28.5 25 22.5 25 15.5V6L16 2Z"
          fill="hsl(95 35% 42%)"
          stroke="hsl(95 35% 35%)"
          strokeWidth="0.5"
        />
        
        {/* Leaf design inside shield */}
        <g transform="translate(16, 16)">
          {/* Main leaf */}
          <path
            d="M0 -6C-2 -4 -3 -1 -3 2C-3 4 -2 6 0 8C2 6 3 4 3 2C3 -1 2 -4 0 -6Z"
            fill="hsl(42 33% 98%)"
          />
          {/* Leaf stem */}
          <path
            d="M0 2L0 8"
            stroke="hsl(42 33% 98%)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Small leaves */}
          <path
            d="M-1 0C-2 1 -1 3 0 2C1 3 2 1 1 0"
            fill="hsl(42 33% 98%)"
          />
        </g>
      </svg>
    </div>
  );
}