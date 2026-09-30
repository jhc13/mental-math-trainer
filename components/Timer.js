import { useEffect, useState } from 'react';
import { formatSeconds } from 'utils/format';

export default function Timer({ startTime }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timeout;
    const update = () => {
      const milliseconds = Date.now() - startTime;
      setSeconds(Math.floor(milliseconds / 1000));
      timeout = setTimeout(update, 1000 - (milliseconds % 1000));
    };
    update();
    return () => {
      clearTimeout(timeout);
    };
  }, [startTime]);

  return (
    <div className='text-2xl tabular-nums leading-9'>
      {formatSeconds(seconds, true)}
    </div>
  );
}
