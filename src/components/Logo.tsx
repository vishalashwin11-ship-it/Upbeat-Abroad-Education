import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'dark', size = 'md' }) => {
  const isLight = variant === 'light';

  const heights = {
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14',
  };

  return (
    <div className={`flex items-center gap-3 shrink-0 select-none ${className}`}>
      {/* Visual Logo mark matching the brand image */}
      <div className={`relative flex items-center justify-center ${heights[size]}`}>
        <svg
          viewBox="0 0 280 140"
          className="h-full w-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* UAE Serif Letters */}
          <g fill={isLight ? '#FFFFFF' : '#0F172A'}>
            {/* U */}
            <path d="M 30 95 C 30 110 42 120 58 120 C 74 120 86 110 86 95 L 86 50 L 75 50 L 75 93 C 75 102 68 108 58 108 C 48 108 41 102 41 93 L 41 50 L 30 50 Z" />
            <rect x="26" y="48" width="16" height="3" />
            <rect x="73" y="48" width="16" height="3" />

            {/* A */}
            <path d="M 112 120 L 124 120 L 138 50 L 126 50 L 102 120 Z" />
            <path d="M 138 50 L 152 120 L 164 120 L 138 50 Z" />
            {/* Curved crossbar of A */}
            <path d="M 116 102 Q 133 90 150 102 Q 133 95 116 102 Z" />

            {/* E */}
            <path d="M 180 50 L 180 120 L 225 120 L 225 109 L 192 109 L 192 90 L 218 90 L 218 80 L 192 80 L 192 61 L 222 61 L 222 50 Z" />
            <rect x="176" y="48" width="14" height="3" />
            <rect x="176" y="117" width="14" height="3" />
          </g>

          {/* Jet Airplane Climbing Diagonally Over Letters */}
          <g transform="translate(130, 20) rotate(-22)">
            {/* Airplane Fuselage */}
            <path
              d="M 0 24 C 15 22 55 18 100 12 C 115 10 125 5 132 2 C 126 10 112 18 95 24 C 60 32 15 36 0 36 C -10 36 -12 25 0 24 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.2"
            />
            {/* Swept Main Wing */}
            <path d="M 40 24 L -12 62 L -3 64 L 62 28 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            {/* Left Top Wing */}
            <path d="M 58 18 L 30 -12 L 38 -11 L 72 16 Z" fill="#CBD5E1" />
            {/* Orange-Red Tail Fin */}
            <path d="M -6 26 L -26 -2 C -22 -3 -12 0 -6 13 Z" fill="#EA580C" />
            <path d="M -15 9 L -26 -2 L -20 -2 L -10 10 Z" fill="#DC2626" />
            {/* Turbofan Engines with Orange Nacelle Accent */}
            <ellipse cx="22" cy="46" rx="11" ry="4.5" fill="#F97316" />
            <ellipse cx="20" cy="46" rx="9" ry="3" fill="#C2410C" />
            <ellipse cx="52" cy="8" rx="8" ry="3" fill="#EA580C" />
            {/* Cockpit Window */}
            <path d="M 124 5 Q 127 4 129 3 Q 125 7 120 9 Z" fill="#1E293B" />
          </g>

          {/* Subtitle UPBEAT ABROAD EDUCATION */}
          <text
            x="135"
            y="136"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="9"
            letterSpacing="3"
            fill={isLight ? '#E2E8F0' : '#475569'}
            fontWeight="700"
            textAnchor="middle"
          >
            UPBEAT ABROAD EDUCATION
          </text>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`text-base font-extrabold tracking-tight leading-tight ${isLight ? 'text-white' : 'text-slate-900'}`}>
          Upbeat Abroad
        </span>
        <span className={`text-[10px] font-semibold tracking-wider uppercase leading-none ${isLight ? 'text-teal-300' : 'text-teal-700'}`}>
          Global Education
        </span>
      </div>
    </div>
  );
};
