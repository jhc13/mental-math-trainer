import { useContext } from 'react';
import { SettingsContext } from 'utils/settings';

const OPERATORS = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷'
};

function Problem({ operands, operation }) {
  const { settings } = useContext(SettingsContext);
  const { problemDisplay } = settings;

  const operator = OPERATORS[operation];
  if (problemDisplay === 'vertical') {
    return <div />;
  }
  return (
    <div className='text-center text-6xl'>
      {operands[0]} {operator} {operands[1]}
    </div>
  );
}

export default Problem;
