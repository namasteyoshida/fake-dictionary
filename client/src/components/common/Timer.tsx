import { useEffect, useState } from 'react';

type Props = {
  seconds: number;
  onTimeUp?: () => void;
};

export function Timer({ seconds, onTimeUp }: Props) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const percentage = Math.max(0, (timeLeft / seconds) * 100);
  const isUrgent = timeLeft <= 10;

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = minutes > 0 ? `${minutes}分${secs}秒` : `${secs}秒`;

  return (
    <div style={{ margin: '8px 0 16px', textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          fontWeight: 600,
          color: isUrgent ? 'var(--stamp-red)' : 'var(--ink-soft)',
          marginBottom: '6px',
        }}
      >
        残り時間: {timeString}
      </div>

      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'var(--paper-dark)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: isUrgent ? 'var(--stamp-red)' : 'var(--brass)',
            transition: 'width 1s linear, background-color 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
