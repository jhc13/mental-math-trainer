import { useCallback, useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';
import Timer from 'components/Timer';
import Problem from 'components/Problem';
import Keypad from 'components/Keypad';

// min: inclusive, max: exclusive
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomIntegerByLength(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length);
  return getRandomInteger(min, max);
}

function getOperands(operation, operandLengths) {
  switch (operation) {
    case 'addition':
    case 'multiplication':
      return operandLengths.map((length) => getRandomIntegerByLength(length));
    case 'subtraction':
      if (operandLengths[0] !== operandLengths[1]) {
        return operandLengths.map((length) => getRandomIntegerByLength(length));
      }
      const minMinuend = Math.pow(10, operandLengths[0] - 1) + 1;
      const maxMinuend = Math.pow(10, operandLengths[0]);
      const minuend = getRandomInteger(minMinuend, maxMinuend);
      const subtrahend = getRandomInteger(minMinuend - 1, minuend);
      return [minuend, subtrahend];
    case 'division':
      let divisor, minQuotient, maxQuotient;
      if (operandLengths[0] === operandLengths[1]) {
        if (operandLengths[0] === 1) {
          // Exclude 1.
          divisor = getRandomInteger(2, 5);
        } else {
          const minDivisor = Math.pow(10, operandLengths[0] - 1);
          const maxDivisor = Math.pow(10, operandLengths[0]) / 2;
          divisor = getRandomInteger(minDivisor, maxDivisor);
        }
        minQuotient = 2;
        // maxQuotient is inclusive.
        maxQuotient = Math.floor(
          (Math.pow(10, operandLengths[0]) - 1) / divisor
        );
      } else {
        if (operandLengths[1] === 1) {
          // Exclude 1.
          divisor = getRandomInteger(2, 10);
        } else {
          divisor = getRandomIntegerByLength(operandLengths[1]);
        }
        minQuotient = Math.ceil(Math.pow(10, operandLengths[0] - 1) / divisor);
        // maxQuotient is inclusive.
        maxQuotient = Math.floor(
          (Math.pow(10, operandLengths[0]) - 1) / divisor
        );
      }
      const quotient = getRandomInteger(minQuotient, maxQuotient + 1);
      const dividend = divisor * quotient;
      return [dividend, divisor];
  }
}

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

function Solve({ onCorrectAnswer }) {
  const { settings } = useContext(SettingsContext);
  const {
    operation,
    firstOperandLength,
    secondOperandLength,
    inputDirection,
    showTimerWhileSolving
  } = settings;
  const operandLengths = [firstOperandLength, secondOperandLength];
  const [operands] = useState(getOperands(operation, operandLengths));
  const maxAnswerLength = getMaxAnswerLength(operands, operation);
  const [startTime] = useState(Date.now());
  const [answerString, setAnswerString] = useState('');

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
    <div className='flex h-full flex-col items-center'>
      {showTimerWhileSolving && <Timer startTime={startTime} />}
      <div className={'flex flex-auto items-center'}>
        <Problem
          operands={operands}
          operation={operation}
          maxAnswerLength={maxAnswerLength}
          answerString={answerString}
        />
      </div>
      <Keypad onKeyClick={handleKeyClick} />
    </div>
  );
}

export default Solve;
