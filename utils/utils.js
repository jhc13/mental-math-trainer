export const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
};

export function pluralize(word, count) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export function formatSeconds(totalSeconds, alwaysShowMinutes = false) {
  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;

  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  let remainingSeconds = totalSeconds % SECONDS_PER_HOUR;
  const minutes = Math.floor(remainingSeconds / SECONDS_PER_MINUTE);
  const seconds = remainingSeconds % SECONDS_PER_MINUTE;
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');
  if (hours) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  if (alwaysShowMinutes || minutes) {
    return `${minutes}:${paddedSeconds}`;
  }
  return seconds;
}

export function formatCentiseconds(totalCentiseconds) {
  const CENTISECONDS_PER_SECOND = 100;

  const seconds = Math.floor(totalCentiseconds / CENTISECONDS_PER_SECOND);
  const centiseconds = totalCentiseconds % CENTISECONDS_PER_SECOND;
  return `${formatSeconds(seconds)}.${centiseconds
    .toString()
    .padStart(2, '0')}`;
}
