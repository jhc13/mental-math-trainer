import { useContext, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Problem from 'components/Problem';
import Keypad from 'components/Keypad';

function getMaxAnswerLength(operands, operation) {
  const operandLengths = operands.map((operand) => operand.toString().length);
  switch (operation) {
    case 'addition':
      return Math.max(...operandLengths) + 1;
    case 'subtraction':
    case 'division':
      return operandLengths[0];
    case 'multiplication':
      return operandLengths[0] + operandLengths[1];
  }
}

function Home() {
  const [answerString, setAnswerString] = useState('');
  const { settings } = useContext(SettingsContext);
  const { inputDirection, showKeypad } = settings;

  const operands = [123, 456];
  const operation = 'multiplication';
  const maxAnswerLength = getMaxAnswerLength(operands, operation);

  const pressKey = (keyText) => {
    if (keyText === 'clear') {
      setAnswerString('');
    } else if (keyText === 'erase') {
      if (inputDirection === 'right to left') {
        setAnswerString((answerString) => answerString.slice(1));
      } else {
        setAnswerString((answerString) => answerString.slice(0, -1));
      }
    } else if (answerString.length < maxAnswerLength) {
      if (inputDirection === 'right to left') {
        setAnswerString((answerString) => keyText + answerString);
      } else {
        setAnswerString((answerString) => answerString + keyText);
      }
    }
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='flex flex-auto flex-col justify-center'>
        <Problem
          operands={operands}
          operation={operation}
          maxAnswerLength={maxAnswerLength}
          answer={answerString}
        />
      </div>
      {showKeypad && <Keypad pressKey={pressKey} />}
    </div>
  );
}

export default Home;
