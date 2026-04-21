import { ImageResponse } from 'next/og';

export const size = {
  width: 96,
  height: 96,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 50% 30%, #3d2f18 0%, #19120d 48%, #070604 100%)',
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 38) rotate(90) scale(44)">
              <stop offset="0" stopColor="#36515e" stopOpacity="0.72" />
              <stop offset="0.52" stopColor="#211913" stopOpacity="0.92" />
              <stop offset="1" stopColor="#0a0806" />
            </radialGradient>
            <linearGradient id="gold" x1="48" y1="10" x2="48" y2="86" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F7DEA0" />
              <stop offset="0.5" stopColor="#D6A348" />
              <stop offset="1" stopColor="#7E531A" />
            </linearGradient>
            <linearGradient id="darkGold" x1="48" y1="20" x2="48" y2="73" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9B7337" />
              <stop offset="1" stopColor="#332412" />
            </linearGradient>
          </defs>

          <circle cx="48" cy="48" r="41" fill="url(#bg)" stroke="url(#gold)" strokeWidth="2.5" />
          <circle cx="48" cy="48" r="35" stroke="#EFD18D" strokeOpacity="0.35" />

          <path d="M48 2L52 6L48 10L44 6L48 2Z" fill="url(#gold)" stroke="#F6E0A9" strokeOpacity="0.75" />

          <path d="M26 13L24 21M30 13L28 21M32 13H38M35 13V21" stroke="#F0D28E" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M44 10L42 19M49 10L47 19M54 10L52 19M56 10H63M59.5 10V19" stroke="#F0D28E" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M68 13L66 21" stroke="#F0D28E" strokeWidth="1.4" strokeLinecap="round" />

          <path d="M34 27H62L58 22H38L34 27Z" fill="url(#darkGold)" stroke="#F0D28E" strokeWidth="1.2" />
          <path d="M38 27V39M44 27V39M52 27V39M58 27V39" stroke="#F0D28E" strokeWidth="1.2" />
          <path d="M35 39H61" stroke="#F0D28E" strokeWidth="1.4" />

          <path d="M42 41H45V64H42V41Z" fill="url(#gold)" />
          <path d="M51 41H54V64H51V41Z" fill="url(#gold)" />
          <path d="M45 43H51V62H45V43Z" fill="#120E0A" stroke="#EBCB83" strokeWidth="0.8" />
          <path d="M45.5 43.5H50.5L48.7 51L50.5 61.5H45.5L47.3 51L45.5 43.5Z" fill="url(#gold)" />

          <path d="M28 65C34 61 40 60 48 61V74C41 72 34 72 28 75V65Z" fill="url(#gold)" stroke="#F1D390" strokeWidth="1" />
          <path d="M68 65C62 61 56 60 48 61V74C55 72 62 72 68 75V65Z" fill="url(#gold)" stroke="#F1D390" strokeWidth="1" />
          <path d="M48 61V74" stroke="#7A521C" strokeOpacity="0.8" />

          <circle cx="48" cy="77" r="7.5" fill="#2B1D0E" stroke="#E6C880" strokeOpacity="0.5" />
          <path d="M48 71V83M42 77H54" stroke="#E6C880" strokeOpacity="0.7" strokeWidth="1" />
        </svg>
      </div>
    ),
    size
  );
}
