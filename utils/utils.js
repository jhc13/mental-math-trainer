export const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
};

export function pluralize(word, count) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export function formatSeconds(seconds) {
  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;

  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  let time = seconds % SECONDS_PER_HOUR;
  const minutes = Math.floor(time / SECONDS_PER_MINUTE);
  time %= SECONDS_PER_MINUTE;
  let formattedTime = `${minutes.toString().padStart(2, '0')}:${time
    .toString()
    .padStart(2, '0')}`;
  if (hours) {
    formattedTime = `${hours}:${formattedTime}`;
  }
  return formattedTime;
}

export function formatCentiseconds(centiseconds) {
  const CENTISECONDS_PER_SECOND = 100;

  const seconds = Math.floor(centiseconds / CENTISECONDS_PER_SECOND);
  return `${formatSeconds(seconds)}.${(centiseconds % CENTISECONDS_PER_SECOND)
    .toString()
    .padStart(2, '0')}`;
}
