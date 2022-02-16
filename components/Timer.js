import { useEffect, useState } from 'react';
import { formatSeconds } from 'utils/utils';

export default function Timer({ startTime }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() =>
      setSeconds(Math.floor((Date.now() - startTime) / 1000))
    );
    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <div className='text-2xl tabular-nums leading-9'>
      {formatSeconds(seconds, true)}
    </div>
  );
}
