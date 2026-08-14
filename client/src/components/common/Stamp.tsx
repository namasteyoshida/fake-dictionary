import { useEffect } from 'react';
import { sound } from '../../utils/sound';

type Props = {
  isReal: boolean;
};

/** カードが本物か偽物かを、書類の検認スタンプのように表示する */
export function Stamp({ isReal }: Props) {
  useEffect(() => {
    sound.playStamp();
  }, []);

  return (
    <span className={`stamp ${isReal ? 'stamp--real' : 'stamp--fake'}`}>
      {isReal ? 'REAL' : 'FAKE'}
    </span>
  );
}

