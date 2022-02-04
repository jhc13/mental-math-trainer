import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';

const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
};

// Tailwind requires unbroken class strings.
const ANSWER_WIDTHS = {
  1: 'w-[1ch]',
  2: 'w-[2ch]',
  3: 'w-[3ch]',
  4: 'w-[4ch]',
  5: 'w-[5ch]',
  6: 'w-[6ch]',
  7: 'w-[7ch]',
  8: 'w-[8ch]',
  9: 'w-[9ch]',
  10: 'w-[10ch]',
  11: 'w-[11ch]',
  12: 'w-[12ch]',
  13: 'w-[13ch]',
  14: 'w-[14ch]',
  15: 'w-[15ch]',
  16: 'w-[16ch]'
};

function Problem({ operands, operation, answer }) {
  const { settings } = useContext(SettingsContext);
  const { problemDisplay } = settings;

  const operator = OPERATORS[operation];
  const operand_lengths = operands.map((operand) => operand.toString().length);
  let max_answer_length;
  switch (operation) {
    case 'addition':
      max_answer_length = Math.max(...operand_lengths) + 1;
      break;
    case 'subtraction':
    case 'division':
      max_answer_length = operand_lengths[0];
      break;
    case 'multiplication':
      max_answer_length = operand_lengths[0] + operand_lengths[1];
      break;
  }
  const answer_width = ANSWER_WIDTHS[max_answer_length];

  if (problemDisplay === 'vertical') {
    return (
      <div className='flex flex-col gap-1 self-center text-right text-6xl'>
        <div className='mx-2 flex flex-col gap-1'>
          <div className='ml-12'>{operands[0]}</div>
          <div className='flex justify-between'>
            <div>{operator}</div>
            <div className='ml-4'>{operands[1]}</div>
          </div>
        </div>
        <div className='h-1 bg-white' />
        {/* Display a zero width space if the answer is empty to ensure a
            consistent height. */}
        <div
          className={`mx-2 ${answer_width} self-end empty:after:content-["\\200B"]`}
        >
          {answer}
        </div>
      </div>
    );
  }
  return null;
}

export default Problem;
