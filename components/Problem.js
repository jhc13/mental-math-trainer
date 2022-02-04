import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';

const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
};

function Problem({ operands, operation, answer }) {
  const { settings } = useContext(SettingsContext);
  const { problemDisplay } = settings;

  const operator = OPERATORS[operation];
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
        <div className='mx-2 w-[4ch] self-end empty:after:content-["\200B"]'>
          {answer}
        </div>
      </div>
    );
  }
  return null;
}

export default Problem;
