import { useEffect, useState } from 'react';

const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;

function formatTime(time) {
  const hours = Math.floor(time / MILLISECONDS_PER_HOUR);
  time %= MILLISECONDS_PER_HOUR;
  const minutes = Math.floor(time / MILLISECONDS_PER_MINUTE);
  time %= MILLISECONDS_PER_MINUTE;
  const seconds = Math.floor(time / MILLISECONDS_PER_SECOND);
  let formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  if (hours) {
    formattedTime = `${hours}:${formattedTime}`;
  }
  return formattedTime;
}

function Timer({ startTime }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setInterval(() => setTime(Date.now() - startTime));
  }, [startTime]);

  return <div className='text-2xl tabular-nums'>{formatTime(time)}</div>;
}

export default Timer;
