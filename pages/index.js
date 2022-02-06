import { useCallback, useContext, useEffect, useState } from 'react';
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

  const clear = () => {
    setAnswerString('');
  };

  const erase = useCallback(() => {
    if (inputDirection === 'right to left') {
      setAnswerString((answerString) => answerString.slice(1));
    } else {
      setAnswerString((answerString) => answerString.slice(0, -1));
    }
  }, [inputDirection]);

  const appendDigit = useCallback(
    (digit) => {
      if (answerString.length >= maxAnswerLength) {
        return;
      }
      if (inputDirection === 'right to left') {
        setAnswerString((answerString) => digit + answerString);
      } else {
        setAnswerString((answerString) => answerString + digit);
      }
    },
    [answerString.length, inputDirection, maxAnswerLength]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (['c', 'C', ' ', 'Enter'].includes(key)) {
        clear();
      } else if (['Backspace', 'Delete'].includes(key)) {
        erase();
      } else if (/^\d$/.test(key)) {
        appendDigit(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [appendDigit, erase]);

  const handleKeyClick = (event) => {
    const keyText = event.target.textContent;
    if (keyText === 'clear') {
      clear();
    } else if (keyText === 'erase') {
      erase();
    } else {
      appendDigit(keyText);
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
      {showKeypad && <Keypad onKeyClick={handleKeyClick} />}
    </div>
  );
}

export default Home;
