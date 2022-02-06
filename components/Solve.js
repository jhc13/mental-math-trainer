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

function Solve({ operands, operation, onCorrectAnswer }) {
  const [answerString, setAnswerString] = useState('');
  const { settings } = useContext(SettingsContext);
  const { inputDirection, showKeypad } = settings;
  const maxAnswerLength = getMaxAnswerLength(operands, operation);

  useEffect(() => {
    let correctAnswer;
    switch (operation) {
      case 'addition':
        correctAnswer = BigInt(operands[0]) + BigInt(operands[1]);
        break;
      case 'subtraction':
        correctAnswer = BigInt(operands[0]) - BigInt(operands[1]);
        break;
      case 'multiplication':
        correctAnswer = BigInt(operands[0]) * BigInt(operands[1]);
        break;
      case 'division':
        correctAnswer = BigInt(operands[0]) / BigInt(operands[1]);
        break;
    }
    if (BigInt(answerString) === correctAnswer) {
      onCorrectAnswer();
    }
  }, [operands, operation, answerString, onCorrectAnswer]);

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
    const handleKeyDown = ({ key }) => {
      if (key.toLowerCase() === 'c') {
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
      <div
        className={`${
          !showKeypad && 'mb-[30vh]'
        } flex flex-auto flex-col justify-center`}
      >
        <Problem
          operands={operands}
          operation={operation}
          maxAnswerLength={maxAnswerLength}
          answerString={answerString}
        />
      </div>
      {showKeypad && <Keypad onKeyClick={handleKeyClick} />}
    </div>
  );
}

export default Solve;
