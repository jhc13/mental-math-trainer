import { useCallback, useContext, useEffect, useState } from 'react';
import { SettingsContext } from 'utils/settings';

export default function useSet(
  solvedProblems,
  setSolvedProblems,
  onSetEnd,
  operation,
  operandLengths,
  setProblemCount
) {
  const { settings } = useContext(SettingsContext);
  const { inputDirection } = settings;
  const [operands, setOperands] = useState(
    getOperands(operation, operandLengths)
  );
  const [answerString, setAnswerString] = useState('');
  const [setStartTime] = useState(Date.now());
  const [problemStartTime, setProblemStartTime] = useState(Date.now());
  const maxAnswerLength = getMaxAnswerLength(operands, operation);

  const clear = () => {
    setAnswerString('');
  };

  const backspace = useCallback(() => {
    if (inputDirection === 'RIGHT_TO_LEFT') {
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
      if (inputDirection === 'RIGHT_TO_LEFT') {
        setAnswerString((answerString) => digit + answerString);
      } else {
        setAnswerString((answerString) => answerString + digit);
      }
    },
    [answerString, inputDirection, maxAnswerLength]
  );

  const reset = useCallback(() => {
    setOperands(getOperands(operation, operandLengths));
    clear();
    setProblemStartTime(Date.now());
  }, [operation, operandLengths]);

  const handleKeypadPress = useCallback(
    (key) => {
      if (key === 'CLEAR') {
        clear();
      } else if (key === 'BACKSPACE') {
        backspace();
      } else {
        appendDigit(key);
      }
    },
    [backspace, appendDigit]
  );

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (/^\d$/.test(key)) {
        handleKeypadPress(key);
      } else if (['Backspace', 'Delete'].includes(key)) {
        handleKeypadPress('BACKSPACE');
      } else if (key.toLowerCase() === 'c') {
        handleKeypadPress('CLEAR');
      } else if (key === 'Escape') {
        onSetEnd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeypadPress, onSetEnd]);

  useEffect(() => {
    let correctAnswer;
    let operand = operands.operands;
    switch (operands.operation) {
      case 'ADDITION':
        correctAnswer = BigInt(operand[0]) + BigInt(operand[1]);
        break;
      case 'SUBTRACTION':
        correctAnswer = BigInt(operand[0]) - BigInt(operand[1]);
        break;
      case 'MULTIPLICATION':
        correctAnswer = BigInt(operand[0]) * BigInt(operand[1]);
        break;
      case 'DIVISION':
        correctAnswer = BigInt(operand[0]) / BigInt(operand[1]);
        break;
    }
    if (BigInt(answerString) === correctAnswer) {
      const centiseconds = Math.floor((Date.now() - problemStartTime) / 10);
      const problem = {
        operation,
        operandLengths,
        operands,
        centiseconds,
        timestamp: new Date()
      };
      setSolvedProblems((problems) => [...problems, problem]);
      reset();
    }
  }, [
    answerString,
    operation,
    operands,
    problemStartTime,
    operandLengths,
    setSolvedProblems,
    reset
  ]);

  useEffect(() => {
    if (solvedProblems.length === setProblemCount) {
      onSetEnd();
    }
  }, [solvedProblems, setProblemCount, onSetEnd]);
  return {
    operands: operands.operands,
    operationFromOperands: operands.operation,
    answerString,
    setStartTime,
    problemStartTime,
    maxAnswerLength,
    handleKeypadPress
  };
}

function getMaxAnswerLength(operands, operation) {
  const operandLengths = operands.operands.map(
    (operand) => operand.toString().length
  );
  switch (operands.operation) {
    case 'ADDITION':
      return Math.max(...operandLengths) + 1;
    case 'SUBTRACTION':
    case 'DIVISION':
      return operandLengths[0];
    case 'MULTIPLICATION':
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
  const generateAdditionOrMultiplication = () =>
    operandLengths.map((length) =>
      length === 1 ? getRandomInteger(2, 10) : getRandomIntegerByLength(length)
    );

  const generateSubtraction = () => {
    if (operandLengths[0] !== operandLengths[1]) {
      return operandLengths.map((length) => getRandomIntegerByLength(length));
    }
    const minMinuend = Math.pow(10, operandLengths[0] - 1) + 1;
    const maxMinuend = Math.pow(10, operandLengths[0]);
    const minuend = getRandomInteger(minMinuend, maxMinuend);
    const subtrahend = getRandomInteger(minMinuend - 1, minuend);
    return [minuend, subtrahend];
  };

  const generateDivision = () => {
    let divisor, minQuotient, maxQuotient;
    if (operandLengths[0] === operandLengths[1]) {
      divisor =
        operandLengths[0] === 1
          ? getRandomInteger(2, 5)
          : getRandomInteger(
              Math.pow(10, operandLengths[0] - 1),
              Math.pow(10, operandLengths[0]) / 2
            );
      minQuotient = 2;
      maxQuotient = Math.floor((Math.pow(10, operandLengths[0]) - 1) / divisor);
    } else {
      divisor =
        operandLengths[1] === 1
          ? getRandomInteger(2, 10)
          : getRandomIntegerByLength(operandLengths[1]);
      minQuotient = Math.ceil(Math.pow(10, operandLengths[0] - 1) / divisor);
      maxQuotient = Math.floor((Math.pow(10, operandLengths[0]) - 1) / divisor);
    }
    const quotient = getRandomInteger(minQuotient, maxQuotient + 1);
    const dividend = divisor * quotient;
    return [dividend, divisor];
  };

  const operations = ['ADDITION', 'MULTIPLICATION', 'SUBTRACTION', 'DIVISION'];

  switch (operation) {
    case 'ADDITION':
    case 'MULTIPLICATION':
      return { operation, operands: generateAdditionOrMultiplication() };

    case 'SUBTRACTION':
      return { operation, operands: generateSubtraction() };

    case 'DIVISION':
      return { operation, operands: generateDivision() };

    case 'ALL':
      const randomOperation =
        operations[Math.floor(Math.random() * operations.length)];
      console.log(randomOperation, 'Randomly selected operation');
      return getOperands(randomOperation, operandLengths);

    default:
      throw new Error('Unsupported operation');
  }
}

