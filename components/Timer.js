import { useEffect, useState } from 'react';
import { formatSeconds } from 'utils/utils';

function Timer({ startTime }) {
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
    <div className='text-2xl tabular-nums'>{formatSeconds(seconds, true)}</div>
  );
}

export default Timer;
