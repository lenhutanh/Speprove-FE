'use client'

interface WaveBarsProps {
  color?: 'blue' | 'red'
  className?: string
}

const HEIGHTS = [18, 30, 44, 52, 38, 24, 16]
const DELAYS = [0, 0.1, 0.2, 0.08, 0.15, 0.25, 0.05]

export function WaveBars({ color = 'blue', className }: WaveBarsProps) {
  return (
    <>
      <div
        className={className}
        style={{ display: 'flex', alignItems: 'center', gap: 4, height: 56 }}
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={i}
            className={color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}
            style={{
              width: 6,
              height: h,
              borderRadius: 3,
              animation: 'wavePulse 0.9s ease-in-out infinite',
              animationDelay: `${DELAYS[i]}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes wavePulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.7; }
          50%       { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>
    </>
  )
}
