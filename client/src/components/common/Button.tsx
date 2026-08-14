import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import { sound } from '../../utils/sound';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className, children, onClick, ...rest }: Props) {
  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    sound.playClick();
    if (onClick) onClick(e);
  }

  return (
    <button
      className={`btn btn-${variant} ${className ?? ''}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}

