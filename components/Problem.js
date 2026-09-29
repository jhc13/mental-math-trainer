import { OPERATORS } from 'utils/format';

// Tailwind requires unbroken class strings.
// Add an extra ch because tabular numbers are slightly wider than proportional
// numbers.
const ANSWER_WIDTHS = {
  1: 'w-[2ch]',
  2: 'w-[3ch]',
  3: 'w-[4ch]',
  4: 'w-[5ch]',
  5: 'w-[6ch]',
  6: 'w-[7ch]',
  7: 'w-[8ch]',
  8: 'w-[9ch]',
  9: 'w-[10ch]',
  10: 'w-[11ch]',
  11: 'w-[12ch]',
  12: 'w-[13ch]',
  13: 'w-[14ch]',
  14: 'w-[15ch]',
  15: 'w-[16ch]',
  16: 'w-[17ch]'
};

export default function Problem({
  operation,
  operands,
  maxAnswerLength,
  answerString,
  operationFromOperands
}) {
  const operator = OPERATORS[operationFromOperands];
  const answerWidthClass = ANSWER_WIDTHS[maxAnswerLength];
  let textSizeClass;
  if (maxAnswerLength <= 8) {
    textSizeClass = 'text-5xl sm:text-7xl';
  } else if (maxAnswerLength <= 12) {
    textSizeClass = 'text-4xl sm:text-6xl md:text-7xl';
  } else {
    textSizeClass = 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl';
  }

  return (
    <div
      className={`flex flex-col gap-1 self-center text-right ${textSizeClass} tabular-nums`}
    >
      <div className='mx-2 flex flex-col gap-1'>
        <div className='ml-12'>{operands[0]}</div>
        <div className='flex justify-between'>
          {operator}
          <div className='ml-4'>{operands[1]}</div>
        </div>
      </div>
      <div className='h-1 bg-white' />
      {/* Display a zero width space if the answer is empty to ensure a
            consistent height. */}
      <div
        className={`mx-2 ${answerWidthClass} self-end empty:after:content-["\\200B"]`}
      >
        {answerString}
      </div>
    </div>
  );
}
