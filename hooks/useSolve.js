import { useCallback, useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';

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

function useSolve(onCorrectAnswer, onAbort) {
  const { settings } = useContext(SettingsContext);
  const { operation, firstOperandLength, secondOperandLength, inputDirection } =
    settings;
  const [operands, setOperands] = useState(
    getOperands(operation, [firstOperandLength, secondOperandLength])
  );
  const [answerString, setAnswerString] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
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
    [answerString, inputDirection, maxAnswerLength]
  );

  const reset = useCallback(() => {
    setOperands(
      getOperands(operation, [firstOperandLength, secondOperandLength])
    );
    clear();
    setStartTime(Date.now());
  }, [operation, firstOperandLength, secondOperandLength]);

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

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (/^\d$/.test(key)) {
        appendDigit(key);
      } else if (['Backspace', 'Delete'].includes(key)) {
        erase();
      } else if (key.toLowerCase() === 'c') {
        clear();
      } else if (key === 'Escape') {
        onAbort();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [appendDigit, erase, onAbort]);

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
      const centiseconds = Math.floor((Date.now() - startTime) / 10);
      const problem = {
        operation,
        firstOperandLength,
        secondOperandLength,
        operands,
        centiseconds,
        time: Date.now()
      };
      reset();
      onCorrectAnswer(problem);
    }
  }, [
    answerString,
    operation,
    operands,
    startTime,
    firstOperandLength,
    secondOperandLength,
    reset,
    onCorrectAnswer
  ]);

  return {
    operation,
    operands,
    answerString,
    startTime,
    maxAnswerLength,
    handleKeyClick
  };
}

export default useSolve;
